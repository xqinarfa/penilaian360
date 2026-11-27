"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target } from "lucide-react";

interface AddIndikatorModalProps {
  isOpen: boolean;
  subdimensiTitle?: string;
  subdimensiCode?: string;
  suggestedCode?: string;
  onClose: () => void;
  onSave: (indikator: { code: string; title: string }) => void;
}

export default function AddIndikatorModal({
  isOpen,
  subdimensiTitle = "Subdimensi",
  subdimensiCode = "1.1",
  suggestedCode = "1.1.1",
  onClose,
  onSave,
}: AddIndikatorModalProps) {
  const [code, setCode] = useState(suggestedCode);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode(suggestedCode);
      setTitle("");
    }
  }, [isOpen, suggestedCode]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    onSave({
      code: code.trim(),
      title: title.trim(),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dash-modal-backdrop"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="dash-modal-container dash-preview-modal-box"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px" }}
          >
            {/* Header */}
            <div className="dash-preview-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(11, 46, 89, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0b2e59",
                  }}
                >
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="dash-preview-modal-title">Tambah Indikator Baru</h3>
                  <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Pada Subdimensi: <strong>{subdimensiCode} {subdimensiTitle}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="dash-modal-close"
                onClick={onClose}
                aria-label="Tutup modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: "16px 20px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label
                    htmlFor="ind-code-input"
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "6px",
                    }}
                  >
                    Kode Indikator <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="ind-code-input"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: 1.1.1"
                    className="font-mono text-sm"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#f8fafc",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", display: "block" }}>
                    Format standar: [Kode Subdimensi].[Nomor Urut Indikator]
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="ind-title-input"
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "6px",
                    }}
                  >
                    Judul / Deskripsi Indikator <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="ind-title-input"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Penerapan metode analisis data pada penyusunan laporan"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "20px",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  className="dash-btn-action-outline"
                  onClick={onClose}
                  style={{ padding: "6px 14px", fontSize: "12px" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="dash-btn-action-primary"
                  disabled={!title.trim() || !code.trim()}
                  style={{
                    padding: "6px 16px",
                    fontSize: "12px",
                    backgroundColor: "#0b2e59",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontWeight: 600,
                    opacity: !title.trim() || !code.trim() ? 0.6 : 1,
                    cursor: !title.trim() || !code.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Simpan Indikator
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

