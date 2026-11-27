package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	platformredis "github.com/kalanara/evaluasi360-backend/internal/platform/redis"
)

type RedisTokenBlacklistRepository struct {
	client *platformredis.Client
}

func NewRedisTokenBlacklistRepository(client *platformredis.Client) *RedisTokenBlacklistRepository {
	return &RedisTokenBlacklistRepository{client: client}
}

func (r *RedisTokenBlacklistRepository) BlacklistToken(ctx context.Context, jti string, ttl time.Duration) error {
	if r.client == nil {
		return nil
	}
	key := fmt.Sprintf("blacklist:token:%s", jti)
	return r.client.Set(ctx, key, "revoked", ttl).Err()
}

func (r *RedisTokenBlacklistRepository) IsTokenBlacklisted(ctx context.Context, jti string) (bool, error) {
	if r.client == nil {
		return false, nil
	}
	key := fmt.Sprintf("blacklist:token:%s", jti)
	err := r.client.Get(ctx, key).Err()
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}
