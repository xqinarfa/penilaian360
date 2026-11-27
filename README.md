# Evaluasi 360 Kalanara Group

Sistem Evaluasi & Penilaian Kinerja 360 Derajat untuk Pusat Pengembangan Sumber Daya Manusia Aparatur Perhubungan (PPSDMAP) - Badan Pengembangan Sumber Daya Manusia Perhubungan (BPSDMP), Kementerian Perhubungan RI.

## Arsitektur Monorepo

- `Backend-Evaluasi-360`: Backend REST API berbasis Golang (Clean Architecture, GORM, PostgreSQL, Redis, JWT).
- `Frontend-Evaluasi-360`: Frontend Web Application berbasis Next.js 16 (App Router, Tailwind CSS, Lucide Icons, Standalone Output).

## Deployment

Proyek ini dikonfigurasi dengan Docker Compose untuk orkestrasi container:
- **Database**: PostgreSQL 16 (`evaluasi360-db`) port 5436 -> 5432
- **Cache**: Redis 7 Alpine (`evaluasi360-redis`)
- **Backend API**: Go API Server (`evaluasi360-backend`) port 9097 -> 8080
- **Frontend Web**: Next.js Server (`penilaian360-web`) port 8097 -> 3000

```bash
docker compose up -d --build
```
