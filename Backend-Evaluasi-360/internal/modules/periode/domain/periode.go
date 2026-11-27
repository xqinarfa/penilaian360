package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type PeriodeStatus string

const (
	PeriodeTerjadwal   PeriodeStatus = "Terjadwal"
	PeriodeBerjalan    PeriodeStatus = "Berjalan"
	PeriodeDiperpanjang PeriodeStatus = "Diperpanjang"
	PeriodeSelesai     PeriodeStatus = "Selesai"
)

type PeriodeEvaluasi struct {
	ID              string        `json:"id" gorm:"type:varchar(50);primaryKey"`
	Nama            string        `json:"nama" gorm:"type:varchar(255);not null"`
	PelatihanID     string        `json:"pelatihanId" gorm:"type:varchar(50);index;not null"`
	StartDate       time.Time     `json:"startDate" gorm:"type:timestamp;not null"`
	EndDate         time.Time     `json:"endDate" gorm:"type:timestamp;not null"`
	Status          PeriodeStatus `json:"status" gorm:"type:varchar(50);not null;default:'Terjadwal'"`
	ProgressPercent float64       `json:"progressPercent" gorm:"type:decimal(5,2);default:0.0"`
	CreatedAt       time.Time     `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt       time.Time     `json:"updatedAt" gorm:"autoUpdateTime"`
}

type AlumniEvaluasi struct {
	ID                  string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	PeriodeID           string    `json:"periodeId" gorm:"type:varchar(50);index;not null"`
	PegawaiID           uuid.UUID `json:"pegawaiId" gorm:"type:uuid;index;not null"`
	PelatihanID         string    `json:"pelatihanId" gorm:"type:varchar(50);not null"`
	SelesaiLmsDate      string    `json:"selesaiLms" gorm:"type:varchar(50)"`
	SharingKmsStatus    string    `json:"sharingKms" gorm:"type:varchar(50);default:'Selesai'"`
	JatuhTempoDate      string    `json:"jatuhTempo" gorm:"type:varchar(50)"`
	IsPenilaiLengkap    bool      `json:"isPenilaiLengkap" gorm:"type:boolean;default:false"`
	StatusPenilai       string    `json:"statusPenilai" gorm:"type:varchar(50)"`
	BulanPascaPelatihan int       `json:"bulanPascaPelatihan" gorm:"type:int;default:6"`
	CreatedAt           time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt           time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type PenugasanPenilai struct {
	ID                string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	PeriodeID         string    `json:"periodeId" gorm:"type:varchar(50);index;not null"`
	AlumniID          string    `json:"alumniId" gorm:"type:varchar(50);index;not null"`
	PenilaiPegawaiID  uuid.UUID `json:"penilaiPegawaiId" gorm:"type:uuid;index;not null"`
	Kategori          string    `json:"kategori" gorm:"type:varchar(5);not null"` // "D", "A", "R", "B"
	KategoriLabel     string    `json:"kategoriLabel" gorm:"type:varchar(100);not null"`
	Kanal             string    `json:"kanal" gorm:"type:varchar(20);default:'both'"` // "mail", "wa", "both"
	Status            string    `json:"status" gorm:"type:varchar(50);default:'Belum dibuka'"` // "Belum dibuka", "Sedang mengisi", "Selesai", "Kedaluwarsa"
	Deadline          time.Time `json:"deadline" gorm:"type:timestamp"`
	AktivitasTerakhir string    `json:"aktivitasTerakhir" gorm:"type:varchar(100)"`
	PengingatCount    int       `json:"pengingatCount" gorm:"type:int;default:0"`
	SubmittedAt       *time.Time `json:"submittedAt,omitempty"`
	CreatedAt         time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt         time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// Frontend-compatible Response DTOs
type PeriodeItemResponse struct {
	ID              string        `json:"id"`
	Nama            string        `json:"nama"`
	CreatedAt       string        `json:"createdAt"`
	Instrumen       string        `json:"instrumen"`
	AlumniCount     int           `json:"alumniCount"`
	MasaPengisian   string        `json:"masaPengisian"`
	ProgressPercent float64       `json:"progressPercent"`
	Status          PeriodeStatus `json:"status"`
}

type EvaluatorDetailResponse struct {
	Role    string `json:"role"`
	Nama    string `json:"nama"`
	NIP     string `json:"nip"`
	Jabatan string `json:"jabatan"`
	Status  string `json:"status"`
}

type AlumniItemResponse struct {
	ID                  string                    `json:"id"`
	Nama                string                    `json:"nama"`
	NIP                 string                    `json:"nip"`
	Pelatihan           string                    `json:"pelatihan"`
	SelesaiLms          string                    `json:"selesaiLms"`
	SharingKms          string                    `json:"sharingKms"`
	JatuhTempo          string                    `json:"jatuhTempo"`
	Penilai             string                    `json:"penilai"`
	IsPenilaiLengkap    bool                      `json:"isPenilaiLengkap"`
	UnitKerja           string                    `json:"unitKerja"`
	Evaluators          []EvaluatorDetailResponse `json:"evaluators"`
	BulanPascaPelatihan int                       `json:"bulanPascaPelatihan"`
	StatusPenilai       string                    `json:"statusPenilai"`
}

type PenilaiDetailItemResponse struct {
	ID                string `json:"id"`
	Nama              string `json:"nama"`
	NIP               string `json:"nip"`
	Jabatan           string `json:"jabatan"`
	Kategori          string `json:"kategori"`
	KategoriLabel     string `json:"kategoriLabel"`
	Kanal             string `json:"kanal"`
	Status            string `json:"status"`
	AktivitasTerakhir string `json:"aktivitasTerakhir"`
	PengingatCount    int    `json:"pengingatCount"`
	AvatarText        string `json:"avatarText"`
}

type PenilaianTertundaItemResponse struct {
	ID             string `json:"id"`
	PenilaiNama    string `json:"penilaiNama"`
	PenilaiNip     string `json:"penilaiNip"`
	AlumniNama     string `json:"alumniNama"`
	AlumniNip      string `json:"alumniNip,omitempty"`
	Pelatihan      string `json:"pelatihan"`
	Kategori       string `json:"kategori"`
	KategoriLabel  string `json:"kategoriLabel"`
	Periode        string `json:"periode"`
	Deadline       string `json:"deadline"`
	DeadlineStatus string `json:"deadlineStatus"`
	IsOverdue      bool   `json:"isOverdue"`
	Status         string `json:"status"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
}

