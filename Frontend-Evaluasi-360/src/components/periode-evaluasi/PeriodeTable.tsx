"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreHorizontal, Clock, CheckCircle2, Loader2, Calendar } from "lucide-react";
import type { PeriodeEvaluasiItem } from "@/types";

interface PeriodeTableProps {
  data?: PeriodeEvaluasiItem[];
  isLoading?: boolean;
}

export default function PeriodeTable({
  data = [],
  isLoading = false,
}: PeriodeTableProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("Aktif");

  const aktifCount = data.filter(
    (item) => item.status === "Berjalan" || item.status === "Diperpanjang"
  ).length;
  const terjadwalCount = data.filter((item) => item.status === "Terjadwal").length;
  const selesaiCount = data.filter((item) => item.status === "Selesai").length;

  const subTabs = [
    { label: "Aktif", count: aktifCount },
    { label: "Terjadwal", count: terjadwalCount },
    { label: "Selesai", count: selesaiCount },
    { label: "Semua", count: data.length },
  ];

  const filteredData = data.filter((item) => {
    if (activeSubTab === "Aktif")
      return item.status === "Berjalan" || item.status === "Diperpanjang";
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <Loader2 size={24} className="animate-spin text-primary-600" />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>Memuat daftar periode evaluasi...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <Calendar size={24} style={{ color: "#94a3b8" }} />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>
                        Tidak ada periode evaluasi pada status ini.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
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
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
