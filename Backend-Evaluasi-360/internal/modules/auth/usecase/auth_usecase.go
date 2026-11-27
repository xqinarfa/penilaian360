package usecase

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/config"
	authdomain "github.com/kalanara/evaluasi360-backend/internal/modules/auth/domain"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	platformnats "github.com/kalanara/evaluasi360-backend/internal/platform/nats"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type authUsecase struct {
	userRepo       userdomain.UserRepository
	blacklistRepo  authdomain.TokenBlacklistRepository
	passwordHasher authdomain.PasswordHasher
	jwtService     authdomain.JWTService
	natsClient     *platformnats.Client
	ssoCfg         config.SSOConfig
	httpClient     *http.Client
}

func NewAuthUsecase(
	userRepo userdomain.UserRepository,
	blacklistRepo authdomain.TokenBlacklistRepository,
	passwordHasher authdomain.PasswordHasher,
	jwtService authdomain.JWTService,
	natsClient *platformnats.Client,
	ssoCfg config.SSOConfig,
) authdomain.AuthUsecase {
	return &authUsecase{
		userRepo:       userRepo,
		blacklistRepo:  blacklistRepo,
		passwordHasher: passwordHasher,
		jwtService:     jwtService,
		natsClient:     natsClient,
		ssoCfg:         ssoCfg,
		httpClient:     &http.Client{Timeout: 10 * time.Second},
	}
}

