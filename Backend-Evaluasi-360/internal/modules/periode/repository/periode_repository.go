package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	instrumendomain "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
	"github.com/kalanara/evaluasi360-backend/internal/modules/periode/domain"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type GormPeriodeRepository struct {
	db *gorm.DB
}

func NewGormPeriodeRepository(db *gorm.DB) *GormPeriodeRepository {
	return &GormPeriodeRepository{db: db}
}

func (r *GormPeriodeRepository) ListPeriode(ctx context.Context) ([]domain.PeriodeItemResponse, error) {
	var list []domain.PeriodeEvaluasi
	if err := r.db.WithContext(ctx).Order("start_date DESC").Find(&list).Error; err != nil {
		return nil, err
	}

	results := make([]domain.PeriodeItemResponse, len(list))
	for i, p := range list {
		var alumniCount int64
		r.db.WithContext(ctx).Model(&domain.AlumniEvaluasi{}).Where("periode_id = ?", p.ID).Count(&alumniCount)

		var pelatihan instrumendomain.JenisPelatihan
		_ = r.db.WithContext(ctx).First(&pelatihan, "id = ?", p.PelatihanID).Error

		masaPengisian := fmt.Sprintf("%s – %s", p.StartDate.Format("2 Jan 2006"), p.EndDate.Format("2 Jan 2006"))

		results[i] = domain.PeriodeItemResponse{
			ID:              p.ID,
			Nama:            p.Nama,
			CreatedAt:       p.CreatedAt.Format("2 Jan 2006"),
			Instrumen:       pelatihan.Nama,
			AlumniCount:     int(alumniCount),
			MasaPengisian:   masaPengisian,
			ProgressPercent: p.ProgressPercent,
			Status:          p.Status,
		}
	}

	return results, nil
}

func (r *GormPeriodeRepository) GetPeriode(ctx context.Context, id string) (*domain.PeriodeItemResponse, error) {
	var p domain.PeriodeEvaluasi
	if err := r.db.WithContext(ctx).First(&p, "id = ?", id).Error; err != nil {
		return nil, sharederrors.ErrPeriodeNotFound
	}

	var alumniCount int64
	r.db.WithContext(ctx).Model(&domain.AlumniEvaluasi{}).Where("periode_id = ?", p.ID).Count(&alumniCount)

	var pelatihan instrumendomain.JenisPelatihan
	_ = r.db.WithContext(ctx).First(&pelatihan, "id = ?", p.PelatihanID).Error

	masaPengisian := fmt.Sprintf("%s – %s", p.StartDate.Format("2 Jan 2006"), p.EndDate.Format("2 Jan 2006"))

	return &domain.PeriodeItemResponse{
		ID:              p.ID,
		Nama:            p.Nama,
		CreatedAt:       p.CreatedAt.Format("2 Jan 2006"),
		Instrumen:       pelatihan.Nama,
		AlumniCount:     int(alumniCount),
		MasaPengisian:   masaPengisian,
		ProgressPercent: p.ProgressPercent,
		Status:          p.Status,
	}, nil
}

func (r *GormPeriodeRepository) CreatePeriode(ctx context.Context, req *domain.CreatePeriodeRequest) (*domain.PeriodeItemResponse, error) {
	newID := req.ID
	if newID == "" {
		newID = fmt.Sprintf("periode-%d", time.Now().UnixNano()%10000)
	}

	start, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		start = time.Now()
	}
	end, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		end = start.AddDate(0, 1, 0)
	}

	status := domain.PeriodeStatus(req.Status)
	if status == "" {
		status = domain.PeriodeTerjadwal
		now := time.Now()
		if now.After(start) && now.Before(end) {
			status = domain.PeriodeBerjalan
		}
	}

	p := domain.PeriodeEvaluasi{
		ID:              newID,
		Nama:            req.Nama,
		PelatihanID:     req.PelatihanID,
		StartDate:       start,
		EndDate:         end,
		Status:          status,
		ProgressPercent: 0.0,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&p).Error; err != nil {
		return nil, err
	}

	return r.GetPeriode(ctx, newID)
}

