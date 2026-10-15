"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Info, AlertTriangle } from "lucide-react";
import RedaksiKategoriRow from "./RedaksiKategoriRow";
import {
  KATEGORI_CONFIGS,
  type KategoriKey,
  type RedaksiItemState,
  type FormValidationErrors,
  type TouchedFields,
} from "./types";

interface RedaksiPertanyaanSectionProps {
  redaksi: Record<KategoriKey, RedaksiItemState>;
  errors: FormValidationErrors;
  touched: TouchedFields;
  onToggleCategory: (key: KategoriKey, aktif: boolean) => void;
  onChangeCategoryText: (key: KategoriKey, text: string) => void;
  onBlurCategory: (key: KategoriKey) => void;
}

export default function RedaksiPertanyaanSection({
  redaksi,
  errors,
  touched,
  onToggleCategory,
  onChangeCategoryText,
  onBlurCategory,
}: RedaksiPertanyaanSectionProps) {
  return (
    <div className="tb-card" id="section-redaksi">
      <div className="tb-section-title">
        <span className="tb-section-num">2</span>
        Redaksi Pertanyaan
      </div>
      <p className="tb-section-hint">
        Satu butir dapat memiliki redaksi berbeda per kategori penilai. Centang kategori yang akan diberi pertanyaan ini.
      </p>

      {/* Global Section Error Alert if 0 categories are active */}
      <AnimatePresence>
        {errors.globalRedaksi && (
          <motion.div
            className="tb-alert-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Peringatan Kategori Penilai:</strong>
              <p style={{ marginTop: "2px", fontSize: "12px" }}>{errors.globalRedaksi}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Matrix Header */}
      <div className="tb-matrix-header">
        <span className="tb-matrix-th">Penilai</span>
        <span className="tb-matrix-th center">Aktif</span>
        <span className="tb-matrix-th">Redaksi Pertanyaan</span>
      </div>

      {/* Category Rows wrapped with LayoutGroup */}
      <LayoutGroup id="kategori-rows">
        <div>
          {KATEGORI_CONFIGS.map((config) => {
            const itemData = redaksi[config.key];
            const itemError = errors.redaksi[config.key];
            const isFieldTouched = touched[`redaksi_${config.key}`];

            const otherSources = KATEGORI_CONFIGS.filter(
              (c) => c.key !== config.key && redaksi[c.key].text.trim().length > 0
            ).map((c) => ({
              key: c.key,
              code: c.code,
              label: c.label,
              badgeClass: c.badgeClass,
              text: redaksi[c.key].text,
            }));

            return (
              <RedaksiKategoriRow
                key={config.key}
                config={config}
                data={itemData}
                otherSources={otherSources}
                error={itemError}
                isTouched={isFieldTouched}
                onToggle={(aktif) => onToggleCategory(config.key, aktif)}
                onChangeText={(text) => onChangeCategoryText(config.key, text)}
                onBlur={() => onBlurCategory(config.key)}
              />
            );
          })}
        </div>
      </LayoutGroup>

      {/* Info Tip Token */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <Info size={16} color="#1f6fd1" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.55 }}>
          Penanda{" "}
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#e8f1fc",
              color: "#155bbb",
              fontWeight: 600,
            }}
          >
            [nama agenda]
          </span>{" "}
          akan otomatis diganti dengan nama agenda pelatihan saat kuesioner ditampilkan kepada penilai.
        </p>
      </div>
    </div>
  );
}
