package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"github.com/kalanara/evaluasi360-backend/internal/config"
	"github.com/kalanara/evaluasi360-backend/pkg/response"
)

type ipRateLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var (
	limiters = make(map[string]*ipRateLimiter)
	mu       sync.Mutex
)

// RateLimiter limits requests per client IP.
func RateLimiter(cfg config.RateLimitConfig) gin.HandlerFunc {
	if !cfg.Enabled {
		return func(c *gin.Context) { c.Next() }
	}

	// Periodically cleanup stale rate limiters
	go func() {
		for {
			time.Sleep(10 * time.Minute)
			mu.Lock()
			for ip, entry := range limiters {
				if time.Since(entry.lastSeen) > 30*time.Minute {
					delete(limiters, ip)
				}
			}
			mu.Unlock()
		}
	}()

	rateLimit := rate.Every(cfg.Window / time.Duration(cfg.Requests))

	return func(c *gin.Context) {
		ip := c.ClientIP()

		mu.Lock()
		v, exists := limiters[ip]
		if !exists {
			limiter := rate.NewLimiter(rateLimit, cfg.Burst)
			limiters[ip] = &ipRateLimiter{limiter: limiter, lastSeen: time.Now()}
			v = limiters[ip]
		}
		v.lastSeen = time.Now()
		mu.Unlock()

		if !v.limiter.Allow() {
			response.Error(c, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", "Too many requests, please slow down", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}

