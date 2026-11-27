"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { SubdimensiItem } from "@/types";

interface AddSubdimensiModalProps {
  isOpen: boolean;
  fokusTitle?: string;
  suggestedCode?: string;
  onClose: () => void;
  onSave: (subdimensi: SubdimensiItem) => void;
}

export default function AddSubdimensiModal({
  isOpen,
  fokusTitle = "Fokus",
  suggestedCode = "1.5",
  onClose,
  onSave,
}: AddSubdimensiModalProps) {
  const [code, setCode] = useState(suggestedCode);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode(suggestedCode);
      setTitle("");
    }
  }, [isOpen, suggestedCode, isOpen]);

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
      id: `sub-${Date.now()}`,
      code: code.trim(),
      title: title.trim(),
      indikatorCount: 1,
      butirCount: 1,
      indikators: [
        {
          id: `ind-${Date.now()}`,
          code: `${code.trim()}.1`,
          title: title.trim(),
          butirCount: 1,
          items: [
            {
              id: `butir-${Date.now()}`,
              code: `${code.trim()}.1.1`,
              text: `Penerapan aspek ${title.trim()} dalam rutinitas kerja harian.`,
              categories: ["D", "A"],
            },
          ],
        },
      ],
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
                <h3 className="dash-modal-title">Tambah Subdimensi Baru</h3>
                <p className="dash-modal-subtitle">
                  Tambahkan subdimensi untuk {fokusTitle}.
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
                <label className="dash-form-label" htmlFor="input-sub-code">
                  Kode Subdimensi
                </label>
                <input
                  id="input-sub-code"
                  type="text"
                  className="dash-input-text mono-font"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="dash-form-field">
                <label className="dash-form-label" htmlFor="input-sub-title">
                  Judul Subdimensi
                </label>
                <input
                  id="input-sub-title"
                  type="text"
                  className="dash-input-text"
                  placeholder="Contoh: Efektivitas kolaborasi dan koordinasi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
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
                  Simpan Subdimensi
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
