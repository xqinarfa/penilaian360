"use client";

import { motion } from "framer-motion";
import { Plus, ArrowRight, Layers, FileCheck } from "lucide-react";
import type { JenisPelatihanItem } from "@/types";

interface JenisPelatihanSidebarProps {
  pelatihanList: JenisPelatihanItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onNewPelatihan?: () => void;
}

export default function JenisPelatihanSidebar({
  pelatihanList,
  selectedId,
  onSelect,
  onNewPelatihan,
}: JenisPelatihanSidebarProps) {
  return (
    <aside
      className="dash-card dash-instrumen-aside"
      aria-label="Daftar Jenis Pelatihan"
    >
      {/* Header Kolom Kiri */}
      <div className="dash-instrumen-aside-head">
        <h2 className="dash-instrumen-aside-title">Jenis Pelatihan</h2>
        <motion.button
          type="button"
          className="dash-btn-aside-new"
          onClick={onNewPelatihan || (() => alert("Membuka formulir pembuatan jenis pelatihan baru."))}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Plus size={13} aria-hidden="true" />
          <span>Baru</span>
        </motion.button>
      </div>

      {/* Nav List */}
      <div className="dash-instrumen-pelatihan-list" role="tablist" aria-orientation="vertical">
        {pelatihanList.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`dash-pelatihan-nav-item ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(item.id)}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <div className="dash-pelatihan-item-content">
                <div className="dash-pelatihan-item-title-row">
                  <span className="dash-pelatihan-item-name">{item.nama}</span>
                  {isSelected && (
                    <span className="dash-pelatihan-active-dot" aria-hidden="true" />
                  )}
                </div>

                {item.useInstrumenInti ? (
                  <div className="dash-pelatihan-core-badge">
                    <FileCheck size={11} aria-hidden="true" />
                    <span>Pakai Instrumen Inti</span>
                  </div>
                ) : (
                  <div className="dash-pelatihan-item-meta">
                    <span>{item.butirCount} butir</span>
                    <span className="dash-meta-dot">·</span>
                    <span>{item.fokusCount} fokus</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="dash-instrumen-aside-footer">
        <p className="dash-instrumen-aside-note">
          Butir umum yang berlaku untuk semua pelatihan tanpa instrumen khusus dikelola di
        </p>
        <button
          type="button"
          className="dash-link-instrumen-inti"
          onClick={() => alert("Membuka konfigurasi Instrumen Inti.")}
        >
          <span>Instrumen Inti</span>
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
