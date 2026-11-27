CREATE TABLE IF NOT EXISTS periode_evaluasis (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    pelatihan_id VARCHAR(50) NOT NULL REFERENCES jenis_pelatihans(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Terjadwal',
    progress_percent DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alumni_evaluasis (
    id VARCHAR(50) PRIMARY KEY,
    periode_id VARCHAR(50) NOT NULL REFERENCES periode_evaluasis(id) ON DELETE CASCADE,
    pegawai_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pelatihan_id VARCHAR(50) NOT NULL REFERENCES jenis_pelatihans(id),
    selesai_lms_date VARCHAR(50),
    sharing_kms_status VARCHAR(50) DEFAULT 'Selesai',
    jatuh_tempo_date VARCHAR(50),
    is_penilai_lengkap BOOLEAN DEFAULT FALSE,
    status_penilai VARCHAR(50),
    bulan_pasca_pelatihan INT DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alumni_periode_id ON alumni_evaluasis(periode_id);
CREATE INDEX IF NOT EXISTS idx_alumni_pegawai_id ON alumni_evaluasis(pegawai_id);

CREATE TABLE IF NOT EXISTS penugasan_penilais (
    id VARCHAR(50) PRIMARY KEY,
    periode_id VARCHAR(50) NOT NULL REFERENCES periode_evaluasis(id) ON DELETE CASCADE,
    alumni_id VARCHAR(50) NOT NULL REFERENCES alumni_evaluasis(id) ON DELETE CASCADE,
    penilai_pegawai_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kategori VARCHAR(5) NOT NULL, -- 'D', 'A', 'R', 'B'
    kategori_label VARCHAR(100) NOT NULL,
    kanal VARCHAR(20) DEFAULT 'both',
    status VARCHAR(50) DEFAULT 'Belum dibuka',
    deadline TIMESTAMP WITH TIME ZONE,
    aktivitas_terakhir VARCHAR(100),
    pengingat_count INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_penugasan_alumni_id ON penugasan_penilais(alumni_id);
CREATE INDEX IF NOT EXISTS idx_penugasan_penilai_id ON penugasan_penilais(penilai_pegawai_id);
CREATE INDEX IF NOT EXISTS idx_penugasan_status ON penugasan_penilais(status);

