package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	authdomain "github.com/kalanara/evaluasi360-backend/internal/modules/auth/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/middleware"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type AuthHandler struct {
	authUsecase authdomain.AuthUsecase
	validator   *validator.CustomValidator
	frontendURL string
}

func NewAuthHandler(authUsecase authdomain.AuthUsecase, validator *validator.CustomValidator, frontendURL ...string) *AuthHandler {
	fURL := "http://localhost:3000"
	if len(frontendURL) > 0 && frontendURL[0] != "" {
		fURL = frontendURL[0]
	}
	return &AuthHandler{
		authUsecase: authUsecase,
		validator:   validator,
		frontendURL: fURL,
	}
}

// Register creates a new user account.
func (h *AuthHandler) Register(c *gin.Context) {
	var input authdomain.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload provided", nil)
		return
	}

	if valErrors := h.validator.ValidateStruct(input); len(valErrors) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Validation failed for request fields", valErrors)
		return
	}

	res, err := h.authUsecase.Register(c.Request.Context(), input)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "User registered successfully", res)
}

// Login authenticates a user using NIP or Email and Password.
func (h *AuthHandler) Login(c *gin.Context) {
	var input authdomain.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload provided", nil)
		return
	}

	if input.Email == "" && input.NIP == "" {
		response.Error(c, http.StatusBadRequest, "VALIDATION_FAILED", "NIP or Email is required", nil)
		return
	}

	res, err := h.authUsecase.Login(c.Request.Context(), input)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	// Support both {success, data: {token, tokens, user}} and direct envelope
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"token":   res.Tokens.AccessToken,
		"tokens":  res.Tokens,
		"user":    res.User,
		"data": gin.H{
			"token":  res.Tokens.AccessToken,
			"tokens": res.Tokens,
			"user":   res.User,
		},
	})
}

// RefreshToken renews an access token using a refresh token.
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var input authdomain.RefreshTokenInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload provided", nil)
		return
	}

	if valErrors := h.validator.ValidateStruct(input); len(valErrors) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Validation failed", valErrors)
		return
	}

	tokens, err := h.authUsecase.RefreshToken(c.Request.Context(), input.RefreshToken)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Token refreshed successfully", tokens)
}

// Logout invalidates the active access token and stores it in Redis blacklist.
func (h *AuthHandler) Logout(c *gin.Context) {
	claimsVal, exists := c.Get(middleware.ContextClaimsKey)
	if !exists {
		response.JSON(c, http.StatusOK, "Successfully logged out", nil)
		return
	}

	claims, ok := claimsVal.(*authdomain.JWTClaims)
	if ok {
		_ = h.authUsecase.Logout(c.Request.Context(), claims)
	}

	response.JSON(c, http.StatusOK, "Successfully logged out", nil)
}

// ChangePassword changes the user password.
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	val, exists := c.Get(middleware.ContextUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "User identity not found in context", nil)
		return
	}
	userID := val.(uuid.UUID)

	var input authdomain.ChangePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload provided", nil)
		return
	}

	if valErrors := h.validator.ValidateStruct(input); len(valErrors) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "Validation failed", valErrors)
		return
	}

	if err := h.authUsecase.ChangePassword(c.Request.Context(), userID, input); err != nil {
		response.Error(c, http.StatusBadRequest, "CHANGE_PASSWORD_FAILED", err.Error(), nil)
		return
	}

	response.JSON(c, http.StatusOK, "Password changed successfully", nil)
}

// GetSSOURL returns the redirection URL for Kemenhub HubNet SSO.
func (h *AuthHandler) GetSSOURL(c *gin.Context) {
	authURL := h.authUsecase.GetSSOAuthURL()
	response.JSON(c, http.StatusOK, "SSO Authorization URL generated", gin.H{
		"auth_url": authURL,
	})
}

// LoginSSO exchanges authorization code for JWT tokens (POST /api/v1/auth/sso).
func (h *AuthHandler) LoginSSO(c *gin.Context) {
	var req authdomain.SSOLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload provided", nil)
		return
	}

	if req.Code == "" {
		response.Error(c, http.StatusBadRequest, "VALIDATION_FAILED", "SSO authorization code is required", nil)
		return
	}

	res, err := h.authUsecase.LoginSSO(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "SSO_FAILED", err.Error(), nil)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "SSO Authentication successful",
		"token":   res.Tokens.AccessToken,
		"tokens":  res.Tokens,
		"user":    res.User,
		"data": gin.H{
			"token":  res.Tokens.AccessToken,
			"tokens": res.Tokens,
			"user":   res.User,
		},
	})
}

// LoginEduhub handles GET /api/v1/auth/sso callback with ?token={JWT}&user={JSON}.
func (h *AuthHandler) LoginEduhub(c *gin.Context) {
	token := c.Query("token")
	userJSON := c.Query("user")

	if token == "" {
		if strings.Contains(c.GetHeader("Accept"), "text/html") {
			c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%s/login?error=%s", h.frontendURL, url.QueryEscape("Token parameter is required")))
			return
		}
		response.Error(c, http.StatusBadRequest, "MISSING_TOKEN", "Token parameter is required", nil)
		return
	}

	var preDecoded authdomain.EduhubUserInfo
	if userJSON != "" {
		decoded := userJSON
		if unescaped, err := url.QueryUnescape(userJSON); err == nil {
			decoded = unescaped
		}
		_ = json.Unmarshal([]byte(decoded), &preDecoded)
	}

	var res *authdomain.AuthResponse
	var err error
	if preDecoded.NIP != "" {
		res, err = h.authUsecase.LoginEduhub(c.Request.Context(), token, preDecoded)
	} else {
		res, err = h.authUsecase.LoginEduhub(c.Request.Context(), token)
	}

	if err != nil {
		if strings.Contains(c.GetHeader("Accept"), "text/html") {
			c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%s/login?error=%s", h.frontendURL, url.QueryEscape(err.Error())))
			return
		}
		response.Error(c, http.StatusUnauthorized, "AUTH_FAILED", err.Error(), nil)
		return
	}

	// If browser redirect requested
	if strings.Contains(c.GetHeader("Accept"), "text/html") {
		redirectTarget := fmt.Sprintf("%s/dashboard?token=%s&refresh_token=%s",
			h.frontendURL,
			url.QueryEscape(res.Tokens.AccessToken),
			url.QueryEscape(res.Tokens.RefreshToken),
		)
		c.Redirect(http.StatusTemporaryRedirect, redirectTarget)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "EduHub SSO Authentication successful",
		"token":   res.Tokens.AccessToken,
		"tokens":  res.Tokens,
		"user":    res.User,
		"data": gin.H{
			"token":  res.Tokens.AccessToken,
			"tokens": res.Tokens,
			"user":   res.User,
		},
	})
}
