# ==========================================
# Stage 1: Build binary
# ==========================================
FROM golang:alpine AS builder

WORKDIR /app
ENV GOTOOLCHAIN=auto

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata make

# Download dependencies first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build statically linked API and Migration binaries
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /bin/api ./cmd/api

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /bin/migrate ./cmd/migrate

# ==========================================
# Stage 2: Minimal runtime image
# ==========================================
FROM alpine:3.20

WORKDIR /app

# Install certificates, timezone data, and curl for healthcheck
RUN apk add --no-cache ca-certificates tzdata curl

# Copy binaries and migration SQL files
COPY --from=builder /bin/api /app/bin/api
COPY --from=builder /bin/migrate /app/bin/migrate
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/.env.example /app/.env.example

EXPOSE 8080

CMD ["/app/bin/api"]