func (u *authUsecase) Register(ctx context.Context, input authdomain.RegisterInput) (*authdomain.AuthResponse, error) {
	// 1. Check existing Email
	existingEmail, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err == nil && existingEmail != nil {
		return nil, sharederrors.ErrUserAlreadyExists
	}

	// 2. Check existing NIP
	existingNIP, err := u.userRepo.FindByNIP(ctx, input.NIP)
	if err == nil && existingNIP != nil {
		return nil, sharederrors.ErrUserAlreadyExists
	}

	// 3. Hash password
	hashedPassword, err := u.passwordHasher.HashPassword(input.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	role := input.Role
	if role == "" {
		role = userdomain.RolePegawai
	}

	user := &userdomain.User{
		ID:           uuid.New(),
		NIP:          input.NIP,
		Email:        input.Email,
		PasswordHash: hashedPassword,
		FullName:     input.FullName,
		Role:         role,
		Jabatan:      input.Jabatan,
		UnitKerja:    input.UnitKerja,
		Phone:        input.Phone,
		Provider:     "LOCAL",
		IsActive:     true,
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Publish event to NATS JetStream asynchronously
	if u.natsClient != nil {
		go func() {
			evt, _ := json.Marshal(map[string]interface{}{
				"event":     "USER_REGISTERED",
				"user_id":   user.ID,
				"nip":       user.NIP,
				"email":     user.Email,
				"full_name": user.FullName,
				"role":      user.Role,
				"timestamp": time.Now().UTC(),
			})
			_ = u.natsClient.Publish(context.Background(), "EVALUASI360.USER.REGISTERED", evt)
		}()
	}

	tokens, err := u.jwtService.GenerateTokenPair(user)
	if err != nil {
		return nil, err
	}

	return &authdomain.AuthResponse{
		Tokens: tokens,
		User:   user.ToResponse(),
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, input authdomain.LoginInput) (*authdomain.AuthResponse, error) {
	var user *userdomain.User
	var err error

	identifier := strings.TrimSpace(input.NIP)
	if identifier == "" {
		identifier = strings.TrimSpace(input.Email)
	}

	if identifier == "" {
		return nil, sharederrors.ErrInvalidCredentials
	}

	if !strings.Contains(identifier, "@") {
		user, err = u.userRepo.FindByNIP(ctx, identifier)
		if err != nil && input.Email != "" {
			user, err = u.userRepo.FindByEmail(ctx, input.Email)
		}
	} else {
		user, err = u.userRepo.FindByEmail(ctx, identifier)
		if err != nil && input.NIP != "" {
			user, err = u.userRepo.FindByNIP(ctx, input.NIP)
		}
	}

	if err != nil {
		if errors.Is(err, sharederrors.ErrUserNotFound) {
			return nil, sharederrors.ErrInvalidCredentials
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, sharederrors.ErrForbidden
	}

	if !u.passwordHasher.CheckPassword(input.Password, user.PasswordHash) {
		return nil, sharederrors.ErrInvalidCredentials
	}

	tokens, err := u.jwtService.GenerateTokenPair(user)
	if err != nil {
		return nil, err
	}

	return &authdomain.AuthResponse{
		Tokens: tokens,
		User:   user.ToResponse(),
	}, nil
}

func (u *authUsecase) RefreshToken(ctx context.Context, refreshToken string) (*authdomain.TokenPair, error) {
	claims, err := u.jwtService.ValidateToken(refreshToken)
	if err != nil {
		return nil, err
	}

	if u.blacklistRepo != nil && claims.ID != "" {
		isBlacklisted, err := u.blacklistRepo.IsTokenBlacklisted(ctx, claims.ID)
		if err == nil && isBlacklisted {
			return nil, sharederrors.ErrTokenRevoked
		}
	}

	user, err := u.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		return nil, err
	}

	if !user.IsActive {
		return nil, sharederrors.ErrForbidden
	}

	// Revoke old refresh token (token rotation)
	if u.blacklistRepo != nil && claims.ID != "" {
		remainingTTL := time.Until(claims.ExpiresAt.Time)
		if remainingTTL > 0 {
			_ = u.blacklistRepo.BlacklistToken(ctx, claims.ID, remainingTTL)
		}
	}

	return u.jwtService.GenerateTokenPair(user)
}

func (u *authUsecase) Logout(ctx context.Context, claims *authdomain.JWTClaims) error {
	if claims == nil || claims.ID == "" || u.blacklistRepo == nil {
		return nil
	}

	ttl := time.Until(claims.ExpiresAt.Time)
	if ttl <= 0 {
		ttl = 15 * time.Minute
	}

	return u.blacklistRepo.BlacklistToken(ctx, claims.ID, ttl)
}

func (u *authUsecase) ChangePassword(ctx context.Context, userID uuid.UUID, input authdomain.ChangePasswordInput) error {
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if !u.passwordHasher.CheckPassword(input.OldPassword, user.PasswordHash) {
		return errors.New("old password does not match")
	}

	newHash, err := u.passwordHasher.HashPassword(input.NewPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = newHash
	return u.userRepo.Update(ctx, user)
}

func (u *authUsecase) GetSSOAuthURL() string {
	redirectURI := u.ssoCfg.KemenhubRedirect
	if redirectURI == "" {
		redirectURI = fmt.Sprintf("%s/sso/auth/callback", u.ssoCfg.FrontendURL)
	}

	return fmt.Sprintf(
		"%s?client_id=%s&redirect_uri=%s&response_type=code&scope=&login_api=null&identifier=%s",
		u.ssoCfg.KemenhubAuthURL,
		url.QueryEscape(u.ssoCfg.KemenhubAppID),
		url.QueryEscape(redirectURI),
		url.QueryEscape(u.ssoCfg.SSOIdentifier),
	)
}

func (u *authUsecase) LoginSSO(ctx context.Context, req authdomain.SSOLoginRequest) (*authdomain.AuthResponse, error) {
	if !u.ssoCfg.EnableSSO {
		return nil, errors.New("SSO Kemenhub feature is currently disabled")
	}

	redirectURI := req.RedirectURI
	if redirectURI == "" {
		redirectURI = u.ssoCfg.KemenhubRedirect
	}

	// 1. Exchange OAuth Authorization Code for Access Token
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", u.ssoCfg.KemenhubAppID)
	data.Set("client_secret", u.ssoCfg.KemenhubAppSecret)
	data.Set("redirect_uri", redirectURI)
	data.Set("code", req.Code)

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, u.ssoCfg.KemenhubTokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, fmt.Errorf("failed to create SSO token request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := u.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to contact SSO token server: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		errBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("SSO returned status %d: %s", resp.StatusCode, string(errBody))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read SSO response: %w", err)
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return nil, fmt.Errorf("failed to parse SSO token response: %w", err)
	}

	// 2. Fetch User Profile from SSO User Info Endpoint
	userReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u.ssoCfg.KemenhubUserURL, nil)
	if err != nil {
		return nil, err
	}
	userReq.Header.Set("Authorization", "Bearer "+tokenResp.AccessToken)

	userHTTPResp, err := u.httpClient.Do(userReq)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user info from SSO: %w", err)
	}
	defer userHTTPResp.Body.Close()

	var ssoUser struct {
		NIP       string `json:"nip"`
		Email     string `json:"email"`
		Name      string `json:"name"`
		Jabatan   string `json:"jabatan"`
		UnitKerja string `json:"unit_kerja"`
		Photo     string `json:"photo"`
	}
	if err := json.NewDecoder(userHTTPResp.Body).Decode(&ssoUser); err != nil {
		return nil, fmt.Errorf("failed to decode SSO user profile: %w", err)
	}

	return u.syncSSOUser(ctx, ssoUser.NIP, ssoUser.Email, ssoUser.Name, ssoUser.Jabatan, ssoUser.UnitKerja, ssoUser.Photo, "HUBNET")
}

func (u *authUsecase) LoginEduhub(ctx context.Context, token string, preDecodedUser ...authdomain.EduhubUserInfo) (*authdomain.AuthResponse, error) {
	if token == "" {
		return nil, errors.New("token parameter is required")
	}

	var nip, email, name, photo, jabatan, unitKerja string

	// Strategi 1: Gunakan data user yang sudah di-decode dari query param ?user=
	if len(preDecodedUser) > 0 && preDecodedUser[0].NIP != "" {
		usr := preDecodedUser[0]
		nip = strings.TrimSpace(usr.NIP)
		email = strings.TrimSpace(usr.Email)
		name = strings.TrimSpace(usr.Name)
		photo = strings.TrimSpace(usr.Image)
		jabatan = strings.TrimSpace(usr.Jabatan)
		unitKerja = strings.TrimSpace(usr.UnitKerja)
		slog.Info("LoginEduhub: using pre-decoded user from ?user= param", "nip", nip, "email", email)
	}

	// Strategi 2: Decode payload JWT EduHub
	if nip == "" {
		jwtNIP, jwtName, jwtImage := decodeEduhubJWTPayload(token)
		if jwtNIP != "" {
			nip = jwtNIP
			if name == "" {
				name = jwtName
			}
			if photo == "" {
				photo = jwtImage
			}
			slog.Info("LoginEduhub: decoded NIP from JWT payload", "nip", nip)
		}
	}

	// Strategi 3: Panggil EduHub verify API jika token JWT tidak menyertakan NIP
	if nip == "" {
		verifyURL := u.ssoCfg.EduhubVerifyURL
		if verifyURL == "" {
			verifyURL = "https://bpsdm.kemenhub.go.id/api/portal/auth/sso"
		}

		reqBody, _ := json.Marshal(map[string]string{"token": token})
		httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, verifyURL, strings.NewReader(string(reqBody)))
		if err == nil {
			httpReq.Header.Set("Content-Type", "application/json")
			httpReq.Header.Set("Authorization", "Bearer "+token)

			resp, errDo := u.httpClient.Do(httpReq)
			if errDo == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				var eduhubResp struct {
					Success bool `json:"success"`
					Data    struct {
						NIP       string `json:"nip"`
						Email     string `json:"email"`
						Name      string `json:"name"`
						Image     string `json:"image"`
						Jabatan   string `json:"jabatan"`
						UnitKerja string `json:"unit_kerja"`
					} `json:"data"`
				}
				if errDecode := json.NewDecoder(resp.Body).Decode(&eduhubResp); errDecode == nil && eduhubResp.Data.NIP != "" {
					nip = eduhubResp.Data.NIP
					email = eduhubResp.Data.Email
					name = eduhubResp.Data.Name
					photo = eduhubResp.Data.Image
					jabatan = eduhubResp.Data.Jabatan
					unitKerja = eduhubResp.Data.UnitKerja
				}
			}
		}
	}

	if nip == "" {
		// Fallback for demo/development if token is dummy
		if u.ssoCfg.EnableSSO && strings.HasPrefix(token, "demo-") {
			nip = "199603122022031004"
			name = "Dimas Prakoso"
			email = "dimas.prakoso@kemenhub.go.id"
		} else {
			return nil, errors.New("failed to verify or extract ASN NIP from EduHub SSO token")
		}
	}

	return u.syncSSOUser(ctx, nip, email, name, jabatan, unitKerja, photo, "EDUHUB")
}