func (r *GormPeriodeRepository) ListAlumniByPeriode(ctx context.Context, periodeID string) ([]domain.AlumniItemResponse, error) {
	var alumniList []domain.AlumniEvaluasi
	query := r.db.WithContext(ctx).Model(&domain.AlumniEvaluasi{})
	if periodeID != "" {
		query = query.Where("periode_id = ?", periodeID)
	}

	if err := query.Find(&alumniList).Error; err != nil {
		return nil, err
	}

	results := make([]domain.AlumniItemResponse, len(alumniList))
	for i, a := range alumniList {
		var user userdomain.User
		_ = r.db.WithContext(ctx).First(&user, "id = ?", a.PegawaiID).Error

		var pelatihan instrumendomain.JenisPelatihan
		_ = r.db.WithContext(ctx).First(&pelatihan, "id = ?", a.PelatihanID).Error

		var evaluators []domain.PenugasanPenilai
		_ = r.db.WithContext(ctx).Where("alumni_id = ?", a.ID).Find(&evaluators).Error

		evaluatorDetails := make([]domain.EvaluatorDetailResponse, len(evaluators))
		for eIdx, ev := range evaluators {
			var evalUser userdomain.User
			_ = r.db.WithContext(ctx).First(&evalUser, "id = ?", ev.PenilaiPegawaiID).Error
			evaluatorDetails[eIdx] = domain.EvaluatorDetailResponse{
				Role:    ev.KategoriLabel,
				Nama:    evalUser.FullName,
				NIP:     evalUser.NIP,
				Jabatan: evalUser.Jabatan,
				Status:  "Terverifikasi",
			}
		}

		penilaiLabel := a.StatusPenilai
		if penilaiLabel == "" {
			if a.IsPenilaiLengkap {
				penilaiLabel = fmt.Sprintf("%d ditetapkan", len(evaluators))
			} else {
				penilaiLabel = "Belum lengkap"
			}
		}

		results[i] = domain.AlumniItemResponse{
			ID:                  a.ID,
			Nama:                user.FullName,
			NIP:                 user.NIP,
			Pelatihan:           pelatihan.Nama,
			SelesaiLms:          a.SelesaiLmsDate,
			SharingKms:          a.SharingKmsStatus,
			JatuhTempo:          a.JatuhTempoDate,
			Penilai:             penilaiLabel,
			IsPenilaiLengkap:    a.IsPenilaiLengkap,
			UnitKerja:           user.UnitKerja,
			Evaluators:          evaluatorDetails,
			BulanPascaPelatihan: a.BulanPascaPelatihan,
			StatusPenilai:       penilaiLabel,
		}
	}

	return results, nil
}

func (r *GormPeriodeRepository) GetAlumniDetail(ctx context.Context, alumniID string) (*domain.AlumniItemResponse, []domain.PenilaiDetailItemResponse, error) {
	var a domain.AlumniEvaluasi
	if err := r.db.WithContext(ctx).First(&a, "id = ?", alumniID).Error; err != nil {
		return nil, nil, sharederrors.ErrAlumniNotFound
	}

	var user userdomain.User
	_ = r.db.WithContext(ctx).First(&user, "id = ?", a.PegawaiID).Error

	var pelatihan instrumendomain.JenisPelatihan
	_ = r.db.WithContext(ctx).First(&pelatihan, "id = ?", a.PelatihanID).Error

	var penugasanList []domain.PenugasanPenilai
	_ = r.db.WithContext(ctx).Where("alumni_id = ?", a.ID).Find(&penugasanList).Error

	penilaiResponses := make([]domain.PenilaiDetailItemResponse, len(penugasanList))
	for i, pen := range penugasanList {
		var penUser userdomain.User
		_ = r.db.WithContext(ctx).First(&penUser, "id = ?", pen.PenilaiPegawaiID).Error

		initials := "ID"
		parts := strings.Split(penUser.FullName, " ")
		if len(parts) >= 2 {
			initials = string([]rune(parts[0])[:1]) + string([]rune(parts[1])[:1])
		} else if len(parts) == 1 && len(parts[0]) > 0 {
			initials = string([]rune(parts[0])[:1])
		}

		penilaiResponses[i] = domain.PenilaiDetailItemResponse{
			ID:                pen.ID,
			Nama:              penUser.FullName,
			NIP:               penUser.NIP,
			Jabatan:           penUser.Jabatan,
			Kategori:          pen.Kategori,
			KategoriLabel:     pen.KategoriLabel,
			Kanal:             pen.Kanal,
			Status:            pen.Status,
			AktivitasTerakhir: pen.AktivitasTerakhir,
			PengingatCount:    pen.PengingatCount,
			AvatarText:        initials,
		}
	}

	alumniResp := &domain.AlumniItemResponse{
		ID:                  a.ID,
		Nama:                user.FullName,
		NIP:                 user.NIP,
		Pelatihan:           pelatihan.Nama,
		SelesaiLms:          a.SelesaiLmsDate,
		SharingKms:          a.SharingKmsStatus,
		JatuhTempo:          a.JatuhTempoDate,
		Penilai:             fmt.Sprintf("%d ditetapkan", len(penugasanList)),
		IsPenilaiLengkap:    a.IsPenilaiLengkap,
		UnitKerja:           user.UnitKerja,
		BulanPascaPelatihan: a.BulanPascaPelatihan,
		StatusPenilai:       a.StatusPenilai,
	}

	return alumniResp, penilaiResponses, nil
}

