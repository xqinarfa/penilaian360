package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type GormInstrumenRepository struct {
	db *gorm.DB
}

func NewGormInstrumenRepository(db *gorm.DB) *GormInstrumenRepository {
	return &GormInstrumenRepository{db: db}
}

func (r *GormInstrumenRepository) ListPelatihan(ctx context.Context) ([]domain.JenisPelatihanResponse, error) {
	var list []domain.JenisPelatihan
	if err := r.db.WithContext(ctx).Order("id ASC").Find(&list).Error; err != nil {
		return nil, err
	}

	results := make([]domain.JenisPelatihanResponse, len(list))
	for i, p := range list {
		var butirCount int64
		var fokusCount int64

		r.db.WithContext(ctx).Model(&domain.FokusEvaluasi{}).Where("pelatihan_id = ? OR pelatihan_id IS NULL", p.ID).Count(&fokusCount)
		r.db.WithContext(ctx).Model(&domain.ButirPertanyaan{}).Joins("JOIN fokus_evaluasis ON fokus_evaluasis.id = butir_pertanyaans.fokus_id").
			Where("fokus_evaluasis.pelatihan_id = ? OR fokus_evaluasis.pelatihan_id IS NULL", p.ID).Count(&butirCount)

		results[i] = domain.JenisPelatihanResponse{
			ID:               p.ID,
			Nama:             p.Nama,
			ButirCount:       int(butirCount),
			FokusCount:       int(fokusCount),
			UseInstrumenInti: p.UseInstrumenInti,
		}
	}

	return results, nil
}

func (r *GormInstrumenRepository) GetPelatihan(ctx context.Context, id string) (*domain.JenisPelatihanResponse, error) {
	var p domain.JenisPelatihan
	if err := r.db.WithContext(ctx).First(&p, "id = ?", id).Error; err != nil {
		return nil, sharederrors.ErrInstrumenNotFound
	}

	var butirCount int64
	var fokusCount int64
	r.db.WithContext(ctx).Model(&domain.FokusEvaluasi{}).Where("pelatihan_id = ? OR pelatihan_id IS NULL", p.ID).Count(&fokusCount)
	r.db.WithContext(ctx).Model(&domain.ButirPertanyaan{}).Joins("JOIN fokus_evaluasis ON fokus_evaluasis.id = butir_pertanyaans.fokus_id").
		Where("fokus_evaluasis.pelatihan_id = ? OR fokus_evaluasis.pelatihan_id IS NULL", p.ID).Count(&butirCount)

	return &domain.JenisPelatihanResponse{
		ID:               p.ID,
		Nama:             p.Nama,
		ButirCount:       int(butirCount),
		FokusCount:       int(fokusCount),
		UseInstrumenInti: p.UseInstrumenInti,
	}, nil
}

func (r *GormInstrumenRepository) CreatePelatihan(ctx context.Context, req *domain.CreatePelatihanRequest) (*domain.JenisPelatihanResponse, error) {
	newID := req.ID
	if newID == "" {
		newID = fmt.Sprintf("pel-%d", time.Now().UnixNano()%10000)
	}

	pelatihan := domain.JenisPelatihan{
		ID:               newID,
		Nama:             req.Nama,
		UseInstrumenInti: req.UseInstrumenInti,
		Deskripsi:        req.Deskripsi,
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&pelatihan).Error; err != nil {
		return nil, err
	}

	return &domain.JenisPelatihanResponse{
		ID:               pelatihan.ID,
		Nama:             pelatihan.Nama,
		UseInstrumenInti: pelatihan.UseInstrumenInti,
		ButirCount:       0,
		FokusCount:       0,
	}, nil
}

