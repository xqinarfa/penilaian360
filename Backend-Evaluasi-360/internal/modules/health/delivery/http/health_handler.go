package http

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	platformdb "github.com/kalanara/evaluasi360-backend/internal/platform/database"
	platformredis "github.com/kalanara/evaluasi360-backend/internal/platform/redis"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
)

type HealthHandler struct {
	db    *platformdb.DB
	redis *platformredis.Client
}

func NewHealthHandler(db *platformdb.DB, redis *platformredis.Client) *HealthHandler {
	return &HealthHandler{db: db, redis: redis}
}

// Healthz serves Kubernetes / cloud liveness probe.
func (h *HealthHandler) Healthz(c *gin.Context) {
	response.JSON(c, http.StatusOK, "Service is healthy and alive", gin.H{
		"status":    "UP",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Readyz serves Kubernetes / cloud readiness probe verifying DB & Redis availability.
func (h *HealthHandler) Readyz(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	checks := gin.H{
		"database": "UP",
		"redis":    "UP",
	}
	allHealthy := true

	if h.db != nil {
		if err := h.db.Ping(ctx); err != nil {
			checks["database"] = "DOWN: " + err.Error()
			allHealthy = false
		}
	} else {
		checks["database"] = "NOT_CONFIGURED"
	}

	if h.redis != nil {
		if err := h.redis.Ping(ctx).Err(); err != nil {
			checks["redis"] = "DOWN: " + err.Error()
			allHealthy = false
		}
	} else {
		checks["redis"] = "NOT_CONFIGURED"
	}

	if !allHealthy {
		response.Error(c, http.StatusServiceUnavailable, "SERVICE_DEGRADED", "One or more dependencies are unavailable", checks)
		return
	}

	response.JSON(c, http.StatusOK, "All systems operational", checks)
}