func (r *GormPeriodeRepository) GantiPenilai(ctx context.Context, penugasanID string, newPegawaiID uuid.UUID, kanal string) error {
	var pen domain.PenugasanPenilai
	if err := r.db.WithContext(ctx).First(&pen, "id = ?", penugasanID).Error; err != nil {
		return sharederrors.ErrPenugasanNotFound
	}

	pen.PenilaiPegawaiID = newPegawaiID
	if kanal != "" {
		pen.Kanal = kanal
	}
	pen.Status = "Belum dibuka"
	pen.AktivitasTerakhir = "Penilai diganti"
	pen.UpdatedAt = time.Now().UTC()

	return r.db.WithContext(ctx).Save(&pen).Error
}

func (r *GormPeriodeRepository) BatalkanPenugasan(ctx context.Context, penugasanID string, alasan string) error {
	return r.db.WithContext(ctx).Delete(&domain.PenugasanPenilai{}, "id = ?", penugasanID).Error
}

func (r *GormPeriodeRepository) KirimPengingat(ctx context.Context, penugasanID string, kanal string) error {
	var pen domain.PenugasanPenilai
	if err := r.db.WithContext(ctx).First(&pen, "id = ?", penugasanID).Error; err != nil {
		return sharederrors.ErrPenugasanNotFound
	}

	pen.PengingatCount++
	if kanal != "" {
		pen.Kanal = kanal
	}
	pen.AktivitasTerakhir = fmt.Sprintf("Pengingat ke-%d dikirim", pen.PengingatCount)
	pen.UpdatedAt = time.Now().UTC()

	return r.db.WithContext(ctx).Save(&pen).Error
}

func (r *GormPeriodeRepository) ListPenilaianTertunda(ctx context.Context) ([]domain.PenilaianTertundaItemResponse, error) {
	var pendingList []domain.PenugasanPenilai
	err := r.db.WithContext(ctx).Where("status != ?", "Selesai").Find(&pendingList).Error
	if err != nil {
		return nil, err
	}

	results := make([]domain.PenilaianTertundaItemResponse, len(pendingList))
	for i, pen := range pendingList {
		var penUser userdomain.User
		_ = r.db.WithContext(ctx).First(&penUser, "id = ?", pen.PenilaiPegawaiID).Error

		var alm domain.AlumniEvaluasi
		_ = r.db.WithContext(ctx).First(&alm, "id = ?", pen.AlumniID).Error

		var almUser userdomain.User
		_ = r.db.WithContext(ctx).First(&almUser, "id = ?", alm.PegawaiID).Error

		var periode domain.PeriodeEvaluasi
		_ = r.db.WithContext(ctx).First(&periode, "id = ?", pen.PeriodeID).Error

		var pelatihan instrumendomain.JenisPelatihan
		_ = r.db.WithContext(ctx).First(&pelatihan, "id = ?", alm.PelatihanID).Error

		isOverdue := time.Now().After(pen.Deadline)
		deadlineStatus := "Dalam batas waktu"
		if isOverdue {
			days := int(time.Since(pen.Deadline).Hours() / 24)
			deadlineStatus = fmt.Sprintf("Lewat %d hari", days)
		}

		results[i] = domain.PenilaianTertundaItemResponse{
			ID:             pen.ID,
			PenilaiNama:    penUser.FullName,
			PenilaiNip:     penUser.NIP,
			AlumniNama:     almUser.FullName,
			AlumniNip:      almUser.NIP,
			Pelatihan:      pelatihan.Nama,
			Kategori:       pen.Kategori,
			KategoriLabel:  pen.KategoriLabel,
			Periode:        periode.Nama,
			Deadline:       pen.Deadline.Format("2 Jan 2006"),
			DeadlineStatus: deadlineStatus,
			IsOverdue:      isOverdue,
			Status:         pen.Status,
			Email:          penUser.Email,
			Phone:          penUser.Phone,
		}
	}

	return results, nil
}

