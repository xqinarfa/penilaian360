export type KategoriPenilai = "D" | "A" | "R" | "B";
export type StatusPenilai = "Selesai" | "Sedang mengisi" | "Belum dibuka";
export type KanalKomunikasi = "mail" | "wa" | "both";

export interface PenilaiItem {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  kategori: KategoriPenilai;
  kategoriLabel: string;
  kanal: KanalKomunikasi;
  status: StatusPenilai;
  aktivitasTerakhir: string;
  pengingatCount?: number;
  avatarText: string;
}

export interface AlumniProfile {
  nama: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  avatarText: string;
  lulusLms: string;
  sharingKms: string;
  masaPengisian: string;
  periodeNama: string;
}

export interface CandidatePegawai {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  avatarText: string;
}

export const INITIAL_ALUMNI: AlumniProfile = {
  nama: "Dimas Prakoso",
  nip: "19960312 202203 1 004",
  jabatan: "Analis Kebijakan Ahli Pertama",
  unitKerja: "Ditjen Perhubungan Laut",
  avatarText: "DP",
  lulusLms: "14 Apr 2026",
  sharingKms: "22 Apr 2026",
  masaPengisian: "1–21 Okt 2026",
  periodeNama: "Latsar CPNS Gel. II",
};

export const INITIAL_PENILAI_LIST: PenilaiItem[] = [
  {
    id: "penilai-1",
    nama: "Diri sendiri",
    nip: "19960312 202203 1 004",
    jabatan: "Dimas Prakoso (alumni)",
    kategori: "D",
    kategoriLabel: "Diri sendiri",
    kanal: "mail",
    status: "Selesai",
    aktivitasTerakhir: "3 Okt 2026, 09.12",
    avatarText: "DP",
  },
  {
    id: "penilai-2",
    nama: "Bambang Hartono",
    nip: "19810415 200501 1 002",
    jabatan: "Kepala Bagian Program",
    kategori: "A",
    kategoriLabel: "Atasan",
    kanal: "both",
    status: "Selesai",
    aktivitasTerakhir: "4 Okt 2026, 15.40",
    avatarText: "BH",
  },
  {
    id: "penilai-3",
    nama: "Lukman Hakim",
    nip: "19940822 201902 1 003",
    jabatan: "Analis Kebijakan",
    kategori: "R",
    kategoriLabel: "Rekan kerja",
    kanal: "mail",
    status: "Sedang mengisi",
    aktivitasTerakhir: "8 Okt 2026, 10.03",
    avatarText: "LH",
  },
  {
    id: "penilai-4",
    nama: "Maria Ulfa",
    nip: "19950719 202012 2 001",
    jabatan: "Perencana Ahli Pertama",
    kategori: "R",
    kategoriLabel: "Rekan kerja",
    kanal: "both",
    status: "Belum dibuka",
    aktivitasTerakhir: "—",
    pengingatCount: 2,
    avatarText: "MU",
  },
  {
    id: "penilai-5",
    nama: "Yoga Pratama",
    nip: "19981105 202203 1 008",
    jabatan: "Pengadministrasi Umum",
    kategori: "B",
    kategoriLabel: "Bawahan",
    kanal: "wa",
    status: "Selesai",
    aktivitasTerakhir: "6 Okt 2026, 13.27",
    avatarText: "YP",
  },
];

export const CANDIDATE_REPLACEMENT_LIST: CandidatePegawai[] = [
  {
    id: "cand-1",
    nama: "Fajar Nugroho",
    nip: "19930412 201801 1 002",
    jabatan: "Kepala Subbagian Program",
    unitKerja: "BPSDM Perhubungan",
    avatarText: "FN",
  },
  {
    id: "cand-2",
    nama: "Hendra Saputra",
    nip: "19950917 202012 1 005",
    jabatan: "Analis SDM Aparatur Ahli Pertama",
    unitKerja: "Sekretariat Jenderal",
    avatarText: "HS",
  },
  {
    id: "cand-3",
    nama: "Sri Wahyuni",
    nip: "19910228 201503 2 004",
    jabatan: "Perencana Ahli Muda",
    unitKerja: "Ditjen Perhubungan Darat",
    avatarText: "SW",
  },
  {
    id: "cand-4",
    nama: "Agus Setiawan",
    nip: "19901114 201402 1 001",
    jabatan: "Pranata Komputer Ahli Pertama",
    unitKerja: "Ditjen Perhubungan Laut",
    avatarText: "AS",
  },
];
