package repository

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	instrumendomain "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
	"github.com/kalanara/evaluasi360-backend/internal/modules/penilaian/domain"
	periodedomain "github.com/kalanara/evaluasi360-backend/internal/modules/periode/domain"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type GormPenilaianRepository struct {
	db *gorm.DB
}

func NewGormPenilaianRepository(db *gorm.DB) *GormPenilaianRepository {
	return &GormPenilaianRepository{db: db}
}

func (r *GormPenilaianRepository) GetFormByPenugasanID(ctx context.Context, penugasanID string) (*domain.FormPenilaianResponse, error) {
	var pen periodedomain.PenugasanPenilai
	if err := r.db.WithContext(ctx).First(&pen, "id = ?", penugasanID).Error; err != nil {
		return nil, sharederrors.ErrPenugasanNotFound
	}

	var alm periodedomain.AlumniEvaluasi
	_ = r.db.WithContext(ctx).First(&alm, "id = ?", pen.AlumniID).Error

	var almUser userdomain.User
	_ = r.db.WithContext(ctx).First(&almUser, "id = ?", alm.PegawaiID).Error

	var pel instrumendomain.JenisPelatihan
	_ = r.db.WithContext(ctx).First(&pel, "id = ?", alm.PelatihanID).Error

	// Retrieve Fokus and Butir that include this penugasan category (e.g. "D", "A", "R", "B")
	var butirs []instrumendomain.ButirPertanyaan
	_ = r.db.WithContext(ctx).Where("is_open_ended = false").Find(&butirs).Error

	pertanyaanList := []domain.PertanyaanFormItem{}
	for _, b := range butirs {
		cats := strings.Split(b.Categories, ",")
		match := false
		for _, c := range cats {
			if strings.EqualFold(strings.TrimSpace(c), pen.Kategori) {
				match = true
				break
			}
		}
		if match {
			var f instrumendomain.FokusEvaluasi
			_ = r.db.WithContext(ctx).First(&f, "id = ?", b.FokusID).Error

			pertanyaanList = append(pertanyaanList, domain.PertanyaanFormItem{
				ButirID:    b.ID,
				FokusTitle: f.Title,
				Code:       b.Code,
				Text:       b.Text,
				AgendaHint: b.AgendaHint,
			})
		}
	}

	// Open ended questions
	var openButirs []instrumendomain.ButirPertanyaan
	_ = r.db.WithContext(ctx).Where("is_open_ended = true").Find(&openButirs).Error

	pertanyaanTerbuka := []domain.PertanyaanTerbukaItem{}
	for _, ob := range openButirs {
		pertanyaanTerbuka = append(pertanyaanTerbuka, domain.PertanyaanTerbukaItem{
			FokusID: ob.FokusID,
			Code:    ob.Code,
			Text:    ob.Text,
		})
	}

	return &domain.FormPenilaianResponse{
		PenugasanID:       pen.ID,
		Kategori:          pen.Kategori,
		KategoriLabel:     pen.KategoriLabel,
		AlumniNama:        almUser.FullName,
		AlumniNIP:         almUser.NIP,
		PelatihanNama:     pel.Nama,
		Deadline:          pen.Deadline.Format("2 Jan 2006"),
		PertanyaanList:    pertanyaanList,
		PertanyaanTerbuka: pertanyaanTerbuka,
	}, nil
}

func (r *GormPenilaianRepository) SubmitPenilaian(ctx context.Context, req *domain.SubmitPenilaianRequest) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var pen periodedomain.PenugasanPenilai
		if err := tx.First(&pen, "id = ?", req.PenugasanID).Error; err != nil {
			return sharederrors.ErrPenugasanNotFound
		}

		if pen.Status == "Selesai" {
			return sharederrors.ErrPenugasanAlreadyDone
		}

		now := time.Now().UTC()

		// Save answers
		for _, jwb := range req.Jawaban {
			jwbEntity := domain.PenilaianJawaban{
				ID:          uuid.New(),
				PenugasanID: pen.ID,
				ButirID:     jwb.ButirID,
				Skor:        jwb.Skor,
				Catatan:     jwb.Catatan,
				CreatedAt:   now,
				UpdatedAt:   now,
			}
			if err := tx.Create(&jwbEntity).Error; err != nil {
				return err
			}
		}

		// Save open-ended answers
		for _, jt := range req.JawabanTerbuka {
			jtEntity := domain.PenilaianJawabanTerbuka{
				ID:               uuid.New(),
				PenugasanID:      pen.ID,
				FokusID:          jt.FokusID,
				PertanyaanID:     jt.PertanyaanID,
				Jawaban:          jt.Jawaban,
				KategoriHambatan: jt.KategoriHambatan,
				CreatedAt:        now,
				UpdatedAt:        now,
			}
			if err := tx.Create(&jtEntity).Error; err != nil {
				return err
			}
		}

		// Update Penugasan status
		pen.Status = "Selesai"
		pen.AktivitasTerakhir = "Penilaian diserahkan"
		pen.SubmittedAt = &now
		pen.UpdatedAt = now
		if err := tx.Save(&pen).Error; err != nil {
			return err
		}

		// Recalculate progress for the period
		var totalPenugasan int64
		var selesaiPenugasan int64
		tx.Model(&periodedomain.PenugasanPenilai{}).Where("periode_id = ?", pen.PeriodeID).Count(&totalPenugasan)
		tx.Model(&periodedomain.PenugasanPenilai{}).Where("periode_id = ? AND status = ?", pen.PeriodeID, "Selesai").Count(&selesaiPenugasan)

		if totalPenugasan > 0 {
			progress := (float64(selesaiPenugasan) / float64(totalPenugasan)) * 100.0
			tx.Model(&periodedomain.PeriodeEvaluasi{}).Where("id = ?", pen.PeriodeID).Update("progress_percent", progress)
		}

		return nil
	})
}

