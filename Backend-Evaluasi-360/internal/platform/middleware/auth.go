package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	authdomain "github.com/kalanara/evaluasi360-backend/internal/modules/auth/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
)

const (
	ContextClaimsKey = "AuthClaims"
	ContextUserIDKey = "UserID"
	ContextRoleKey   = "UserRole"
	ContextNIPKey    = "UserNIP"
)

// Auth verifies the Bearer JWT token and ensures it is not blacklisted.
func Auth(jwtService authdomain.JWTService, blacklistRepo authdomain.TokenBlacklistRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "Missing Authorization header", nil)
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			response.Error(c, http.StatusUnauthorized, "INVALID_TOKEN_FORMAT", "Authorization header format must be 'Bearer <token>'", nil)
			c.Abort()
			return
		}

		tokenString := parts[1]

		claims, err := jwtService.ValidateToken(tokenString)
		if err != nil {
			response.HandleDomainError(c, err)
			c.Abort()
			return
		}

		// Check Redis blacklist if repository is available
		if blacklistRepo != nil && claims.ID != "" {
			blacklisted, err := blacklistRepo.IsTokenBlacklisted(context.Background(), claims.ID)
			if err == nil && blacklisted {
				response.Error(c, http.StatusUnauthorized, "TOKEN_REVOKED", "Token has been revoked or logged out", nil)
				c.Abort()
				return
			}
		}

		c.Set(ContextClaimsKey, claims)
		c.Set(ContextUserIDKey, claims.UserID)
		c.Set(ContextRoleKey, string(claims.Role))
		c.Set(ContextNIPKey, claims.NIP)

		c.Next()
	}
}

// RequireRoles restricts route access to specific roles.
func RequireRoles(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get(ContextRoleKey)
		if !exists {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized access", nil)
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			response.Error(c, http.StatusForbidden, "FORBIDDEN", "Invalid user role", nil)
			c.Abort()
			return
		}

		for _, r := range allowedRoles {
			if strings.EqualFold(r, roleStr) {
				c.Next()
				return
			}
		}

		response.Error(c, http.StatusForbidden, "FORBIDDEN", "Insufficient role privileges to perform this operation", nil)
		c.Abort()
	}
}

