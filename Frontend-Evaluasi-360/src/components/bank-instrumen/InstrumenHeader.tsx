"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Eye, Copy, Plus } from "lucide-react";

interface InstrumenHeaderProps {
  title?: string;
  versi?: string;
  tanggalTerbit?: string;
  periodeAktif?: string;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onAddFokus?: () => void;
}

export default function InstrumenHeader({
  title = "Instrumen Latsar CPNS",
  versi = "2",
  tanggalTerbit = "2 Okt 2026",
  periodeAktif = "1 periode aktif",
  onPreview,
  onDuplicate,
  onAddFokus,
}: InstrumenHeaderProps) {
  return (
    <div className="dash-card dash-instrumen-header-card">
      <div className="dash-instrumen-head-top">
        {/* Left Information */}
        <div className="dash-instrumen-head-info">
          <div className="dash-instrumen-title-row">
            <h2 className="dash-instrumen-main-title">{title}</h2>
            <div className="dash-status-pill connected" aria-label="Status instrumen: Terbit">
              <CheckCircle2 size={12} aria-hidden="true" />
              <span>Terbit</span>
            </div>
          </div>

          <div className="dash-instrumen-meta-row">
            <span>Versi <strong>{versi}</strong></span>
            <span className="dash-meta-dot">·</span>
            <span>Diterbitkan <strong>{tanggalTerbit}</strong></span>
            <span className="dash-meta-dot">·</span>
            <span>Digunakan pada <strong>{periodeAktif}</strong></span>
          </div>

          <div className="dash-instrumen-locked-notice">
            <Lock size={13} className="text-amber" aria-hidden="true" />
            <span>Versi terbit tidak dapat diubah. Buat versi baru untuk perubahan.</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="dash-instrumen-head-actions">
          <motion.button
            type="button"
            className="dash-btn-action-outline"
            onClick={onPreview || (() => alert("Membuka pratinjau instrumen evaluasi 360."))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={14} aria-hidden="true" />
            <span>Pratinjau</span>
          </motion.button>

          <motion.button
            type="button"
            className="dash-btn-action-outline"
            onClick={onDuplicate || (() => alert("Menduplikasi instrumen menjadi versi draf baru."))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Copy size={14} aria-hidden="true" />
            <span>Duplikat Versi</span>
          </motion.button>

          <motion.button
            type="button"
            className="dash-btn-action-primary"
            onClick={onAddFokus || (() => alert("Membuka modal penambahan fokus baru."))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={15} aria-hidden="true" />
            <span>Fokus</span>
          </motion.button>
        </div>
      </div>

      {/* Legend Kategori Penilai */}
      <div className="dash-instrumen-legend-bar">
        <span className="dash-legend-label">Kategori penilai:</span>
        <div className="dash-legend-items">
          <div className="dash-legend-chip">
            <span className="dash-kat-badge kat-D">D</span>
            <span>Diri sendiri</span>
          </div>
          <div className="dash-legend-chip">
            <span className="dash-kat-badge kat-A">A</span>
            <span>Atasan</span>
          </div>
          <div className="dash-legend-chip">
            <span className="dash-kat-badge kat-R">R</span>
            <span>Rekan kerja</span>
          </div>
          <div className="dash-legend-chip">
            <span className="dash-kat-badge kat-B">B</span>
            <span>Bawahan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
