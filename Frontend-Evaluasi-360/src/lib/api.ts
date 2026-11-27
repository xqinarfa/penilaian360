import type {
  AuthUser,
  PegawaiItem,
  SIKSyncHistoryItem,
  JenisPelatihanItem,
  FokusItem,
  SubdimensiItem,
  ButirPertanyaanItem,
  PeriodeEvaluasiItem,
  PenilaianTertundaItem,
  AlumniItem,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
}

interface PegawaiListResponse {
  items: PegawaiItem[];
  total: number;
  limit: number;
  offset: number;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// ==========================================
// AUTHENTICATION & USER API FUNCTIONS
// ==========================================

export interface LoginResponse {
  token: string;
  tokens?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
  user: AuthUser;
}

export async function loginUser(
  nipOrEmail: string,
  password: string
): Promise<LoginResponse> {
  const isEmail = nipOrEmail.includes("@");
  const body = isEmail
    ? { email: nipOrEmail, password }
    : { nip: nipOrEmail, password };

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        errorBody.error ||
        "Login gagal. Periksa NIP/Email dan Kata Sandi Anda."
    );
  }

  const json = await res.json();
  const data: LoginResponse = json.data || json;
  const token = data.token || data.tokens?.access_token;

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("token", token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    }
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil profil user: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<AuthUser> = await res.json();
  return json.data;
}

export async function updateCurrentUser(payload: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal memperbarui profil: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<AuthUser> = await res.json();
  return json.data;
}

// ==========================================
// PEGAWAI API FUNCTIONS
// ==========================================

