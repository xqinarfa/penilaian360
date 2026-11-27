package usecase

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/domain"
	platformnats "github.com/kalanara/evaluasi360-backend/internal/platform/nats"
)

type penilaianUsecase struct {
	repo domain.PenilaianRepository
	nats *platformnats.Client
}

func NewPenilaianUsecase(repo domain.PenilaianRepository, nats *platformnats.Client) domain.PenilaianUsecase {
	return &penilaianUsecase{
		repo: repo,
		nats: nats,
	}
}

func (u *penilaianUsecase) GetFormPenilaian(ctx context.Context, penugasanID string) (*domain.FormPenilaianResponse, error) {
	return u.repo.GetFormByPenugasanID(ctx, penugasanID)
}

func (u *penilaianUsecase) SubmitPenilaian(ctx context.Context, req *domain.SubmitPenilaianRequest) error {
	if err := u.repo.SubmitPenilaian(ctx, req); err != nil {
		return err
	}

	// Publish event to NATS JetStream asynchronously
	if u.nats != nil {
		go func() {
			eventPayload, _ := json.Marshal(map[string]interface{}{
				"event":        "EVALUATION_SUBMITTED",
				"penugasan_id": req.PenugasanID,
			})
			_ = u.nats.Publish(context.Background(), fmt.Sprintf("EVALUASI360.SUBMITTED.%s", req.PenugasanID), eventPayload)
		}()
	}

	return nil
}

