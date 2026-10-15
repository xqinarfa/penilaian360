"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import "./detail-individu.css";
import { AlumniDetailData, INITIAL_DIMAS_PRAKOSO_DATA } from "./types";
import { DetailIndividuHeader } from "./DetailIndividuHeader";
import { RadarProfilCard } from "./RadarProfilCard";
import { StatRingkasanCards } from "./StatRingkasanCards";
import { TabelRincianFokus } from "./TabelRincianFokus";
import { HambatanKutipanSection } from "./HambatanKutipanSection";

interface DetailIndividuViewProps {
  initialData?: AlumniDetailData;
}

const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const sectionItemVariants: Variants = {
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

export const DetailIndividuView: React.FC<DetailIndividuViewProps> = ({
  initialData = INITIAL_DIMAS_PRAKOSO_DATA,
}) => {
  const [data] = useState<AlumniDetailData>(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <motion.div
      className="dhi-container"
      variants={shouldReduceMotion ? undefined : pageContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toast Notification with AnimatePresence */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 10000,
              maxWidth: 420,
              padding: "12px 18px",
              borderRadius: 12,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: "13px",
              fontWeight: 500,
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
          >
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header with back link, title, actions, and auto-update status */}
      <motion.div variants={shouldReduceMotion ? undefined : sectionItemVariants}>
        <DetailIndividuHeader
          data={data}
          onExportPdf={() =>
            showToast(`Mengekspor Laporan Hasil Individu ${data.nama} (PDF)...`)
          }
          onExportExcel={() =>
            showToast(`Menyiapkan data evaluasi 360 ${data.nama} dalam format Excel...`)
          }
        />
      </motion.div>

      {/* 2. Main 2-Column Grid: Left Radar, Right 3 Stat Cards + Table */}
      <motion.div
        className="dhi-main-grid"
        variants={shouldReduceMotion ? undefined : sectionItemVariants}
      >
        {/* Left Column: Radar Profil */}
        <RadarProfilCard scores={data.radarScores} />

        {/* Right Column: 3 Stat Cards + Tabel Rincian per Fokus */}
        <div className="dhi-right-column">
          <StatRingkasanCards data={data} />
          <TabelRincianFokus items={data.rincianFokus} />
        </div>
      </motion.div>

      {/* 3. Section Hambatan Penerapan */}
      <motion.div variants={shouldReduceMotion ? undefined : sectionItemVariants}>
        <HambatanKutipanSection items={data.kutipanHambatan} />
      </motion.div>

      {/* Footer Disclaimer */}
      <motion.p
        className="dhi-footer-notice"
        variants={shouldReduceMotion ? undefined : sectionItemVariants}
      >
        Data contoh · Halaman ini akan diperbarui otomatis ketika penilai lain menyelesaikan tugasnya.
      </motion.p>
    </motion.div>
  );
};
