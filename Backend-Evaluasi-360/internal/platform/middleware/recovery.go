package middleware

import (
	"log/slog"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
)

// Recovery handles panics cleanly and returns a standardized 500 error envelope.
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				stack := string(debug.Stack())
				reqID, _ := c.Get("RequestID")

				slog.Error("Unhandled Panic Recovered",
					"request_id", reqID,
					"error", r,
					"stack", stack,
				)

				response.Error(c, http.StatusInternalServerError, "INTERNAL_PANIC", "An internal error occurred", nil)
				c.Abort()
			}
		}()
		c.Next()
	}
}