type GantiPenilaiRequest struct {
	CalonPegawaiID uuid.UUID `json:"calonPegawaiId" validate:"required"`
	Kanal          string    `json:"kanal" validate:"omitempty,oneof=mail wa both"`
}

type KirimPengingatRequest struct {
	Kanal string `json:"kanal" validate:"omitempty,oneof=mail wa both"`
}

type CreatePeriodeRequest struct {
	ID          string `json:"id"`
	Nama        string `json:"nama" validate:"required"`
	PelatihanID string `json:"pelatihanId" validate:"required"`
	StartDate   string `json:"startDate" validate:"required"`
	EndDate     string `json:"endDate" validate:"required"`
	Status      string `json:"status"`
}

type PeriodeRepository interface {
	ListPeriode(ctx context.Context) ([]PeriodeItemResponse, error)
	GetPeriode(ctx context.Context, id string) (*PeriodeItemResponse, error)
	CreatePeriode(ctx context.Context, req *CreatePeriodeRequest) (*PeriodeItemResponse, error)
	ListAlumniByPeriode(ctx context.Context, periodeID string) ([]AlumniItemResponse, error)
	GetAlumniDetail(ctx context.Context, alumniID string) (*AlumniItemResponse, []PenilaiDetailItemResponse, error)
	GantiPenilai(ctx context.Context, penugasanID string, newPegawaiID uuid.UUID, kanal string) error
	BatalkanPenugasan(ctx context.Context, penugasanID string, alasan string) error
	KirimPengingat(ctx context.Context, penugasanID string, kanal string) error
	ListPenilaianTertunda(ctx context.Context) ([]PenilaianTertundaItemResponse, error)
}

type PeriodeUsecase interface {
	GetPeriodeList(ctx context.Context) ([]PeriodeItemResponse, error)
	GetPeriode(ctx context.Context, id string) (*PeriodeItemResponse, error)
	CreatePeriode(ctx context.Context, req *CreatePeriodeRequest) (*PeriodeItemResponse, error)
	GetAlumniList(ctx context.Context, periodeID string) ([]AlumniItemResponse, error)
	GetAlumniDetail(ctx context.Context, alumniID string) (*AlumniItemResponse, []PenilaiDetailItemResponse, error)
	GantiPenilai(ctx context.Context, penugasanID string, req *GantiPenilaiRequest) error
	BatalkanPenugasan(ctx context.Context, penugasanID string, alasan string) error
	KirimPengingat(ctx context.Context, penugasanID string, req *KirimPengingatRequest) error
	GetPenilaianTertunda(ctx context.Context) ([]PenilaianTertundaItemResponse, error)
}

