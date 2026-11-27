export type KategoriKey = "diri" | "atasan" | "rekan" | "bawahan";
export type TipeJawaban = "skala" | "terbuka";

export interface KategoriConfig {
  key: KategoriKey;
  code: "D" | "A" | "R" | "B";
  label: string;
  badgeClass: string;
  placeholder: string;
  defaultText: string;
  defaultActive: boolean;
}

export const KATEGORI_CONFIGS: KategoriConfig[] = [
  {
    key: "diri",
    code: "D",
    label: "Diri sendiri",
    badgeClass: "kat-D",
    placeholder: "Tuliskan redaksi pertanyaan untuk diri sendiri...",
    defaultText: "Setelah mengikuti pelatihan, saya lebih mampu berkoordinasi dan bekerja sama dalam tim.",
    defaultActive: true,
  },
  {
    key: "atasan",
    code: "A",
    label: "Atasan",
    badgeClass: "kat-A",
    placeholder: "Tuliskan redaksi pertanyaan untuk atasan...",
    defaultText: "Setelah mengikuti pelatihan, pegawai ini menunjukkan peningkatan dalam berkoordinasi dan bekerja sama.",
    defaultActive: true,
  },
  {
    key: "rekan",
    code: "R",
    label: "Rekan kerja",
    badgeClass: "kat-R",
    placeholder: "Tuliskan redaksi pertanyaan untuk rekan kerja...",
    defaultText: "Rekan saya ini lebih mudah diajak berkoordinasi dan bekerja sama setelah mengikuti pelatihan.",
    defaultActive: true,
  },
  {
    key: "bawahan",
    code: "B",
    label: "Bawahan",
    badgeClass: "kat-B",
    placeholder: "Aktifkan kategori ini untuk mengisi redaksi pertanyaan.",
    defaultText: "",
    defaultActive: false,
  },
];

export interface RedaksiItemState {
  aktif: boolean;
  text: string;
}

export interface FormButirData {
  fokus: string;
  subdimensi: string;
  indikator: string;
  redaksi: Record<KategoriKey, RedaksiItemState>;
  tipeJawaban: TipeJawaban;
  urutan: string;
  wajib: boolean;
}

export interface FormValidationErrors {
  fokus?: string;
  subdimensi?: string;
  indikator?: string;
  globalRedaksi?: string;
  redaksi: Partial<Record<KategoriKey, string>>;
  urutan?: string;
}

export type TouchedFields = {
  fokus?: boolean;
  subdimensi?: boolean;
  indikator?: boolean;
  urutan?: boolean;
} & Partial<Record<`redaksi_${KategoriKey}`, boolean>>;

export const DEFAULT_FORM_DATA: FormButirData = {
  fokus: "3",
  subdimensi: "3.3",
  indikator: "3.3.1",
  redaksi: {
    diri: {
      aktif: true,
      text: "Setelah mengikuti pelatihan, saya lebih mampu berkoordinasi dan bekerja sama dalam tim.",
    },
    atasan: {
      aktif: true,
      text: "Setelah mengikuti pelatihan, pegawai ini menunjukkan peningkatan dalam berkoordinasi dan bekerja sama.",
    },
    rekan: {
      aktif: true,
      text: "Rekan saya ini lebih mudah diajak berkoordinasi dan bekerja sama setelah mengikuti pelatihan.",
    },
    bawahan: {
      aktif: false,
      text: "",
    },
  },
  tipeJawaban: "skala",
  urutan: "end",
  wajib: true,
};

/**
 * Validasi form butir pertanyaan secara inline
 */
export function validateForm(
  data: FormButirData,
  touched: TouchedFields = {},
  isSubmitting = false
): FormValidationErrors {
  const errors: FormValidationErrors = {
    redaksi: {},
  };

  // 1. Lokus validation
  if ((isSubmitting || touched.fokus) && !data.fokus.trim()) {
    errors.fokus = "Fokus evaluasi wajib dipilih.";
  }

  if ((isSubmitting || touched.subdimensi) && !data.subdimensi.trim()) {
    errors.subdimensi = "Subdimensi wajib dipilih.";
  }

  if ((isSubmitting || touched.indikator) && !data.indikator.trim()) {
    errors.indikator = "Indikator evaluasi wajib dipilih.";
  }

  // 2. Global category check: minimal 1 kategori harus aktif
  const activeCategories = Object.entries(data.redaksi).filter(
    ([, val]) => val.aktif
  );
  if (activeCategories.length === 0) {
    errors.globalRedaksi = "Minimal 1 kategori penilai harus diaktifkan.";
  }

  // 3. Redaksi per kategori yang aktif
  for (const config of KATEGORI_CONFIGS) {
    const key = config.key;
    const catData = data.redaksi[key];
    const isFieldTouched = isSubmitting || touched[`redaksi_${key}`];

    if (catData.aktif) {
      const trimmed = catData.text.trim();
      if (isFieldTouched && !trimmed) {
        errors.redaksi[key] = `Redaksi pertanyaan untuk ${config.label.toLowerCase()} wajib diisi.`;
      } else if (isFieldTouched && trimmed.length < 10) {
        errors.redaksi[key] = "Redaksi pertanyaan terlalu singkat (minimal 10 karakter).";
      } else if (isFieldTouched && trimmed.length > 500) {
        errors.redaksi[key] = "Redaksi pertanyaan maksimal 500 karakter.";
      } else if (isFieldTouched && trimmed.includes("[") && !trimmed.includes("]")) {
        errors.redaksi[key] = "Terdapat tanda kurung siku '[' tanpa pasangan penutup ']'.";
      }
    }
  }

  // 4. Urutan validation
  if ((isSubmitting || touched.urutan) && !data.urutan.trim()) {
    errors.urutan = "Posisi butir wajib dipilih.";
  }

  return errors;
}
