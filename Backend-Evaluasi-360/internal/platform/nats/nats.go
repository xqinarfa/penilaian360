package nats

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"github.com/kalanara/evaluasi360-backend/internal/config"
)

type Client struct {
	Conn      *nats.Conn
	JetStream jetstream.JetStream
	cfg       config.NATSConfig
}

func NewClient(cfg config.NATSConfig) (*Client, error) {
	opts := []nats.Option{
		nats.Name(cfg.ClientID),
		nats.Timeout(5 * time.Second),
		nats.ReconnectWait(2 * time.Second),
		nats.MaxReconnects(5),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			slog.Warn("NATS disconnected", "error", err)
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			slog.Info("NATS reconnected", "url", nc.ConnectedUrl())
		}),
	}

	nc, err := nats.Connect(cfg.URL, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS broker: %w", err)
	}

	js, err := jetstream.New(nc)
	if err != nil {
		nc.Close()
		return nil, fmt.Errorf("failed to initialize JetStream: %w", err)
	}

	// Ensure stream exists
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = js.CreateOrUpdateStream(ctx, jetstream.StreamConfig{
		Name:     cfg.StreamName,
		Subjects: []string{"EVALUASI360.>"},
		Storage:  jetstream.FileStorage,
		MaxAge:   7 * 24 * time.Hour,
	})
	if err != nil {
		slog.Warn("Could not create or update JetStream stream (continuing without stream guarantees)", "error", err)
	}

	slog.Info("NATS JetStream client initialized", "url", cfg.URL, "stream", cfg.StreamName)

	return &Client{
		Conn:      nc,
		JetStream: js,
		cfg:       cfg,
	}, nil
}

func (c *Client) Publish(ctx context.Context, subject string, data []byte) error {
	if c == nil || c.JetStream == nil {
		return nil // gracefully degrade if NATS is not available
	}
	ctxTimeout, cancel := context.WithTimeout(ctx, c.cfg.PublishTimeout)
	defer cancel()

	_, err := c.JetStream.Publish(ctxTimeout, subject, data)
	return err
}

func (c *Client) Close() {
	if c != nil && c.Conn != nil {
		slog.Info("Closing NATS connection")
		c.Conn.Drain()
		c.Conn.Close()
	}
}

