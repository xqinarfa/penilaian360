package unit_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/config"
	authdomain "github.com/kalanara/evaluasi360-backend/internal/modules/auth/domain"
	authusecase "github.com/kalanara/evaluasi360-backend/internal/modules/auth/usecase"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/security"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

// MockUserRepository implements in-memory user repository
type MockUserRepository struct {
	users map[uuid.UUID]*userdomain.User
}

func NewMockUserRepository() *MockUserRepository {
	return &MockUserRepository{users: make(map[uuid.UUID]*userdomain.User)}
}

func (m *MockUserRepository) Create(ctx context.Context, user *userdomain.User) error {
	m.users[user.ID] = user
	return nil
}

func (m *MockUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*userdomain.User, error) {
	u, ok := m.users[id]
	if !ok {
		return nil, sharederrors.ErrUserNotFound
	}
	return u, nil
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*userdomain.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, sharederrors.ErrUserNotFound
}

func (m *MockUserRepository) FindByNIP(ctx context.Context, nip string) (*userdomain.User, error) {
	for _, u := range m.users {
		if u.NIP == nip {
			return u, nil
		}
	}
	return nil, sharederrors.ErrUserNotFound
}

func (m *MockUserRepository) Update(ctx context.Context, user *userdomain.User) error {
	m.users[user.ID] = user
	return nil
}

func (m *MockUserRepository) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.users, id)
	return nil
}

func (m *MockUserRepository) List(ctx context.Context, search string, limit, offset int) ([]userdomain.User, int64, error) {
	var list []userdomain.User
	for _, u := range m.users {
		list = append(list, *u)
	}
	return list, int64(len(list)), nil
}

// MockBlacklistRepo implements in-memory token blacklist
type MockBlacklistRepo struct {
	revoked map[string]bool
}

func NewMockBlacklistRepo() *MockBlacklistRepo {
	return &MockBlacklistRepo{revoked: make(map[string]bool)}
}

func (b *MockBlacklistRepo) BlacklistToken(ctx context.Context, jti string, ttl time.Duration) error {
	b.revoked[jti] = true
	return nil
}

func (b *MockBlacklistRepo) IsTokenBlacklisted(ctx context.Context, jti string) (bool, error) {
	return b.revoked[jti], nil
}

func TestAuthRegisterAndLoginFlow(t *testing.T) {
	userRepo := NewMockUserRepository()
	blacklistRepo := NewMockBlacklistRepo()
	hasher := security.NewBcryptHasher()
	jwtService := security.NewJWTService(config.JWTConfig{
		SecretKey:            "super-secret-key-evaluasi-360-min-32-chars-long",
		AccessTokenDuration:  15 * time.Minute,
		RefreshTokenDuration: 7 * 24 * time.Hour,
		Issuer:               "evaluasi360-auth-service",
	})

	ssoCfg := config.SSOConfig{EnableSSO: false}

	uc := authusecase.NewAuthUsecase(userRepo, blacklistRepo, hasher, jwtService, nil, ssoCfg)
	ctx := context.Background()

	// 1. Test Register
	regInput := authdomain.RegisterInput{
		NIP:       "199603122022031004",
		Email:     "dimas.prakoso@kemenhub.go.id",
		Password:  "password123",
		FullName:  "Dimas Prakoso",
		Jabatan:   "Analis Kebijakan Ahli Pertama",
		UnitKerja: "Ditjen Perhubungan Laut",
		Role:      userdomain.RoleAlumni,
	}

	regRes, err := uc.Register(ctx, regInput)
	if err != nil {
		t.Fatalf("Register failed: %v", err)
	}

	if regRes.User.NIP != regInput.NIP {
		t.Errorf("expected NIP %s, got %s", regInput.NIP, regRes.User.NIP)
	}
	if regRes.Tokens.AccessToken == "" {
		t.Fatal("expected non-empty access token")
	}

	// 2. Test Duplicate Register
	_, err = uc.Register(ctx, regInput)
	if err == nil {
		t.Fatal("expected error on duplicate register, got nil")
	}

	// 3. Test Login with NIP
	loginRes, err := uc.Login(ctx, authdomain.LoginInput{
		NIP:      "199603122022031004",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("Login with NIP failed: %v", err)
	}

	if loginRes.User.Email != regInput.Email {
		t.Errorf("expected email %s, got %s", regInput.Email, loginRes.User.Email)
	}

	// 4. Test Login with Email
	loginEmailRes, err := uc.Login(ctx, authdomain.LoginInput{
		Email:    "dimas.prakoso@kemenhub.go.id",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("Login with Email failed: %v", err)
	}
	if loginEmailRes.Tokens.AccessToken == "" {
		t.Fatal("expected access token from login with email")
	}

	// 5. Test Login with Invalid Password
	_, err = uc.Login(ctx, authdomain.LoginInput{
		NIP:      "199603122022031004",
		Password: "wrongpassword",
	})
	if err == nil {
		t.Fatal("expected invalid credentials error, got nil")
	}

	// 6. Test Refresh Token
	refreshed, err := uc.RefreshToken(ctx, loginRes.Tokens.RefreshToken)
	if err != nil {
		t.Fatalf("RefreshToken failed: %v", err)
	}
	if refreshed.AccessToken == "" {
		t.Fatal("expected new access token")
	}

	// 7. Test Logout
	claims, err := jwtService.ValidateToken(loginRes.Tokens.AccessToken)
	if err != nil {
		t.Fatalf("validate token for logout failed: %v", err)
	}

	err = uc.Logout(ctx, claims)
	if err != nil {
		t.Fatalf("Logout failed: %v", err)
	}

	// Verify token is blacklisted
	isRevoked, _ := blacklistRepo.IsTokenBlacklisted(ctx, claims.ID)
	if !isRevoked {
		t.Fatal("expected token to be marked as revoked in blacklist")
	}
}

