"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import type { FormValidationErrors, TouchedFields } from "./types";

interface LokusOption {
  value: string;
  label: string;
}

const FOKUS_OPTIONS: LokusOption[] = [
  { value: "3", label: "3. Sikap dan perilaku kerja" },
  { value: "1", label: "1. Relevansi dan penerapan materi" },
  { value: "2", label: "2. Dukungan lingkungan kerja" },
  { value: "4", label: "4. Ketepatan waktu" },
  { value: "5", label: "5. Manfaat pelatihan" },
];

const SUBDIMENSI_MAP: Record<string, LokusOption[]> = {
  "3": [
    { value: "3.3", label: "3.3 Kerja sama dan komunikasi" },
    { value: "3.1", label: "3.1 Tanggung jawab" },
    { value: "3.2", label: "3.2 Integritas" },
    { value: "3.4", label: "3.4 Inisiatif" },
  ],
  "1": [
    { value: "1.1", label: "1.1 Kesempatan penerapan" },
    { value: "1.2", label: "1.2 Kontribusi materi" },
    { value: "1.3", label: "1.3 Pengetahuan yang diperoleh" },
  ],
  "2": [
    { value: "2.1", label: "2.1 Dukungan atasan langsung" },
    { value: "2.2", label: "2.2 Fasilitas sarana kerja" },
  ],
  "4": [
    { value: "4.1", label: "4.1 Ketepatan kehadiran" },
    { value: "4.2", label: "4.2 Kecepatan respons" },
  ],
  "5": [
    { value: "5.1", label: "5.1 Dampak terhadap produktivitas kerja" },
    { value: "5.2", label: "5.2 Efisiensi waktu kerja" },
  ],
};

const INDIKATOR_MAP: Record<string, LokusOption[]> = {
  "3.3": [
    {
      value: "3.3.1",
      label: "Kemampuan menyampaikan informasi, berkoordinasi, dan bekerja dalam tim",
    },
    {
      value: "3.3.2",
      label: "Kemampuan mendengarkan dan menanggapi masukan",
    },
  ],
  "3.1": [
    { value: "3.1.1", label: "Penyelesaian tugas tepat waktu dan sesuai standar kerja" },
  ],
  "3.2": [
    { value: "3.2.1", label: "Konsistensi nilai moral, etika, dan kejujuran" },
  ],
  "3.4": [
    { value: "3.4.1", label: "Proaktif mengajukan solusi masalah di unit kerja" },
  ],
  "1.1": [
    { value: "1.1.1", label: "Tersedianya pekerjaan yang relevan dengan pelatihan" },
  ],
  "1.2": [
    { value: "1.2.1", label: "Materi langsung mendukung sasaran kinerja individu" },
  ],
  "1.3": [
    { value: "1.3.1", label: "Peningkatan wawasan regulasi dan SOP teknis" },
  ],
};

interface LokusButirSectionProps {
  fokus: string;
  subdimensi: string;
  indikator: string;
  errors: FormValidationErrors;
  touched: TouchedFields;
  onChangeFokus: (val: string) => void;
  onChangeSubdimensi: (val: string) => void;
  onChangeIndikator: (val: string) => void;
  onBlurField: (field: "fokus" | "subdimensi" | "indikator") => void;
}

