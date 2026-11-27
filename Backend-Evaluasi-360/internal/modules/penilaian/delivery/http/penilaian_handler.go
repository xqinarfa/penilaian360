package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type PenilaianHandler struct {
	usecase   domain.PenilaianUsecase
	validator *validator.CustomValidator
}

func NewPenilaianHandler(usecase domain.PenilaianUsecase, validator *validator.CustomValidator) *PenilaianHandler {
	return &PenilaianHandler{
		usecase:   usecase,
		validator: validator,
	}
}

// GetForm handles GET /api/v1/penilaian/form/:penugasanId
func (h *PenilaianHandler) GetForm(c *gin.Context) {
	penugasanID := c.Param("penugasanId")

	form, err := h.usecase.GetFormPenilaian(c.Request.Context(), penugasanID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Form penilaian retrieved successfully", form)
}

// Submit handles POST /api/v1/penilaian/submit
func (h *PenilaianHandler) Submit(c *gin.Context) {
	var req domain.SubmitPenilaianRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	if errorsList := h.validator.ValidateStruct(&req); len(errorsList) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", "Validation failed", errorsList)
		return
	}

	if err := h.usecase.SubmitPenilaian(c.Request.Context(), &req); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Penilaian submitted successfully", nil)
}

