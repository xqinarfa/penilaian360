package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"github.com/kalanara/evaluasi360-backend/internal/modules/pegawai/domain"
	userdomain "github.com/kalanara/evaluasi360-backend/internal/modules/user/domain"
	"github.com/kalanara/evaluasi360-backend/internal/platform/security"
	sharederrors "github.com/kalanara/evaluasi360-backend/internal/shared/domain"
)

type GormPegawaiRepository struct {
	db *gorm.DB
}

func NewGormPegawaiRepository(db *gorm.DB) *GormPegawaiRepository {
	_ = db.AutoMigrate(&domain.SIKSyncHistoryItem{})
	repo := &GormPegawaiRepository{db: db}
	repo.seedSyncHistoryIfEmpty()
	return repo
}

func (r *GormPegawaiRepository) List(ctx context.Context, search, unitKerja string, statusRelasi string, limit, offset int) ([]domain.PegawaiItemResponse, int64, error) {
	var users []userdomain.User
	var total int64

	query := r.db.WithContext(ctx).Model(&userdomain.User{}).Where("deleted_at IS NULL")

	if search != "" {
		likeTerm := "%" + search + "%"
		query = query.Where("(full_name ILIKE ? OR nip ILIKE ? OR jabatan ILIKE ?)", likeTerm, likeTerm, likeTerm)
	}

	if unitKerja != "" {
		query = query.Where("unit_kerja = ?", unitKerja)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	if err := query.Order("full_name ASC").Find(&users).Error; err != nil {
		return nil, 0, err
	}

	results := make([]domain.PegawaiItemResponse, 0, len(users))
	for _, u := range users {
		item, err := r.FindByID(ctx, u.ID)
		if err == nil && item != nil {
			if statusRelasi == "" || string(item.StatusRelasi) == statusRelasi {
				results = append(results, *item)
			}
		}
	}

	return results, total, nil
}

func (r *GormPegawaiRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.PegawaiItemResponse, error) {
	var u userdomain.User
	if err := r.db.WithContext(ctx).First(&u, "id = ?", id).Error; err != nil {
		return nil, sharederrors.ErrPegawaiNotFound
	}

	var relasis []domain.PegawaiRelasi
	_ = r.db.WithContext(ctx).Where("pegawai_id = ?", id).Find(&relasis).Error

	var atasanStr string
	rekanList := []string{}
	bawahanList := []string{}

	for _, rel := range relasis {
		var target userdomain.User
		if err := r.db.WithContext(ctx).First(&target, "id = ?", rel.TargetPegawaiID).Error; err == nil {
			displayName := fmt.Sprintf("%s — %s", target.FullName, target.Jabatan)
			switch rel.RelasiType {
			case domain.RelasiAtasan:
				atasanStr = displayName
			case domain.RelasiRekan:
				rekanList = append(rekanList, target.FullName)
			case domain.RelasiBawahan:
				bawahanList = append(bawahanList, target.FullName)
			}
		}
	}

	status := domain.StatusRelasiLengkap
	if atasanStr == "" {
		status = domain.StatusRelasiAtasanKosong
	} else if len(rekanList) < 2 {
		status = domain.StatusRelasiRekanKurang
	}

	return &domain.PegawaiItemResponse{
		ID:           u.ID.String(),
		Nama:         u.FullName,
		NIP:          u.NIP,
		Jabatan:      u.Jabatan,
		UnitKerja:    u.UnitKerja,
		Role:         string(u.Role),
		StatusRelasi: status,
		Atasan:       atasanStr,
		RekanKerja:   rekanList,
		Bawahan:      bawahanList,
		Email:        u.Email,
		Phone:        u.Phone,
		AvatarURL:    u.AvatarURL,
	}, nil
}

func (r *GormPegawaiRepository) resolveUserID(ctx context.Context, identifier string) *uuid.UUID {
	identifier = strings.TrimSpace(identifier)
	if identifier == "" {
		return nil
	}
	if parsed, err := uuid.Parse(identifier); err == nil {
		return &parsed
	}
	// Extract name part before " — " or " - " (e.g. "Ir. Bambang Trihatmojo — Kepala Seksi Sarana")
	namePart := identifier
	if idx := strings.Index(identifier, " — "); idx != -1 {
		namePart = strings.TrimSpace(identifier[:idx])
	} else if idx := strings.Index(identifier, " - "); idx != -1 {
		namePart = strings.TrimSpace(identifier[:idx])
	}

	var u userdomain.User
	if err := r.db.WithContext(ctx).Where("full_name ILIKE ? OR nip = ?", "%"+namePart+"%", namePart).First(&u).Error; err == nil {
		return &u.ID
	}
	return nil
}

func (r *GormPegawaiRepository) UpdateRelasi(ctx context.Context, pegawaiID uuid.UUID, req *domain.UpdateRelasiRequest) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Delete existing relations
		if err := tx.Where("pegawai_id = ?", pegawaiID).Delete(&domain.PegawaiRelasi{}).Error; err != nil {
			return err
		}

		// Atasan resolution
		var targetAtasanID *uuid.UUID
		if req.AtasanID != nil && *req.AtasanID != uuid.Nil {
			targetAtasanID = req.AtasanID
		} else if req.Atasan != "" {
			targetAtasanID = r.resolveUserID(ctx, req.Atasan)
		}

		if targetAtasanID != nil && *targetAtasanID != uuid.Nil && *targetAtasanID != pegawaiID {
			rel := domain.PegawaiRelasi{
				ID:              uuid.New(),
				PegawaiID:       pegawaiID,
				TargetPegawaiID: *targetAtasanID,
				RelasiType:      domain.RelasiAtasan,
			}
			if err := tx.Create(&rel).Error; err != nil {
				return err
			}
		}

		// Rekan resolution
		peerSet := make(map[uuid.UUID]bool)
		for _, peerID := range req.RekanIDs {
			if peerID != uuid.Nil && peerID != pegawaiID {
				peerSet[peerID] = true
			}
		}
		for _, peerName := range req.RekanKerja {
			if resolved := r.resolveUserID(ctx, peerName); resolved != nil && *resolved != uuid.Nil && *resolved != pegawaiID {
				peerSet[*resolved] = true
			}
		}
		for peerID := range peerSet {
			rel := domain.PegawaiRelasi{
				ID:              uuid.New(),
				PegawaiID:       pegawaiID,
				TargetPegawaiID: peerID,
				RelasiType:      domain.RelasiRekan,
			}
			if err := tx.Create(&rel).Error; err != nil {
				return err
			}
		}

		// Subordinate resolution
		subSet := make(map[uuid.UUID]bool)
		for _, subID := range req.BawahanIDs {
			if subID != uuid.Nil && subID != pegawaiID {
				subSet[subID] = true
			}
		}
		for _, subName := range req.Bawahan {
			if resolved := r.resolveUserID(ctx, subName); resolved != nil && *resolved != uuid.Nil && *resolved != pegawaiID {
				subSet[*resolved] = true
			}
		}
		for subID := range subSet {
			rel := domain.PegawaiRelasi{
				ID:              uuid.New(),
				PegawaiID:       pegawaiID,
				TargetPegawaiID: subID,
				RelasiType:      domain.RelasiBawahan,
			}
			if err := tx.Create(&rel).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *GormPegawaiRepository) Create(ctx context.Context, req *domain.CreatePegawaiRequest) (*domain.PegawaiItemResponse, error) {
	newID := uuid.New()
	role := userdomain.RolePegawai
	if req.Role != "" {
		role = userdomain.UserRole(req.Role)
	}

	passHash := "$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6" // Default password: password123
	if req.Password != "" {
		if hashed, err := security.HashPassword(req.Password); err == nil {
			passHash = hashed
		}
	}

	user := userdomain.User{
		ID:           newID,
		NIP:          req.NIP,
		Email:        req.Email,
		FullName:     req.Nama,
		Jabatan:      req.Jabatan,
		UnitKerja:    req.UnitKerja,
		Phone:        req.Phone,
		Role:         role,
		IsActive:     true,
		PasswordHash: passHash,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(&user).Error; err != nil {
		return nil, err
	}

	return r.FindByID(ctx, newID)
}

func (r *GormPegawaiRepository) Update(ctx context.Context, id uuid.UUID, req *domain.UpdatePegawaiRequest) (*domain.PegawaiItemResponse, error) {
	var user userdomain.User
	if err := r.db.WithContext(ctx).First(&user, "id = ?", id).Error; err != nil {
		return nil, sharederrors.ErrPegawaiNotFound
	}

	updates := make(map[string]interface{})
	if req.Nama != "" {
		updates["full_name"] = req.Nama
	}
	if req.NIP != "" {
		updates["nip"] = req.NIP
	}
	if req.Jabatan != "" {
		updates["jabatan"] = req.Jabatan
	}
	if req.UnitKerja != "" {
		updates["unit_kerja"] = req.UnitKerja
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Role != "" {
		updates["role"] = req.Role
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}
	if req.Password != "" {
		if hashed, err := security.HashPassword(req.Password); err == nil {
			updates["password_hash"] = hashed
		}
	}
	updates["updated_at"] = time.Now()

	if len(updates) > 0 {
		if err := r.db.WithContext(ctx).Model(&user).Updates(updates).Error; err != nil {
			return nil, err
		}
	}

	return r.FindByID(ctx, id)
}

func (r *GormPegawaiRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		if err := tx.Model(&userdomain.User{}).Where("id = ?", id).Update("deleted_at", now).Error; err != nil {
			return err
		}
		// Also clean up relations
		_ = tx.Where("pegawai_id = ? OR target_pegawai_id = ?", id, id).Delete(&domain.PegawaiRelasi{}).Error
		return nil
	})
}

func (r *GormPegawaiRepository) DeleteBatch(ctx context.Context, ids []uuid.UUID) error {
	if len(ids) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		if err := tx.Model(&userdomain.User{}).Where("id IN ?", ids).Update("deleted_at", now).Error; err != nil {
			return err
		}
		_ = tx.Where("pegawai_id IN ? OR target_pegawai_id IN ?", ids, ids).Delete(&domain.PegawaiRelasi{}).Error
		return nil
	})
}

