"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3 } from "lucide-react";
import type { OpenQuestionItemResponse } from "@/types";

interface AddOpenQuestionModalProps {
  isOpen: boolean;
  initialData?: OpenQuestionItemResponse | null;
  suggestedCode?: string;
  onClose: () => void;
  onSave: (question: { id?: string; code: string; text: string }) => void;
}

export default function AddOpenQuestionModal({
  isOpen,
  initialData,
  suggestedCode = "6.1",
  onClose,
  onSave,
}: AddOpenQuestionModalProps) {
  const [code, setCode] = useState(suggestedCode);
  const [text, setText] = useState("");

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setText(initialData.text);
    } else {
      setCode(suggestedCode);
      setText("");
    }
  }, [isOpen, initialData, suggestedCode]);

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
    if (!text.trim() || !code.trim()) return;

    onSave({
      id: initialData ? initialData.id : undefined,
      code: code.trim(),
      text: text.trim(),
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
            style={{ maxWidth: "520px" }}
          >
            {/* Header */}
            <div className="dash-preview-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7c3aed",
                  }}
                >
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="dash-preview-modal-title">
                    {initialData ? "Edit Pertanyaan Terbuka" : "Tambah Pertanyaan Terbuka"}
                  </h3>
                  <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Fokus 6: Masukan & Saran Kualitatif (Isian Terbuka)
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
                    htmlFor="oq-code-input"
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "6px",
                    }}
                  >
                    Kode Pertanyaan <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="oq-code-input"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: 6.1"
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
                </div>

                <div>
                  <label
                    htmlFor="oq-text-input"
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "6px",
                    }}
                  >
                    Redaksi Pertanyaan Terbuka <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    id="oq-text-input"
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Contoh: Tuliskan contoh konkret perubahan perilaku kerja atau terobosan yang telah dilakukan alumni pasca mengikuti pelatihan ini..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                    Pertanyaan terbuka akan dijawab berupa teks naratif panjang oleh penilai dan tidak dinilai dengan skala Likert.
                  </span>
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
                  disabled={!text.trim() || !code.trim()}
                  style={{
                    padding: "6px 16px",
                    fontSize: "12px",
                    backgroundColor: "#7c3aed",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontWeight: 600,
                    opacity: !text.trim() || !code.trim() ? 0.6 : 1,
                    cursor: !text.trim() || !code.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {initialData ? "Simpan Perubahan" : "Simpan Pertanyaan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

