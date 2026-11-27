package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/internal/modules/laporan/domain"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
)

type LaporanHandler struct {
	usecase domain.LaporanUsecase
}

func NewLaporanHandler(usecase domain.LaporanUsecase) *LaporanHandler {
	return &LaporanHandler{usecase: usecase}
}

// GetDashboardMetrics handles GET /api/v1/laporan/dashboard
func (h *LaporanHandler) GetDashboardMetrics(c *gin.Context) {
	year := c.DefaultQuery("year", "2026")
	metrics, err := h.usecase.GetDashboard(c.Request.Context(), year)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Dashboard metrics retrieved successfully", metrics)
}

// GetRekap handles GET /api/v1/laporan/rekap
func (h *LaporanHandler) GetRekap(c *gin.Context) {
	periodeID := c.Query("periodeId")
	rekap, err := h.usecase.GetRekap(c.Request.Context(), periodeID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Rekap evaluasi retrieved successfully", rekap)
}

// GetDetailIndividu handles GET /api/v1/laporan/alumni/:id
func (h *LaporanHandler) GetDetailIndividu(c *gin.Context) {
	alumniID := c.Param("id")
	data, err := h.usecase.GetDetailIndividu(c.Request.Context(), alumniID)
	if err != nil {
		response.HandleDomainError(c, err)
		return
	}

	response.JSON(c, http.StatusOK, "Detail individu retrieved successfully", data)
}

