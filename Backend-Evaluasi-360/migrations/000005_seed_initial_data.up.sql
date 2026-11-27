-- Seed Initial Users (Dimas Prakoso, Admin, Evaluators)
-- Password for all seed users is: password123
INSERT INTO users (id, nip, email, password_hash, full_name, role, jabatan, unit_kerja, phone, is_active)
VALUES 
('a0000000-0000-0000-0000-000000000001', '198501012010121001', 'rina.admin@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Rina Wulandari', 'admin', 'Super Administrator BPSDM', 'BPSDM Perhubungan', '+62 811-2233-4455', true),
('a0000000-0000-0000-0000-000000000002', '199603122022031004', 'dimas.prakoso@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Dimas Prakoso', 'alumni', 'Analis Kebijakan Ahli Pertama', 'Ditjen Perhubungan Laut', '+62 812-9876-5432', true),
('a0000000-0000-0000-0000-000000000003', '197805122002121001', 'bambang.t@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Ir. Bambang Trihatmojo, M.T.', 'evaluator', 'Kepala Seksi Sarana', 'Ditjen Perhubungan Laut', '+62 812-3456-7890', true),
('a0000000-0000-0000-0000-000000000004', '199508112020122002', 'siti.rahmawati@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Siti Rahmawati, S.T.', 'evaluator', 'Staf Teknis Pelayaran', 'Ditjen Perhubungan Laut', '+62 813-1122-3344', true),
('a0000000-0000-0000-0000-000000000005', '199403012019031003', 'ahmad.fauzi@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Ahmad Fauzi, S.Kom.', 'evaluator', 'Pranata Komputer', 'Ditjen Perhubungan Laut', '+62 813-5566-7788', true),
('a0000000-0000-0000-0000-000000000006', '199912042023011002', 'rian.ardiansyah@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Rian Ardiansyah, A.Md.', 'evaluator', 'Pengelola Bahan Pelatihan', 'Ditjen Perhubungan Laut', '+62 815-9988-7766', true),
('a0000000-0000-0000-0000-000000000007', '199507212022032011', 'ayu.lestari@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Ayu Lestari', 'pegawai', 'Pranata Komputer Ahli Pertama', 'BPSDM Perhubungan', '+62 818-4455-6677', true),
('a0000000-0000-0000-0000-000000000008', '198805102022011007', 'fajar.nugroho@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Fajar Nugroho', 'pegawai', 'Kepala Subbagian Program', 'BPSDM Perhubungan', '+62 819-2233-1122', true),
('a0000000-0000-0000-0000-000000000009', '198806182015032002', 'sri.wahyuni@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Sri Wahyuni', 'pegawai', 'Perencana Ahli Muda', 'Ditjen Perhubungan Darat', '+62 812-7788-9900', true),
('a0000000-0000-0000-0000-000000000010', '199707032022031009', 'hendra.saputra@kemenhub.go.id', '$2b$12$U24bnnKmQC3DjibyAeOf..NgOB/iGGG6tGNhefTUEdxpTN5kkvyb6', 'Hendra Saputra', 'pegawai', 'Analis SDM Aparatur Ahli Pertama', 'Sekretariat Jenderal', '+62 813-4433-2211', true)
ON CONFLICT (nip) DO NOTHING;

