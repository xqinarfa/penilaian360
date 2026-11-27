package middleware

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
)

// Timeout injects a timeout into the request context.
func Timeout(duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), duration)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

