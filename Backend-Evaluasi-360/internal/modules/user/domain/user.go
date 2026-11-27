package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	RoleAdmin     UserRole = "admin"
	RolePegawai   UserRole = "pegawai"
	RoleEvaluator UserRole = "evaluator"
	RoleAlumni    UserRole = "alumni"
)

type User struct {
	ID           uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	NIP          string     `json:"nip" gorm:"column:nip;type:varchar(50);uniqueIndex;not null"`
	Email        string     `json:"email" gorm:"type:varchar(255);uniqueIndex;not null"`
	PasswordHash string     `json:"-" gorm:"type:varchar(255);not null"`
	FullName     string     `json:"full_name" gorm:"type:varchar(255);not null"`
	Role         UserRole   `json:"role" gorm:"type:varchar(50);not null;default:'pegawai'"`
	Jabatan      string     `json:"jabatan" gorm:"type:varchar(255)"`
	UnitKerja    string     `json:"unit_kerja" gorm:"type:varchar(255)"`
	Phone        string     `json:"phone" gorm:"type:varchar(50)"`
	AvatarURL    string     `json:"avatar_url" gorm:"type:varchar(512)"`
	Provider     string     `json:"provider" gorm:"-"`
	IsActive     bool       `json:"is_active" gorm:"type:boolean;default:true"`
	CreatedAt    time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty" gorm:"index"`
}

type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	NIP       string    `json:"nip"`
	Email     string    `json:"email"`
	FullName  string    `json:"full_name"`
	Role      UserRole  `json:"role"`
	Jabatan   string    `json:"jabatan"`
	UnitKerja string    `json:"unit_kerja"`
	Phone     string    `json:"phone"`
	AvatarURL string    `json:"avatar_url"`
	Provider  string    `json:"provider,omitempty"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		NIP:       u.NIP,
		Email:     u.Email,
		FullName:  u.FullName,
		Role:      u.Role,
		Jabatan:   u.Jabatan,
		UnitKerja: u.UnitKerja,
		Phone:     u.Phone,
		AvatarURL: u.AvatarURL,
		Provider:  u.Provider,
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
	}
}

type UpdateProfileRequest struct {
	FullName  string `json:"full_name" validate:"omitempty"`
	Phone     string `json:"phone" validate:"omitempty"`
	AvatarURL string `json:"avatar_url" validate:"omitempty"`
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	FindByNIP(ctx context.Context, nip string) (*User, error)
	Update(ctx context.Context, user *User) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, search string, limit, offset int) ([]User, int64, error)
}

type UserUsecase interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*UserResponse, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, req *UpdateProfileRequest) (*UserResponse, error)
	ListUsers(ctx context.Context, search string, limit, offset int) ([]UserResponse, int64, error)
}

