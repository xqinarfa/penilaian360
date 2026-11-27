package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/domain"
)

type pegawaiUsecase struct {
	repo domain.PegawaiRepository
}

func NewPegawaiUsecase(repo domain.PegawaiRepository) domain.PegawaiUsecase {
	return &pegawaiUsecase{repo: repo}
}

func (u *pegawaiUsecase) ListPegawai(ctx context.Context, search, unitKerja string, statusRelasi string, limit, offset int) ([]domain.PegawaiItemResponse, int64, error) {
	return u.repo.List(ctx, search, unitKerja, statusRelasi, limit, offset)
}

func (u *pegawaiUsecase) GetPegawai(ctx context.Context, id uuid.UUID) (*domain.PegawaiItemResponse, error) {
	return u.repo.FindByID(ctx, id)
}

func (u *pegawaiUsecase) UpdateRelasi(ctx context.Context, pegawaiID uuid.UUID, req *domain.UpdateRelasiRequest) (*domain.PegawaiItemResponse, error) {
	if err := u.repo.UpdateRelasi(ctx, pegawaiID, req); err != nil {
		return nil, err
	}
	return u.repo.FindByID(ctx, pegawaiID)
}

func (u *pegawaiUsecase) CreatePegawai(ctx context.Context, req *domain.CreatePegawaiRequest) (*domain.PegawaiItemResponse, error) {
	return u.repo.Create(ctx, req)
}

func (u *pegawaiUsecase) UpdatePegawai(ctx context.Context, id uuid.UUID, req *domain.UpdatePegawaiRequest) (*domain.PegawaiItemResponse, error) {
	return u.repo.Update(ctx, id, req)
}

func (u *pegawaiUsecase) DeletePegawai(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *pegawaiUsecase) DeleteBatchPegawai(ctx context.Context, ids []uuid.UUID) error {
	return u.repo.DeleteBatch(ctx, ids)
}

func (u *pegawaiUsecase) GetSyncHistory(ctx context.Context) ([]domain.SIKSyncHistoryItem, error) {
	return u.repo.GetSyncHistory(ctx)
}

func (u *pegawaiUsecase) TriggerSyncSIK(ctx context.Context, triggeredBy string) (*domain.SIKSyncHistoryItem, error) {
	return u.repo.TriggerSyncSIK(ctx, triggeredBy)
}

