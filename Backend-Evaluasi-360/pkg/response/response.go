package response

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

// StandardResponse is the uniform API response structure.
type StandardResponse struct {
	Success   bool        `json:"success"`
	Message   string      `json:"message,omitempty"`
	Data      interface{} `json:"data,omitempty"`
	Errors    interface{} `json:"errors,omitempty"`
	Code      string      `json:"code,omitempty"`
	RequestID string      `json:"request_id,omitempty"`
}

// JSON sends a successful response with standard envelope.
func JSON(c *gin.Context, httpStatus int, message string, data interface{}) {
	reqID, _ := c.Get("RequestID")
	reqIDStr, _ := reqID.(string)

	c.JSON(httpStatus, StandardResponse{
		Success:   true,
		Message:   message,
		Data:      data,
		RequestID: reqIDStr,
	})
}

// Error sends an error response with standardized structure and domain error code mapping.
func Error(c *gin.Context, httpStatus int, code string, message string, details interface{}) {
	reqID, _ := c.Get("RequestID")
	reqIDStr, _ := reqID.(string)

	c.JSON(httpStatus, StandardResponse{
		Success:   false,
		Code:      code,
		Message:   message,
		Errors:    details,
		RequestID: reqIDStr,
	})
}

// HandleDomainError maps domain sentinel errors directly to HTTP status and code.
func HandleDomainError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, sharederrors.ErrUserNotFound):
		Error(c, http.StatusNotFound, "USER_NOT_FOUND", "User not found", nil)
	case errors.Is(err, sharederrors.ErrPegawaiNotFound):
		Error(c, http.StatusNotFound, "PEGAWAI_NOT_FOUND", "Pegawai data not found", nil)
	case errors.Is(err, sharederrors.ErrInstrumenNotFound):
		Error(c, http.StatusNotFound, "INSTRUMEN_NOT_FOUND", "Instrumen evaluasi not found", nil)
	case errors.Is(err, sharederrors.ErrPeriodeNotFound):
		Error(c, http.StatusNotFound, "PERIODE_NOT_FOUND", "Periode evaluasi not found", nil)
	case errors.Is(err, sharederrors.ErrAlumniNotFound):
		Error(c, http.StatusNotFound, "ALUMNI_NOT_FOUND", "Alumni evaluasi not found", nil)
	case errors.Is(err, sharederrors.ErrPenugasanNotFound):
		Error(c, http.StatusNotFound, "PENUGASAN_NOT_FOUND", "Penugasan penilai not found", nil)
	case errors.Is(err, sharederrors.ErrPenugasanAlreadyDone):
		Error(c, http.StatusBadRequest, "PENUGASAN_ALREADY_DONE", "Penilaian sudah diselesaikan sebelumnya", nil)
	case errors.Is(err, sharederrors.ErrDuplicateAssignment):
		Error(c, http.StatusConflict, "DUPLICATE_ASSIGNMENT", "Penilai sudah ditugaskan untuk kategori ini", nil)
	case errors.Is(err, sharederrors.ErrUserAlreadyExists):
		Error(c, http.StatusConflict, "USER_EXISTS", "User already registered with this NIP or email", nil)
	case errors.Is(err, sharederrors.ErrInvalidCredentials):
		Error(c, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid NIP/email or password", nil)
	case errors.Is(err, sharederrors.ErrUnauthorized), errors.Is(err, sharederrors.ErrTokenExpired), errors.Is(err, sharederrors.ErrInvalidToken):
		Error(c, http.StatusUnauthorized, "UNAUTHORIZED", err.Error(), nil)
	case errors.Is(err, sharederrors.ErrTokenRevoked):
		Error(c, http.StatusUnauthorized, "TOKEN_REVOKED", "Token has been revoked or logged out", nil)
	case errors.Is(err, sharederrors.ErrForbidden):
		Error(c, http.StatusForbidden, "FORBIDDEN", "You do not have permission to access this resource", nil)
	case errors.Is(err, sharederrors.ErrRateLimitExceeded):
		Error(c, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", "Rate limit exceeded, please retry later", nil)
	default:
		Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred", nil)
	}
}

