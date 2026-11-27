package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/middleware"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type UserHandler struct {
	userUsecase domain.UserUsecase
	validator   *validator.CustomValidator
}

func NewUserHandler(userUsecase domain.UserUsecase, validator *validator.CustomValidator) *UserHandler {
	return &UserHandler{
		userUsecase: userUsecase,
		validator:   validator,
	}
}

// Me retrieves current authenticated user profile.
func (h *UserHandler) Me(c *gin.Context) {
	val, exists := c.Get(middleware.ContextUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "User identity not found in request context", nil)
		return
	}

	userID, ok := val.(uuid.UUID)
	if !ok {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Invalid user ID format", nil)
		return
	}

	profile, err := h.userUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "User profile retrieved successfully", profile)
}

// UpdateMe updates current user's profile information.
func (h *UserHandler) UpdateMe(c *gin.Context) {
	val, exists := c.Get(middleware.ContextUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "User identity not found in context", nil)
		return
	}
	userID := val.(uuid.UUID)

	var req domain.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	if errorsList := h.validator.ValidateStruct(&req); len(errorsList) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", "Validation failed", errorsList)
		return
	}

	profile, err := h.userUsecase.UpdateProfile(c.Request.Context(), userID, &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Profile updated successfully", profile)
}

// ListUsers returns paginated list of users (Admin only).
func (h *UserHandler) ListUsers(c *gin.Context) {
	search := c.Query("search")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	users, total, err := h.userUsecase.ListUsers(c.Request.Context(), search, limit, offset)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Users listed successfully", gin.H{
		"users":  users,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

