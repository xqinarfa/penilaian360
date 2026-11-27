package http

import (
	"net/http/pprof"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/kalanara/evaluasi360-backend/internal/config"
	authdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/auth/delivery/http"
	authdomain "github.com/kalanara/evaluasi360-backend/internal/modules/auth/domain"
	healthdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/health/delivery/http"
	instrumendelivery "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/delivery/http"
	laporandelivery "github.com/kalanara/evaluasi360-backend/internal/modules/laporan/delivery/http"
	pegawaidelivery "github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/delivery/http"
	penilaiandelivery "github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/delivery/http"
	periodedelivery "github.com/kalanara/evaluasi360-backend/internal/modules/periode/delivery/http"
	userdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/user/delivery/http"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/middleware"
)

type RouterConfig struct {
	Config           *config.Config
	JWTService       authdomain.JWTService
	BlacklistRepo    authdomain.TokenBlacklistRepository
	HealthHandler    *healthdelivery.HealthHandler
	AuthHandler      *authdelivery.AuthHandler
	UserHandler      *userdelivery.UserHandler
	PegawaiHandler   *pegawaidelivery.PegawaiHandler
	InstrumenHandler *instrumendelivery.InstrumenHandler
	PeriodeHandler   *periodedelivery.PeriodeHandler
	PenilaianHandler *penilaiandelivery.PenilaianHandler
	LaporanHandler   *laporandelivery.LaporanHandler
}

