package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

type PegawaiHandler struct {
	usecase   domain.PegawaiUsecase
	validator *validator.CustomValidator
}

func NewPegawaiHandler(usecase domain.PegawaiUsecase, validator *validator.CustomValidator) *PegawaiHandler {
	return &PegawaiHandler{
		usecase:   usecase,
		validator: validator,
	}
}

// ListPegawai handles GET /api/v1/pegawai
func (h *PegawaiHandler) ListPegawai(c *gin.Context) {
	search := c.Query("search")
	unitKerja := c.Query("unitKerja")
	statusRelasi := c.Query("statusRelasi")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	items, total, err := h.usecase.ListPegawai(c.Request.Context(), search, unitKerja, statusRelasi, limit, offset)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pegawai list retrieved successfully", gin.H{
		"items":  items,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

// GetPegawai handles GET /api/v1/pegawai/:id
func (h *PegawaiHandler) GetPegawai(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_ID", "Invalid pegawai ID", nil)
		return
	}

	item, err := h.usecase.GetPegawai(c.Request.Context(), id)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pegawai details retrieved successfully", item)
}

// UpdateRelasi handles PUT /api/v1/pegawai/:id/relasi
func (h *PegawaiHandler) UpdateRelasi(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_ID", "Invalid pegawai ID", nil)
		return
	}

	var req domain.UpdateRelasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	updated, err := h.usecase.UpdateRelasi(c.Request.Context(), id, &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Relasi kerja updated successfully", updated)
}

// CreatePegawai handles POST /api/v1/pegawai
func (h *PegawaiHandler) CreatePegawai(c *gin.Context) {
	var req domain.CreatePegawaiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	created, err := h.usecase.CreatePegawai(c.Request.Context(), &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusCreated, "Pegawai created successfully", created)
}

// UpdatePegawai handles PUT /api/v1/pegawai/:id
func (h *PegawaiHandler) UpdatePegawai(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_ID", "Invalid pegawai ID", nil)
		return
	}

	var req domain.UpdatePegawaiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	updated, err := h.usecase.UpdatePegawai(c.Request.Context(), id, &req)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pegawai updated successfully", updated)
}

// DeletePegawai handles DELETE /api/v1/pegawai/:id
func (h *PegawaiHandler) DeletePegawai(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_ID", "Invalid pegawai ID", nil)
		return
	}

	if err := h.usecase.DeletePegawai(c.Request.Context(), id); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pegawai deleted successfully", nil)
}

type DeleteBatchRequest struct {
	IDs []string `json:"ids" binding:"required"`
}

// DeleteBatchPegawai handles DELETE /api/v1/pegawai
func (h *PegawaiHandler) DeleteBatchPegawai(c *gin.Context) {
	var req DeleteBatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	parsedIDs := make([]uuid.UUID, 0, len(req.IDs))
	for _, idStr := range req.IDs {
		if id, err := uuid.Parse(idStr); err == nil {
			parsedIDs = append(parsedIDs, id)
		}
	}

	if err := h.usecase.DeleteBatchPegawai(c.Request.Context(), parsedIDs); err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Pegawai items deleted successfully", nil)
}

// GetSyncHistory handles GET /api/v1/pegawai/sync-history
func (h *PegawaiHandler) GetSyncHistory(c *gin.Context) {
	history, err := h.usecase.GetSyncHistory(c.Request.Context())
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Riwayat sinkronisasi SI-K retrieved successfully", history)
}

type TriggerSyncRequest struct {
	TriggeredBy string `json:"triggeredBy"`
}

// TriggerSyncSIK handles POST /api/v1/pegawai/sync-sik
func (h *PegawaiHandler) TriggerSyncSIK(c *gin.Context) {
	var req TriggerSyncRequest
	_ = c.ShouldBindJSON(&req)

	synced, err := h.usecase.TriggerSyncSIK(c.Request.Context(), req.TriggeredBy)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Sinkronisasi SI-K berhasil diproses", synced)
}

