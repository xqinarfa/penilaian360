"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Building2,
  Briefcase,
  IdCard,
  CheckCircle2,
} from "lucide-react";
import { AlumniDetailData } from "./types";

interface DetailIndividuHeaderProps {
  data: AlumniDetailData;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export const DetailIndividuHeader: React.FC<DetailIndividuHeaderProps> = ({
  data,
  onExportPdf,
  onExportExcel,
}) => {
  // Extract initials from name (e.g. "Dimas Prakoso" -> "DP")
  const initials = data.nama
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Nav Row: Back button + Action buttons */}
      <div className="dhi-nav-row">
        <Link
          href="/laporan"
          className="dhi-back-btn"
          title="Kembali ke daftar alumni"
        >
          <motion.span
            style={{ display: "inline-flex", alignItems: "center" }}
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            <ArrowLeft size={16} />
          </motion.span>
          <span>Kembali ke daftar alumni</span>
        </Link>

        {/* Action Buttons */}
        <div className="dhi-actions-group">
          <motion.button
            type="button"
            className="dhi-action-btn"
            onClick={onExportPdf}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            <Download size={15} style={{ color: "#475569" }} />
            <span>Unduh PDF</span>
          </motion.button>

          <motion.button
            type="button"
            className="dhi-action-btn"
            onClick={onExportExcel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            <FileSpreadsheet size={15} style={{ color: "#1F6FD1" }} />
            <span>Ekspor Excel</span>
          </motion.button>
        </div>
      </div>

      {/* Alumni Identity Hero Banner */}
      <div className="dhi-hero-card">
        <div className="dhi-hero-profile">
          <div className="dhi-hero-avatar" aria-hidden="true">
            {initials}
          </div>

          <div className="dhi-hero-info">
            <div className="dhi-hero-title-row">
              <h1 className="dhi-hero-name">
                Hasil Penilaian 360: {data.nama}
              </h1>
              <span className="dhi-progress-chip">
                <CheckCircle2 size={13} />
                {data.penilaiSelesai} dari {data.penilaiTotal} Penilai Selesai
              </span>
            </div>

            {/* Metadata Pills: NIP, Jabatan, Unit Kerja */}
            <div className="dhi-hero-tags">
              <span className="dhi-hero-tag">
                <IdCard size={13} style={{ color: "#64748B" }} />
                NIP {data.nip}
              </span>
              <span className="dhi-hero-tag">
                <Briefcase size={13} style={{ color: "#64748B" }} />
                {data.jabatan}
              </span>
              <span className="dhi-hero-tag">
                <Building2 size={13} style={{ color: "#64748B" }} />
                {data.unitKerja}
              </span>
            </div>

            <p className="dhi-hero-sub">
              {data.periode} &bull; Indeks keseluruhan dihitung dari penilaian pihak lain
            </p>
          </div>
        </div>

        {/* Side Status: Auto-update status */}
        <div className="dhi-hero-side-status">
          <span className="dhi-status-pill-pulse">
            <motion.span
              className="dhi-pulse-dot"
              aria-hidden="true"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [1, 0.75, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span>Data diperbarui otomatis</span>
          </span>
          <span style={{ fontSize: "11px", color: "#64748B" }}>
            Terakhir: <strong style={{ fontWeight: 600, color: "#334155" }}>{data.terakhirDiperbarui}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
