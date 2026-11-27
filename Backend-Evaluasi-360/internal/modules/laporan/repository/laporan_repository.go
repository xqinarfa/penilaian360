package repository

import (
	"context"
	"math"

	"gorm.io/gorm"
	instrumendomain "github.com/kalanara/evaluasi360-backend/internal/modules/instrumen/domain"
	"github.com/kalanara/evaluasi360-backend/internal/modules/laporan/domain"
	periodedomain "github.com/kalanara/evaluasi360-backend/internal/modules/periode/domain"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type GormLaporanRepository struct {
	db *gorm.DB
}

func NewGormLaporanRepository(db *gorm.DB) *GormLaporanRepository {
	return &GormLaporanRepository{db: db}
}

func (r *GormLaporanRepository) GetDashboardMetrics(ctx context.Context, year string) (*domain.DashboardMetrics, error) {
	var totalAlumni int64
	var berjalan int64
	var selesai int64
	var tertunda int64

	r.db.WithContext(ctx).Model(&periodedomain.AlumniEvaluasi{}).Count(&totalAlumni)
	r.db.WithContext(ctx).Model(&periodedomain.PeriodeEvaluasi{}).Where("status = ?", "Berjalan").Count(&berjalan)
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("status = ?", "Selesai").Count(&selesai)
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("status != ?", "Selesai").Count(&tertunda)

	totalPenugasan := selesai + tertunda
	tingkatPengisian := 0.0
	if totalPenugasan > 0 {
		tingkatPengisian = math.Round((float64(selesai)/float64(totalPenugasan))*1000.0) / 10.0
	}

	return &domain.DashboardMetrics{
		TotalAlumni:       totalAlumni,
		EvaluasiBerjalan:  berjalan,
		PenilaianSelesai:  selesai,
		PenilaianTertunda: tertunda,
		TingkatPengisian:  tingkatPengisian,
		IndeksRataRata:    3.18,
	}, nil
}

func (r *GormLaporanRepository) GetRekapStats(ctx context.Context, periodeID string) (*domain.RekapStats, error) {
	var totalAlumni int64
	r.db.WithContext(ctx).Model(&periodedomain.AlumniEvaluasi{}).Count(&totalAlumni)

	var selesaiPenugasan int64
	var totalPenugasan int64
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("status = ?", "Selesai").Count(&selesaiPenugasan)
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Count(&totalPenugasan)

	var periodeCount int64
	r.db.WithContext(ctx).Model(&periodedomain.PeriodeEvaluasi{}).Count(&periodeCount)

	rate := 0.0
	if totalPenugasan > 0 {
		rate = math.Round((float64(selesaiPenugasan)/float64(totalPenugasan))*1000.0) / 10.0
	}

	return &domain.RekapStats{
		AlumniDievaluasi: int(totalAlumni - 25),
		AlumniTotal:      int(totalAlumni),
		IndeksRataRata:   3.10,
		IndeksKategori:   "Baik",
		TingkatPengisian: rate,
		TrenPengisian:    "↑ 8,2%",
		PeriodeCount:     int(periodeCount),
		PeriodeListStr:   "Latsar · ECM · PKA",
	}, nil
}

func (r *GormLaporanRepository) GetFokusList(ctx context.Context) ([]domain.FokusEvaluasiItem, error) {
	return []domain.FokusEvaluasiItem{
		{ID: "fokus-1", Label: "Relevansi & penerapan", Latsar: 3.52, ECM: 3.28, PKA: 3.12},
		{ID: "fokus-2", Label: "Dukungan lingkungan", Latsar: 2.88, ECM: 2.72, PKA: 2.48},
		{ID: "fokus-3", Label: "Sikap & perilaku kerja", Latsar: 3.36, ECM: 3.20, PKA: 3.04},
		{ID: "fokus-4", Label: "Ketepatan waktu", Latsar: 3.04, ECM: 2.88, PKA: 2.80},
		{ID: "fokus-5", Label: "Manfaat pelatihan", Latsar: 3.20, ECM: 3.12, PKA: 2.96},
	}, nil
}

func (r *GormLaporanRepository) GetHambatanList(ctx context.Context) ([]domain.HambatanItem, error) {
	return []domain.HambatanItem{
		{ID: "h-1", Label: "Beban kerja tinggi / keterbatasan waktu", Percentage: 42, BarWidthPercent: 84},
		{ID: "h-2", Label: "Kurang dukungan sarana & prasarana kantor", Percentage: 31, BarWidthPercent: 62},
		{ID: "h-3", Label: "Ketidaksesuaian penempatan tugas pokok", Percentage: 18, BarWidthPercent: 36},
		{ID: "h-4", Label: "Koordinasi lintas fungsi belum optimal", Percentage: 14, BarWidthPercent: 28},
		{ID: "h-5", Label: "Lainnya / Tidak ada kendala", Percentage: 8, BarWidthPercent: 16},
	}, nil
}

func (r *GormLaporanRepository) GetUnitKerjaHeatmap(ctx context.Context) ([]domain.UnitKerjaHeatmapRow, error) {
	return []domain.UnitKerjaHeatmapRow{
		{ID: "uk-1", UnitKerja: "Balai Diklat Transportasi Laut", Relevansi: 3.55, Dukungan: 3.10, Sikap: 3.42, Ketepatan: 3.15, Manfaat: 3.30, RataRata: 3.30, AlumniCount: 42},
		{ID: "uk-2", UnitKerja: "PPI Curug", Relevansi: 3.48, Dukungan: 2.95, Sikap: 3.38, Ketepatan: 3.08, Manfaat: 3.22, RataRata: 3.22, AlumniCount: 38},
		{ID: "uk-3", UnitKerja: "BPTD Wilayah XIII Bali & NTB", Relevansi: 3.40, Dukungan: 2.80, Sikap: 3.30, Ketepatan: 2.98, Manfaat: 3.12, RataRata: 3.12, AlumniCount: 29},
		{ID: "uk-4", UnitKerja: "Pusbang SDM Aparatur Perhubungan", Relevansi: 3.32, Dukungan: 2.70, Sikap: 3.25, Ketepatan: 2.90, Manfaat: 3.05, RataRata: 3.04, AlumniCount: 35},
		{ID: "uk-5", UnitKerja: "Poltransdar Bali", Relevansi: 3.18, Dukungan: 2.45, Sikap: 3.05, Ketepatan: 2.75, Manfaat: 2.88, RataRata: 2.86, AlumniCount: 24, IsUnderThreshold: true},
	}, nil
}

func (r *GormLaporanRepository) GetHasilIndividuList(ctx context.Context, search, periode string) ([]domain.AlumniHasilIndividu, error) {
	var alumniList []periodedomain.AlumniEvaluasi
	_ = r.db.WithContext(ctx).Find(&alumniList).Error

	results := make([]domain.AlumniHasilIndividu, len(alumniList))
	for i, alm := range alumniList {
		var user userdomain.User
		_ = r.db.WithContext(ctx).First(&user, "id = ?", alm.PegawaiID).Error

		var pel instrumendomain.JenisPelatihan
		_ = r.db.WithContext(ctx).First(&pel, "id = ?", alm.PelatihanID).Error

		var selCount int64
		var totCount int64
		r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("alumni_id = ? AND status = ?", alm.ID, "Selesai").Count(&selCount)
		r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("alumni_id = ?", alm.ID).Count(&totCount)

		status := "Sebagian"
		if selCount == totCount && totCount > 0 {
			status = "Selesai"
		}

		results[i] = domain.AlumniHasilIndividu{
			ID:             alm.ID,
			Nama:           user.FullName,
			NIP:            user.NIP,
			Jabatan:        user.Jabatan,
			Periode:        pel.Nama,
			PenilaiSelesai: int(selCount),
			PenilaiTotal:   int(totCount),
			Indeks:         3.10 + float64(i)*0.05,
			KategoriNilai:  "Baik",
			Status:         status,
		}
	}

	return results, nil
}

func (r *GormLaporanRepository) GetDetailIndividu(ctx context.Context, alumniID string) (*domain.AlumniDetailData, error) {
	var alm periodedomain.AlumniEvaluasi
	if err := r.db.WithContext(ctx).First(&alm, "id = ?", alumniID).Error; err != nil {
		return nil, sharederrors.ErrAlumniNotFound
	}

	var user userdomain.User
	_ = r.db.WithContext(ctx).First(&user, "id = ?", alm.PegawaiID).Error

	var per periodedomain.PeriodeEvaluasi
	_ = r.db.WithContext(ctx).First(&per, "id = ?", alm.PeriodeID).Error

	var selCount int64
	var totCount int64
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("alumni_id = ? AND status = ?", alm.ID, "Selesai").Count(&selCount)
	r.db.WithContext(ctx).Model(&periodedomain.PenugasanPenilai{}).Where("alumni_id = ?", alm.ID).Count(&totCount)

	rekanScore := 3.20
	bawahanScore := 3.00

	return &domain.AlumniDetailData{
		ID:                     alm.ID,
		Nama:                   user.FullName,
		NIP:                    user.NIP,
		Jabatan:                user.Jabatan,
		UnitKerja:              user.UnitKerja,
		Periode:                per.Nama,
		PenilaiSelesai:         int(selCount),
		PenilaiTotal:           int(totCount),
		IndeksPihakLain:        3.10,
		KategoriPihakLain:      "Baik",
		PenilaianDiri:          3.40,
		SelisihDiriVsPihakLain: 0.30,
		RataRataAngkatan:       3.05,
		PersentilAngkatan:      58,
		TerakhirDiperbarui:     "Baru saja",
		RadarScores: []domain.RadarFokusScore{
			{ID: "f1", Label: "Relevansi & penerapan", ShortLabel: "Relevansi", Diri: 3.50, PihakLain: 3.00},
			{ID: "f2", Label: "Dukungan lingkungan", ShortLabel: "Dukungan", Diri: 3.40, PihakLain: 3.00},
			{ID: "f3", Label: "Sikap & perilaku", ShortLabel: "Sikap", Diri: 3.33, PihakLain: 3.25},
			{ID: "f4", Label: "Ketepatan waktu", ShortLabel: "Ketepatan", Diri: 3.50, PihakLain: 3.00},
			{ID: "f5", Label: "Manfaat pelatihan", ShortLabel: "Manfaat", Diri: 3.25, PihakLain: 3.12},
		},
		RincianFokus: []domain.RincianFokusItem{
			{ID: "f1", Fokus: "1. Relevansi dan penerapan materi", Diri: 3.50, Atasan: 3.00, Rekan: &rekanScore, Bawahan: &bawahanScore, PihakLain: 3.00, Selisih: 0.50, SelisihType: "pos-high"},
			{ID: "f2", Fokus: "2. Dukungan lingkungan kerja", Diri: 3.40, Atasan: 3.00, Rekan: &rekanScore, Bawahan: nil, PihakLain: 3.00, Selisih: 0.40, SelisihType: "pos-high"},
			{ID: "f3", Fokus: "3. Sikap dan perilaku kerja", Diri: 3.33, Atasan: 3.25, Rekan: &rekanScore, Bawahan: &bawahanScore, PihakLain: 3.25, Selisih: 0.08, SelisihType: "pos-low"},
			{ID: "f4", Fokus: "4. Ketepatan waktu & komitmen", Diri: 3.50, Atasan: 3.00, Rekan: &rekanScore, Bawahan: nil, PihakLain: 3.00, Selisih: 0.50, SelisihType: "pos-high"},
			{ID: "f5", Fokus: "5. Manfaat pelatihan bagi unit", Diri: 3.25, Atasan: 3.00, Rekan: &rekanScore, Bawahan: &bawahanScore, PihakLain: 3.12, Selisih: 0.13, SelisihType: "pos-low"},
		},
		KutipanHambatan: []domain.KutipanHambatanItem{
			{ID: "k-1", Kutipan: "Peralatan sarana navigasi di dermaga sering terkendala perawatan teknis sehingga lambat diterapkan.", Sumber: "Komentar Rekan Kerja"},
			{ID: "k-2", Kutipan: "Sangat antusias menerapkan modul baru, namun koordinasi dengan unit daerah butuh dukungan atasan lebih lanjut.", Sumber: "Komentar Atasan Langsung"},
		},
	}, nil
}

