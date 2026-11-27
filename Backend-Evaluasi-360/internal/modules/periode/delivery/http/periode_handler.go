package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/internal/modules/periode/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type PeriodeHandler struct {
	usecase   domain.PeriodeUsecase
	validator *validator.CustomValidator
}

func NewPeriodeHandler(usecase domain.PeriodeUsecase, validator *validator.CustomValidator) *PeriodeHandler {
	return &PeriodeHandler{
		usecase:   usecase,
		validator: validator,
	}
}

// ListPeriode handles GET /api/v1/periode
func (h *PeriodeHandler) ListPeriode(c *gin.Context) {
	list, err := h.usecase.GetPeriodeList(c.Request.Context())
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Periode list retrieved successfully", list)
}

// GetPeriode handles GET /api/v1/periode/:id
func (h *PeriodeHandler) GetPeriode(c *gin.Context) {
	id := c.Param("id")
	item, err := h.usecase.GetPeriode(c.Request.Context(), id)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Periode detail retrieved successfully", item)
}

// CreatePeriode handles POST /api/v1/periode
func (h *PeriodeHandler) CreatePeriode(c *gin.Context) {
	var req domain.CreatePeriodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	if errorsList := h.validator.ValidateStruct(&req); len(errorsList) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", "Validation failed", errorsList)
		return
	}

	created, err := h.usecase.CreatePeriode(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Periode created successfully", created)
}

// ListAlumni handles GET /api/v1/periode/:id/alumni or /api/v1/alumni
func (h *PeriodeHandler) ListAlumni(c *gin.Context) {
	periodeID := c.Param("id")
	if periodeID == "" {
		periodeID = c.Query("periodeId")
	}

	list, err := h.usecase.GetAlumniList(c.Request.Context(), periodeID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Alumni list retrieved successfully", list)
}

// GetAlumniDetail handles GET /api/v1/alumni/:id
func (h *PeriodeHandler) GetAlumniDetail(c *gin.Context) {
	id := c.Param("id")
	alumni, penilaiList, err := h.usecase.GetAlumniDetail(c.Request.Context(), id)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Alumni detail retrieved successfully", gin.H{
		"alumni":      alumni,
		"penilaiList": penilaiList,
	})
}

// GantiPenilai handles POST /api/v1/penugasan/:id/ganti-penilai
func (h *PeriodeHandler) GantiPenilai(c *gin.Context) {
	penugasanID := c.Param("id")

	var req domain.GantiPenilaiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	if errorsList := h.validator.ValidateStruct(&req); len(errorsList) > 0 {
		response.Error(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", "Validation failed", errorsList)
		return
	}

	if err := h.usecase.GantiPenilai(c.Request.Context(), penugasanID, &req); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Penilai successfully replaced", nil)
}

// BatalkanPenugasan handles DELETE /api/v1/penugasan/:id
func (h *PeriodeHandler) BatalkanPenugasan(c *gin.Context) {
	penugasanID := c.Param("id")
	alasan := c.Query("alasan")

	if err := h.usecase.BatalkanPenugasan(c.Request.Context(), penugasanID, alasan); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Penugasan successfully canceled", nil)
}

// KirimPengingat handles POST /api/v1/penugasan/:id/pengingat
func (h *PeriodeHandler) KirimPengingat(c *gin.Context) {
	penugasanID := c.Param("id")

	var req domain.KirimPengingatRequest
	_ = c.ShouldBindJSON(&req)

	if err := h.usecase.KirimPengingat(c.Request.Context(), penugasanID, &req); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pengingat successfully sent", nil)
}

// ListPenilaianTertunda handles GET /api/v1/penilaian-tertunda
func (h *PeriodeHandler) ListPenilaianTertunda(c *gin.Context) {
	list, err := h.usecase.GetPenilaianTertunda(c.Request.Context())
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Penilaian tertunda list retrieved successfully", list)
}

