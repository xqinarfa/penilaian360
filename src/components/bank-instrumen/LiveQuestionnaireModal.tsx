"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle } from "lucide-react";
import type { FokusItem } from "@/types";
import type { KategoriPenilaiCode } from "./PreviewQuestionnaireModal";

interface LiveQuestionnaireModalProps {
  isOpen: boolean;
  kategori: KategoriPenilaiCode;
  pelatihanNama: string;
  fokusList: FokusItem[];
  onClose: () => void;
  onChangeKategori: (kategori: KategoriPenilaiCode) => void;
}

const kategoriLabels: Record<KategoriPenilaiCode, { name: string; roleDesc: string }> = {
  D: { name: "Diri Sendiri", roleDesc: "Evaluasi mandiri penerapan kompetensi pasca pelatihan" },
  A: { name: "Atasan Langsung", roleDesc: "Penilaian atasan terhadap kontribusi dan kinerja alumni di unit kerja" },
  R: { name: "Rekan Kerja", roleDesc: "Penilaian sejawat terkait kolaborasi, sikap kerja, dan transfer ilmu" },
  B: { name: "Bawahan", roleDesc: "Penilaian bawahan terkait kepemimpinan dan keteladanan pasca pelatihan" },
};

const likertOptions = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Ragu-ragu / Cukup" },
  { value: 4, label: "Setuju" },
  { value: 5, label: "Sangat Setuju" },
];

export default function LiveQuestionnaireModal({
  isOpen,
  kategori,
  pelatihanNama,
  fokusList,
  onClose,
  onChangeKategori,
}: LiveQuestionnaireModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});

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

  const currentInfo = kategoriLabels[kategori];

  // Extract questions that have this category
  const questionsToDisplay: {
    id: string;
    code: string;
    text: string;
    agendaHint?: string;
  }[] = [];

  fokusList.forEach((fokus) => {
    if (!fokus.isIsianTerbuka && fokus.subdimensis) {
      fokus.subdimensis.forEach((sub) => {
        if (sub.indikators) {
          sub.indikators.forEach((ind) => {
            if (ind.items) {
              ind.items.forEach((item) => {
                if (item.categories.includes(kategori)) {
                  questionsToDisplay.push({
                    id: item.id,
                    code: item.code,
                    text: item.text,
                    agendaHint: item.agendaHint,
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  const openQuestions = fokusList.find((f) => f.isIsianTerbuka)?.openQuestions || [];

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
          {/* Modal Dialog */}
          <motion.div
            className="dash-modal-container dash-live-survey-modal-box"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="dash-live-survey-header">
              <div className="dash-live-survey-head-left">
                <div className="dash-live-survey-tag-row">
                  <span className={`kat-badge kat-${kategori}`}>{kategori}</span>
                  <span className="dash-live-survey-tag-text">{currentInfo.name}</span>
                  <span className="dash-meta-dot">·</span>
                  <span className="dash-live-survey-training-name">{pelatihanNama}</span>
                </div>
                <h3 className="dash-live-survey-title">
                  Pratinjau Lembar Kuesioner Evaluasi 360
                </h3>
                <p className="dash-live-survey-subtitle">{currentInfo.roleDesc}</p>
              </div>

              <div className="dash-live-survey-head-right">
                {/* Category Quick Switcher */}
                <div className="dash-category-quick-switch" role="group" aria-label="Ganti kategori penilai">
                  {(["D", "A", "R", "B"] as KategoriPenilaiCode[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`dash-cat-switch-btn ${kategori === cat ? "active" : ""}`}
                      onClick={() => onChangeKategori(cat)}
                    >
                      {cat}
                    </button>
                  ))}
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
            </div>

            {/* Body Content */}
            <div className="dash-live-survey-body">
              {/* Petunjuk Pengisian */}
              <div className="dash-live-survey-instruction-card">
                <div className="dash-instruction-head">
                  <HelpCircle size={15} className="text-blue" />
                  <span className="dash-instruction-title">Petunjuk Pengisian Skala Likert:</span>
                </div>
                <div className="dash-likert-legend-grid">
                  {likertOptions.map((opt) => (
                    <div key={opt.value} className="dash-likert-legend-item">
                      <span className="dash-likert-legend-num">{opt.value}</span>
                      <span className="dash-likert-legend-txt">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="dash-live-questions-list">
                <h4 className="dash-survey-section-heading">
                  A. Pertanyaan Skala Indeks Penerapan ({questionsToDisplay.length} butir)
                </h4>

                {questionsToDisplay.length === 0 ? (
                  <div className="dash-empty-questions-notice">
                    Tidak ada butir pertanyaan yang ditujukan khusus untuk kategori penilai ini.
                  </div>
                ) : (
                  questionsToDisplay.map((q) => (
                    <div key={q.id} className="dash-survey-question-item">
                      <div className="dash-survey-q-top">
                        <span className="dash-tree-code mono-font">{q.code}</span>
                        <p className="dash-survey-q-text">{q.text}</p>
                      </div>

                      {q.agendaHint && (
                        <p className="dash-survey-q-hint">
                          Pengetahuan atau keterampilan dari agenda{" "}
                          <span className="dash-hint-tag">[nama agenda]</span> telah diterapkan dalam pekerjaan.
                        </p>
                      )}

                      {/* Likert 1-5 Radio Options */}
                      <div className="dash-survey-likert-row" role="radiogroup" aria-label={`Nilai untuk butir ${q.code}`}>
                        {likertOptions.map((opt) => {
                          const isSelected = answers[q.id] === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={`dash-likert-radio-pill ${isSelected ? "selected" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`answer_${q.id}`}
                                value={opt.value}
                                checked={isSelected}
                                onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                                className="sr-only"
                              />
                              <span className="dash-likert-pill-num">{opt.value}</span>
                              <span className="dash-likert-pill-label">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}

                {/* Section B: Open Questions */}
                {openQuestions.length > 0 && (
                  <div className="dash-survey-open-section">
                    <h4 className="dash-survey-section-heading">
                      B. Pertanyaan Isian Terbuka ({openQuestions.length} pertanyaan)
                    </h4>
                    {openQuestions.map((oq) => (
                      <div key={oq.id} className="dash-survey-question-item">
                        <div className="dash-survey-q-top">
                          <span className="dash-tree-code mono-font">{oq.code}</span>
                          <p className="dash-survey-q-text">{oq.text}</p>
                        </div>
                        <textarea
                          rows={3}
                          className="dash-survey-textarea"
                          placeholder="Ketikkan jawaban atau evaluasi deskriptif di sini..."
                          value={openAnswers[oq.id] || ""}
                          onChange={(e) => setOpenAnswers((prev) => ({ ...prev, [oq.id]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="dash-modal-footer">
              <span className="dash-preview-footer-note">
                Mode simulasi aktif · Data respons pratinjau tidak disimpan ke database evaluasi.
              </span>
              <button
                type="button"
                className="dash-btn-modal-cancel"
                onClick={onClose}
              >
                Kembali ke Bank Instrumen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