func (r *GormInstrumenRepository) ListFokusByPelatihan(ctx context.Context, pelatihanID string) ([]domain.FokusItemResponse, error) {
	var fokusList []domain.FokusEvaluasi
	query := r.db.WithContext(ctx).Model(&domain.FokusEvaluasi{})
	if pelatihanID != "" {
		query = query.Where("pelatihan_id = ?", pelatihanID)
	}
	if err := query.Order("number ASC").Find(&fokusList).Error; err != nil {
		return nil, err
	}

	// Fallback to pel-1 if no distinct fokus found for this pelatihan
	if len(fokusList) == 0 && pelatihanID != "" && pelatihanID != "pel-1" {
		_ = r.db.WithContext(ctx).Model(&domain.FokusEvaluasi{}).Where("pelatihan_id = 'pel-1' OR pelatihan_id IS NULL").Order("number ASC").Find(&fokusList).Error
	}

	results := make([]domain.FokusItemResponse, len(fokusList))
	for i, f := range fokusList {
		var subdimensis []domain.Subdimensi
		_ = r.db.WithContext(ctx).Where("fokus_id = ?", f.ID).Order("code ASC").Find(&subdimensis).Error

		subdimensiResponses := make([]domain.SubdimensiItemResponse, len(subdimensis))
		totalButirInFokus := 0

		for sIdx, sub := range subdimensis {
			var indikators []domain.Indikator
			_ = r.db.WithContext(ctx).Where("subdimensi_id = ?", sub.ID).Order("code ASC").Find(&indikators).Error

			indikatorResponses := make([]domain.IndikatorItemResponse, len(indikators))
			subButirCount := 0

			for indIdx, ind := range indikators {
				var butirs []domain.ButirPertanyaan
				_ = r.db.WithContext(ctx).Where("indikator_id = ? AND is_open_ended = false", ind.ID).Order("code ASC").Find(&butirs).Error

				butirResponses := make([]domain.ButirPertanyaanItemResponse, len(butirs))
				for bIdx, b := range butirs {
					cats := strings.Split(b.Categories, ",")
					for cIdx := range cats {
						cats[cIdx] = strings.TrimSpace(cats[cIdx])
					}
					butirResponses[bIdx] = domain.ButirPertanyaanItemResponse{
						ID:         b.ID,
						Code:       b.Code,
						Text:       b.Text,
						AgendaHint: b.AgendaHint,
						Categories: cats,
					}
				}

				subButirCount += len(butirs)
				indikatorResponses[indIdx] = domain.IndikatorItemResponse{
					ID:         ind.ID,
					Code:       ind.Code,
					Title:      ind.Title,
					ButirCount: len(butirs),
					Items:      butirResponses,
				}
			}

			totalButirInFokus += subButirCount
			subdimensiResponses[sIdx] = domain.SubdimensiItemResponse{
				ID:             sub.ID,
				Code:           sub.Code,
				Title:          sub.Title,
				IndikatorCount: len(indikators),
				ButirCount:     subButirCount,
				Indikators:     indikatorResponses,
			}
		}

		// Check open questions if isIsianTerbuka
		var openQuestions []domain.OpenQuestionItemResponse
		if f.IsIsianTerbuka {
			var openButirs []domain.ButirPertanyaan
			_ = r.db.WithContext(ctx).Where("fokus_id = ? AND is_open_ended = true", f.ID).Find(&openButirs).Error
			for _, ob := range openButirs {
				openQuestions = append(openQuestions, domain.OpenQuestionItemResponse{
					ID:   ob.ID,
					Code: ob.Code,
					Text: ob.Text,
				})
			}
		}

		results[i] = domain.FokusItemResponse{
			ID:              f.ID,
			Number:          f.Number,
			Title:           f.Title,
			SubdimensiCount: len(subdimensis),
			ButirCount:      totalButirInFokus,
			IsIsianTerbuka:  f.IsIsianTerbuka,
			PertanyaanCount: len(openQuestions),
			Subdimensis:     subdimensiResponses,
			OpenQuestions:   openQuestions,
		}
	}

	return results, nil
}

