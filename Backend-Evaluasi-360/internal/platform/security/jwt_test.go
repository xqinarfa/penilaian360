package security_test

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/config"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/security"
)

func TestJWTGenerateAndValidate(t *testing.T) {
	jwtCfg := config.JWTConfig{
		SecretKey:            "super-secret-key-evaluasi-360-min-32-chars-long",
		AccessTokenDuration:  15 * time.Minute,
		RefreshTokenDuration: 7 * 24 * time.Hour,
		Issuer:               "evaluasi360-auth-service",
	}

	jwtService := security.NewJWTService(jwtCfg)

	userID := uuid.New()
	user := &userdomain.User{
		ID:        userID,
		NIP:       "199603122022031004",
		Email:     "dimas.prakoso@kemenhub.go.id",
		FullName:  "Dimas Prakoso",
		Role:      userdomain.RoleAlumni,
		UnitKerja: "Ditjen Perhubungan Laut",
	}

	tokens, err := jwtService.GenerateTokenPair(user)
	if err != nil {
		t.Fatalf("failed to generate token pair: %v", err)
	}

	if tokens.AccessToken == "" || tokens.RefreshToken == "" {
		t.Fatal("expected non-empty tokens")
	}

	// Validate Access Token
	claims, err := jwtService.ValidateToken(tokens.AccessToken)
	if err != nil {
		t.Fatalf("failed to validate access token: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("expected UserID %s, got %s", userID, claims.UserID)
	}
	if claims.NIP != user.NIP {
		t.Errorf("expected NIP %s, got %s", user.NIP, claims.NIP)
	}
	if claims.Email != user.Email {
		t.Errorf("expected Email %s, got %s", user.Email, claims.Email)
	}
	if claims.Role != user.Role {
		t.Errorf("expected Role %s, got %s", user.Role, claims.Role)
	}

	// Validate Refresh Token
	refreshClaims, err := jwtService.ValidateToken(tokens.RefreshToken)
	if err != nil {
		t.Fatalf("failed to validate refresh token: %v", err)
	}

	if refreshClaims.UserID != userID {
		t.Errorf("expected refresh UserID %s, got %s", userID, refreshClaims.UserID)
	}
}

func TestJWTExpiredToken(t *testing.T) {
	jwtCfg := config.JWTConfig{
		SecretKey:            "super-secret-key-evaluasi-360-min-32-chars-long",
		AccessTokenDuration:  -1 * time.Minute, // Already expired
		RefreshTokenDuration: -1 * time.Minute,
		Issuer:               "evaluasi360-auth-service",
	}

	jwtService := security.NewJWTService(jwtCfg)

	user := &userdomain.User{
		ID:       uuid.New(),
		NIP:      "199603122022031004",
		Email:    "dimas.prakoso@kemenhub.go.id",
		FullName: "Dimas Prakoso",
		Role:     userdomain.RoleAlumni,
	}

	tokens, err := jwtService.GenerateTokenPair(user)
	if err != nil {
		t.Fatalf("failed to generate token: %v", err)
	}

	_, err = jwtService.ValidateToken(tokens.AccessToken)
	if err == nil {
		t.Fatal("expected expired token error, got nil")
	}
}

