package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type PenilaianJawaban struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	PenugasanID string    `json:"penugasanId" gorm:"type:varchar(50);index;not null"`
	ButirID     string    `json:"butirId" gorm:"type:varchar(50);index;not null"`
	Skor        int       `json:"skor" gorm:"type:int;not null"` // 1 - 5
	Catatan     string    `json:"catatan,omitempty" gorm:"type:text"`
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type PenilaianJawabanTerbuka struct {
	ID               uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	PenugasanID      string    `json:"penugasanId" gorm:"type:varchar(50);index;not null"`
	FokusID          string    `json:"fokusId" gorm:"type:varchar(50);index;not null"`
	PertanyaanID     string    `json:"pertanyaanId" gorm:"type:varchar(50);not null"`
	Jawaban          string    `json:"jawaban" gorm:"type:text;not null"`
	KategoriHambatan string    `json:"kategoriHambatan,omitempty" gorm:"type:varchar(100)"`
	CreatedAt        time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt        time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type SubmitJawabanItem struct {
	ButirID string `json:"butirId" validate:"required"`
	Skor    int    `json:"skor" validate:"required,min=1,max=5"`
	Catatan string `json:"catatan,omitempty"`
}

type SubmitJawabanTerbukaItem struct {
	FokusID          string `json:"fokusId" validate:"required"`
	PertanyaanID     string `json:"pertanyaanId" validate:"required"`
	Jawaban          string `json:"jawaban" validate:"required"`
	KategoriHambatan string `json:"kategoriHambatan,omitempty"`
}

type SubmitPenilaianRequest struct {
	PenugasanID      string                     `json:"penugasanId" validate:"required"`
	Jawaban          []SubmitJawabanItem        `json:"jawaban" validate:"required,dive"`
	JawabanTerbuka   []SubmitJawabanTerbukaItem `json:"jawabanTerbuka,omitempty"`
}

type FormPenilaianResponse struct {
	PenugasanID       string                 `json:"penugasanId"`
	Kategori          string                 `json:"kategori"`
	KategoriLabel     string                 `json:"kategoriLabel"`
	AlumniNama        string                 `json:"alumniNama"`
	AlumniNIP         string                 `json:"alumniNip"`
	PelatihanNama     string                 `json:"pelatihanNama"`
	Deadline          string                 `json:"deadline"`
	PertanyaanList    []PertanyaanFormItem   `json:"pertanyaanList"`
	PertanyaanTerbuka []PertanyaanTerbukaItem `json:"pertanyaanTerbuka"`
}

type PertanyaanFormItem struct {
	ButirID    string `json:"butirId"`
	FokusTitle string `json:"fokusTitle"`
	Code       string `json:"code"`
	Text       string `json:"text"`
	AgendaHint string `json:"agendaHint,omitempty"`
}

type PertanyaanTerbukaItem struct {
	FokusID string `json:"fokusId"`
	Code    string `json:"code"`
	Text    string `json:"text"`
}

type PenilaianRepository interface {
	GetFormByPenugasanID(ctx context.Context, penugasanID string) (*FormPenilaianResponse, error)
	SubmitPenilaian(ctx context.Context, req *SubmitPenilaianRequest) error
}

type PenilaianUsecase interface {
	GetFormPenilaian(ctx context.Context, penugasanID string) (*FormPenilaianResponse, error)
	SubmitPenilaian(ctx context.Context, req *SubmitPenilaianRequest) error
}

