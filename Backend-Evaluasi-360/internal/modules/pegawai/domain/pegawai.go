package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type RelasiType string

const (
	RelasiAtasan  RelasiType = "ATASAN"
	RelasiRekan   RelasiType = "REKAN"
	RelasiBawahan RelasiType = "BAWAHAN"
)

type StatusRelasi string

const (
	StatusRelasiLengkap      StatusRelasi = "Lengkap"
	StatusRelasiRekanKurang  StatusRelasi = "Rekan kurang"
	StatusRelasiAtasanKosong StatusRelasi = "Atasan kosong"
)

type PegawaiRelasi struct {
	ID              uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	PegawaiID       uuid.UUID  `json:"pegawai_id" gorm:"type:uuid;index;not null"`
	TargetPegawaiID uuid.UUID  `json:"target_pegawai_id" gorm:"type:uuid;index;not null"`
	RelasiType      RelasiType `json:"relasi_type" gorm:"type:varchar(20);not null"`
	CreatedAt       time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt       time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
}

type PegawaiItemResponse struct {
	ID           string       `json:"id"`
	Nama         string       `json:"nama"`
	NIP          string       `json:"nip"`
	Jabatan      string       `json:"jabatan"`
	UnitKerja    string       `json:"unitKerja"`
	Role         string       `json:"role"`
	StatusRelasi StatusRelasi `json:"statusRelasi"`
	Atasan       string       `json:"atasan"`
	RekanKerja   []string     `json:"rekanKerja"`
	Bawahan      []string     `json:"bawahan"`
	Email        string       `json:"email,omitempty"`
	Phone        string       `json:"phone,omitempty"`
	AvatarURL    string       `json:"avatarUrl,omitempty"`
}

type CreatePegawaiRequest struct {
	NIP       string `json:"nip" validate:"required"`
	Nama      string `json:"nama" validate:"required"`
	Jabatan   string `json:"jabatan" validate:"required"`
	UnitKerja string `json:"unitKerja" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	Password  string `json:"password"`
}

type UpdatePegawaiRequest struct {
	Nama      string `json:"nama,omitempty"`
	NIP       string `json:"nip,omitempty"`
	Jabatan   string `json:"jabatan,omitempty"`
	UnitKerja string `json:"unitKerja,omitempty"`
	Email     string `json:"email,omitempty"`
	Phone     string `json:"phone,omitempty"`
	Role      string `json:"role,omitempty"`
	Password  string `json:"password,omitempty"`
	IsActive  *bool  `json:"isActive,omitempty"`
}

type UpdateRelasiRequest struct {
	AtasanID    *uuid.UUID  `json:"atasanId,omitempty"`
	RekanIDs    []uuid.UUID `json:"rekanIds,omitempty"`
	BawahanIDs  []uuid.UUID `json:"bawahanIds,omitempty"`
	Atasan      string      `json:"atasan,omitempty"`
	RekanKerja  []string    `json:"rekanKerja,omitempty"`
	Bawahan     []string    `json:"bawahan,omitempty"`
}

type SyncChangeLogItem struct {
	NIP        string `json:"nip"`
	Nama       string `json:"nama"`
	Field      string `json:"field"`
	OldValue   string `json:"oldValue"`
	NewValue   string `json:"newValue"`
	ChangeType string `json:"changeType"` // "MUTASI", "PROMOSI", "DATA_BARU", "RELASI"
	Timestamp  string `json:"timestamp"`
}

type SIKSyncHistoryItem struct {
	ID              string              `json:"id" gorm:"primaryKey;type:varchar(50)"`
	SyncType        string              `json:"syncType" gorm:"type:varchar(50)"`
	Status          string              `json:"status" gorm:"type:varchar(30)"`
	TriggeredByName string              `json:"triggeredByName" gorm:"type:varchar(255)"`
	Source          string              `json:"source" gorm:"type:varchar(255)"`
	TotalFetched    int                 `json:"totalFetched" gorm:"type:int"`
	TotalInserted   int                 `json:"totalInserted" gorm:"type:int"`
	TotalUpdated    int                 `json:"totalUpdated" gorm:"type:int"`
	TotalFailed     int                 `json:"totalFailed" gorm:"type:int"`
	DurationMs      int64               `json:"durationMs" gorm:"type:bigint"`
	Message         string              `json:"message" gorm:"type:text"`
	ChangesLogJSON  string              `json:"-" gorm:"type:text;column:changes_log"`
	ChangesLog      []SyncChangeLogItem `json:"changesLog" gorm:"-"`
	CreatedAt       time.Time           `json:"createdAt" gorm:"autoCreateTime"`
}

type PegawaiRepository interface {
	List(ctx context.Context, search, unitKerja string, statusRelasi string, limit, offset int) ([]PegawaiItemResponse, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*PegawaiItemResponse, error)
	UpdateRelasi(ctx context.Context, pegawaiID uuid.UUID, req *UpdateRelasiRequest) error
	Create(ctx context.Context, req *CreatePegawaiRequest) (*PegawaiItemResponse, error)
	Update(ctx context.Context, id uuid.UUID, req *UpdatePegawaiRequest) (*PegawaiItemResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteBatch(ctx context.Context, ids []uuid.UUID) error
	GetSyncHistory(ctx context.Context) ([]SIKSyncHistoryItem, error)
	TriggerSyncSIK(ctx context.Context, triggeredBy string) (*SIKSyncHistoryItem, error)
}

type PegawaiUsecase interface {
	ListPegawai(ctx context.Context, search, unitKerja string, statusRelasi string, limit, offset int) ([]PegawaiItemResponse, int64, error)
	GetPegawai(ctx context.Context, id uuid.UUID) (*PegawaiItemResponse, error)
	UpdateRelasi(ctx context.Context, pegawaiID uuid.UUID, req *UpdateRelasiRequest) (*PegawaiItemResponse, error)
	CreatePegawai(ctx context.Context, req *CreatePegawaiRequest) (*PegawaiItemResponse, error)
	UpdatePegawai(ctx context.Context, id uuid.UUID, req *UpdatePegawaiRequest) (*PegawaiItemResponse, error)
	DeletePegawai(ctx context.Context, id uuid.UUID) error
	DeleteBatchPegawai(ctx context.Context, ids []uuid.UUID) error
	GetSyncHistory(ctx context.Context) ([]SIKSyncHistoryItem, error)
	TriggerSyncSIK(ctx context.Context, triggeredBy string) (*SIKSyncHistoryItem, error)
}

