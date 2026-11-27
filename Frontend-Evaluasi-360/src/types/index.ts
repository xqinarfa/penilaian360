import type { LucideIcon } from "lucide-react";

export interface HeroSlide {
  tag: string;
  title: string;
  highlight: string;
  desc: string;
}


export interface WorkflowStep {
  number: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  cardClass: string;
  bgClass: string;
}

export interface AboutFeature {
  title: string;
  desc: string;
  Icon: LucideIcon;
}

export interface EvaluatorDetail {
  role: "Atasan Langsung" | "Rekan Kerja (Peer)" | "Bawahan Langsung" | "Diri Sendiri (Self)";
  nama: string;
  nip: string;
  jabatan: string;
  status: "Terverifikasi" | "Menunggu Konfirmasi" | "Belum Ditetapkan";
}

export interface AlumniEvaluationItem {
  id: string;
  nama: string;
  nip: string;
  pelatihan: string;
  selesaiLms: string;
  sharingKms: "Selesai" | "Tertahan";
  jatuhTempo: string;
  penilai: string;
  isPenilaiLengkap: boolean;
  unitKerja?: string;
  evaluators?: EvaluatorDetail[];
  bulanPascaPelatihan?: number;
  statusPenilai?: string;
}

export interface ActionQueueItem {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  badgeText: string;
  badgeType: "urgent" | "today" | "sync";
}

export type UserRole = "admin" | "pegawai" | "evaluator" | "alumni";

export interface AuthUser {
  id: string;
  nip: string;
  email: string;
  full_name: string;
  role: UserRole;
  jabatan?: string;
  unit_kerja?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
}

export interface PegawaiItem {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  role?: UserRole;
  email?: string;
  phone?: string;
  statusRelasi: "Lengkap" | "Rekan kurang" | "Atasan kosong";
  atasan?: string;
  rekanKerja: string[];
  bawahan: string[];
}

export interface SyncChangeLogItem {
  nip: string;
  nama: string;
  field: string;
  oldValue: string;
  newValue: string;
  changeType: string;
  timestamp: string;
}

export interface SIKSyncHistoryItem {
  id: string;
  syncType: string;
  status: string;
  triggeredByName: string;
  source: string;
  totalFetched: number;
  totalInserted: number;
  totalUpdated: number;
  totalFailed: number;
  durationMs: number;
  message: string;
  changesLog: SyncChangeLogItem[];
  createdAt: string;
}

export interface PeriodeEvaluasiItem {
  id: string;
  nama: string;
  createdAt: string;
  instrumen: string;
  alumniCount: number;
  masaPengisian: string;
  progressPercent: number;
  status: "Berjalan" | "Diperpanjang" | "Terjadwal" | "Selesai";
}

export interface AlumniItem {
  id: string;
  nama: string;
  nip: string;
  pelatihan: string;
  selesaiLms: string;
  sharingKms: string;
  jatuhTempo: string;
  penilai: string;
  isPenilaiLengkap: boolean;
  unitKerja: string;
  bulanPascaPelatihan?: number;
  statusPenilai?: string;
}

export interface PenilaianTertundaItem {
  id: string;
  penilaiNama: string;
  penilaiNip: string;
  alumniNama: string;
  alumniNip?: string;
  pelatihan: string;
  kategori: "D" | "A" | "R" | "B";
  kategoriLabel: string;
  periode: string;
  deadline: string;
  deadlineStatus: string;
  isOverdue?: boolean;
  status: "Kedaluwarsa" | "Sedang mengisi" | "Belum dibuka";
  email: string;
  phone: string;
}

export interface JenisPelatihanItem {
  id: string;
  nama: string;
  butirCount?: number;
  fokusCount?: number;
  useInstrumenInti?: boolean;
}

export interface ButirPertanyaanItem {
  id: string;
  code: string;
  text: string;
  agendaHint?: string;
  categories: ("D" | "A" | "R" | "B")[];
}

export interface IndikatorItem {
  id: string;
  code: string;
  title: string;
  butirCount: number;
  items: ButirPertanyaanItem[];
}

export interface SubdimensiItem {
  id: string;
  code: string;
  title: string;
  indikatorCount: number;
  butirCount: number;
  indikators: IndikatorItem[];
}

export interface OpenQuestionItem {
  id: string;
  code: string;
  text: string;
}

export type OpenQuestionItemResponse = OpenQuestionItem;

export interface FokusItem {
  id: string;
  number: number;
  title: string;
  subdimensiCount?: number;
  butirCount?: number;
  isIsianTerbuka?: boolean;
  pertanyaanCount?: number;
  subdimensis?: SubdimensiItem[];
  openQuestions?: OpenQuestionItem[];
}
