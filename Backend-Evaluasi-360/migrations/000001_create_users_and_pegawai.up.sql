CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nip VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'pegawai',
    jabatan VARCHAR(255),
    unit_kerja VARCHAR(255),
    phone VARCHAR(50),
    avatar_url VARCHAR(512),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_nip ON users(nip);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_unit_kerja ON users(unit_kerja);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS pegawai_relasis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pegawai_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_pegawai_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relasi_type VARCHAR(20) NOT NULL, -- ATASAN, REKAN, BAWAHAN
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_pegawai_relasi UNIQUE(pegawai_id, target_pegawai_id, relasi_type)
);

CREATE INDEX IF NOT EXISTS idx_pegawai_relasis_pegawai_id ON pegawai_relasis(pegawai_id);
CREATE INDEX IF NOT EXISTS idx_pegawai_relasis_target_id ON pegawai_relasis(target_pegawai_id);

