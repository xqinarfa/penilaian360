"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Keyboard, AlertCircle } from "lucide-react";

interface StickyActionBarProps {
  errorCount: number;
  isSubmitting?: boolean;
  onBatal: () => void;
  onSimpanTambah: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StickyActionBar({
  errorCount,
  isSubmitting = false,
  onBatal,
  onSimpanTambah,
  onSubmit,
}: StickyActionBarProps) {
  return (
    <div
      className="tb-sticky-bar"
      role="toolbar"
      aria-label="Aksi Formulir Butir Pertanyaan"
    >
      {/* Keyboard Shortcuts & Errors info */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <Keyboard size={15} color="#94a3b8" aria-hidden="true" />
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              color: "#475569",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            ⌘/Ctrl
          </kbd>
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              color: "#475569",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            ↵
          </kbd>
          <span style={{ fontSize: "11.5px" }}>simpan &amp; tambah lagi</span>
        </div>

        <AnimatePresence>
          {errorCount > 0 && (
            <motion.div
              key={errorCount}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "11.5px",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={13} />
              <span>Periksa {errorCount} isian formulir</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
        <button
          type="button"
          id="btn-batal"
          className="tb-btn-cancel"
          onClick={onBatal}
        >
          Batal
        </button>

        <button
          type="button"
          id="btn-simpan-tambah"
          className="tb-btn-secondary"
          onClick={onSimpanTambah}
          disabled={isSubmitting}
        >
          Simpan &amp; Tambah Lagi
        </button>

        <button
          type="button"
          id="btn-simpan"
          className="tb-btn-primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <Check size={16} strokeWidth={2.4} aria-hidden="true" />
          <span>{isSubmitting ? "Menyimpan..." : "Simpan Butir"}</span>
        </button>
      </div>
    </div>
  );
}
