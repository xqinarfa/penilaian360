"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreHorizontal, Clock, CheckCircle2 } from "lucide-react";
import type { PeriodeEvaluasiItem } from "@/types";

const initialPeriodeData: PeriodeEvaluasiItem[] = [
  {
    id: "per-1",
    nama: "Latsar CPNS Gelombang II",
    createdAt: "1 Okt 2026",
    instrumen: "Latsar CPNS v2",
    alumniCount: 142,
    masaPengisian: "1–21 Okt 2026",
    progressPercent: 78,
    status: "Berjalan",
  },
  {
    id: "per-2",
    nama: "ECM Angkatan 4",
    createdAt: "5 Okt 2026",
    instrumen: "ECM v1",
    alumniCount: 58,
    masaPengisian: "5–25 Okt 2026",
    progressPercent: 84,
    status: "Berjalan",
  },
  {
    id: "per-3",
    nama: "PKA Angkatan 2",
    createdAt: "8 Sep 2026",
    instrumen: "Instrumen Inti v1",
    alumniCount: 48,
    masaPengisian: "8–29 Sep 2026",
    progressPercent: 48,
    status: "Diperpanjang",
  },
  {
    id: "per-4",
    nama: "Latsar CPNS Gelombang III",
    createdAt: "2 Nov 2026",
    instrumen: "Latsar CPNS v2",
    alumniCount: 96,
    masaPengisian: "2–22 Nov 2026",
    progressPercent: 0,
    status: "Terjadwal",
  },
  {
    id: "per-5",
    nama: "Pelatihan Teknis K3 Pelabuhan",
    createdAt: "1 Agu 2026",
    instrumen: "Instrumen Inti v1",
    alumniCount: 37,
    masaPengisian: "1–21 Agu 2026",
    progressPercent: 91,
    status: "Selesai",
  },
];

export default function PeriodeTable() {
  const [activeSubTab, setActiveSubTab] = useState<string>("Aktif");
  const [data] = useState<PeriodeEvaluasiItem[]>(initialPeriodeData);

  const subTabs = [
    { label: "Aktif", count: 3 },
    { label: "Terjadwal", count: 1 },
    { label: "Selesai", count: 12 },
    { label: "Semua", count: null },
  ];

  const filteredData = data.filter((item) => {
    if (activeSubTab === "Aktif") return item.status === "Berjalan" || item.status === "Diperpanjang";
    if (activeSubTab === "Terjadwal") return item.status === "Terjadwal";
    if (activeSubTab === "Selesai") return item.status === "Selesai";
    return true;
  });

  return (
    <div className="dash-periode-container">
      {/* Sub-tabs */}
      <div className="dash-subtabs-row" role="tablist" aria-label="Filter status periode">
        {subTabs.map((tab) => (
          <motion.button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeSubTab === tab.label}
            className={`dash-subtab ${activeSubTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.label)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="dash-subtab-badge">{tab.count}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tabel Periode */}
      <div className="dash-card dash-table-card">
        <div className="dash-table-wrapper">
          <table className="dash-data-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: "30%" }}>NAMA PERIODE</th>
                <th scope="col" style={{ width: "16%" }}>INSTRUMEN</th>
                <th scope="col" style={{ width: "10%", textAlign: "right" }}>ALUMNI</th>
                <th scope="col" style={{ width: "16%" }}>MASA PENGISIAN</th>
                <th scope="col" style={{ width: "18%" }}>PENGISIAN</th>
                <th scope="col" style={{ width: "14%" }}>STATUS</th>
                <th scope="col" style={{ width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="dash-periode-name-cell">
                      <Link
                        href="/periode-evaluasi/detail-alumni"
                        className="dash-periode-title hover:text-blue-600 transition"
                      >
                        {row.nama}
                      </Link>
                      <p className="dash-periode-meta">Dibuat otomatis · {row.createdAt}</p>
                    </div>
                  </td>
                  <td>
                    <span className="dash-table-inst-text">{row.instrumen}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="dash-table-count-text">{row.alumniCount}</span>
                  </td>
                  <td>
                    <span className="dash-table-date-text">{row.masaPengisian}</span>
                  </td>
                  <td>
                    {row.status === "Terjadwal" ? (
                      <span className="dash-table-italic-muted">Belum dibuka</span>
                    ) : (
                      <div className="dash-progress-inline">
                        <div className="dash-progress-track">
                          <motion.div
                            className={`dash-progress-fill ${
                              row.status === "Diperpanjang"
                                ? "warning"
                                : row.status === "Selesai"
                                ? "success"
                                : "primary"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${row.progressPercent}%` }}
                            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span className="dash-progress-text">{row.progressPercent}%</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {row.status === "Berjalan" && (
                      <span className="dash-pill-berjalan">
                        <span className="dash-dot-live" />
                        Berjalan
                      </span>
                    )}
                    {row.status === "Diperpanjang" && (
                      <span className="dash-pill-diperpanjang">
                        <Clock size={12} />
                        Diperpanjang
                      </span>
                    )}
                    {row.status === "Terjadwal" && (
                      <span className="dash-pill-terjadwal">
                        <span className="dash-dot-gray" />
                        Terjadwal
                      </span>
                    )}
                    {row.status === "Selesai" && (
                      <span className="dash-pill-selesai">
                        <CheckCircle2 size={12} />
                        Selesai
                      </span>
                    )}
                  </td>
                  <td>
                    <motion.button
                      type="button"
                      className="dash-row-more-btn"
                      aria-label="Aksi baris"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal size={16} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
