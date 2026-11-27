package domain

import (
	"context"
	"time"
)

type JenisPelatihan struct {
	ID               string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	Nama             string    `json:"nama" gorm:"type:varchar(255);not null"`
	UseInstrumenInti bool      `json:"useInstrumenInti" gorm:"type:boolean;default:false"`
	Deskripsi        string    `json:"deskripsi,omitempty" gorm:"type:text"`
	CreatedAt        time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt        time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type FokusEvaluasi struct {
	ID             string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	PelatihanID    string    `json:"pelatihanId,omitempty" gorm:"type:varchar(50);index"`
	Number         int       `json:"number" gorm:"type:int;not null"`
	Title          string    `json:"title" gorm:"type:varchar(255);not null"`
	IsIsianTerbuka bool      `json:"isIsianTerbuka" gorm:"type:boolean;default:false"`
	Bobot          float64   `json:"bobot" gorm:"type:decimal(5,2);default:1.0"`
	CreatedAt      time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt      time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type Subdimensi struct {
	ID        string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	FokusID   string    `json:"fokusId" gorm:"type:varchar(50);index;not null"`
	Code      string    `json:"code" gorm:"type:varchar(20);not null"`
	Title     string    `json:"title" gorm:"type:varchar(255);not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type Indikator struct {
	ID           string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	SubdimensiID string    `json:"subdimensiId" gorm:"type:varchar(50);index;not null"`
	Code         string    `json:"code" gorm:"type:varchar(20);not null"`
	Title        string    `json:"title" gorm:"type:varchar(255);not null"`
	CreatedAt    time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type ButirPertanyaan struct {
	ID          string    `json:"id" gorm:"type:varchar(50);primaryKey"`
	IndikatorID string    `json:"indikatorId,omitempty" gorm:"type:varchar(50);index"`
	FokusID     string    `json:"fokusId" gorm:"type:varchar(50);index;not null"`
	Code        string    `json:"code" gorm:"type:varchar(30);not null"`
	Text        string    `json:"text" gorm:"type:text;not null"`
	AgendaHint  string    `json:"agendaHint,omitempty" gorm:"type:text"`
	Categories  string    `json:"categories" gorm:"type:varchar(50);not null"` // comma-separated e.g. "D,A,R,B"
	IsOpenEnded bool      `json:"isOpenEnded" gorm:"type:boolean;default:false"`
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// DTOs matching frontend exactly
type JenisPelatihanResponse struct {
	ID               string `json:"id"`
	Nama             string `json:"nama"`
	ButirCount       int    `json:"butirCount"`
	FokusCount       int    `json:"fokusCount"`
	UseInstrumenInti bool   `json:"useInstrumenInti"`
}

type ButirPertanyaanItemResponse struct {
	ID         string   `json:"id"`
	Code       string   `json:"code"`
	Text       string   `json:"text"`
	AgendaHint string   `json:"agendaHint,omitempty"`
	Categories []string `json:"categories"`
}

type IndikatorItemResponse struct {
	ID         string                        `json:"id"`
	Code       string                        `json:"code"`
	Title      string                        `json:"title"`
	ButirCount int                           `json:"butirCount"`
	Items      []ButirPertanyaanItemResponse `json:"items"`
}

type SubdimensiItemResponse struct {
	ID             string                  `json:"id"`
	Code           string                  `json:"code"`
	Title          string                  `json:"title"`
	IndikatorCount int                     `json:"indikatorCount"`
	ButirCount     int                     `json:"butirCount"`
	Indikators     []IndikatorItemResponse `json:"indikators"`
}

type OpenQuestionItemResponse struct {
	ID   string `json:"id"`
	Code string `json:"code"`
	Text string `json:"text"`
}

type FokusItemResponse struct {
	ID              string                     `json:"id"`
	Number          int                        `json:"number"`
	Title           string                     `json:"title"`
	SubdimensiCount int                        `json:"subdimensiCount"`
	ButirCount      int                        `json:"butirCount"`
	IsIsianTerbuka  bool                       `json:"isIsianTerbuka"`
	PertanyaanCount int                        `json:"pertanyaanCount,omitempty"`
	Subdimensis     []SubdimensiItemResponse   `json:"subdimensis,omitempty"`
	OpenQuestions   []OpenQuestionItemResponse `json:"openQuestions,omitempty"`
}

type CreatePelatihanRequest struct {
	ID               string `json:"id"`
	Nama             string `json:"nama" validate:"required"`
	UseInstrumenInti bool   `json:"useInstrumenInti"`
	Deskripsi        string `json:"deskripsi"`
}

type CreateFokusRequest struct {
	ID             string  `json:"id"`
	PelatihanID    string  `json:"pelatihanId"`
	Number         int     `json:"number" validate:"required"`
	Title          string  `json:"title" validate:"required"`
	IsIsianTerbuka bool    `json:"isIsianTerbuka"`
	Bobot          float64 `json:"bobot"`
}

type CreateSubdimensiRequest struct {
	ID      string `json:"id"`
	FokusID string `json:"fokusId" validate:"required"`
	Code    string `json:"code" validate:"required"`
	Title   string `json:"title" validate:"required"`
}

type CreateIndikatorRequest struct {
	ID           string `json:"id"`
	SubdimensiID string `json:"subdimensiId" validate:"required"`
	Code         string `json:"code" validate:"required"`
	Title        string `json:"title" validate:"required"`
}

type CreateButirRequest struct {
	ID          string   `json:"id"`
	PelatihanID string   `json:"pelatihanId"`
	FokusID     string   `json:"fokusId"`
	IndikatorID string   `json:"indikatorId"`
	Code        string   `json:"code" validate:"required"`
	Text        string   `json:"text" validate:"required"`
	AgendaHint  string   `json:"agendaHint"`
	Categories  []string `json:"categories" validate:"required"`
	IsOpenEnded bool     `json:"isOpenEnded"`
}

type UpdateButirRequest struct {
	Text        string   `json:"text" validate:"required"`
	AgendaHint  string   `json:"agendaHint"`
	Categories  []string `json:"categories" validate:"required"`
	IsOpenEnded bool     `json:"isOpenEnded"`
}

type DuplicateInstrumenRequest struct {
	SourcePelatihanID string `json:"sourcePelatihanId" validate:"required"`
	TargetPelatihanID string `json:"targetPelatihanId"`
	NewVersion        string `json:"newVersion"`
}

type InstrumenRepository interface {
	ListPelatihan(ctx context.Context) ([]JenisPelatihanResponse, error)
	GetPelatihan(ctx context.Context, id string) (*JenisPelatihanResponse, error)
	CreatePelatihan(ctx context.Context, req *CreatePelatihanRequest) (*JenisPelatihanResponse, error)
	ListFokusByPelatihan(ctx context.Context, pelatihanID string) ([]FokusItemResponse, error)
	CreateFokus(ctx context.Context, req *CreateFokusRequest) (*FokusItemResponse, error)
	CreateSubdimensi(ctx context.Context, req *CreateSubdimensiRequest) (*SubdimensiItemResponse, error)
	CreateIndikator(ctx context.Context, req *CreateIndikatorRequest) (*IndikatorItemResponse, error)
	CreateButir(ctx context.Context, butir *ButirPertanyaan) error
	UpdateButir(ctx context.Context, id string, req *UpdateButirRequest) (*ButirPertanyaanItemResponse, error)
	DeleteButir(ctx context.Context, id string) error
	DuplicateInstrumen(ctx context.Context, req *DuplicateInstrumenRequest) error
}

type InstrumenUsecase interface {
	GetPelatihanList(ctx context.Context) ([]JenisPelatihanResponse, error)
	CreatePelatihan(ctx context.Context, req *CreatePelatihanRequest) (*JenisPelatihanResponse, error)
	GetFokusList(ctx context.Context, pelatihanID string) ([]FokusItemResponse, error)
	AddFokus(ctx context.Context, req *CreateFokusRequest) (*FokusItemResponse, error)
	AddSubdimensi(ctx context.Context, req *CreateSubdimensiRequest) (*SubdimensiItemResponse, error)
	AddIndikator(ctx context.Context, req *CreateIndikatorRequest) (*IndikatorItemResponse, error)
	AddButir(ctx context.Context, req *CreateButirRequest) (*ButirPertanyaanItemResponse, error)
	UpdateButir(ctx context.Context, id string, req *UpdateButirRequest) (*ButirPertanyaanItemResponse, error)
	DeleteButir(ctx context.Context, id string) error
	DuplicateInstrumen(ctx context.Context, req *DuplicateInstrumenRequest) error
}

