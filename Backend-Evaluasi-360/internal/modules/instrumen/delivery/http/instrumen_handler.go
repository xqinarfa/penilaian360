package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type InstrumenHandler struct {
	usecase   domain.InstrumenUsecase
	validator *validator.CustomValidator
}

func NewInstrumenHandler(usecase domain.InstrumenUsecase, validator *validator.CustomValidator) *InstrumenHandler {
	return &InstrumenHandler{
		usecase:   usecase,
		validator: validator,
	}
}

// ListPelatihan handles GET /api/v1/instrumen/pelatihan
func (h *InstrumenHandler) ListPelatihan(c *gin.Context) {
	list, err := h.usecase.GetPelatihanList(c.Request.Context())
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pelatihan list retrieved successfully", list)
}

// CreatePelatihan handles POST /api/v1/instrumen/pelatihan
func (h *InstrumenHandler) CreatePelatihan(c *gin.Context) {
	var req domain.CreatePelatihanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	p, err := h.usecase.CreatePelatihan(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Jenis pelatihan created successfully", p)
}

// ListFokus handles GET /api/v1/instrumen/fokus?pelatihanId=...
func (h *InstrumenHandler) ListFokus(c *gin.Context) {
	pelatihanID := c.Query("pelatihanId")

	fokusList, err := h.usecase.GetFokusList(c.Request.Context(), pelatihanID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Fokus evaluasi list retrieved successfully", fokusList)
}

// CreateFokus handles POST /api/v1/instrumen/fokus
func (h *InstrumenHandler) CreateFokus(c *gin.Context) {
	var req domain.CreateFokusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	fokus, err := h.usecase.AddFokus(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Fokus evaluasi created successfully", fokus)
}

// CreateSubdimensi handles POST /api/v1/instrumen/subdimensi
func (h *InstrumenHandler) CreateSubdimensi(c *gin.Context) {
	var req domain.CreateSubdimensiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	sub, err := h.usecase.AddSubdimensi(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Subdimensi created successfully", sub)
}

// CreateIndikator handles POST /api/v1/instrumen/indikator
func (h *InstrumenHandler) CreateIndikator(c *gin.Context) {
	var req domain.CreateIndikatorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	ind, err := h.usecase.AddIndikator(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Indikator created successfully", ind)
}

// AddButir handles POST /api/v1/instrumen/butir
func (h *InstrumenHandler) AddButir(c *gin.Context) {
	var req domain.CreateButirRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	butir, err := h.usecase.AddButir(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Butir instrumen added successfully", butir)
}

// UpdateButir handles PUT /api/v1/instrumen/butir/:id
func (h *InstrumenHandler) UpdateButir(c *gin.Context) {
	id := c.Param("id")
	var req domain.UpdateButirRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	updated, err := h.usecase.UpdateButir(c.Request.Context(), id, &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Butir instrumen updated successfully", updated)
}

// DeleteButir handles DELETE /api/v1/instrumen/butir/:id
func (h *InstrumenHandler) DeleteButir(c *gin.Context) {
	id := c.Param("id")
	if err := h.usecase.DeleteButir(c.Request.Context(), id); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Butir instrumen deleted successfully", nil)
}

// DuplicateInstrumen handles POST /api/v1/instrumen/duplikat
func (h *InstrumenHandler) DuplicateInstrumen(c *gin.Context) {
	var req domain.DuplicateInstrumenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	if err := h.usecase.DuplicateInstrumen(c.Request.Context(), &req); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Instrumen duplicated successfully", nil)
}