func (u *authUsecase) syncSSOUser(ctx context.Context, nip, email, name, jabatan, unitKerja, photo, provider string) (*authdomain.AuthResponse, error) {
	if email == "" && nip != "" {
		email = fmt.Sprintf("%s@kemenhub.go.id", nip)
	}

	var user *userdomain.User
	var err error

	if nip != "" {
		user, err = u.userRepo.FindByNIP(ctx, nip)
	}
	if (err != nil || user == nil) && email != "" {
		user, err = u.userRepo.FindByEmail(ctx, email)
	}

	if err != nil || user == nil {
		randomPwd, _ := u.passwordHasher.HashPassword(uuid.NewString())
		user = &userdomain.User{
			ID:           uuid.New(),
			NIP:          nip,
			Email:        email,
			FullName:     name,
			PasswordHash: randomPwd,
			Role:         userdomain.RolePegawai,
			Jabatan:      jabatan,
			UnitKerja:    unitKerja,
			AvatarURL:    photo,
			Provider:     provider,
			IsActive:     true,
		}
		if errCreate := u.userRepo.Create(ctx, user); errCreate != nil {
			return nil, fmt.Errorf("failed to auto-register SSO user: %w", errCreate)
		}
	} else {
		// Update user information from SSO
		updated := false
		if user.NIP == "" && nip != "" {
			user.NIP = nip
			updated = true
		}
		if name != "" && user.FullName != name {
			user.FullName = name
			updated = true
		}
		if photo != "" && user.AvatarURL != photo {
			user.AvatarURL = photo
			updated = true
		}
		if jabatan != "" && user.Jabatan == "" {
			user.Jabatan = jabatan
			updated = true
		}
		if unitKerja != "" && user.UnitKerja == "" {
			user.UnitKerja = unitKerja
			updated = true
		}
		if user.Provider == "" || user.Provider == "LOCAL" {
			user.Provider = provider
			updated = true
		}
		if updated {
			_ = u.userRepo.Update(ctx, user)
		}
	}

	if !user.IsActive {
		return nil, sharederrors.ErrForbidden
	}

	tokens, err := u.jwtService.GenerateTokenPair(user)
	if err != nil {
		return nil, err
	}

	return &authdomain.AuthResponse{
		Tokens: tokens,
		User:   user.ToResponse(),
	}, nil
}

func decodeEduhubJWTPayload(tokenStr string) (nip, name, image string) {
	parts := strings.Split(tokenStr, ".")
	if len(parts) < 2 {
		return "", "", ""
	}

	payloadSegment := parts[1]
	// Pad base64 if needed
	switch len(payloadSegment) % 4 {
	case 2:
		payloadSegment += "=="
	case 3:
		payloadSegment += "="
	}

	decoded, err := base64.URLEncoding.DecodeString(payloadSegment)
	if err != nil {
		decoded, err = base64.RawURLEncoding.DecodeString(parts[1])
		if err != nil {
			return "", "", ""
		}
	}

	var claims struct {
		NIP   string `json:"nip"`
		Name  string `json:"name"`
		Image string `json:"image"`
	}
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return "", "", ""
	}

	return strings.TrimSpace(claims.NIP), strings.TrimSpace(claims.Name), strings.TrimSpace(claims.Image)
}
