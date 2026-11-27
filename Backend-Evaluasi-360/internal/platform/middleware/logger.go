package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/internal/platform/metrics"
)

// StructuredLogger logs each HTTP request and records Prometheus metrics.
func StructuredLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method

		metrics.HttpRequestsTotal.WithLabelValues(method, path, string(rune(statusCode))).Inc()
		metrics.HttpRequestDuration.WithLabelValues(method, path).Observe(latency.Seconds())

		reqID, _ := c.Get("RequestID")

		if rawQuery != "" {
			path = path + "?" + rawQuery
		}

		attrs := []any{
			slog.String("request_id", reqID.(string)),
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("status", statusCode),
			slog.Duration("latency", latency),
			slog.String("client_ip", clientIP),
		}

		if len(c.Errors) > 0 {
			attrs = append(attrs, slog.String("errors", c.Errors.String()))
			slog.Error("HTTP Request Error", attrs...)
		} else if statusCode >= 500 {
			slog.Error("HTTP Server Error", attrs...)
		} else if statusCode >= 400 {
			slog.Warn("HTTP Client Error", attrs...)
		} else {
			slog.Info("HTTP Request Handled", attrs...)
		}
	}
}

