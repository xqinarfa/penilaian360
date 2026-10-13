"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Plus,
  GripVertical,
  MoreHorizontal,
  Edit2,
  Edit3,
} from "lucide-react";
import type { FokusItem, ButirPertanyaanItem } from "@/types";
import SubdimensiAccordionItem from "./SubdimensiAccordionItem";

interface FokusAccordionTreeProps {
  fokusList: FokusItem[];
  onAddButir?: (indikatorId: string, indikatorCode: string) => void;
  onEditButir?: (butir: ButirPertanyaanItem) => void;
  onAddSubdimensi?: (fokusId: string) => void;
  onAddPertanyaanOpen?: (fokusId: string) => void;
}

export default function FokusAccordionTree({
  fokusList,
  onAddButir,
  onEditButir,
  onAddSubdimensi,
  onAddPertanyaanOpen,
}: FokusAccordionTreeProps) {
  const [expandedFokusIds, setExpandedFokusIds] = useState<string[]>(["fokus-1"]);
  const [expandedSubIds, setExpandedSubIds] = useState<string[]>(["sub-1-1"]);
  const [expandedIndikatorIds, setExpandedIndikatorIds] = useState<string[]>(["ind-1-1-1"]);

  const toggleFokus = (id: string) => {
    setExpandedFokusIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSub = (id: string) => {
    setExpandedSubIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleIndikator = (id: string) => {
    setExpandedIndikatorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="dash-instrumen-tree-container">
      <div className="dash-card dash-instrumen-tree-card">
        {fokusList.map((fokus) => {
          const isFokusExpanded = expandedFokusIds.includes(fokus.id);

          return (
            <div key={fokus.id} className="dash-fokus-group">
              {/* Fokus Header Row */}
              <div className="tree-row dash-fokus-row">
                <span className="drag-handle" aria-hidden="true" title="Tarik untuk mengubah urutan">
                  <GripVertical size={16} />
                </span>

                <button
                  type="button"
                  className={`chev ${isFokusExpanded ? "open" : ""}`}
                  onClick={() => toggleFokus(fokus.id)}
                  aria-expanded={isFokusExpanded}
                  aria-label={`${isFokusExpanded ? "Tutup" : "Buka"} ${fokus.title}`}
                >
                  <ChevronRight size={15} />
                </button>

                <div
                  className="dash-fokus-title-group"
                  onClick={() => toggleFokus(fokus.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFokus(fokus.id)}
                >
                  <span className="dash-fokus-heading">{fokus.title}</span>

                  {fokus.isIsianTerbuka ? (
                    <div className="dash-fokus-open-badge-row">
                      <span className="dash-status-pill purple">
                        <Edit3 size={11} aria-hidden="true" />
                        <span>Isian terbuka</span>
                      </span>
                      <span className="dash-fokus-meta-count">
                        <strong>{fokus.pertanyaanCount}</strong> pertanyaan
                      </span>
                    </div>
                  ) : (
                    <div className="dash-fokus-meta-count">
                      <span><strong>{fokus.subdimensiCount}</strong> subdimensi</span>
                      <span className="dash-meta-dot">·</span>
                      <span><strong>{fokus.butirCount}</strong> butir</span>
                    </div>
                  )}
                </div>

                {/* Row Action Buttons */}
                <div className="dash-row-actions">
                  <button
                    type="button"
                    className="row-action icon-btn"
                    title={fokus.isIsianTerbuka ? "Tambah pertanyaan" : "Tambah subdimensi"}
                    aria-label={fokus.isIsianTerbuka ? "Tambah pertanyaan" : "Tambah subdimensi"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fokus.isIsianTerbuka) {
                        onAddPertanyaanOpen?.(fokus.id);
                      } else {
                        onAddSubdimensi?.(fokus.id);
                      }
                    }}
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    type="button"
                    className="row-action icon-btn"
                    title="Menu opsi fokus"
                    aria-label="Menu opsi fokus"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Menu opsi fokus: ${fokus.title}`);
                    }}
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              {/* Fokus Expanded Content */}
              <AnimatePresence>
                {isFokusExpanded && (
                  <motion.div
                    className="dash-fokus-body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Render Open Questions for Fokus 6 */}
                    {fokus.isIsianTerbuka && fokus.openQuestions && (
                      <div className="dash-open-questions-container">
                        {fokus.openQuestions.map((oq) => (
                          <div key={oq.id} className="tree-row dash-open-q-item">
                            <span className="drag-handle" aria-hidden="true">
                              <GripVertical size={14} />
                            </span>
                            <div className="dash-open-q-content">
                              <div className="dash-butir-text-row">
                                <span className="dash-tree-code mono-font">{oq.code}</span>
                                <p className="dash-butir-text">{oq.text}</p>
                              </div>
                            </div>
                            <div className="dash-row-actions">
                              <button
                                type="button"
                                className="row-action icon-btn"
                                title="Edit pertanyaan"
                                onClick={() => alert(`Edit pertanyaan ${oq.code}`)}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                className="row-action icon-btn"
                                title="Menu opsi pertanyaan"
                                onClick={() => alert(`Menu opsi pertanyaan ${oq.code}`)}
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="dash-btn-tree-add"
                          onClick={() => onAddPertanyaanOpen?.(fokus.id)}
                        >
                          <Plus size={13} />
                          <span>Tambah pertanyaan terbuka</span>
                        </button>
                      </div>
                    )}

                    {/* Render Subdimensis via Modular Component */}
                    {fokus.subdimensis &&
                      fokus.subdimensis.map((sub) => (
                        <SubdimensiAccordionItem
                          key={sub.id}
                          sub={sub}
                          isSubExpanded={expandedSubIds.includes(sub.id)}
                          onToggleSub={() => toggleSub(sub.id)}
                          expandedIndikatorIds={expandedIndikatorIds}
                          onToggleIndikator={toggleIndikator}
                          onAddButir={onAddButir}
                          onEditButir={onEditButir}
                        />
                      ))}

                    {/* Add Subdimensi Button */}
                    {!fokus.isIsianTerbuka && (
                      <div className="dash-tree-add-subdimensi-row">
                        <button
                          type="button"
                          className="dash-btn-tree-add"
                          onClick={() => onAddSubdimensi?.(fokus.id)}
                        >
                          <Plus size={13} />
                          <span>Tambah subdimensi</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <p className="dash-instrumen-tree-footer-note">
        Fokus 6 berisi isian terbuka dan tidak ikut perhitungan indeks penerapan.
      </p>
    </div>
  );
}