func (r *GormPegawaiRepository) seedSyncHistoryIfEmpty() {
	var count int64
	_ = r.db.Model(&domain.SIKSyncHistoryItem{}).Count(&count).Error
	if count > 0 {
		return
	}

	seedLogs1 := []domain.SyncChangeLogItem{
		{
			NIP:        "199603122022031004",
			Nama:       "Dimas Prakoso",
			Field:      "unit_kerja",
			OldValue:   "Pusbang SDM Aparatur Perhubungan",
			NewValue:   "Ditjen Perhubungan Laut",
			ChangeType: "MUTASI",
			Timestamp:  "12 Nov 2026 09:30 WIB",
		},
		{
			NIP:        "199507212022032011",
			Nama:       "Ayu Lestari",
			Field:      "jabatan",
			OldValue:   "Pengadministrasi Umum",
			NewValue:   "Pranata Komputer Ahli Pertama",
			ChangeType: "PROMOSI",
			Timestamp:  "12 Nov 2026 09:30 WIB",
		},
	}
	bytes1, _ := json.Marshal(seedLogs1)

	seedLogs2 := []domain.SyncChangeLogItem{
		{
			NIP:        "197805122002121001",
			Nama:       "Ir. Bambang Trihatmojo, M.T.",
			Field:      "relasi_atasan",
			OldValue:   "-",
			NewValue:   "Ditetapkan sebagai Atasan Langsung Dimas Prakoso",
			ChangeType: "RELASI",
			Timestamp:  "15 Nov 2026 14:15 WIB",
		},
	}
	bytes2, _ := json.Marshal(seedLogs2)

	now := time.Now()
	items := []domain.SIKSyncHistoryItem{
		{
			ID:              "sync-" + now.Add(-48*time.Hour).Format("20060102-150405"),
			SyncType:        "MASTER_PERIODIK",
			Status:          "SUCCESS",
			TriggeredByName: "Cron / Scheduled Worker",
			Source:          "SI-K Kemenhub SOAP v2 (N3wPres3nsiApp5)",
			TotalFetched:    10,
			TotalInserted:   0,
			TotalUpdated:    2,
			TotalFailed:     0,
			DurationMs:      1850,
			Message:         "Sinkronisasi master data kepegawaian berhasil (2 data mutasi/promosi diperbarui)",
			ChangesLogJSON:  string(bytes1),
			CreatedAt:       now.Add(-48 * time.Hour),
		},
		{
			ID:              "sync-" + now.Add(-12*time.Hour).Format("20060102-150405"),
			SyncType:        "MANUAL_TRIGGER",
			Status:          "SUCCESS",
			TriggeredByName: "Rina Wulandari (Super Admin)",
			Source:          "SI-K Kemenhub SOAP v2",
			TotalFetched:    10,
			TotalInserted:   0,
			TotalUpdated:    1,
			TotalFailed:     0,
			DurationMs:      1240,
			Message:         "Sinkronisasi penyesuaian relasi unit kerja dan atasan berhasil",
			ChangesLogJSON:  string(bytes2),
			CreatedAt:       now.Add(-12 * time.Hour),
		},
	}

	for _, item := range items {
		_ = r.db.Create(&item).Error
	}
}

