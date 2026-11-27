package security_test

import (
	"testing"

	"github.com/kalanara/evaluasi360-backend/internal/platform/security"
)

func TestHashAndCheckPassword(t *testing.T) {
	password := "RahasiaBPSDM2026!"

	hash, err := security.HashPassword(password)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}

	if len(hash) == 0 {
		t.Fatal("expected non-empty hash string")
	}

	if !security.CheckPassword(password, hash) {
		t.Fatal("expected password check to succeed with correct password")
	}

	if security.CheckPassword("SalahPassword", hash) {
		t.Fatal("expected password check to fail with incorrect password")
	}
}

func TestBcryptHasher(t *testing.T) {
	hasher := security.NewBcryptHasher()
	password := "Evaluasi360Secure"

	hash, err := hasher.HashPassword(password)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}

	if !hasher.CheckPassword(password, hash) {
		t.Fatal("expected password to match")
	}
}

