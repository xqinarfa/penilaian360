export interface RekapStats {
  alumniDievaluasi: number;
  alumniTotal: number;
  indeksRataRata: number;
  indeksKategori: string;
  tingkatPengisian: number;
  trenPengisian: string;
  periodeCount: number;
  periodeListStr: string;
}

export interface FokusEvaluasiItem {
  id: string;
  label: string;
  latsar: number;
  ecm: number;
  pka: number;
}

export interface HambatanItem {
  id: string;
  label: string;
  percentage: number;
  barWidthPercent: number;
}

export interface UnitKerjaHeatmapRow {
  id: string;
  unitKerja: string;
  relevansi: number;
  dukungan: number;
  sikap: number;
  ketepatan: number;
  manfaat: number;
  rataRata: number;
  alumniCount: number;
  isUnderThreshold?: boolean;
}

export interface AlumniHasilIndividu {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  periode: string;
  penilaiSelesai: number;
  penilaiTotal: number;
  indeks: number;
  kategoriNilai: "Sangat baik" | "Baik" | "Cukup" | "Kurang";
  status: "Selesai" | "Sebagian";
}

// Initial Mock Data
export const INITIAL_REKAP_STATS: RekapStats = {
  alumniDievaluasi: 223,
  alumniTotal: 248,
  indeksRataRata: 3.10,
  indeksKategori: "Baik",
  tingkatPengisian: 71.4,
  trenPengisian: "↑ 8,2%",
  periodeCount: 3,
  periodeListStr: "Latsar · ECM · PKA",
};

export const INITIAL_FOKUS_LIST: FokusEvaluasiItem[] = [
  {
    id: "fokus-1",
    label: "Relevansi & penerapan",
    latsar: 3.52,
    ecm: 3.28,
    pka: 3.12,
  },
  {
    id: "fokus-2",
    label: "Dukungan lingkungan",
    latsar: 2.88,
    ecm: 2.72,
    pka: 2.48,
  },
  {
    id: "fokus-3",
    label: "Sikap & perilaku kerja",
    latsar: 3.36,
    ecm: 3.20,
    pka: 3.04,
  },
  {
    id: "fokus-4",
    label: "Ketepatan waktu",
    latsar: 3.04,
    ecm: 2.88,
    pka: 2.80,
  },
  {
    id: "fokus-5",
    label: "Manfaat pelatihan",
    latsar: 3.20,
    ecm: 3.12,
    pka: 2.96,
  },
];

export const INITIAL_HAMBATAN_LIST: HambatanItem[] = [
  {
    id: "hambatan-1",
    label: "Tidak ada kesempatan menerapkan",
    percentage: 34,
    barWidthPercent: 100,
  },
  {
    id: "hambatan-2",
    label: "Beban kerja rutin tinggi",
    percentage: 27,
    barWidthPercent: 79,
  },
  {
    id: "hambatan-3",
    label: "Sarana / anggaran tidak tersedia",
    percentage: 18,
    barWidthPercent: 53,
  },
  {
    id: "hambatan-4",
    label: "Atasan kurang memberi ruang",
    percentage: 12,
    barWidthPercent: 35,
  },
  {
    id: "hambatan-5",
    label: "Lainnya",
    percentage: 9,
    barWidthPercent: 26,
  },
];

export const INITIAL_HEATMAP_DATA: UnitKerjaHeatmapRow[] = [
  {
    id: "unit-1",
    unitKerja: "Ditjen Perhubungan Laut",
    relevansi: 3.12,
    dukungan: 2.81,
    sikap: 3.30,
    ketepatan: 2.95,
    manfaat: 3.18,
    rataRata: 3.07,
    alumniCount: 64,
  },
  {
    id: "unit-2",
    unitKerja: "Ditjen Perhubungan Darat",
    relevansi: 3.04,
    dukungan: 2.48,
    sikap: 2.88,
    ketepatan: 3.10,
    manfaat: 3.08,
    rataRata: 2.92,
    alumniCount: 51,
  },
  {
    id: "unit-3",
    unitKerja: "BPSDM Perhubungan",
    relevansi: 3.31,
    dukungan: 3.15,
    sikap: 3.40,
    ketepatan: 3.08,
    manfaat: 3.29,
    rataRata: 3.25,
    alumniCount: 43,
  },
  {
    id: "unit-4",
    unitKerja: "Ditjen Perhubungan Udara",
    relevansi: 3.05,
    dukungan: 2.95,
    sikap: 3.15,
    ketepatan: 3.22,
    manfaat: 3.10,
    rataRata: 3.09,
    alumniCount: 38,
  },
  {
    id: "unit-5",
    unitKerja: "Sekretariat Jenderal",
    relevansi: 3.22,
    dukungan: 3.10,
    sikap: 3.35,
    ketepatan: 3.05,
    manfaat: 3.15,
    rataRata: 3.17,
    alumniCount: 27,
  },
  {
    id: "unit-6",
    unitKerja: "Inspektorat Jenderal",
    relevansi: 0,
    dukungan: 0,
    sikap: 0,
    ketepatan: 0,
    manfaat: 0,
    rataRata: 0,
    alumniCount: 2,
    isUnderThreshold: true,
  },
];

export const INITIAL_ALUMNI_INDIVIDU_LIST: AlumniHasilIndividu[] = [
  {
    id: "alumni-1",
    nama: "Dimas Prakoso",
    nip: "19960312 202203 1 004",
    jabatan: "Analis Kebijakan Ahli Pertama",
    periode: "Latsar CPNS Gel. II",
    penilaiSelesai: 5,
    penilaiTotal: 5,
    indeks: 3.10,
    kategoriNilai: "Baik",
    status: "Selesai",
  },
  {
    id: "alumni-2",
    nama: "Bambang Hartono",
    nip: "19850315 201001 1 003",
    jabatan: "Kepala Bagian Program",
    periode: "Latsar CPNS Gel. II",
    penilaiSelesai: 5,
    penilaiTotal: 5,
    indeks: 3.42,
    kategoriNilai: "Sangat baik",
    status: "Selesai",
  },
  {
    id: "alumni-3",
    nama: "Ayu Lestari",
    nip: "19950721 202203 2 011",
    jabatan: "Pranata Komputer Ahli Pertama",
    periode: "ECM Angkatan 4",
    penilaiSelesai: 4,
    penilaiTotal: 5,
    indeks: 2.95,
    kategoriNilai: "Baik",
    status: "Selesai",
  },
  {
    id: "alumni-4",
    nama: "Fajar Nugroho",
    nip: "19880510 202201 1 007",
    jabatan: "Kepala Subbagian Program",
    periode: "Latsar CPNS Gel. II",
    penilaiSelesai: 5,
    penilaiTotal: 5,
    indeks: 3.28,
    kategoriNilai: "Sangat baik",
    status: "Selesai",
  },
  {
    id: "alumni-5",
    nama: "Sri Wahyuni",
    nip: "19880618 201503 2 002",
    jabatan: "Perencana Ahli Muda",
    periode: "PKA Angkatan 2",
    penilaiSelesai: 3,
    penilaiTotal: 5,
    indeks: 2.82,
    kategoriNilai: "Baik",
    status: "Sebagian",
  },
  {
    id: "alumni-6",
    nama: "Nur Aini Rahmah",
    nip: "19931127 201903 2 006",
    jabatan: "Auditor Ahli Pertama",
    periode: "Pelatihan Teknis K3 Pelabuhan",
    penilaiSelesai: 5,
    penilaiTotal: 5,
    indeks: 3.18,
    kategoriNilai: "Baik",
    status: "Selesai",
  },
];
