"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Check } from "lucide-react";

export type KategoriPenilaiCode = "D" | "A" | "R" | "B";

interface PreviewQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLivePreview: (kategori: KategoriPenilaiCode) => void;
}

interface KategoriOption {
  value: KategoriPenilaiCode;
  badge: "D" | "A" | "R" | "B";
  title: string;
  desc: string;
}

const kategoriOptions: KategoriOption[] = [
  {
    value: "D",
    badge: "D",
    title: "Diri sendiri",
    desc: "Alumni menilai penerapan hasil pelatihan sendiri",
  },
  {
    value: "A",
    badge: "A",
    title: "Atasan langsung",
    desc: "Atasan menilai penerapan di unit kerja",
  },
  {
    value: "R",
    badge: "R",
    title: "Rekan kerja",
    desc: "Rekan menilai kolaborasi dan perilaku kerja",
  },
  {
    value: "B",
    badge: "B",
    title: "Bawahan",
    desc: "Bawahan menilai kepemimpinan dan dukungan",
  },
];

export default function PreviewQuestionnaireModal({
  isOpen,
  onClose,
  onOpenLivePreview,
}: PreviewQuestionnaireModalProps) {
  const [selectedKategori, setSelectedKategori] = useState<KategoriPenilaiCode>("D");

  // Handle escape key and lock body scroll
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

  const handleOpen = () => {
    onOpenLivePreview(selectedKategori);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dash-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-preview-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Modal Panel Container */}
          <motion.div
            className="dash-modal-container dash-preview-modal-box"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="dash-modal-header">
              <div>
                <h3 id="modal-preview-title" className="dash-modal-title">
                  Pratinjau Kuesioner
                </h3>
                <p className="dash-modal-subtitle">
                  Pilih kategori penilai yang ingin dilihat.
                </p>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={onClose}
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Radio Category Cards List */}
            <div className="dash-preview-radio-list">
              {kategoriOptions.map((opt) => {
                const isChecked = selectedKategori === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`kat-radio ${isChecked ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKategori(opt.value);
                    }}
                  >
                    <input
                      type="radio"
                      name="kategori_penilai"
                      value={opt.value}
                      checked={isChecked}
                      onChange={() => setSelectedKategori(opt.value)}
                      className="kat-radio-hidden-input"
                    />
                    <span className={`kat-badge kat-${opt.badge}`}>
                      {opt.badge}
                    </span>
                    <div className="kat-radio-text-wrap">
                      <p className="kat-radio-title">{opt.title}</p>
                      <p className="kat-radio-desc">{opt.desc}</p>
                    </div>
                    {isChecked && (
                      <span className="kat-radio-check-wrap">
                        <Check size={16} className="text-blue" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Footer with Equal Width Action Buttons */}
            <div className="dash-modal-footer dash-modal-footer-equal">
              <button
                type="button"
                className="dash-btn-modal-cancel flex-1"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="button"
                className="dash-btn-modal-primary flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
              >
                <Eye size={15} />
                <span>Buka Pratinjau</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
