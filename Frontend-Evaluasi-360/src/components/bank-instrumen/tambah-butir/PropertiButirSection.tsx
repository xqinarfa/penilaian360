"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlignLeft, AlertCircle } from "lucide-react";
import type { TipeJawaban, FormValidationErrors, TouchedFields } from "./types";

interface PropertiButirSectionProps {
  tipeJawaban: TipeJawaban;
  urutan: string;
  wajib: boolean;
  errors: FormValidationErrors;
  touched: TouchedFields;
  onChangeTipeJawaban: (tipe: TipeJawaban) => void;
  onChangeUrutan: (urutan: string) => void;
  onChangeWajib: (wajib: boolean) => void;
  onBlurUrutan: () => void;
}

export default function PropertiButirSection({
  tipeJawaban,
  urutan,
  wajib,
  errors,
  touched,
  onChangeTipeJawaban,
  onChangeUrutan,
  onChangeWajib,
  onBlurUrutan,
}: PropertiButirSectionProps) {
  return (
    <div className="tb-card" id="section-properti">
      <div className="tb-section-title">
        <span className="tb-section-num">3</span>
        Properti Butir
      </div>
      <p className="tb-section-hint">
        Atur tipe jawaban dan perilaku butir di kuesioner.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Tipe Jawaban with moderate animated layout indicator */}
        <div>
          <label className="tb-field-label">
            <span className="tb-field-label-left">
              Tipe jawaban <span className="tb-req" title="Wajib diisi">*</span>
            </span>
          </label>
          <div className="tb-tipe-btn-group" style={{ position: "relative" }}>
            <button
              type="button"
              className={`tb-tipe-btn ${tipeJawaban === "skala" ? "active" : ""}`}
              onClick={() => onChangeTipeJawaban("skala")}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {tipeJawaban === "skala" && (
                <motion.div
                  layoutId="activeTipeHighlight"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#e8f1fc",
                    borderRadius: "8px",
                    zIndex: 0,
                  }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Skala 1–4 (Likert)</span>
              </span>
            </button>

            <button
              type="button"
              className={`tb-tipe-btn ${tipeJawaban === "terbuka" ? "active" : ""}`}
              onClick={() => onChangeTipeJawaban("terbuka")}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {tipeJawaban === "terbuka" && (
                <motion.div
                  layoutId="activeTipeHighlight"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#e8f1fc",
                    borderRadius: "8px",
                    zIndex: 0,
                  }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <AlignLeft size={16} aria-hidden="true" />
                <span>Isian terbuka</span>
              </span>
            </button>
          </div>

          <p
            id="tipe-hint"
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginTop: "8px",
              lineHeight: 1.5,
            }}
          >
            {tipeJawaban === "skala"
              ? 'Penilai memilih dari 4 tingkat persetujuan. Ada opsi "Tidak dapat menilai".'
              : 'Penilai menuliskan jawaban bebas. Tidak ada skala dan tidak dihitung dalam indeks kumulatif.'}
          </p>
        </div>

        {/* Grid: Urutan + Wajib diisi */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Posisi Butir */}
          <div>
            <label htmlFor="urutan" className="tb-field-label">
              <span className="tb-field-label-left">
                Posisi butir <span className="tb-req" title="Wajib diisi">*</span>
              </span>
            </label>
            <div className="tb-select-wrap">
              <select
                id="urutan"
                className={`tb-select ${errors.urutan && touched.urutan ? "has-error" : ""}`}
                value={urutan}
                onChange={(e) => onChangeUrutan(e.target.value)}
                onBlur={onBlurUrutan}
                aria-invalid={Boolean(errors.urutan && touched.urutan)}
                aria-describedby={errors.urutan && touched.urutan ? "urutan-error" : undefined}
              >
                <option value="end">Di akhir indikator</option>
                <option value="after-1">Setelah butir 3.3.1.1 — Tersedianya pekerjaan…</option>
                <option value="after-2">Setelah butir 3.3.1.2 — Alumni mampu mengidentifikasi…</option>
              </select>
            </div>
            <AnimatePresence>
              {errors.urutan && touched.urutan ? (
                <motion.div
                  id="urutan-error"
                  className="tb-field-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <AlertCircle size={13} />
                  <span>{errors.urutan}</span>
                </motion.div>
              ) : (
                <p className="tb-field-hint">Butir lain akan bergeser otomatis.</p>
              )}
            </AnimatePresence>
          </div>

          {/* Wajib Diisi Switch */}
          <div>
            <label className="tb-field-label">
              <span className="tb-field-label-left">Wajib diisi</span>
            </label>
            <div style={{ marginTop: "6px" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  id="wajib"
                  checked={wajib}
                  onChange={(e) => onChangeWajib(e.target.checked)}
                />
                <span className="slider" aria-hidden="true" />
                <span className="switch-text" id="wajib-text">
                  {wajib ? "Ya, penilai harus menjawab" : "Tidak, butir ini opsional"}
                </span>
              </label>
            </div>
            <p className="tb-field-hint" style={{ marginTop: "8px" }}>
              Butir wajib tidak bisa dikosongkan saat kirim kuesioner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
