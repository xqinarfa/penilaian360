export type SelisihType = "pos-high" | "pos-low" | "neutral" | "neg";

export interface RadarFokusScore {
  id: string;
  label: string;
  shortLabel: string;
  diri: number;
  pihakLain: number;
}

export interface RincianFokusItem {
  id: string;
  fokus: string;
  diri: number;
  atasan: number;
  rekan: number | null;
  bawahan: number | null;
  rekanBawahan?: number | null;
  pihakLain: number;
  selisih: number;
  selisihType: SelisihType;
}

export interface KutipanHambatanItem {
  id: string;
  kutipan: string;
  sumber: string;
}

export interface AlumniDetailData {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  periode: string;
  penilaiSelesai: number;
  penilaiTotal: number;
  indeksPihakLain: number;
  kategoriPihakLain: string;
  penilaianDiri: number;
  selisihDiriVsPihakLain: number;
  rataRataAngkatan: number;
  persentilAngkatan: number;
  terakhirDiperbarui: string;
  radarScores: RadarFokusScore[];
  rincianFokus: RincianFokusItem[];
  kutipanHambatan: KutipanHambatanItem[];
}

export const INITIAL_DIMAS_PRAKOSO_DATA: AlumniDetailData = {
  id: "1",
  nama: "Dimas Prakoso",
  nip: "19940812 202203 1 002",
  jabatan: "Penata Kelola Pelayaran",
  unitKerja: "BPTD Wilayah XIII Bali & NTB",
  periode: "EPP Latsar CPNS Gelombang II",
  penilaiSelesai: 3,
  penilaiTotal: 5,
  indeksPihakLain: 3.10,
  kategoriPihakLain: "Baik",
  penilaianDiri: 3.40,
  selisihDiriVsPihakLain: 0.30,
  rataRataAngkatan: 3.05,
  persentilAngkatan: 58,
  terakhirDiperbarui: "5 menit lalu",
  radarScores: [
    {
      id: "f1",
      label: "Relevansi & penerapan",
      shortLabel: "Relevansi",
      diri: 3.50,
      pihakLain: 3.00,
    },
    {
      id: "f2",
      label: "Dukungan",
      shortLabel: "Dukungan",
      diri: 3.40,
      pihakLain: 3.00,
    },
    {
      id: "f3",
      label: "Sikap & perilaku",
      shortLabel: "Sikap",
      diri: 3.33,
      pihakLain: 3.25,
    },
    {
      id: "f4",
      label: "Ketepatan waktu",
      shortLabel: "Ketepatan",
      diri: 3.50,
      pihakLain: 3.00,
    },
    {
      id: "f5",
      label: "Manfaat",
      shortLabel: "Manfaat",
      diri: 3.25,
      pihakLain: 3.25,
    },
  ],
  rincianFokus: [
    {
      id: "rf-1",
      fokus: "Relevansi dan penerapan materi",
      diri: 3.50,
      atasan: 3.00,
      rekan: null,
      bawahan: null,
      rekanBawahan: null,
      pihakLain: 3.00,
      selisih: 0.50,
      selisihType: "pos-high",
    },
    {
      id: "rf-2",
      fokus: "Dukungan lingkungan kerja",
      diri: 3.40,
      atasan: 3.00,
      rekan: null,
      bawahan: null,
      rekanBawahan: null,
      pihakLain: 3.00,
      selisih: 0.40,
      selisihType: "pos-high",
    },
    {
      id: "rf-3",
      fokus: "Sikap dan perilaku kerja",
      diri: 3.33,
      atasan: 3.25,
      rekan: null,
      bawahan: null,
      rekanBawahan: null,
      pihakLain: 3.25,
      selisih: 0.08,
      selisihType: "pos-low",
    },
    {
      id: "rf-4",
      fokus: "Ketepatan waktu",
      diri: 3.50,
      atasan: 3.00,
      rekan: null,
      bawahan: null,
      rekanBawahan: null,
      pihakLain: 3.00,
      selisih: 0.50,
      selisihType: "pos-high",
    },
    {
      id: "rf-5",
      fokus: "Manfaat pelatihan",
      diri: 3.25,
      atasan: 3.25,
      rekan: null,
      bawahan: null,
      rekanBawahan: null,
      pihakLain: 3.25,
      selisih: 0.00,
      selisihType: "neutral",
    },
  ],
  kutipanHambatan: [
    {
      id: "h-1",
      kutipan:
        "Belum ada kesempatan memimpin rapat koordinasi sehingga materi komunikasi efektif belum banyak dipraktikkan.",
      sumber: "Diri sendiri",
    },
    {
      id: "h-2",
      kutipan:
        "Beban administrasi akhir tahun tinggi; perlu penugasan proyek kecil agar hasil pelatihan terpakai.",
      sumber: "Atasan",
    },
  ],
};
