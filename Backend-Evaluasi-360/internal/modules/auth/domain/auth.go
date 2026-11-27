package domain

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
)

// JWTClaims represents standard and custom claims contained in access and refresh tokens.
type JWTClaims struct {
	UserID    uuid.UUID           `json:"user_id"`
	NIP       string              `json:"nip,omitempty"`
	Email     string              `json:"email"`
	Role      userdomain.UserRole `json:"role"`
	FullName  string              `json:"full_name"`
	UnitKerja string              `json:"unit_kerja,omitempty"`
	jwt.RegisteredClaims
}

// TokenPair holds access and refresh token strings with expiry times.
type TokenPair struct {
	AccessToken      string    `json:"access_token"`
	RefreshToken     string    `json:"refresh_token"`
	AccessExpiresAt  time.Time `json:"access_expires_at"`
	RefreshExpiresAt time.Time `json:"refresh_expires_at"`
	TokenType        string    `json:"token_type"`
}

// RegisterInput represents payload for user registration.
type RegisterInput struct {
	NIP       string              `json:"nip" validate:"required,min=5,max=50"`
	Email     string              `json:"email" validate:"required,email"`
	Password  string              `json:"password" validate:"required,min=6,max=64"`
	FullName  string              `json:"full_name" validate:"required,min=2,max=100"`
	Jabatan   string              `json:"jabatan"`
	UnitKerja string              `json:"unit_kerja"`
	Phone     string              `json:"phone"`
	Role      userdomain.UserRole `json:"role" validate:"omitempty,oneof=admin pegawai evaluator alumni"`
}

// LoginInput represents credentials for user authentication (NIP or Email).
type LoginInput struct {
	Email    string `json:"email,omitempty"`
	NIP      string `json:"nip,omitempty"`
	Password string `json:"password" validate:"required"`
}

// RefreshTokenInput represents payload to exchange refresh token for new access token.
type RefreshTokenInput struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// ChangePasswordInput represents payload for user changing their password.
type ChangePasswordInput struct {
	OldPassword string `json:"old_password" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=6,max=64"`
}

// SSOLoginRequest represents payload containing authorization code from Kemenhub SSO.
type SSOLoginRequest struct {
	Code        string `json:"code" validate:"required"`
	RedirectURI string `json:"redirect_uri,omitempty"`
}

// SSOAuthURLResponse represents payload containing SSO Kemenhub authorization URL.
type SSOAuthURLResponse struct {
	AuthURL     string `json:"auth_url"`
	ClientID    string `json:"client_id"`
	RedirectURI string `json:"redirect_uri"`
	Identifier  string `json:"identifier"`
}

// EduhubUserInfo represents pre-decoded user data sent by EduHub in the callback URL.
type EduhubUserInfo struct {
	ID        string      `json:"id"`
	Email     string      `json:"email"`
	Name      string      `json:"name"`
	NIP       string      `json:"nip"`
	Role      string      `json:"role"`
	Image     string      `json:"image"`
	Jabatan   string      `json:"jabatan,omitempty"`
	UnitKerja string      `json:"unit_kerja,omitempty"`
	Sector    interface{} `json:"sector,omitempty"`
}

// AuthResponse represents complete response returned on login or registration.
type AuthResponse struct {
	Tokens *TokenPair               `json:"tokens"`
	User   *userdomain.UserResponse `json:"user"`
}

// TokenBlacklistRepository defines storage contract for token revocation.
type TokenBlacklistRepository interface {
	BlacklistToken(ctx context.Context, jti string, ttl time.Duration) error
	IsTokenBlacklisted(ctx context.Context, jti string) (bool, error)
}

// JWTService defines token signing and verification contract.
type JWTService interface {
	GenerateTokenPair(user *userdomain.User) (*TokenPair, error)
	ValidateToken(tokenString string) (*JWTClaims, error)
}

// PasswordHasher defines password hashing and verification contract.
type PasswordHasher interface {
	HashPassword(password string) (string, error)
	CheckPassword(plainPassword, hashedPassword string) bool
}

// EventPublisher defines contract for publishing domain events.
type EventPublisher interface {
	PublishEvent(ctx context.Context, subject string, event interface{}) error
}

// AuthUsecase defines business logic contracts for auth module.
type AuthUsecase interface {
	Register(ctx context.Context, input RegisterInput) (*AuthResponse, error)
	Login(ctx context.Context, input LoginInput) (*AuthResponse, error)
	LoginSSO(ctx context.Context, req SSOLoginRequest) (*AuthResponse, error)
	LoginEduhub(ctx context.Context, token string, preDecodedUser ...EduhubUserInfo) (*AuthResponse, error)
	GetSSOAuthURL() string
	RefreshToken(ctx context.Context, refreshToken string) (*TokenPair, error)
	Logout(ctx context.Context, claims *JWTClaims) error
	ChangePassword(ctx context.Context, userID uuid.UUID, input ChangePasswordInput) error
}
