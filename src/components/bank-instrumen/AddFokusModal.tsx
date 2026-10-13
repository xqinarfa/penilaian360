"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Edit3 } from "lucide-react";
import type { FokusItem } from "@/types";

interface AddFokusModalProps {
  isOpen: boolean;
  nextNumber: number;
  onClose: () => void;
  onSave: (fokus: FokusItem) => void;
}

export default function AddFokusModal({
  isOpen,
  nextNumber,
  onClose,
  onSave,
}: AddFokusModalProps) {
  const [title, setTitle] = useState("");
  const [isIsianTerbuka, setIsIsianTerbuka] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(`${nextNumber}. `);
      setIsIsianTerbuka(false);
    }
  }, [isOpen, nextNumber]);

  // Escape key and scroll lock
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
    if (!title.trim()) return;

    onSave({
      id: `fokus-${Date.now()}`,
      number: nextNumber,
      title: title.trim(),
      subdimensiCount: isIsianTerbuka ? undefined : 0,
      butirCount: isIsianTerbuka ? undefined : 0,
      isIsianTerbuka,
      pertanyaanCount: isIsianTerbuka ? 1 : undefined,
      subdimensis: isIsianTerbuka ? [] : [],
      openQuestions: isIsianTerbuka
        ? [
            {
              id: `open-${Date.now()}`,
              code: `${nextNumber}.1`,
              text: "Pertanyaan evaluasi terbuka pertama...",
            },
          ]
        : undefined,
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
          >
            <div className="dash-modal-header">
              <div>
                <h3 className="dash-modal-title">Tambah Fokus Penilaian</h3>
                <p className="dash-modal-subtitle">
                  Tambahkan dimensi fokus evaluasi baru pada instrumen ini.
                </p>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={onClose}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="dash-modal-form-body">
              <div className="dash-form-field">
                <label className="dash-form-label" htmlFor="input-fokus-title">
                  Judul Fokus
                </label>
                <input
                  id="input-fokus-title"
                  type="text"
                  className="dash-input-text"
                  placeholder="Contoh: 7. Dukungan teknologi dan digitalisasi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="dash-form-field">
                <span className="dash-form-label">Tipe Pengukuran Fokus:</span>
                <div className="dash-category-toggle-grid">
                  <button
                    type="button"
                    className={`dash-cat-toggle-card ${!isIsianTerbuka ? "active" : ""}`}
                    onClick={() => setIsIsianTerbuka(false)}
                  >
                    <Layers size={16} className="text-blue" />
                    <span className="dash-cat-toggle-name">Skala Indeks Penerapan</span>
                  </button>

                  <button
                    type="button"
                    className={`dash-cat-toggle-card ${isIsianTerbuka ? "active" : ""}`}
                    onClick={() => setIsIsianTerbuka(true)}
                  >
                    <Edit3 size={16} className="text-purple-600" />
                    <span className="dash-cat-toggle-name">Pertanyaan Isian Terbuka</span>
                  </button>
                </div>
              </div>

              <div className="dash-modal-footer dash-modal-footer-equal">
                <button
                  type="button"
                  className="dash-btn-modal-cancel flex-1"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="dash-btn-modal-primary flex-1"
                >
                  Tambah Fokus
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