func (r *GormInstrumenRepository) CreateFokus(ctx context.Context, req *domain.CreateFokusRequest) (*domain.FokusItemResponse, error) {
	newID := req.ID
	if newID == "" {
		if req.PelatihanID != "" {
			newID = fmt.Sprintf("fokus-%s-%d", req.PelatihanID, req.Number)
		} else {
			newID = fmt.Sprintf("fokus-%d-%d", req.Number, time.Now().Unix()%1000)
		}
	}

	bobot := req.Bobot
	if bobot <= 0 {
		bobot = 1.0
	}

	fokus := domain.FokusEvaluasi{
		ID:             newID,
		PelatihanID:    req.PelatihanID,
		Number:         req.Number,
		Title:          req.Title,
		IsIsianTerbuka: req.IsIsianTerbuka,
		Bobot:          bobot,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&fokus).Error; err != nil {
		return nil, err
	}

	return &domain.FokusItemResponse{
		ID:              fokus.ID,
		Number:          fokus.Number,
		Title:           fokus.Title,
		SubdimensiCount: 0,
		ButirCount:      0,
		IsIsianTerbuka:  fokus.IsIsianTerbuka,
		Subdimensis:     []domain.SubdimensiItemResponse{},
	}, nil
}

func (r *GormInstrumenRepository) CreateSubdimensi(ctx context.Context, req *domain.CreateSubdimensiRequest) (*domain.SubdimensiItemResponse, error) {
	newID := req.ID
	if newID == "" {
		cleanCode := strings.ReplaceAll(req.Code, ".", "-")
		newID = fmt.Sprintf("sub-%s-%s", req.FokusID, cleanCode)
	}

	sub := domain.Subdimensi{
		ID:        newID,
		FokusID:   req.FokusID,
		Code:      req.Code,
		Title:     req.Title,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&sub).Error; err != nil {
		return nil, err
	}

	return &domain.SubdimensiItemResponse{
		ID:             sub.ID,
		Code:           sub.Code,
		Title:          sub.Title,
		IndikatorCount: 0,
		ButirCount:     0,
		Indikators:     []domain.IndikatorItemResponse{},
	}, nil
}

func (r *GormInstrumenRepository) CreateIndikator(ctx context.Context, req *domain.CreateIndikatorRequest) (*domain.IndikatorItemResponse, error) {
	newID := req.ID
	if newID == "" {
		cleanCode := strings.ReplaceAll(req.Code, ".", "-")
		newID = fmt.Sprintf("ind-%s", cleanCode)
	}

	ind := domain.Indikator{
		ID:           newID,
		SubdimensiID: req.SubdimensiID,
		Code:         req.Code,
		Title:        req.Title,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&ind).Error; err != nil {
		return nil, err
	}

	return &domain.IndikatorItemResponse{
		ID:         ind.ID,
		Code:       ind.Code,
		Title:      ind.Title,
		ButirCount: 0,
		Items:      []domain.ButirPertanyaanItemResponse{},
	}, nil
}

func (r *GormInstrumenRepository) CreateButir(ctx context.Context, butir *domain.ButirPertanyaan) error {
	// Auto resolve indikator_id and fokus_id from code prefix if missing
	if butir.IndikatorID == "" && butir.Code != "" {
		lastDotIdx := strings.LastIndex(butir.Code, ".")
		if lastDotIdx > 0 {
			indCode := butir.Code[:lastDotIdx]
			var ind domain.Indikator
			if err := r.db.WithContext(ctx).First(&ind, "code = ?", indCode).Error; err == nil {
				butir.IndikatorID = ind.ID
				var sub domain.Subdimensi
				if err := r.db.WithContext(ctx).First(&sub, "id = ?", ind.SubdimensiID).Error; err == nil {
					butir.FokusID = sub.FokusID
				}
			}
		}
	}

	if butir.ID == "" {
		cleanCode := strings.ReplaceAll(butir.Code, ".", "-")
		butir.ID = fmt.Sprintf("butir-%s", cleanCode)
	}

	return r.db.WithContext(ctx).Create(butir).Error
}

