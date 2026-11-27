# Evaluasi 360 Backend API

Production-ready backend service built with **Golang** using **Modular Clean Architecture (Package-by-Feature)** for Evaluasi Pasca Pelatihan 360 Derajat Kementerian Perhubungan RI. Setiap modul bisnis dikelompokkan secara terpisah dan independen (Domain, Usecase, Repository, Delivery), dipadukan dengan platform infrastruktur bersama (PostgreSQL, Redis, MinIO, NATS, Prometheus).

---

## 🏛️ Modular Clean Architecture Layout

Struktur `internal/` dikelompokkan berdasarkan **modul bisnis**, bukan dicampur menjadi satu:

```
Backend-Evaluasi-360/
├── cmd/
│   ├── api/
│   │   └── main.go                             # Entry point, dependency injection, graceful shutdown
│   └── migrate/
│       └── main.go                             # golang-migrate CLI runner (up/down/version)
├── internal/
│   ├── config/                                 # Validasi konfigurasi env (caarlos0/env)
│   ├── shared/                                 # Domain errors bersama yang digunakan lintas modul
│   │   └── domain/errors.go
│   ├── platform/                               # Platform infrastruktur & middleware bersama
│   │   ├── database/postgres.go                # PostgreSQL GORM connection pool & timeout
│   │   ├── redis/redis.go                      # Redis client pool
│   │   ├── nats/nats.go                        # NATS JetStream client & publisher
│   │   ├── minio/minio.go                      # MinIO S3 client (upload & presigned URL)
│   │   ├── logger/logger.go                    # Structured logging (log/slog)
│   │   ├── metrics/metrics.go                  # Prometheus metrics registry
│   │   ├── security/                           # Password hashing (bcrypt) & JWT generator
│   │   └── middleware/                         # RequestID, Logger, Recovery, CORS, RateLimiter, JWT/RBAC, Timeout
│   ├── modules/                                # 🎯 MODUL-MODUL BISNIS INDEPENDEN
│   │   ├── health/                             # 🩺 Modul Healthcheck & Observabilitas (/healthz, /readyz)
│   │   ├── auth/                               # 🔐 Modul Autentikasi & Otorisasi (/register, /login, /refresh, /logout, /sso)
│   │   ├── user/                               # 👤 Modul Profil Pengguna (/api/v1/users/me)
│   │   ├── pegawai/                            # 👥 Modul Pegawai & Relasi Kerja (Atasan, Rekan, Bawahan)
│   │   ├── instrumen/                          # 📝 Modul Bank Instrumen & Butir Pertanyaan Evaluasi
│   │   ├── periode/                            # 📅 Modul Periode Evaluasi, Alumni & Penugasan Penilai (D/A/R/B)
│   │   ├── penilaian/                          # ✍️ Modul Form Pengisian Kuesioner & Submit Evaluasi
│   │   └── laporan/                            # 📊 Modul Rekapitulasi Laporan, Radar Chart & Indeks Unit Kerja
│   └── app/                                    # Assembler aplikasi
│       └── http/router.go                      # Gin engine yang me-mount seluruh modul
├── pkg/
│   ├── response/response.go                    # Standardized JSON response envelope
│   └── validator/validator.go                  # Input validator (go-playground/validator/v10)
├── migrations/                                 # SQL Migrations (golang-migrate)
│   ├── 000001_create_users_and_pegawai.up.sql / .down.sql
│   ├── 000002_create_instrumen_tables.up.sql / .down.sql
│   ├── 000003_create_periode_and_penugasan.up.sql / .down.sql
│   ├── 000004_create_penilaian_tables.up.sql / .down.sql
│   └── 000005_seed_initial_data.up.sql / .down.sql
├── deploy/
│   └── prometheus.yml                          # Prometheus config
├── .air.toml                                   # Air live reload config
├── .env & .env.example                         # Environment config
├── compose.yaml                                # Docker Compose infrastructure
├── Dockerfile                                  # Multi-stage production container
└── Makefile
```

---

## ⚡ Tech Stack & Libraries

- **Language:** Go (1.24+)
- **Routing:** Gin (`github.com/gin-gonic/gin`)
- **Database & ORM:** PostgreSQL 16 + GORM (`gorm.io/gorm`, `gorm.io/driver/postgres`)
- **Database Migrations:** `github.com/golang-migrate/migrate/v4`
- **Cache & Token Blacklist:** Redis 7 (`github.com/redis/go-redis/v9`)
- **Object Storage:** MinIO S3 (`github.com/minio/minio-go/v7`)
- **Event Streaming:** NATS JetStream (`github.com/nats-io/nats.go`)
- **Authentication:** JWT HS256 (`github.com/golang-jwt/jwt/v5`) dengan Refresh Token rotation & SSO support
- **Password Hashing:** `golang.org/x/crypto/bcrypt` (Cost: 12)
- **Input Validation:** `github.com/go-playground/validator/v10`
- **Structured Logging:** `log/slog` (JSON & Text format)
- **Observability:** Prometheus (`/metrics`) + Go Profiler (`/debug/pprof`)
- **Rate Limiting:** Token Bucket per IP (`golang.org/x/time/rate`)