export async function fetchPegawaiList(params?: {
  search?: string;
  unitKerja?: string;
  statusRelasi?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: PegawaiItem[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/pegawai`);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.unitKerja && params.unitKerja !== "Semua unit kerja") {
    url.searchParams.set("unitKerja", params.unitKerja);
  }
  if (params?.statusRelasi && params.statusRelasi !== "Semua status") {
    url.searchParams.set("statusRelasi", params.statusRelasi);
  }
  if (params?.limit) url.searchParams.set("limit", params.limit.toString());
  if (params?.offset) url.searchParams.set("offset", params.offset.toString());

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil data pegawai: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PegawaiListResponse> = await res.json();
  return {
    items: json.data?.items || [],
    total: json.data?.total || 0,
  };
}

export async function fetchPegawaiById(id: string): Promise<PegawaiItem> {
  const res = await fetch(`${API_BASE_URL}/pegawai/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil detail pegawai: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PegawaiItem> = await res.json();
  return json.data;
}

export interface UpdateRelasiPayload {
  atasan?: string;
  atasanId?: string;
  rekanKerja?: string[];
  rekanIds?: string[];
  bawahan?: string[];
  bawahanIds?: string[];
}

export async function updatePegawaiRelasi(
  id: string,
  payload: UpdateRelasiPayload
): Promise<PegawaiItem> {
  const res = await fetch(`${API_BASE_URL}/pegawai/${id}/relasi`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal memperbarui relasi: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PegawaiItem> = await res.json();
  return json.data;
}

export interface CreatePegawaiPayload {
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  email: string;
  phone?: string;
  role?: string;
  password?: string;
}

export interface UpdatePegawaiPayload {
  nama?: string;
  nip?: string;
  jabatan?: string;
  unitKerja?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
  isActive?: boolean;
}

export async function createPegawai(
  payload: CreatePegawaiPayload
): Promise<PegawaiItem> {
  const res = await fetch(`${API_BASE_URL}/pegawai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menambah pegawai: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PegawaiItem> = await res.json();
  return json.data;
}

export async function updatePegawai(
  id: string,
  payload: UpdatePegawaiPayload
): Promise<PegawaiItem> {
  const res = await fetch(`${API_BASE_URL}/pegawai/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal memperbarui pegawai: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PegawaiItem> = await res.json();
  return json.data;
}

export async function deletePegawai(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/pegawai/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menghapus pegawai: HTTP ${res.status}`
    );
  }
}

export async function deletePegawaiBatch(ids: string[]): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/pegawai`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menghapus pegawai: HTTP ${res.status}`
    );
  }
}

// ==========================================
// SIK SYNC & AUDIT TRAIL FUNCTIONS
// ==========================================

export async function fetchSyncHistory(): Promise<SIKSyncHistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/pegawai/sync-history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        `Gagal mengambil riwayat sinkronisasi SI-K: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<SIKSyncHistoryItem[]> = await res.json();
  return json.data || [];
}

export async function triggerSyncSIK(
  triggeredBy?: string
): Promise<SIKSyncHistoryItem> {
  const res = await fetch(`${API_BASE_URL}/pegawai/sync-sik`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ triggeredBy: triggeredBy || "Administrator Evaluasi 360" }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        `Gagal menjalankan sinkronisasi SI-K: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<SIKSyncHistoryItem> = await res.json();
  return json.data;
}

// ==========================================
// BANK INSTRUMEN API FUNCTIONS
// ==========================================

export async function fetchPelatihanList(): Promise<JenisPelatihanItem[]> {
  const res = await fetch(`${API_BASE_URL}/instrumen/pelatihan`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil daftar pelatihan: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<JenisPelatihanItem[]> = await res.json();
  return json.data || [];
}

export async function createPelatihan(payload: {
  nama: string;
  useInstrumenInti?: boolean;
  deskripsi?: string;
}): Promise<JenisPelatihanItem> {
  const res = await fetch(`${API_BASE_URL}/instrumen/pelatihan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal membuat pelatihan: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<JenisPelatihanItem> = await res.json();
  return json.data;
}

export async function fetchFokusList(pelatihanId?: string): Promise<FokusItem[]> {
  const url = new URL(`${API_BASE_URL}/instrumen/fokus`);
  if (pelatihanId) {
    url.searchParams.set("pelatihanId", pelatihanId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil daftar fokus evaluasi: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<FokusItem[]> = await res.json();
  return json.data || [];
}

export async function createFokus(payload: {
  pelatihanId?: string;
  number: number;
  title: string;
  isIsianTerbuka?: boolean;
  bobot?: number;
}): Promise<FokusItem> {
  const res = await fetch(`${API_BASE_URL}/instrumen/fokus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menambah fokus evaluasi: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<FokusItem> = await res.json();
  return json.data;
}

export async function createSubdimensi(payload: {
  fokusId: string;
  code: string;
  title: string;
}): Promise<SubdimensiItem> {
  const res = await fetch(`${API_BASE_URL}/instrumen/subdimensi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menambah subdimensi: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<SubdimensiItem> = await res.json();
  return json.data;
}

export async function createIndikator(payload: {
  subdimensiId: string;
  code: string;
  title: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/instrumen/indikator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menambah indikator: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<any> = await res.json();
  return json.data;
}

// ==========================================
// PERIODE EVALUASI & PENUGASAN API FUNCTIONS
// ==========================================

export async function fetchPeriodeList(): Promise<PeriodeEvaluasiItem[]> {
  const res = await fetch(`${API_BASE_URL}/periode`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil daftar periode: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PeriodeEvaluasiItem[]> = await res.json();
  return json.data || [];
}

export async function fetchPeriodeById(id: string): Promise<PeriodeEvaluasiItem> {
  const res = await fetch(`${API_BASE_URL}/periode/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil detail periode: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PeriodeEvaluasiItem> = await res.json();
  return json.data;
}

export async function createPeriode(payload: {
  nama: string;
  pelatihanId: string;
  startDate: string;
  endDate: string;
  status?: string;
}): Promise<PeriodeEvaluasiItem> {
  const res = await fetch(`${API_BASE_URL}/periode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal membuat periode: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PeriodeEvaluasiItem> = await res.json();
  return json.data;
}

export async function fetchAlumniList(periodeId?: string): Promise<AlumniItem[]> {
  const url = new URL(`${API_BASE_URL}/alumni`);
  if (periodeId) {
    url.searchParams.set("periodeId", periodeId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil daftar alumni: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<AlumniItem[]> = await res.json();
  return json.data || [];
}

export async function fetchAlumniDetail(id: string): Promise<{
  alumni: any;
  penilaiList: any[];
}> {
  const res = await fetch(`${API_BASE_URL}/alumni/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil detail alumni: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<{ alumni: any; penilaiList: any[] }> = await res.json();
  return json.data;
}

export async function gantiPenilai(
  penugasanId: string,
  payload: { calonPegawaiId: string; kanal?: string }
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/penugasan/${penugasanId}/ganti-penilai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengganti penilai: HTTP ${res.status}`
    );
  }
}

export async function batalkanPenugasan(
  penugasanId: string,
  alasan?: string
): Promise<void> {
  const url = new URL(`${API_BASE_URL}/penugasan/${penugasanId}`);
  if (alasan) url.searchParams.set("alasan", alasan);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal membatalkan penugasan: HTTP ${res.status}`
    );
  }
}

export async function kirimPengingatPenugasan(
  penugasanId: string,
  payload?: { kanal?: string }
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/penugasan/${penugasanId}/pengingat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengirim pengingat: HTTP ${res.status}`
    );
  }
}

export async function fetchPenilaianTertundaList(): Promise<PenilaianTertundaItem[]> {
  const res = await fetch(`${API_BASE_URL}/penilaian-tertunda`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengambil penilaian tertunda: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<PenilaianTertundaItem[]> = await res.json();
  return json.data || [];
}

export async function createButir(payload: {
  pelatihanId?: string;
  fokusId?: string;
  indikatorId?: string;
  code: string;
  text: string;
  agendaHint?: string;
  categories: string[];
  isOpenEnded?: boolean;
}): Promise<ButirPertanyaanItem> {
  const res = await fetch(`${API_BASE_URL}/instrumen/butir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menambah butir instrumen: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<ButirPertanyaanItem> = await res.json();
  return json.data;
}

export async function updateButir(
  id: string,
  payload: {
    text: string;
    agendaHint?: string;
    categories: string[];
    isOpenEnded?: boolean;
  }
): Promise<ButirPertanyaanItem> {
  const res = await fetch(`${API_BASE_URL}/instrumen/butir/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal mengubah butir instrumen: HTTP ${res.status}`
    );
  }

  const json: ApiResponse<ButirPertanyaanItem> = await res.json();
  return json.data;
}

export async function deleteButir(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/instrumen/butir/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menghapus butir instrumen: HTTP ${res.status}`
    );
  }
}

export async function duplicateInstrumen(payload: {
  sourcePelatihanId: string;
  targetPelatihanId?: string;
  newVersion?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/instrumen/duplikat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Gagal menduplikasi instrumen: HTTP ${res.status}`
    );
  }
}