func (r *GormInstrumenRepository) UpdateButir(ctx context.Context, id string, req *domain.UpdateButirRequest) (*domain.ButirPertanyaanItemResponse, error) {
	var butir domain.ButirPertanyaan
	if err := r.db.WithContext(ctx).First(&butir, "id = ?", id).Error; err != nil {
		return nil, sharederrors.ErrInstrumenNotFound
	}

	catsStr := strings.Join(req.Categories, ",")
	updates := map[string]interface{}{
		"text":          req.Text,
		"agenda_hint":   req.AgendaHint,
		"categories":    catsStr,
		"is_open_ended": req.IsOpenEnded,
		"updated_at":    time.Now(),
	}

	if err := r.db.WithContext(ctx).Model(&butir).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &domain.ButirPertanyaanItemResponse{
		ID:         butir.ID,
		Code:       butir.Code,
		Text:       req.Text,
		AgendaHint: req.AgendaHint,
		Categories: req.Categories,
	}, nil
}

func (r *GormInstrumenRepository) DeleteButir(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.ButirPertanyaan{}, "id = ?", id).Error
}

func (r *GormInstrumenRepository) DuplicateInstrumen(ctx context.Context, req *domain.DuplicateInstrumenRequest) error {
	targetID := req.TargetPelatihanID
	if targetID == "" {
		targetID = req.SourcePelatihanID
	}

	// Fetch all fokus of source
	var sourceFokusList []domain.FokusEvaluasi
	if err := r.db.WithContext(ctx).Where("pelatihan_id = ?", req.SourcePelatihanID).Find(&sourceFokusList).Error; err != nil {
		return err
	}

	if len(sourceFokusList) == 0 {
		_ = r.db.WithContext(ctx).Where("pelatihan_id = 'pel-1'").Find(&sourceFokusList).Error
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, sf := range sourceFokusList {
			newFokusID := fmt.Sprintf("fokus-%s-%d-%s", targetID, sf.Number, uuid.New().String()[:4])
			newFokus := domain.FokusEvaluasi{
				ID:             newFokusID,
				PelatihanID:    targetID,
				Number:         sf.Number,
				Title:          sf.Title,
				IsIsianTerbuka: sf.IsIsianTerbuka,
				Bobot:          sf.Bobot,
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
			}
			if err := tx.Create(&newFokus).Error; err != nil {
				return err
			}

			// Copy Subdimensi
			var subs []domain.Subdimensi
			_ = tx.Where("fokus_id = ?", sf.ID).Find(&subs).Error
			for _, s := range subs {
				newSubID := fmt.Sprintf("sub-%s-%s", newFokusID, strings.ReplaceAll(s.Code, ".", "-"))
				newSub := domain.Subdimensi{
					ID:        newSubID,
					FokusID:   newFokusID,
					Code:      s.Code,
					Title:     s.Title,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				if err := tx.Create(&newSub).Error; err != nil {
					return err
				}

				// Copy Indikator
				var inds []domain.Indikator
				_ = tx.Where("subdimensi_id = ?", s.ID).Find(&inds).Error
				for _, ind := range inds {
					newIndID := fmt.Sprintf("ind-%s-%s", newSubID, strings.ReplaceAll(ind.Code, ".", "-"))
					newInd := domain.Indikator{
						ID:           newIndID,
						SubdimensiID: newSubID,
						Code:         ind.Code,
						Title:        ind.Title,
						CreatedAt:    time.Now(),
						UpdatedAt:    time.Now(),
					}
					if err := tx.Create(&newInd).Error; err != nil {
						return err
					}

					// Copy Butir
					var butirs []domain.ButirPertanyaan
					_ = tx.Where("indikator_id = ?", ind.ID).Find(&butirs).Error
					for _, b := range butirs {
						newButirID := fmt.Sprintf("butir-%s-%s", newIndID, strings.ReplaceAll(b.Code, ".", "-"))
						newButir := domain.ButirPertanyaan{
							ID:          newButirID,
							IndikatorID: newIndID,
							FokusID:     newFokusID,
							Code:        b.Code,
							Text:        b.Text,
							AgendaHint:  b.AgendaHint,
							Categories:  b.Categories,
							IsOpenEnded: b.IsOpenEnded,
							CreatedAt:   time.Now(),
							UpdatedAt:   time.Now(),
						}
						if err := tx.Create(&newButir).Error; err != nil {
							return err
						}
					}
				}
			}
		}
		return nil
	})
}

