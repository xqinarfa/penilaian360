package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	apphttp "github.com/kalanara/evaluasi360-backend/internal/app/http"
	"github.com/kalanara/evaluasi360-backend/internal/config"
	authdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/auth/delivery/http"
	authrepo "github.com/kalanara/evaluasi360-backend/internal/modules/auth/repository"
	authusecase "github.com/kalanara/evaluasi360-backend/internal/modules/auth/usecase"
	healthdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/health/delivery/http"
	instrumendelivery "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/delivery/http"
	instrumenrepo "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/repository"
	instrumenusecase "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/usecase"
	laporandelivery "github.com/kalanara/evaluasi360-backend/internal/modules/laporan/delivery/http"
	laporanrepo "github.com/kalanara/evaluasi360-backend/internal/modules/laporan/repository"
	laporanusecase "github.com/kalanara/evaluasi360-backend/internal/modules/laporan/usecase"
	pegawaidelivery "github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/delivery/http"
	pegawairepo "github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/repository"
	pegawaiusecase "github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/usecase"
	penilaiandelivery "github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/delivery/http"
	penilaianrepo "github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/repository"
	penilaianusecase "github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/usecase"
	periodedelivery "github.com/kalanara/evaluasi360-backend/internal/modules/periode/delivery/http"
	perioderepo "github.com/kalanara/evaluasi360-backend/internal/modules/periode/repository"
	periodeusecase "github.com/kalanara/evaluasi360-backend/internal/modules/periode/usecase"
	userdelivery "github.com/kalanara/evaluasi360-backend/internal/modules/user/delivery/http"
	userrepo "github.com/kalanara/evaluasi360-backend/internal/modules/user/repository"
	userusecase "github.com/kalanara/evaluasi360-backend/internal/modules/user/usecase"
	platformdb "github.com/kalanara/evaluasi360-backend/internal/platform/database"
	platformlogger "github.com/kalanara/evaluasi360-backend/internal/platform/logger"
	platformmetrics "github.com/kalanara/evaluasi360-backend/internal/platform/metrics"
	platformminio "github.com/kalanara/evaluasi360-backend/internal/platform/minio"
	platformnats "github.com/kalanara/evaluasi360-backend/internal/platform/nats"
	platformredis "github.com/kalanara/evaluasi360-backend/internal/platform/redis"
	platformsecurity "github.com/kalanara/evaluasi360-backend/internal/platform/security"
	"github.com/kalanara/evaluasi360-backend/pkg/validator"
)

