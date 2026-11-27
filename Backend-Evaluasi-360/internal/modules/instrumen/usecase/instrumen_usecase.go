package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
)

type instrumenUsecase struct {
	repo domain.InstrumenRepository
}

func NewInstrumenUsecase(repo domain.InstrumenRepository) domain.InstrumenUsecase {
	return &instrumenUsecase{repo: repo}
}

func (u *instrumenUsecase) GetPelatihanList(ctx context.Context) ([]domain.JenisPelatihanResponse, error) {
	return u.repo.ListPelatihan(ctx)
}

func (u *instrumenUsecase) CreatePelatihan(ctx context.Context, req *domain.CreatePelatihanRequest) (*domain.JenisPelatihanResponse, error) {
	return u.repo.CreatePelatihan(ctx, req)
}

func (u *instrumenUsecase) GetFokusList(ctx context.Context, pelatihanID string) ([]domain.FokusItemResponse, error) {
	return u.repo.ListFokusByPelatihan(ctx, pelatihanID)
}

func (u *instrumenUsecase) AddFokus(ctx context.Context, req *domain.CreateFokusRequest) (*domain.FokusItemResponse, error) {
	return u.repo.CreateFokus(ctx, req)
}

func (u *instrumenUsecase) AddSubdimensi(ctx context.Context, req *domain.CreateSubdimensiRequest) (*domain.SubdimensiItemResponse, error) {
	return u.repo.CreateSubdimensi(ctx, req)
}

func (u *instrumenUsecase) AddIndikator(ctx context.Context, req *domain.CreateIndikatorRequest) (*domain.IndikatorItemResponse, error) {
	return u.repo.CreateIndikator(ctx, req)
}

func (u *instrumenUsecase) AddButir(ctx context.Context, req *domain.CreateButirRequest) (*domain.ButirPertanyaanItemResponse, error) {
	butirID := req.ID
	if butirID == "" {
		cleanCode := strings.ReplaceAll(req.Code, ".", "-")
		butirID = fmt.Sprintf("butir-%s-%s", cleanCode, uuid.New().String()[:4])
	}

	butir := &domain.ButirPertanyaan{
		ID:          butirID,
		IndikatorID: req.IndikatorID,
		FokusID:     req.FokusID,
		Code:        req.Code,
		Text:        req.Text,
		AgendaHint:  req.AgendaHint,
		Categories:  strings.Join(req.Categories, ","),
		IsOpenEnded: req.IsOpenEnded,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}

	if err := u.repo.CreateButir(ctx, butir); err != nil {
		return nil, err
	}

	return &domain.ButirPertanyaanItemResponse{
		ID:         butir.ID,
		Code:       butir.Code,
		Text:       butir.Text,
		AgendaHint: butir.AgendaHint,
		Categories: req.Categories,
	}, nil
}

func (u *instrumenUsecase) UpdateButir(ctx context.Context, id string, req *domain.UpdateButirRequest) (*domain.ButirPertanyaanItemResponse, error) {
	return u.repo.UpdateButir(ctx, id, req)
}

func (u *instrumenUsecase) DeleteButir(ctx context.Context, id string) error {
	return u.repo.DeleteButir(ctx, id)
}

func (u *instrumenUsecase) DuplicateInstrumen(ctx context.Context, req *domain.DuplicateInstrumenRequest) error {
	return u.repo.DuplicateInstrumen(ctx, req)
}

