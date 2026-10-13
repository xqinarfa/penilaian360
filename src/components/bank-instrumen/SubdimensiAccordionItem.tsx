"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus, GripVertical, MoreHorizontal, Edit2 } from "lucide-react";
import type { SubdimensiItem, ButirPertanyaanItem } from "@/types";

interface SubdimensiAccordionItemProps {
  sub: SubdimensiItem;
  isSubExpanded: boolean;
  onToggleSub: () => void;
  expandedIndikatorIds: string[];
  onToggleIndikator: (indikatorId: string) => void;
  onAddButir?: (indikatorId: string, indikatorCode: string) => void;
  onEditButir?: (butir: ButirPertanyaanItem) => void;
}

export default function SubdimensiAccordionItem({
  sub,
  isSubExpanded,
  onToggleSub,
  expandedIndikatorIds,
  onToggleIndikator,
  onAddButir,
  onEditButir,
}: SubdimensiAccordionItemProps) {
  return (
    <div className="dash-subdimensi-box">
      {/* Subdimensi Row */}
      <div className="tree-row dash-subdimensi-row">
        <span className="drag-handle" aria-hidden="true">
          <GripVertical size={14} />
        </span>

        <button
          type="button"
          className={`chev ${isSubExpanded ? "open" : ""}`}
          onClick={onToggleSub}
          aria-expanded={isSubExpanded}
          aria-label={`${isSubExpanded ? "Tutup" : "Buka"} ${sub.title}`}
        >
          <ChevronRight size={14} />
        </button>

        <div
          className="dash-subdimensi-title-wrap"
          onClick={onToggleSub}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggleSub()}
        >
          <span className="dash-tree-code mono-font">{sub.code}</span>
          <span className="dash-subdimensi-name">{sub.title}</span>
        </div>

        <span className="dash-subdimensi-count">
          {sub.indikatorCount} indikator · <strong>{sub.butirCount}</strong> butir
        </span>

        <div className="dash-row-actions">
          <button
            type="button"
            className="row-action icon-btn"
            title="Menu subdimensi"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Menu opsi subdimensi: ${sub.title}`);
            }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Subdimensi Body */}
      <AnimatePresence>
        {isSubExpanded && sub.indikators && (
          <motion.div
            className="dash-subdimensi-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sub.indikators.map((ind) => {
              const isIndikatorExpanded = expandedIndikatorIds.includes(ind.id);

              return (
                <div key={ind.id} className="dash-indikator-group">
                  {/* Indikator Row */}
                  <div className="tree-row dash-indikator-row">
                    <span className="drag-handle" aria-hidden="true">
                      <GripVertical size={13} />
                    </span>

                    <button
                      type="button"
                      className={`chev ${isIndikatorExpanded ? "open" : ""}`}
                      onClick={() => onToggleIndikator(ind.id)}
                      aria-expanded={isIndikatorExpanded}
                      aria-label={`${isIndikatorExpanded ? "Tutup" : "Buka"} ${ind.title}`}
                    >
                      <ChevronRight size={13} />
                    </button>

                    <div
                      className="dash-indikator-title-wrap"
                      onClick={() => onToggleIndikator(ind.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && onToggleIndikator(ind.id)}
                    >
                      <span className="dash-tree-code mono-font">{ind.code}</span>
                      <span className="dash-indikator-name">{ind.title}</span>
                    </div>

                    <span className="dash-indikator-count">
                      <strong>{ind.butirCount}</strong> butir
                    </span>

                    <div className="dash-row-actions">
                      <button
                        type="button"
                        className="row-action icon-btn"
                        title="Menu indikator"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Menu opsi indikator: ${ind.title}`);
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Butir List */}
                  {isIndikatorExpanded && ind.items && (
                    <div className="dash-butir-list">
                      {ind.items.map((butir) => (
                        <div key={butir.id} className="tree-row dash-butir-item">
                          <span className="drag-handle mt-0.5" aria-hidden="true">
                            <GripVertical size={13} />
                          </span>

                          <div className="dash-butir-content">
                            <div className="dash-butir-text-row">
                              <span className="dash-tree-code mono-font">{butir.code}</span>
                              <p className="dash-butir-text">{butir.text}</p>
                            </div>

                            {butir.agendaHint && (
                              <p className="dash-butir-hint-row">
                                Pengetahuan atau keterampilan dari agenda{" "}
                                <span className="dash-hint-tag">[nama agenda]</span> telah diterapkan dalam pekerjaan.
                              </p>
                            )}
                          </div>

                          {/* Categories */}
                          <div className="dash-butir-categories">
                            {butir.categories.map((cat) => (
                              <span
                                key={cat}
                                className={`dash-kat-badge kat-${cat}`}
                                title={`Kategori ${cat}`}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="dash-row-actions">
                            <button
                              type="button"
                              className="row-action icon-btn"
                              title="Edit butir"
                              aria-label="Edit butir"
                              onClick={() => onEditButir?.(butir)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="row-action icon-btn"
                              title="Menu butir"
                              aria-label="Menu butir"
                              onClick={() => alert(`Menu opsi butir: ${butir.code}`)}
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Tambah Butir Button */}
                      <div className="dash-add-butir-btn-wrap">
                        <button
                          type="button"
                          className="dash-btn-tree-add"
                          onClick={() => onAddButir?.(ind.id, ind.code)}
                        >
                          <Plus size={13} />
                          <span>Tambah butir di indikator ini</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