-- Seed Relasi Kerja Dimas Prakoso, Ayu Lestari, Fajar Nugroho, Hendra Saputra
INSERT INTO pegawai_relasis (pegawai_id, target_pegawai_id, relasi_type)
VALUES
-- Dimas Prakoso (Lengkap)
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'ATASAN'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'REKAN'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'REKAN'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'BAWAHAN'),
-- Ayu Lestari (Rekan kurang)
('a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008', 'ATASAN'),
('a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000010', 'REKAN'),
-- Fajar Nugroho (Lengkap)
('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'ATASAN'),
('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000005', 'REKAN'),
('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', 'REKAN'),
('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000007', 'BAWAHAN'),
-- Hendra Saputra (Lengkap)
('a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000003', 'ATASAN'),
('a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000007', 'REKAN'),
('a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000006', 'REKAN')
ON CONFLICT DO NOTHING;

-- Seed Jenis Pelatihan
INSERT INTO jenis_pelatihans (id, nama, use_instrumen_inti, deskripsi)
VALUES
('pel-1', 'Latsar CPNS', false, 'Pelatihan Dasar Calon Pegawai Negeri Sipil'),
('pel-2', 'Coaching & Mentoring (ECM)', false, 'Executive Coaching & Mentoring Angkatan Kemenhub'),
('pel-3', 'Pelatihan Kepemimpinan Administrator', true, 'PKA untuk Eselon III / Administrator'),
('pel-4', 'Pelatihan Teknis Umum', true, 'Pelatihan Teknis Fungsional dan Substantif')
ON CONFLICT (id) DO NOTHING;

-- Seed Fokus Evaluasi
INSERT INTO fokus_evaluasis (id, pelatihan_id, number, title, is_isian_terbuka, bobot)
VALUES
('fokus-1', 'pel-1', 1, '1. Relevansi dan penerapan materi', false, 1.0),
('fokus-2', 'pel-1', 2, '2. Peningkatan kinerja individu', false, 1.0),
('fokus-3', 'pel-1', 3, '3. Dukungan lingkungan dan unit kerja', false, 1.0),
('fokus-4', 'pel-1', 4, '4. Sikap, komitmen dan ketepatan waktu', false, 1.0),
('fokus-5', 'pel-1', 5, '5. Manfaat pelatihan bagi organisasi', false, 1.0),
('fokus-6', 'pel-1', 6, '6. Hambatan & saran perbaikan (Isian Terbuka)', true, 0.0)
ON CONFLICT (id) DO NOTHING;

-- Seed Subdimensi
INSERT INTO subdimensis (id, fokus_id, code, title)
VALUES
('sub-1-1', 'fokus-1', '1.1', 'Kesempatan penerapan materi pelatihan'),
('sub-1-2', 'fokus-1', '1.2', 'Kontribusi materi terhadap percepatan kerja'),
('sub-2-1', 'fokus-2', '2.1', 'Kualitas output pekerjaan setelah pelatihan'),
('sub-3-1', 'fokus-3', '3.1', 'Dukungan fasilitas dan atasan di unit kerja'),
('sub-4-1', 'fokus-4', '4.1', 'Disiplin dan kepatuhan SOP kerja')
ON CONFLICT (id) DO NOTHING;

-- Seed Indikator
INSERT INTO indikators (id, subdimensi_id, code, title)
VALUES
('ind-1-1-1', 'sub-1-1', '1.1.1', 'Ketersediaan penugasan yang relevan dengan modul pelatihan'),
('ind-1-2-1', 'sub-1-2', '1.2.1', 'Dukungan materi terhadap pencapaian SKP / target organisasi'),
('ind-2-1-1', 'sub-2-1', '2.1.1', 'Peningkatan akurasi dan kecepatan layanan kerja'),
('ind-3-1-1', 'sub-3-1', '3.1.1', 'Ketersediaan sarana pendukung penerapan kompetensi'),
('ind-4-1-1', 'sub-4-1', '4.1.1', 'Konsistensi etos kerja dan integritas')
ON CONFLICT (id) DO NOTHING;

-- Seed Butir Pertanyaan Likert (D, A, R, B)
INSERT INTO butir_pertanyaans (id, indikator_id, fokus_id, code, text, agenda_hint, categories, is_open_ended)
VALUES
('butir-1-1-1-1', 'ind-1-1-1', 'fokus-1', '1.1.1.1', 'Tersedianya pekerjaan atau tugas yang memungkinkan penggunaan hasil pelatihan.', 'Pengetahuan atau keterampilan telah diterapkan dalam pekerjaan.', 'D,A,R,B', false),
('butir-1-1-1-2', 'ind-1-1-1', 'fokus-1', '1.1.1.2', 'Alumni mampu mengidentifikasi peluang penerapan lanjutan di unit kerja.', 'Penerapan inovasi secara mandiri.', 'D,A', false),
('butir-1-2-1-1', 'ind-1-2-1', 'fokus-1', '1.2.1.1', 'Materi pelatihan secara langsung mempercepat penyelesaian target kerja.', 'Efisiensi waktu kerja.', 'D,A,R,B', false),
('butir-2-1-1-1', 'ind-2-1-1', 'fokus-2', '2.1.1.1', 'Kualitas hasil kerja alumni meningkat signifikan setelah mengikuti pelatihan.', 'Hasil output lebih rapi dan presisi.', 'D,A,R,B', false),
('butir-3-1-1-1', 'ind-3-1-1', 'fokus-3', '3.1.1.1', 'Lingkungan kerja dan pimpinan memberikan keleluasaan dalam berinovasi.', 'Dukungan moril dan fasilitas.', 'D,A,R', false),
('butir-4-1-1-1', 'ind-4-1-1', 'fokus-4', '4.1.1.1', 'Alumni menunjukkan kedisiplinan dan komitmen tinggi dalam menyelesaikan tugas.', 'Ketaatan waktu dan integritas.', 'D,A,R,B', false),
('butir-6-open-1', NULL, 'fokus-6', '6.1', 'Kendala atau hambatan utama yang dihadapi dalam menerapkan hasil pelatihan di unit kerja Anda:', NULL, 'D,A,R,B', true),
('butir-6-open-2', NULL, 'fokus-6', '6.2', 'Saran perbaikan untuk peningkatan kurikulum dan penyelenggaraan pelatihan di masa mendatang:', NULL, 'D,A,R,B', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Periode Evaluasi
INSERT INTO periode_evaluasis (id, nama, pelatihan_id, start_date, end_date, status, progress_percent)
VALUES
('periode-1', 'Latsar CPNS Gel. II', 'pel-1', '2026-10-01 00:00:00+07', '2026-10-21 23:59:59+07', 'Berjalan', 71.4),
('periode-2', 'Coaching & Mentoring (ECM) Angkatan 4', 'pel-2', '2026-10-15 00:00:00+07', '2026-11-05 23:59:59+07', 'Berjalan', 45.0),
('periode-3', 'PKA Angkatan 2 2026', 'pel-3', '2026-11-01 00:00:00+07', '2026-11-25 23:59:59+07', 'Terjadwal', 0.0)
ON CONFLICT (id) DO NOTHING;

-- Seed Alumni Evaluasi
INSERT INTO alumni_evaluasis (id, periode_id, pegawai_id, pelatihan_id, selesai_lms_date, sharing_kms_status, jatuh_tempo_date, is_penilai_lengkap, status_penilai, bulan_pasca_pelatihan)
VALUES
('alm-1', 'periode-1', 'a0000000-0000-0000-0000-000000000002', 'pel-1', '14 Apr 2026', 'Selesai', '14 Okt 2026', true, '5 ditetapkan', 6),
('alm-2', 'periode-2', 'a0000000-0000-0000-0000-000000000007', 'pel-2', '16 Apr 2026', 'Selesai', '16 Okt 2026', false, 'Belum lengkap', 6),
('alm-3', 'periode-1', 'a0000000-0000-0000-0000-000000000008', 'pel-1', '18 Apr 2026', 'Selesai', '18 Okt 2026', true, '5 ditetapkan', 6)
ON CONFLICT (id) DO NOTHING;

-- Seed Penugasan Penilai untuk Dimas Prakoso (alm-1)
INSERT INTO penugasan_penilais (id, periode_id, alumni_id, penilai_pegawai_id, kategori, kategori_label, kanal, status, deadline, aktivitas_terakhir, pengingat_count)
VALUES
('penilai-1', 'periode-1', 'alm-1', 'a0000000-0000-0000-0000-000000000002', 'D', 'Diri Sendiri (Self)', 'mail', 'Selesai', '2026-10-21 23:59:59+07', '3 Okt 2026, 09.12', 0),
('penilai-2', 'periode-1', 'alm-1', 'a0000000-0000-0000-0000-000000000003', 'A', 'Atasan Langsung', 'both', 'Selesai', '2026-10-21 23:59:59+07', '4 Okt 2026, 15.40', 0),
('penilai-3', 'periode-1', 'alm-1', 'a0000000-0000-0000-0000-000000000004', 'R', 'Rekan Kerja (Peer)', 'mail', 'Sedang mengisi', '2026-10-21 23:59:59+07', '8 Okt 2026, 10.03', 1),
('penilai-4', 'periode-1', 'alm-1', 'a0000000-0000-0000-0000-000000000005', 'R', 'Rekan Kerja (Peer)', 'both', 'Belum dibuka', '2026-10-21 23:59:59+07', '—', 2),
('penilai-5', 'periode-1', 'alm-1', 'a0000000-0000-0000-0000-000000000006', 'B', 'Bawahan Langsung', 'wa', 'Belum dibuka', '2026-10-21 23:59:59+07', '—', 0)
ON CONFLICT (id) DO NOTHING;

