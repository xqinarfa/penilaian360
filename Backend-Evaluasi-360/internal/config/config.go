package config

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

// Config holds all validated configuration for the application.
type Config struct {
	App       AppConfig
	HTTP      HTTPConfig
	Database  DatabaseConfig
	Redis     RedisConfig
	NATS      NATSConfig
	MinIO     MinIOConfig
	JWT       JWTConfig
	RateLimit RateLimitConfig
	SSO       SSOConfig
}

type AppConfig struct {
	Name        string `env:"APP_NAME" envDefault:"evaluasi-360-backend"`
	Environment string `env:"APP_ENV" envDefault:"development"` // development, staging, production
	LogLevel    string `env:"LOG_LEVEL" envDefault:"info"`      // debug, info, warn, error
	LogFormat   string `env:"LOG_FORMAT" envDefault:"json"`     // json, text
}

type HTTPConfig struct {
	Port            int           `env:"HTTP_PORT" envDefault:"8080"`
	ReadTimeout     time.Duration `env:"HTTP_READ_TIMEOUT" envDefault:"15s"`
	WriteTimeout    time.Duration `env:"HTTP_WRITE_TIMEOUT" envDefault:"15s"`
	IdleTimeout     time.Duration `env:"HTTP_IDLE_TIMEOUT" envDefault:"60s"`
	ContextTimeout  time.Duration `env:"HTTP_CONTEXT_TIMEOUT" envDefault:"10s"`
	ShutdownTimeout time.Duration `env:"HTTP_SHUTDOWN_TIMEOUT" envDefault:"10s"`
	CORSOrigins     []string      `env:"CORS_ALLOWED_ORIGINS" envSeparator:"," envDefault:"http://localhost:3000,http://localhost:3001,http://localhost:5173"`
}

type DatabaseConfig struct {
	Host               string        `env:"DB_HOST,required"`
	Port               int           `env:"DB_PORT" envDefault:"5432"`
	User               string        `env:"DB_USER,required"`
	Password           string        `env:"DB_PASSWORD,required"`
	Name               string        `env:"DB_NAME,required"`
	SSLMode            string        `env:"DB_SSL_MODE" envDefault:"disable"`
	MaxOpenConns       int           `env:"DB_MAX_OPEN_CONNS" envDefault:"25"`
	MaxIdleConns       int           `env:"DB_MAX_IDLE_CONNS" envDefault:"10"`
	ConnMaxLifetime    time.Duration `env:"DB_CONN_MAX_LIFETIME" envDefault:"30m"`
	ConnMaxIdleTime    time.Duration `env:"DB_CONN_MAX_IDLE_TIME" envDefault:"5m"`
	QueryTimeout       time.Duration `env:"DB_QUERY_TIMEOUT" envDefault:"5s"`
	AutoMigrateEnabled bool          `env:"DB_AUTO_MIGRATE" envDefault:"false"`
}

func (d DatabaseConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		d.Host, d.Port, d.User, d.Password, d.Name, d.SSLMode,
	)
}

type RedisConfig struct {
	Host         string        `env:"REDIS_HOST,required"`
	Port         int           `env:"REDIS_PORT" envDefault:"6379"`
	Password     string        `env:"REDIS_PASSWORD" envDefault:""`
	DB           int           `env:"REDIS_DB" envDefault:"0"`
	PoolSize     int           `env:"REDIS_POOL_SIZE" envDefault:"50"`
	MinIdleConns int           `env:"REDIS_MIN_IDLE_CONNS" envDefault:"10"`
	DialTimeout  time.Duration `env:"REDIS_DIAL_TIMEOUT" envDefault:"5s"`
	ReadTimeout  time.Duration `env:"REDIS_READ_TIMEOUT" envDefault:"3s"`
	WriteTimeout time.Duration `env:"REDIS_WRITE_TIMEOUT" envDefault:"3s"`
}

func (r RedisConfig) Address() string {
	return fmt.Sprintf("%s:%d", r.Host, r.Port)
}

