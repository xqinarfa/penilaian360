package usecase

import (
	"context"

	"github.com/kalanara/evaluasi360-backend/internal/modules/periode/domain"
)

type periodeUsecase struct {
	repo domain.PeriodeRepository
}

func NewPeriodeUsecase(repo domain.PeriodeRepository) domain.PeriodeUsecase {
	return &periodeUsecase{repo: repo}
}

func (u *periodeUsecase) GetPeriodeList(ctx context.Context) ([]domain.PeriodeItemResponse, error) {
	return u.repo.ListPeriode(ctx)
}

func (u *periodeUsecase) GetPeriode(ctx context.Context, id string) (*domain.PeriodeItemResponse, error) {
	return u.repo.GetPeriode(ctx, id)
}

func (u *periodeUsecase) CreatePeriode(ctx context.Context, req *domain.CreatePeriodeRequest) (*domain.PeriodeItemResponse, error) {
	return u.repo.CreatePeriode(ctx, req)
}

func (u *periodeUsecase) GetAlumniList(ctx context.Context, periodeID string) ([]domain.AlumniItemResponse, error) {
	return u.repo.ListAlumniByPeriode(ctx, periodeID)
}

func (u *periodeUsecase) GetAlumniDetail(ctx context.Context, alumniID string) (*domain.AlumniItemResponse, []domain.PenilaiDetailItemResponse, error) {
	return u.repo.GetAlumniDetail(ctx, alumniID)
}

func (u *periodeUsecase) GantiPenilai(ctx context.Context, penugasanID string, req *domain.GantiPenilaiRequest) error {
	return u.repo.GantiPenilai(ctx, penugasanID, req.CalonPegawaiID, req.Kanal)
}

func (u *periodeUsecase) BatalkanPenugasan(ctx context.Context, penugasanID string, alasan string) error {
	return u.repo.BatalkanPenugasan(ctx, penugasanID, alasan)
}

func (u *periodeUsecase) KirimPengingat(ctx context.Context, penugasanID string, req *domain.KirimPengingatRequest) error {
	kanal := ""
	if req != nil {
		kanal = req.Kanal
	}
	return u.repo.KirimPengingat(ctx, penugasanID, kanal)
}

func (u *periodeUsecase) GetPenilaianTertunda(ctx context.Context) ([]domain.PenilaianTertundaItemResponse, error) {
	return u.repo.ListPenilaianTertunda(ctx)
}

