CREATE TABLE IF NOT EXISTS penilaian_jawabans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    penugasan_id VARCHAR(50) NOT NULL REFERENCES penugasan_penilais(id) ON DELETE CASCADE,
    butir_id VARCHAR(50) NOT NULL REFERENCES butir_pertanyaans(id) ON DELETE CASCADE,
    skor INT NOT NULL CHECK (skor >= 1 AND skor <= 5),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jawabans_penugasan_id ON penilaian_jawabans(penugasan_id);

CREATE TABLE IF NOT EXISTS penilaian_jawaban_terbukas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    penugasan_id VARCHAR(50) NOT NULL REFERENCES penugasan_penilais(id) ON DELETE CASCADE,
    fokus_id VARCHAR(50) NOT NULL REFERENCES fokus_evaluasis(id) ON DELETE CASCADE,
    pertanyaan_id VARCHAR(50) NOT NULL,
    jawaban TEXT NOT NULL,
    kategori_hambatan VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jawabans_terbuka_penugasan_id ON penilaian_jawaban_terbukas(penugasan_id);