---

## 🚀 Quick Start

### 1. Jalankan Infrastruktur Pendukung (Docker)
```bash
docker compose up -d postgres redis nats minio prometheus
```

Layanan yang aktif:
- **PostgreSQL:** `localhost:5432` (`evaluasi360_user` / `evaluasi360_password` / `evaluasi360_db`)
- **Redis:** `localhost:6379`
- **NATS:** `localhost:4222` (Dashboard monitoring: `http://localhost:8222`)
- **MinIO:** API `localhost:9000` | Console `http://localhost:9001` (`minioadmin` / `minioadmin`)
- **Prometheus:** `http://localhost:9090`

### 2. Jalankan Migrasi Database
```bash
# Migrasi UP (termasuk seed data Dimas Prakoso, instrumen, periode, penilai)
go run ./cmd/migrate -cmd=up

# Cek versi migrasi saat ini
go run ./cmd/migrate -cmd=version
```

### 3. Jalankan Aplikasi
```bash
# Menjalankan langsung via Go
go run ./cmd/api

# Atau menggunakan Live Reload (Air)
air
```

Server API akan aktif di `http://localhost:8080`.

---

## 📋 API Endpoints Reference

### 🔐 Autentikasi (`/api/v1/auth`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Mendaftarkan akun baru |
| `POST` | `/api/v1/auth/login` | Login menggunakan NIP atau Email & Password |
| `POST` | `/api/v1/auth/refresh` | Perbarui Access Token menggunakan Refresh Token |
| `POST` | `/api/v1/auth/logout` | Revoke token dan masukkan ke Redis Blacklist |
| `POST/GET`| `/api/v1/auth/sso` | Autentikasi Single Sign-On (SSO Kemenhub / EduHub) |

### 👥 Pegawai & Relasi Kerja (`/api/v1/pegawai`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/pegawai` | Daftar pegawai (filter: `search`, `unitKerja`, `statusRelasi`) |
| `GET` | `/api/v1/pegawai/:id` | Detail pegawai dan relasi (Atasan, Rekan, Bawahan) |
| `PUT` | `/api/v1/pegawai/:id/relasi` | Update relasi atasan, rekan, dan bawahan (Admin) |

### 📝 Bank Instrumen (`/api/v1/instrumen`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/instrumen/pelatihan` | Daftar jenis pelatihan (Latsar, ECM, PKA, dll.) |
| `GET` | `/api/v1/instrumen/fokus` | Daftar fokus evaluasi, subdimensi, indikator & butir |
| `POST`| `/api/v1/instrumen/butir` | Menambah butir pertanyaan instrumen (Admin) |

### 📅 Periode Evaluasi & Penugasan (`/api/v1/periode`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/periode` | Daftar periode evaluasi aktif & terjadwal |
| `GET` | `/api/v1/periode/:id` | Detail periode evaluasi |
| `GET` | `/api/v1/periode/:id/alumni` | Daftar alumni dalam suatu periode |
| `GET` | `/api/v1/alumni/:id` | Detail alumni & daftar kelengkapan penilai (D/A/R/B) |
| `GET` | `/api/v1/penilaian-tertunda` | Antrean penugasan penilaian tertunda / overdue |
| `POST`| `/api/v1/penugasan/:id/ganti-penilai` | Ganti penilai yang ditugaskan |
| `DELETE`| `/api/v1/penugasan/:id` | Batalkan penugasan penilai |
| `POST`| `/api/v1/penugasan/:id/pengingat` | Kirim pengingat (Email/WhatsApp) ke penilai |

### ✍️ Pengisian Penilaian (`/api/v1/penilaian`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/penilaian/form/:penugasanId`| Ambil kuesioner berdasarkan penugasan & kategori penilai |
| `POST`| `/api/v1/penilaian/submit` | Submit skor Likert (1-5) dan respon isian terbuka |

### 📊 Laporan & Analitik (`/api/v1/laporan`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/laporan/dashboard` | Metrik dashboard ringkasan eksekutif |
| `GET` | `/api/v1/laporan/rekap` | Rekapitulasi indeks, peta unit kerja, dan fokus |
| `GET` | `/api/v1/laporan/alumni/:id` | Laporan evaluasi 360 individual (Radar profile) |