type NATSConfig struct {
	URL            string        `env:"NATS_URL" envDefault:"nats://localhost:4222"`
	ClusterID      string        `env:"NATS_CLUSTER_ID" envDefault:"evaluasi360-cluster"`
	ClientID       string        `env:"NATS_CLIENT_ID" envDefault:"evaluasi360-backend"`
	StreamName     string        `env:"NATS_STREAM_NAME" envDefault:"EVALUASI360_EVENTS"`
	PublishTimeout time.Duration `env:"NATS_PUBLISH_TIMEOUT" envDefault:"3s"`
}

type MinIOConfig struct {
	Endpoint        string        `env:"MINIO_ENDPOINT" envDefault:"localhost:9000"`
	AccessKeyID     string        `env:"MINIO_ACCESS_KEY,required"`
	SecretAccessKey string        `env:"MINIO_SECRET_KEY,required"`
	UseSSL          bool          `env:"MINIO_USE_SSL" envDefault:"false"`
	BucketName      string        `env:"MINIO_BUCKET_NAME" envDefault:"evaluasi360-reports"`
	Location        string        `env:"MINIO_LOCATION" envDefault:"us-east-1"`
	Timeout         time.Duration `env:"MINIO_TIMEOUT" envDefault:"10s"`
}

type JWTConfig struct {
	SecretKey            string        `env:"JWT_SECRET_KEY,required"`
	AccessTokenDuration  time.Duration `env:"JWT_ACCESS_DURATION" envDefault:"15m"`
	RefreshTokenDuration time.Duration `env:"JWT_REFRESH_DURATION" envDefault:"168h"`
	Issuer               string        `env:"JWT_ISSUER" envDefault:"evaluasi360-auth-service"`
}

type RateLimitConfig struct {
	Enabled  bool          `env:"RATE_LIMIT_ENABLED" envDefault:"true"`
	Requests int           `env:"RATE_LIMIT_REQUESTS" envDefault:"100"`
	Window   time.Duration `env:"RATE_LIMIT_WINDOW" envDefault:"1m"`
	Burst    int           `env:"RATE_LIMIT_BURST" envDefault:"20"`
}

type SSOConfig struct {
	EnableSSO         bool   `env:"ENABLE_SSO" envDefault:"true"`
	KemenhubAppID     string `env:"SSO_KEMENHUB_APP_ID" envDefault:"9ec212b9-a143-4371-9270-6726b02f015c"`
	KemenhubAppSecret string `env:"SSO_KEMENHUB_APP_SECRET" envDefault:""`
	KemenhubRedirect  string `env:"SSO_KEMENHUB_REDIRECT_URI" envDefault:"https://bpsdm.kemenhub.go.id/api/portal/sso/callback"`
	KemenhubTokenURL  string `env:"SSO_KEMENHUB_TOKEN_URL" envDefault:"https://hubnet.kemenhub.go.id/sso/oauth/token"`
	KemenhubUserURL   string `env:"SSO_KEMENHUB_USER_URL" envDefault:"https://hubnet.kemenhub.go.id/sso/api/user"`
	KemenhubAuthURL   string `env:"SSO_KEMENHUB_AUTH_URL" envDefault:"https://hubnet.kemenhub.go.id/sso/oauth/authorize"`
	SSOIdentifier     string `env:"SSO_IDENTIFIER" envDefault:"DEVEVAL360"`
	EduhubVerifyURL   string `env:"SSO_EDUHUB_VERIFY_URL" envDefault:"https://bpsdm.kemenhub.go.id/api/portal/auth/sso"`
	FrontendURL       string `env:"FRONTEND_URL" envDefault:"http://localhost:3000"`
}

func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		slog.Debug(".env file not found or failed to load, proceeding with system environment")
	}

	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		return nil, fmt.Errorf("configuration validation error: %w", err)
	}

	if len(cfg.JWT.SecretKey) < 32 {
		return nil, fmt.Errorf("JWT_SECRET_KEY must be at least 32 characters long for security compliance")
	}

	return cfg, nil
}
