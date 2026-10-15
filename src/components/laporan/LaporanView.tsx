"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./laporan.css";
import {
  INITIAL_REKAP_STATS,
  INITIAL_FOKUS_LIST,
  INITIAL_HAMBATAN_LIST,
  INITIAL_HEATMAP_DATA,
  INITIAL_ALUMNI_INDIVIDU_LIST,
} from "./types";
import { LaporanHeader } from "./LaporanHeader";
import { LaporanTabs, LaporanActiveTab } from "./LaporanTabs";
import { RekapFilterBar } from "./RekapFilterBar";
import { RekapStatCards } from "./RekapStatCards";
import { FokusEvaluasiChart } from "./FokusEvaluasiChart";
import { HambatanTerbanyakCard } from "./HambatanTerbanyakCard";
import { PetaIndeksUnitKerjaTable } from "./PetaIndeksUnitKerjaTable";
import { IndividuFilterBar } from "./IndividuFilterBar";
import { HasilIndividuTable } from "./HasilIndividuTable";

export const LaporanView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LaporanActiveTab>("rekap");

  // Rekap filters
  const [pelatihanFilter, setPelatihanFilter] = useState("Semua pelatihan");
  const [tahunFilter, setTahunFilter] = useState("Tahun 2026");
  const [unitKerjaFilter, setUnitKerjaFilter] = useState("Semua unit kerja");

  // Individu filters
  const [searchQuery, setSearchQuery] = useState("");
  const [individuPeriodeFilter, setIndividuPeriodeFilter] = useState("Semua periode");

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered individu alumni
  const filteredAlumni = INITIAL_ALUMNI_INDIVIDU_LIST.filter((alumni) => {
    const matchesSearch =
      alumni.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.nip.includes(searchQuery) ||
      alumni.jabatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPeriode =
      individuPeriodeFilter === "Semua periode" ||
      alumni.periode === individuPeriodeFilter;

    return matchesSearch && matchesPeriode;
  });

  return (
    <div className="hl-container">
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
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
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

      {/* Header */}
      <LaporanHeader
        onExportExcel={() =>
          showToast("Menyiapkan berkas Excel Rekapitulasi Penilaian 360...")
        }
        onExportPdf={() =>
          showToast("Mengekspor Laporan Hasil Evaluasi dalam format PDF...")
        }
      />

      {/* Main Tabs */}
      <LaporanTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Animated Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "rekap" && (
          <motion.div
            key="tab-panel-rekap"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Filters */}
            <RekapFilterBar
              pelatihan={pelatihanFilter}
              onPelatihanChange={setPelatihanFilter}
              tahun={tahunFilter}
              onTahunChange={setTahunFilter}
              unitKerja={unitKerjaFilter}
              onUnitKerjaChange={setUnitKerjaFilter}
            />

            {/* 4 Stat Cards */}
            <RekapStatCards stats={INITIAL_REKAP_STATS} />

            {/* Grid: Bar Chart + Hambatan */}
            <div className="hl-chart-hambatan-grid">
              <FokusEvaluasiChart
                items={INITIAL_FOKUS_LIST}
                onDetailClick={() =>
                  showToast("Membuka rincian data per fokus evaluasi.")
                }
              />
              <HambatanTerbanyakCard
                items={INITIAL_HAMBATAN_LIST}
                onManageClick={() =>
                  showToast("Membuka panel manajemen kategori baku hambatan.")
                }
              />
            </div>

            {/* Heatmap Unit Kerja Table */}
            <PetaIndeksUnitKerjaTable data={INITIAL_HEATMAP_DATA} />
          </motion.div>
        )}

        {activeTab === "individu" && (
          <motion.div
            key="tab-panel-individu"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Filter Bar */}
            <IndividuFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              periodeFilter={individuPeriodeFilter}
              onPeriodeChange={setIndividuPeriodeFilter}
            />

            {/* Alumni Table */}
            <HasilIndividuTable alumniList={filteredAlumni} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
