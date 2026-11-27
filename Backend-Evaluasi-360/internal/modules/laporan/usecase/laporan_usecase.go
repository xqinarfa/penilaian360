package usecase

import (
	"context"

	"github.com/kalanara/evaluasi360-backend/internal/modules/laporan/domain"
)

type laporanUsecase struct {
	repo domain.LaporanRepository
}

func NewLaporanUsecase(repo domain.LaporanRepository) domain.LaporanUsecase {
	return &laporanUsecase{repo: repo}
}

func (u *laporanUsecase) GetDashboard(ctx context.Context, year string) (*domain.DashboardMetrics, error) {
	return u.repo.GetDashboardMetrics(ctx, year)
}

func (u *laporanUsecase) GetRekap(ctx context.Context, periodeID string) (map[string]interface{}, error) {
	stats, err := u.repo.GetRekapStats(ctx, periodeID)
	if err != nil {
		return nil, err
	}

	fokusList, err := u.repo.GetFokusList(ctx)
	if err != nil {
		return nil, err
	}

	hambatanList, err := u.repo.GetHambatanList(ctx)
	if err != nil {
		return nil, err
	}

	unitKerjaList, err := u.repo.GetUnitKerjaHeatmap(ctx)
	if err != nil {
		return nil, err
	}

	hasilIndividu, err := u.repo.GetHasilIndividuList(ctx, "", periodeID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"stats":             stats,
		"fokusList":         fokusList,
		"hambatanList":      hambatanList,
		"unitKerjaList":     unitKerjaList,
		"hasilIndividuList": hasilIndividu,
	}, nil
}

func (u *laporanUsecase) GetDetailIndividu(ctx context.Context, alumniID string) (*domain.AlumniDetailData, error) {
	return u.repo.GetDetailIndividu(ctx, alumniID)
}

