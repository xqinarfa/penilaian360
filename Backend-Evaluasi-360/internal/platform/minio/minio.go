package minio

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/kalanara/evaluasi360-backend/internal/config"
)

type Client struct {
	client *minio.Client
	cfg    config.MinIOConfig
}

func NewClient(cfg config.MinIOConfig) (*Client, error) {
	client, err := minio.New(cfg.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
		Secure: cfg.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize MinIO client: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), cfg.Timeout)
	defer cancel()

	exists, err := client.BucketExists(ctx, cfg.BucketName)
	if err != nil {
		slog.Warn("Failed to check MinIO bucket existence, assuming unreachable for now", "error", err)
	} else if !exists {
		err = client.MakeBucket(ctx, cfg.BucketName, minio.MakeBucketOptions{Region: cfg.Location})
		if err != nil {
			slog.Warn("Failed to create bucket", "bucket", cfg.BucketName, "error", err)
		} else {
			slog.Info("Created MinIO bucket successfully", "bucket", cfg.BucketName)
		}
	}

	slog.Info("MinIO S3 client initialized", "endpoint", cfg.Endpoint, "bucket", cfg.BucketName)

	return &Client{
		client: client,
		cfg:    cfg,
	}, nil
}

func (c *Client) Upload(ctx context.Context, objectName string, reader io.Reader, objectSize int64, contentType string) (string, error) {
	if c == nil || c.client == nil {
		return "", fmt.Errorf("minio client is not configured")
	}
	ctxTimeout, cancel := context.WithTimeout(ctx, c.cfg.Timeout)
	defer cancel()

	_, err := c.client.PutObject(ctxTimeout, c.cfg.BucketName, objectName, reader, objectSize, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload object: %w", err)
	}

	return fmt.Sprintf("/%s/%s", c.cfg.BucketName, objectName), nil
}

func (c *Client) GetPresignedURL(ctx context.Context, objectName string, expires time.Duration) (*url.URL, error) {
	if c == nil || c.client == nil {
		return nil, fmt.Errorf("minio client is not configured")
	}
	return c.client.PresignedGetObject(ctx, c.cfg.BucketName, objectName, expires, nil)
}

