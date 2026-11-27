package domain

import "errors"

// Shared Sentinel Domain Errors
var (
	ErrNotFound             = errors.New("resource not found")
	ErrUserNotFound         = errors.New("user not found")
	ErrUserAlreadyExists    = errors.New("user already exists with this email or NIP")
	ErrInvalidCredentials   = errors.New("invalid email/NIP or password")
	ErrUnauthorized         = errors.New("unauthorized access")
	ErrForbidden            = errors.New("forbidden: insufficient permissions")
	ErrTokenExpired         = errors.New("token has expired")
	ErrInvalidToken         = errors.New("invalid authentication token")
	ErrTokenRevoked         = errors.New("token has been revoked")
	ErrBadRequest           = errors.New("bad request")
	ErrInternalServer       = errors.New("internal server error")
	ErrRateLimitExceeded    = errors.New("rate limit exceeded")
	ErrPegawaiNotFound      = errors.New("pegawai not found")
	ErrInstrumenNotFound    = errors.New("instrumen not found")
	ErrPeriodeNotFound      = errors.New("periode evaluasi not found")
	ErrAlumniNotFound       = errors.New("alumni not found")
	ErrPenugasanNotFound    = errors.New("penugasan penilai not found")
	ErrPenugasanAlreadyDone = errors.New("penugasan already completed")
	ErrDuplicateAssignment  = errors.New("evaluator already assigned for this alumni and category")
)