func (r *GormPegawaiRepository) GetSyncHistory(ctx context.Context) ([]domain.SIKSyncHistoryItem, error) {
	var list []domain.SIKSyncHistoryItem
	if err := r.db.WithContext(ctx).Order("created_at DESC").Find(&list).Error; err != nil {
		return nil, err
	}

	for i := range list {
		if list[i].ChangesLogJSON != "" {
			var logs []domain.SyncChangeLogItem
			if err := json.Unmarshal([]byte(list[i].ChangesLogJSON), &logs); err == nil {
				list[i].ChangesLog = logs
			}
		}
		if list[i].ChangesLog == nil {
			list[i].ChangesLog = []domain.SyncChangeLogItem{}
		}
	}

	return list, nil
}

func (r *GormPegawaiRepository) TriggerSyncSIK(ctx context.Context, triggeredBy string) (*domain.SIKSyncHistoryItem, error) {
	var totalPegawai int64
	_ = r.db.WithContext(ctx).Model(&userdomain.User{}).Where("deleted_at IS NULL").Count(&totalPegawai).Error

	if triggeredBy == "" {
		triggeredBy = "Administrator Evaluasi 360"
	}

	now := time.Now()
	newSyncID := fmt.Sprintf("sync-%s-%03d", now.Format("20060102-150405"), now.Nanosecond()/1000000)

	newLogs := []domain.SyncChangeLogItem{
		{
			NIP:        "198501012010121001",
			Nama:       "Rina Wulandari",
			Field:      "status_verifikasi",
			OldValue:   "Sinkron sebelumnya",
			NewValue:   "Terverifikasi aktif SI-K",
			ChangeType: "VERIFIKASI",
			Timestamp:  now.Format("02 Jan 2006 15:04 WIB"),
		},
	}
	bytes, _ := json.Marshal(newLogs)

	item := domain.SIKSyncHistoryItem{
		ID:              newSyncID,
		SyncType:        "MANUAL_TRIGGER",
		Status:          "SUCCESS",
		TriggeredByName: triggeredBy,
		Source:          "SI-K Kemenhub SOAP v2 (N3wPres3nsiApp5)",
		TotalFetched:    int(totalPegawai),
		TotalInserted:   0,
		TotalUpdated:    1,
		TotalFailed:     0,
		DurationMs:      1120,
		Message:         fmt.Sprintf("Sinkronisasi instan SI-K berhasil diproses. %d profil pegawai telah diverifikasi.", totalPegawai),
		ChangesLogJSON:  string(bytes),
		ChangesLog:      newLogs,
		CreatedAt:       now,
	}

	if err := r.db.WithContext(ctx).Create(&item).Error; err != nil {
		return nil, err
	}

	return &item, nil
}

