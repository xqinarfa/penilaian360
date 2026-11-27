package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HttpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "evaluasi360_http_requests_total",
			Help: "Total number of HTTP requests processed by Evaluasi 360 backend",
		},
		[]string{"method", "path", "status"},
	)

	HttpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "evaluasi360_http_request_duration_seconds",
			Help:    "Histogram of HTTP request latencies in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "path"},
	)

	ActiveEvaluations = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "evaluasi360_active_evaluations_total",
			Help: "Current count of active evaluations in progress",
		},
	)
)

func InitMetrics() *prometheus.Registry {
	return prometheus.DefaultRegisterer.(*prometheus.Registry)
}