func SetupRouter(cfg *RouterConfig) *gin.Engine {
	if cfg.Config.App.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Global Middlewares
	router.Use(middleware.RequestID())
	router.Use(middleware.StructuredLogger())
	router.Use(middleware.Recovery())
	router.Use(middleware.CORS(cfg.Config.HTTP.CORSOrigins))
	router.Use(middleware.RateLimiter(cfg.Config.RateLimit))
	router.Use(middleware.Timeout(cfg.Config.HTTP.ContextTimeout))

	// Health Check Probes
	router.GET("/healthz", cfg.HealthHandler.Healthz)
	router.GET("/readyz", cfg.HealthHandler.Readyz)

	// Prometheus Metrics Endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Go pprof Profiling endpoints
	pprofGroup := router.Group("/debug/pprof")
	{
		pprofGroup.GET("/", gin.WrapF(pprof.Index))
		pprofGroup.GET("/cmdline", gin.WrapF(pprof.Cmdline))
		pprofGroup.GET("/profile", gin.WrapF(pprof.Profile))
		pprofGroup.POST("/symbol", gin.WrapF(pprof.Symbol))
		pprofGroup.GET("/symbol", gin.WrapF(pprof.Symbol))
		pprofGroup.GET("/trace", gin.WrapF(pprof.Trace))
		pprofGroup.GET("/allocs", gin.WrapH(pprof.Handler("allocs")))
		pprofGroup.GET("/block", gin.WrapH(pprof.Handler("block")))
		pprofGroup.GET("/goroutine", gin.WrapH(pprof.Handler("goroutine")))
		pprofGroup.GET("/heap", gin.WrapH(pprof.Handler("heap")))
		pprofGroup.GET("/mutex", gin.WrapH(pprof.Handler("mutex")))
		pprofGroup.GET("/threadcreate", gin.WrapH(pprof.Handler("threadcreate")))
	}

	// SSO entrypoints
	router.GET("/api/sso", cfg.AuthHandler.LoginEduhub)
	router.GET("/sso", cfg.AuthHandler.LoginEduhub)

	// Direct /auth alias routes (compatible with KMS API contract)
	directAuthGroup := router.Group("/auth")
	{
		directAuthGroup.POST("/register", cfg.AuthHandler.Register)
		directAuthGroup.POST("/login", cfg.AuthHandler.Login)
		directAuthGroup.POST("/refresh", cfg.AuthHandler.RefreshToken)
		directAuthGroup.POST("/sso", cfg.AuthHandler.LoginSSO)
		directAuthGroup.GET("/sso", cfg.AuthHandler.LoginEduhub)
		directAuthGroup.GET("/sso/url", cfg.AuthHandler.GetSSOURL)
	}

	// API v1 Routes
	v1Group := router.Group("/api/v1")
	{
		// Module Auth (Public)
		authGroup := v1Group.Group("/auth")
		{
			authGroup.POST("/register", cfg.AuthHandler.Register)
			authGroup.POST("/login", cfg.AuthHandler.Login)
			authGroup.POST("/refresh", cfg.AuthHandler.RefreshToken)
			authGroup.POST("/sso", cfg.AuthHandler.LoginSSO)
			authGroup.GET("/sso", cfg.AuthHandler.LoginEduhub)
			authGroup.GET("/sso/url", cfg.AuthHandler.GetSSOURL)
		}

		// Public Form Access / direct token query
		v1Group.GET("/penilaian/form/:penugasanId", cfg.PenilaianHandler.GetForm)
		v1Group.POST("/penilaian/submit", cfg.PenilaianHandler.Submit)

		// Module Instrumen endpoints
		v1Group.GET("/instrumen/pelatihan", cfg.InstrumenHandler.ListPelatihan)
		v1Group.POST("/instrumen/pelatihan", cfg.InstrumenHandler.CreatePelatihan)
		v1Group.GET("/instrumen/fokus", cfg.InstrumenHandler.ListFokus)
		v1Group.POST("/instrumen/fokus", cfg.InstrumenHandler.CreateFokus)
		v1Group.POST("/instrumen/subdimensi", cfg.InstrumenHandler.CreateSubdimensi)
		v1Group.POST("/instrumen/indikator", cfg.InstrumenHandler.CreateIndikator)
		v1Group.POST("/instrumen/butir", cfg.InstrumenHandler.AddButir)
		v1Group.PUT("/instrumen/butir/:id", cfg.InstrumenHandler.UpdateButir)
		v1Group.DELETE("/instrumen/butir/:id", cfg.InstrumenHandler.DeleteButir)
		v1Group.POST("/instrumen/duplikat", cfg.InstrumenHandler.DuplicateInstrumen)

		// Dashboard & Laporan Public Read (or viewable by authenticated users)
		v1Group.GET("/laporan/dashboard", cfg.LaporanHandler.GetDashboardMetrics)
		v1Group.GET("/laporan/rekap", cfg.LaporanHandler.GetRekap)
		v1Group.GET("/laporan/alumni/:id", cfg.LaporanHandler.GetDetailIndividu)

		// Periode & Penilaian tertunda views
		v1Group.GET("/periode", cfg.PeriodeHandler.ListPeriode)
		v1Group.POST("/periode", cfg.PeriodeHandler.CreatePeriode)
		v1Group.GET("/periode/:id", cfg.PeriodeHandler.GetPeriode)
		v1Group.GET("/periode/:id/alumni", cfg.PeriodeHandler.ListAlumni)
		v1Group.GET("/alumni", cfg.PeriodeHandler.ListAlumni)
		v1Group.GET("/alumni/:id", cfg.PeriodeHandler.GetAlumniDetail)
		v1Group.GET("/penilaian-tertunda", cfg.PeriodeHandler.ListPenilaianTertunda)

		// Module Penugasan Management
		v1Group.POST("/penugasan/:id/ganti-penilai", cfg.PeriodeHandler.GantiPenilai)
		v1Group.DELETE("/penugasan/:id", cfg.PeriodeHandler.BatalkanPenugasan)
		v1Group.POST("/penugasan/:id/pengingat", cfg.PeriodeHandler.KirimPengingat)

		// Module Pegawai endpoints
		v1Group.GET("/pegawai/sync-history", cfg.PegawaiHandler.GetSyncHistory)
		v1Group.POST("/pegawai/sync-sik", cfg.PegawaiHandler.TriggerSyncSIK)
		v1Group.GET("/pegawai", cfg.PegawaiHandler.ListPegawai)
		v1Group.GET("/pegawai/:id", cfg.PegawaiHandler.GetPegawai)
		v1Group.PUT("/pegawai/:id", cfg.PegawaiHandler.UpdatePegawai)
		v1Group.PUT("/pegawai/:id/relasi", cfg.PegawaiHandler.UpdateRelasi)
		v1Group.POST("/pegawai", cfg.PegawaiHandler.CreatePegawai)
		v1Group.DELETE("/pegawai/:id", cfg.PegawaiHandler.DeletePegawai)
		v1Group.DELETE("/pegawai", cfg.PegawaiHandler.DeleteBatchPegawai)

		// Authenticated Routes
		authMiddleware := middleware.Auth(cfg.JWTService, cfg.BlacklistRepo)
		authenticated := v1Group.Group("")
		authenticated.Use(authMiddleware)
		{
			// Module Auth (Protected)
			authenticated.POST("/auth/logout", cfg.AuthHandler.Logout)
			authenticated.POST("/auth/change-password", cfg.AuthHandler.ChangePassword)

			// Module User Profile
			userGroup := authenticated.Group("/users")
			{
				userGroup.GET("/me", cfg.UserHandler.Me)
				userGroup.PUT("/me", cfg.UserHandler.UpdateMe)
				userGroup.GET("", middleware.RequireRoles(string(userdomain.RoleAdmin)), cfg.UserHandler.ListUsers)
			}
			authenticated.GET("/auth/me", cfg.UserHandler.Me)
		}
	}

	return router
}