func main() {
	// 1. Load strongly-typed environment config
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "FATAL: Failed to load application configuration: %v\n", err)
		os.Exit(1)
	}

	// 2. Initialize structured logging (slog)
	appLogger := platformlogger.InitLogger(cfg.App)
	appLogger.Info("Starting Evaluasi 360 Backend API (Modular Clean Architecture)",
		"version", "1.0.0",
		"env", cfg.App.Environment,
		"http_port", cfg.HTTP.Port,
	)

	// 3. Initialize Prometheus Metrics
	_ = platformmetrics.InitMetrics()

	// 4. Platform: Database (PostgreSQL + GORM)
	db, err := platformdb.NewDB(cfg.Database)
	if err != nil {
		appLogger.Error("Failed to initialize PostgreSQL connection", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// 5. Platform: Redis
	redisClient, err := platformredis.NewClient(cfg.Redis)
	if err != nil {
		appLogger.Warn("Redis connection failed (caching/blacklist may be degraded)", "error", err)
	} else {
		defer redisClient.Close()
	}

	// 6. Platform: NATS JetStream
	natsClient, err := platformnats.NewClient(cfg.NATS)
	if err != nil {
		appLogger.Warn("NATS connection failed (event streaming may be degraded)", "error", err)
	} else {
		defer natsClient.Close()
	}

	// 7. Platform: MinIO Object Storage
	minioClient, err := platformminio.NewClient(cfg.MinIO)
	if err != nil {
		appLogger.Warn("MinIO connection failed (document/avatar storage may be degraded)", "error", err)
	}
	_ = minioClient

	// 8. Shared Security & Validation Services
	jwtService := platformsecurity.NewJWTService(cfg.JWT)
	passwordHasher := platformsecurity.NewBcryptHasher()
	customValidator := validator.New()

	// 9. Wire Repositories
	userRepository := userrepo.NewGormUserRepository(db.GormDB)
	tokenBlacklistRepo := authrepo.NewRedisTokenBlacklistRepository(redisClient)
	pegawaiRepository := pegawairepo.NewGormPegawaiRepository(db.GormDB)
	instrumenRepository := instrumenrepo.NewGormInstrumenRepository(db.GormDB)
	periodeRepository := perioderepo.NewGormPeriodeRepository(db.GormDB)
	penilaianRepository := penilaianrepo.NewGormPenilaianRepository(db.GormDB)
	laporanRepository := laporanrepo.NewGormLaporanRepository(db.GormDB)

	// 10. Wire Usecases
	userUsecaseInstance := userusecase.NewUserUsecase(userRepository)
	authUsecaseInstance := authusecase.NewAuthUsecase(userRepository, tokenBlacklistRepo, passwordHasher, jwtService, natsClient, cfg.SSO)
	pegawaiUsecaseInstance := pegawaiusecase.NewPegawaiUsecase(pegawaiRepository)
	instrumenUsecaseInstance := instrumenusecase.NewInstrumenUsecase(instrumenRepository)
	periodeUsecaseInstance := periodeusecase.NewPeriodeUsecase(periodeRepository)
	penilaianUsecaseInstance := penilaianusecase.NewPenilaianUsecase(penilaianRepository, natsClient)
	laporanUsecaseInstance := laporanusecase.NewLaporanUsecase(laporanRepository)

	// 11. Wire Handlers
	healthHandler := healthdelivery.NewHealthHandler(db, redisClient)
	userHandler := userdelivery.NewUserHandler(userUsecaseInstance, customValidator)
	authHandler := authdelivery.NewAuthHandler(authUsecaseInstance, customValidator, cfg.SSO.FrontendURL)
	pegawaiHandler := pegawaidelivery.NewPegawaiHandler(pegawaiUsecaseInstance, customValidator)
	instrumenHandler := instrumendelivery.NewInstrumenHandler(instrumenUsecaseInstance, customValidator)
	periodeHandler := periodedelivery.NewPeriodeHandler(periodeUsecaseInstance, customValidator)
	penilaianHandler := penilaiandelivery.NewPenilaianHandler(penilaianUsecaseInstance, customValidator)
	laporanHandler := laporandelivery.NewLaporanHandler(laporanUsecaseInstance)

	// 12. Setup Router
	router := apphttp.SetupRouter(&apphttp.RouterConfig{
		Config:           cfg,
		JWTService:       jwtService,
		BlacklistRepo:    tokenBlacklistRepo,
		HealthHandler:    healthHandler,
		AuthHandler:      authHandler,
		UserHandler:      userHandler,
		PegawaiHandler:   pegawaiHandler,
		InstrumenHandler: instrumenHandler,
		PeriodeHandler:   periodeHandler,
		PenilaianHandler: penilaianHandler,
		LaporanHandler:   laporanHandler,
	})

	// 13. HTTP Server configuration
	httpServer := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.HTTP.Port),
		Handler:      router,
		ReadTimeout:  cfg.HTTP.ReadTimeout,
		WriteTimeout: cfg.HTTP.WriteTimeout,
		IdleTimeout:  cfg.HTTP.IdleTimeout,
	}

	// 14. Start HTTP Server in background
	go func() {
		appLogger.Info("HTTP server running", "port", cfg.HTTP.Port, "addr", httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			appLogger.Error("HTTP server failed", "error", err)
			os.Exit(1)
		}
	}()

	// 15. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	appLogger.Info("Shutting down Evaluasi 360 backend gracefully...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), cfg.HTTP.ShutdownTimeout)
	defer shutdownCancel()

	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		appLogger.Error("Server forced to shutdown", "error", err)
	}

	appLogger.Info("Evaluasi 360 backend stopped gracefully")
}

