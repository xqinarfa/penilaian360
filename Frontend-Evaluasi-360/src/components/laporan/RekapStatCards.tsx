import React from "react";
import { motion, type Variants } from "framer-motion";
import { Users, Star, BarChart2, Calendar } from "lucide-react";
import { RekapStats } from "./types";

interface RekapStatCardsProps {
  stats: RekapStats;
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
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const RekapStatCards: React.FC<RekapStatCardsProps> = ({ stats }) => {
  return (
    <motion.section
      className="hl-stat-grid"
      aria-label="Ringkasan Statistik Rekapitulasi"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Alumni dievaluasi */}
      <motion.div
        className="hl-card hl-stat-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.18 } }}
      >
        <div className="hl-stat-top">
          <p className="hl-stat-label">Alumni dievaluasi</p>
          <div className="hl-stat-icon-wrap" aria-hidden="true">
            <Users size={16} />
          </div>
        </div>
        <div className="hl-stat-main-row">
          <p className="hl-stat-value">{stats.alumniDievaluasi}</p>
        </div>
        <p className="hl-stat-footer">
          dari <strong>{stats.alumniTotal}</strong> di periode berjalan
        </p>
      </motion.div>

      {/* 2. Indeks penerapan rata-rata */}
      <motion.div
        className="hl-card hl-stat-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.18 } }}
      >
        <div className="hl-stat-top">
          <p className="hl-stat-label">Indeks penerapan rata-rata</p>
          <div className="hl-stat-icon-wrap" aria-hidden="true">
            <Star size={16} />
          </div>
        </div>
        <div className="hl-stat-main-row">
          <p className="hl-stat-value">
            {stats.indeksRataRata.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <span className="hl-stat-badge-rating">{stats.indeksKategori}</span>
        </div>
        <p className="hl-stat-footer">
          Skala <strong>1–4</strong>
        </p>
      </motion.div>

      {/* 3. Tingkat pengisian */}
      <motion.div
        className="hl-card hl-stat-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.18 } }}
      >
        <div className="hl-stat-top">
          <p className="hl-stat-label">Tingkat pengisian</p>
          <div className="hl-stat-icon-wrap" aria-hidden="true">
            <BarChart2 size={16} />
          </div>
        </div>
        <div className="hl-stat-main-row">
          <p className="hl-stat-value">
            {stats.tingkatPengisian.toLocaleString("id-ID", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </p>
          <span className="hl-stat-unit">%</span>
        </div>
        <p className="hl-stat-footer">
          <span className="hl-stat-trend-up">{stats.trenPengisian}</span> dari periode lalu
        </p>
      </motion.div>

      {/* 4. Periode dievaluasi */}
      <motion.div
        className="hl-card hl-stat-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.18 } }}
      >
        <div className="hl-stat-top">
          <p className="hl-stat-label">Periode dievaluasi</p>
          <div className="hl-stat-icon-wrap" aria-hidden="true">
            <Calendar size={16} />
          </div>
        </div>
        <div className="hl-stat-main-row">
          <p className="hl-stat-value">{stats.periodeCount}</p>
        </div>
        <p className="hl-stat-footer">{stats.periodeListStr}</p>
      </motion.div>
    </motion.section>
  );
};
