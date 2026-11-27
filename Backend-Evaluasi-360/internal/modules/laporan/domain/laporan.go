package domain

import (
	"context"
)

type RekapStats struct {
	AlumniDievaluasi int     `json:"alumniDievaluasi"`
	AlumniTotal      int     `json:"alumniTotal"`
	IndeksRataRata   float64 `json:"indeksRataRata"`
	IndeksKategori   string  `json:"indeksKategori"`
	TingkatPengisian float64 `json:"tingkatPengisian"`
	TrenPengisian    string  `json:"trenPengisian"`
	PeriodeCount     int     `json:"periodeCount"`
	PeriodeListStr   string  `json:"periodeListStr"`
}

type FokusEvaluasiItem struct {
	ID     string  `json:"id"`
	Label  string  `json:"label"`
	Latsar float64 `json:"latsar"`
	ECM    float64 `json:"ecm"`
	PKA    float64 `json:"pka"`
}

type HambatanItem struct {
	ID              string  `json:"id"`
	Label           string  `json:"label"`
	Percentage      int     `json:"percentage"`
	BarWidthPercent int     `json:"barWidthPercent"`
}

type UnitKerjaHeatmapRow struct {
	ID               string  `json:"id"`
	UnitKerja        string  `json:"unitKerja"`
	Relevansi        float64 `json:"relevansi"`
	Dukungan         float64 `json:"dukungan"`
	Sikap            float64 `json:"sikap"`
	Ketepatan        float64 `json:"ketepatan"`
	Manfaat          float64 `json:"manfaat"`
	RataRata         float64 `json:"rataRata"`
	AlumniCount      int     `json:"alumniCount"`
	IsUnderThreshold bool    `json:"isUnderThreshold,omitempty"`
}

type AlumniHasilIndividu struct {
	ID             string  `json:"id"`
	Nama           string  `json:"nama"`
	NIP            string  `json:"nip"`
	Jabatan        string  `json:"jabatan"`
	Periode        string  `json:"periode"`
	PenilaiSelesai int     `json:"penilaiSelesai"`
	PenilaiTotal   int     `json:"penilaiTotal"`
	Indeks         float64 `json:"indeks"`
	KategoriNilai  string  `json:"kategoriNilai"`
	Status         string  `json:"status"`
}

type RadarFokusScore struct {
	ID         string  `json:"id"`
	Label      string  `json:"label"`
	ShortLabel string  `json:"shortLabel"`
	Diri       float64 `json:"diri"`
	PihakLain  float64 `json:"pihakLain"`
}

type RincianFokusItem struct {
	ID          string   `json:"id"`
	Fokus       string   `json:"fokus"`
	Diri        float64  `json:"diri"`
	Atasan      float64  `json:"atasan"`
	Rekan       *float64 `json:"rekan"`
	Bawahan     *float64 `json:"bawahan"`
	PihakLain   float64  `json:"pihakLain"`
	Selisih     float64  `json:"selisih"`
	SelisihType string   `json:"selisihType"` // "pos-high" | "pos-low" | "neutral" | "neg"
}

type KutipanHambatanItem struct {
	ID      string `json:"id"`
	Kutipan string `json:"kutipan"`
	Sumber  string `json:"sumber"`
}

type AlumniDetailData struct {
	ID                     string                `json:"id"`
	Nama                   string                `json:"nama"`
	NIP                    string                `json:"nip"`
	Jabatan                string                `json:"jabatan"`
	UnitKerja              string                `json:"unitKerja"`
	Periode                string                `json:"periode"`
	PenilaiSelesai         int                   `json:"penilaiSelesai"`
	PenilaiTotal           int                   `json:"penilaiTotal"`
	IndeksPihakLain        float64               `json:"indeksPihakLain"`
	KategoriPihakLain      string                `json:"kategoriPihakLain"`
	PenilaianDiri          float64               `json:"penilaianDiri"`
	SelisihDiriVsPihakLain float64               `json:"selisihDiriVsPihakLain"`
	RataRataAngkatan       float64               `json:"rataRataAngkatan"`
	PersentilAngkatan      int                   `json:"persentilAngkatan"`
	TerakhirDiperbarui     string                `json:"terakhirDiperbarui"`
	RadarScores            []RadarFokusScore     `json:"radarScores"`
	RincianFokus           []RincianFokusItem    `json:"rincianFokus"`
	KutipanHambatan        []KutipanHambatanItem `json:"kutipanHambatan"`
}

type DashboardMetrics struct {
	TotalAlumni       int64   `json:"totalAlumni"`
	EvaluasiBerjalan  int64   `json:"evaluasiBerjalan"`
	PenilaianSelesai  int64   `json:"penilaianSelesai"`
	PenilaianTertunda int64   `json:"penilaianTertunda"`
	TingkatPengisian  float64 `json:"tingkatPengisian"`
	IndeksRataRata    float64 `json:"indeksRataRata"`
}

type LaporanRepository interface {
	GetDashboardMetrics(ctx context.Context, year string) (*DashboardMetrics, error)
	GetRekapStats(ctx context.Context, periodeID string) (*RekapStats, error)
	GetFokusList(ctx context.Context) ([]FokusEvaluasiItem, error)
	GetHambatanList(ctx context.Context) ([]HambatanItem, error)
	GetUnitKerjaHeatmap(ctx context.Context) ([]UnitKerjaHeatmapRow, error)
	GetHasilIndividuList(ctx context.Context, search, periode string) ([]AlumniHasilIndividu, error)
	GetDetailIndividu(ctx context.Context, alumniID string) (*AlumniDetailData, error)
}

type LaporanUsecase interface {
	GetDashboard(ctx context.Context, year string) (*DashboardMetrics, error)
	GetRekap(ctx context.Context, periodeID string) (map[string]interface{}, error)
	GetDetailIndividu(ctx context.Context, alumniID string) (*AlumniDetailData, error)
}

