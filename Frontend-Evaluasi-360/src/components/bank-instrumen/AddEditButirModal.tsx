"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import type { ButirPertanyaanItem } from "@/types";

interface AddEditButirModalProps {
  isOpen: boolean;
  initialData?: ButirPertanyaanItem | null;
  indikatorCode?: string;
  onClose: () => void;
  onSave: (butir: ButirPertanyaanItem) => void;
}

const allCategories: ("D" | "A" | "R" | "B")[] = ["D", "A", "R", "B"];
const categoryNames: Record<"D" | "A" | "R" | "B", string> = {
  D: "Diri sendiri",
  A: "Atasan",
  R: "Rekan kerja",
  B: "Bawahan",
};

export default function AddEditButirModal({
  isOpen,
  initialData,
  indikatorCode = "1.1.1",
  onClose,
  onSave,
}: AddEditButirModalProps) {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [hasAgendaHint, setHasAgendaHint] = useState(false);
  const [agendaName, setAgendaName] = useState("");
  const [categories, setCategories] = useState<("D" | "A" | "R" | "B")[]>(["D", "A"]);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setText(initialData.text);
      setHasAgendaHint(Boolean(initialData.agendaHint));
      setAgendaName(initialData.agendaHint ? "[nama agenda]" : "");
      setCategories(initialData.categories);
    } else {
      setCode(`${indikatorCode}.${Math.floor(Math.random() * 8) + 3}`);
      setText("");
      setHasAgendaHint(false);
      setAgendaName("");
      setCategories(["D", "A"]);
    }
  }, [initialData, indikatorCode, isOpen]);

  // Escape key handler & scroll lock
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

  const toggleCategory = (cat: "D" | "A" | "R" | "B") => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave({
      id: initialData ? initialData.id : `butir-${Date.now()}`,
      code: code.trim(),
      text: text.trim(),
      agendaHint: hasAgendaHint ? (agendaName || "[nama agenda]") : undefined,
      categories: categories.length > 0 ? categories : ["D"],
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
            className="dash-modal-container dash-form-modal-box"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal-header">
              <div>
                <h3 className="dash-modal-title">
                  {initialData ? "Ubah Butir Pertanyaan" : "Tambah Butir Pertanyaan"}
                </h3>
                <p className="dash-modal-subtitle">
                  Atur redaksi butir dan tentukan kategori penilai yang berhak mengisi.
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
              {/* Kode Butir */}
              <div className="dash-form-field">
                <label className="dash-form-label" htmlFor="input-kode-butir">
                  Kode Butir
                </label>
                <input
                  id="input-kode-butir"
                  type="text"
                  className="dash-input-text mono-font"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              {/* Redaksi Pertanyaan */}
              <div className="dash-form-field">
                <label className="dash-form-label" htmlFor="input-text-butir">
                  Teks Pertanyaan / Pernyataan
                </label>
                <textarea
                  id="input-text-butir"
                  rows={3}
                  className="dash-survey-textarea"
                  placeholder="Contoh: Tersedianya pekerjaan atau tugas yang memungkinkan penggunaan hasil pelatihan."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>

              {/* Target Kategori Penilai */}
              <div className="dash-form-field">
                <span className="dash-form-label">
                  Kategori Penilai yang Berlaku (Pilih minimal 1):
                </span>
                <div className="dash-category-toggle-grid">
                  {allCategories.map((cat) => {
                    const isActive = categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`dash-cat-toggle-card ${isActive ? "active" : ""}`}
                        onClick={() => toggleCategory(cat)}
                      >
                        <span className={`kat-badge kat-${cat}`}>{cat}</span>
                        <span className="dash-cat-toggle-name">{categoryNames[cat]}</span>
                        {isActive && <Check size={14} className="dash-cat-check text-blue" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Agenda Hint Toggle */}
              <div className="dash-form-checkbox-row">
                <input
                  type="checkbox"
                  id="toggle-agenda-hint"
                  checked={hasAgendaHint}
                  onChange={(e) => setHasAgendaHint(e.target.checked)}
                />
                <label htmlFor="toggle-agenda-hint" className="dash-checkbox-label-text">
                  Tambahkan petunjuk rujukan agenda pelatihan (misal: <em>[nama agenda]</em>)
                </label>
              </div>

              {/* Footer Actions */}
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
                  Simpan Butir
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
