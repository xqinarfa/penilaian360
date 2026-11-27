CREATE TABLE IF NOT EXISTS jenis_pelatihans (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    use_instrumen_inti BOOLEAN NOT NULL DEFAULT FALSE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fokus_evaluasis (
    id VARCHAR(50) PRIMARY KEY,
    pelatihan_id VARCHAR(50) REFERENCES jenis_pelatihans(id) ON DELETE SET NULL,
    number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_isian_terbuka BOOLEAN NOT NULL DEFAULT FALSE,
    bobot DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fokus_pelatihan_id ON fokus_evaluasis(pelatihan_id);

CREATE TABLE IF NOT EXISTS subdimensis (
    id VARCHAR(50) PRIMARY KEY,
    fokus_id VARCHAR(50) NOT NULL REFERENCES fokus_evaluasis(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subdimensi_fokus_id ON subdimensis(fokus_id);

CREATE TABLE IF NOT EXISTS indikators (
    id VARCHAR(50) PRIMARY KEY,
    subdimensi_id VARCHAR(50) NOT NULL REFERENCES subdimensis(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_indikator_subdimensi_id ON indikators(subdimensi_id);

CREATE TABLE IF NOT EXISTS butir_pertanyaans (
    id VARCHAR(50) PRIMARY KEY,
    indikator_id VARCHAR(50) REFERENCES indikators(id) ON DELETE SET NULL,
    fokus_id VARCHAR(50) NOT NULL REFERENCES fokus_evaluasis(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    text TEXT NOT NULL,
    agenda_hint TEXT,
    categories VARCHAR(50) NOT NULL, -- 'D,A,R,B'
    is_open_ended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_butir_fokus_id ON butir_pertanyaans(fokus_id);
CREATE INDEX IF NOT EXISTS idx_butir_indikator_id ON butir_pertanyaans(indikator_id);

