"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { AlumniDetailData } from "./types";

interface StatRingkasanCardsProps {
  data: AlumniDetailData;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const StatRingkasanCards: React.FC<StatRingkasanCardsProps> = ({ data }) => {
  const selisihFormatted = `${data.selisihDiriVsPihakLain > 0 ? "+" : ""}${data.selisihDiriVsPihakLain.toFixed(2).replace(".", ",")}`;

  return (
    <motion.div
      className="dhi-stat-cards-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Indeks Penerapan (Pihak Lain) */}
      <motion.div
        className="dhi-card dhi-stat-card"
        variants={cardVariants}
      >
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">
            Indeks penerapan <span style={{ color: "#64748B", fontWeight: 500 }}>(pihak lain)</span>
          </p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <Users size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">
            {data.indeksPihakLain.toFixed(2).replace(".", ",")}
          </span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer">
          <span className="dhi-badge-category">
            {data.kategoriPihakLain}
          </span>
        </div>
      </motion.div>

      {/* 2. Penilaian Diri */}
      <motion.div
        className="dhi-card dhi-stat-card"
        variants={cardVariants}
      >
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">Penilaian diri</p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <UserCheck size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">
            {data.penilaianDiri.toFixed(2).replace(".", ",")}
          </span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer dhi-selisih-row">
          <span className="selisih selisih-pos-high">{selisihFormatted}</span>
          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>
            vs pihak lain
          </span>
        </div>
      </motion.div>

      {/* 3. Rata-rata Angkatan dengan Visual Percentile Bar */}
      <motion.div
        className="dhi-card dhi-stat-card"
        variants={cardVariants}
      >
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">Rata-rata angkatan</p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <TrendingUp size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">
            {data.rataRataAngkatan.toFixed(2).replace(".", ",")}
          </span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer">
          {/* Visual Percentile Progress Track */}
          <div className="dhi-percentile-track" title={`Persentil: ${data.persentilAngkatan}%`}>
            <div
              className="dhi-percentile-fill"
              style={{ width: `${data.persentilAngkatan}%` }}
            />
          </div>
          <p className="dhi-stat-desc">
            Lebih baik dari{" "}
            <strong style={{ fontWeight: 700, color: "#1E293B" }}>
              {data.persentilAngkatan}% alumni
            </strong>{" "}
            angkatan
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
