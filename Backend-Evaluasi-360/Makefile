.PHONY: run build test migrate-up migrate-down migrate-version docker-up docker-down

run:
	go run ./cmd/api

build:
	go build -o ./bin/api ./cmd/api
	go build -o ./bin/migrate ./cmd/migrate

test:
	go test -v ./...

migrate-up:
	go run ./cmd/migrate -cmd=up

migrate-down:
	go run ./cmd/migrate -cmd=down -steps=1

migrate-version:
	go run ./cmd/migrate -cmd=version

docker-up:
	docker compose up -d

docker-down:
	docker compose down