export default function LokusButirSection({
  fokus,
  subdimensi,
  indikator,
  errors,
  touched,
  onChangeFokus,
  onChangeSubdimensi,
  onChangeIndikator,
  onBlurField,
}: LokusButirSectionProps) {
  const currentSubOptions = SUBDIMENSI_MAP[fokus] || [
    { value: `${fokus}.1`, label: `${fokus}.1 Subdimensi Default` },
  ];

  const currentIndikatorOptions = INDIKATOR_MAP[subdimensi] || [
    { value: `${subdimensi}.1`, label: "Indikator umum subdimensi" },
  ];

  const handleFokusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFokus = e.target.value;
    onChangeFokus(newFokus);
    const availableSubs = SUBDIMENSI_MAP[newFokus] || [];
    if (availableSubs.length > 0) {
      const firstSub = availableSubs[0].value;
      onChangeSubdimensi(firstSub);
      const availableInds = INDIKATOR_MAP[firstSub] || [];
      if (availableInds.length > 0) {
        onChangeIndikator(availableInds[0].value);
      }
    }
  };

  const handleSubdimensiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSub = e.target.value;
    onChangeSubdimensi(newSub);
    const availableInds = INDIKATOR_MAP[newSub] || [];
    if (availableInds.length > 0) {
      onChangeIndikator(availableInds[0].value);
    }
  };

  return (
    <div className="tb-card" id="section-lokus">
      <div className="tb-section-title">
        <span className="tb-section-num">1</span>
        Lokus Butir
      </div>
      <p className="tb-section-hint">
        Tentukan di mana butir ini berada dalam struktur instrumen.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Fokus evaluasi */}
        <div className="tb-field">
          <label htmlFor="fokus" className="tb-field-label">
            <span className="tb-field-label-left">
              Fokus evaluasi <span className="tb-req" title="Wajib diisi">*</span>
            </span>
          </label>
          <div className="tb-select-wrap">
            <select
              id="fokus"
              className={`tb-select ${errors.fokus && touched.fokus ? "has-error" : ""}`}
              value={fokus}
              onChange={handleFokusChange}
              onBlur={() => onBlurField("fokus")}
              aria-invalid={Boolean(errors.fokus && touched.fokus)}
              aria-describedby={errors.fokus && touched.fokus ? "fokus-error" : undefined}
            >
              <option value="">-- Pilih Fokus Evaluasi --</option>
              {FOKUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <AnimatePresence>
            {errors.fokus && touched.fokus && (
              <motion.div
                id="fokus-error"
                className="tb-field-error"
                role="alert"
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AlertCircle size={13} />
                <span>{errors.fokus}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subdimensi */}
        <div className="tb-field">
          <label htmlFor="subdimensi" className="tb-field-label">
            <span className="tb-field-label-left">
              Subdimensi <span className="tb-req" title="Wajib diisi">*</span>
            </span>
          </label>
          <div className="tb-select-wrap">
            <select
              id="subdimensi"
              className={`tb-select ${errors.subdimensi && touched.subdimensi ? "has-error" : ""}`}
              value={subdimensi}
              onChange={handleSubdimensiChange}
              onBlur={() => onBlurField("subdimensi")}
              aria-invalid={Boolean(errors.subdimensi && touched.subdimensi)}
              aria-describedby={errors.subdimensi && touched.subdimensi ? "subdimensi-error" : undefined}
            >
              <option value="">-- Pilih Subdimensi --</option>
              {currentSubOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <AnimatePresence>
            {errors.subdimensi && touched.subdimensi && (
              <motion.div
                id="subdimensi-error"
                className="tb-field-error"
                role="alert"
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AlertCircle size={13} />
                <span>{errors.subdimensi}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indikator */}
        <div className="tb-field">
          <label htmlFor="indikator" className="tb-field-label">
            <span className="tb-field-label-left">
              Indikator <span className="tb-req" title="Wajib diisi">*</span>
            </span>
          </label>
          <div className="tb-select-wrap">
            <select
              id="indikator"
              className={`tb-select ${errors.indikator && touched.indikator ? "has-error" : ""}`}
              value={indikator}
              onChange={(e) => onChangeIndikator(e.target.value)}
              onBlur={() => onBlurField("indikator")}
              aria-invalid={Boolean(errors.indikator && touched.indikator)}
              aria-describedby={errors.indikator && touched.indikator ? "indikator-error" : undefined}
            >
              <option value="">-- Pilih Indikator --</option>
              {currentIndikatorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <AnimatePresence>
            {errors.indikator && touched.indikator && (
              <motion.div
                id="indikator-error"
                className="tb-field-error"
                role="alert"
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AlertCircle size={13} />
                <span>{errors.indikator}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
