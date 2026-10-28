"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ChevronRight, ArrowRight } from "lucide-react";
import type { AlumniEvaluationItem } from "@/types";
import { allAlumniDataset } from "@/lib/mock-alumni";

const AlumniDetailModal = dynamic(() => import("./AlumniDetailModal"), { ssr: false });
const ScheduleModal = dynamic(() => import("./ScheduleModal"), { ssr: false });

interface AlumniTableProps {
  searchTerm?: string;
}

export default function AlumniEvaluationTable({ searchTerm = "" }: AlumniTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniEvaluationItem | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const pageSize = 4;

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return allAlumniDataset;
    const lower = searchTerm.toLowerCase();
    return allAlumniDataset.filter(
      (item) =>
        item.nama.toLowerCase().includes(lower) ||
        item.nip.includes(searchTerm) ||
        item.pelatihan.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <>
      <section className="dash-card dash-table-card" aria-labelledby="alumni-table-title">
        <div className="dash-table-header">
          <div>
            <h2 id="alumni-table-title" className="dash-card-title">
              Alumni Memasuki Masa Evaluasi
            </h2>
            <p className="dash-card-sub">
              <strong>4 alumni</strong> dalam 7 hari ke depan · perlu diverifikasi penilainya
            </p>
          </div>
          <motion.button
            type="button"
            className="dash-btn-schedule"
            onClick={() => setIsScheduleOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Buka jadwal</span>
            <ArrowRight size={14} aria-hidden="true" />
          </motion.button>
        </div>

        <div className="dash-table-wrapper">
          <table className="dash-data-table">
            <thead>
              <tr>
                <th scope="col">PEGAWAI</th>
                <th scope="col">PELATIHAN</th>
                <th scope="col">SELESAI LMS</th>
                <th scope="col">SHARING KMS</th>
                <th scope="col">JATUH TEMPO</th>
                <th scope="col">PENILAI</th>
                <th scope="col" aria-label="Aksi"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 24px", color: "#64748b" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={24} color="#94a3b8" />
                      <span style={{ fontWeight: 600, color: "#334155", fontSize: "13.5px" }}>
                        Tidak ada data alumni yang cocok
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Coba gunakan kata kunci pencarian NIP, nama pegawai, atau program pelatihan lain.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="dash-table-clickable-row"
                    onClick={() => setSelectedAlumni(row)}
                    title={`Klik untuk melihat detail evaluasi 360 ${row.nama}`}
                  >
                  <td>
                    <div className="dash-cell-employee">
                      <span className="dash-emp-name">{row.nama}</span>
                      <span className="dash-emp-nip mono-font">{row.nip}</span>
                    </div>
                  </td>

                  <td>
                    <span className="dash-cell-text">{row.pelatihan}</span>
                  </td>

                  <td>
                    <span className="dash-cell-text">{row.selesaiLms}</span>
                  </td>

                  <td>
                    {row.sharingKms === "Selesai" ? (
                      <span className="dash-status-pill connected">
                        <CheckCircle2 size={12} color="#047857" aria-hidden="true" />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="dash-status-pill partial">
                        <AlertCircle size={12} color="#92400e" aria-hidden="true" />
                        <span>Tertahan</span>
                      </span>
                    )}
                  </td>

                  <td>
                    <span className={`dash-cell-text ${row.jatuhTempo === "—" ? "dash-text-muted" : ""}`}>
                      {row.jatuhTempo}
                    </span>
                  </td>

                  <td>
                    {row.penilai === "—" ? (
                      <span className="dash-text-muted">—</span>
                    ) : row.isPenilaiLengkap ? (
                      <span className="dash-penilai-done">
                        <strong>5</strong> <span>ditetapkan</span>
                      </span>
                    ) : (
                      <span className="dash-status-pill partial">
                        <AlertCircle size={12} color="#92400e" aria-hidden="true" />
                        <span>Belum lengkap</span>
                      </span>
                    )}
                  </td>

                  <td>
                    <ChevronRight size={16} className="dash-row-chevron" aria-hidden="true" />
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        <div className="dash-table-footer">
          <div className="dash-pagination-info">
            Menampilkan <strong>{paginatedData.length}</strong> dari {filteredData.length} alumni
          </div>
          <div className="dash-pagination-btns">
            <motion.button
              type="button"
              className="dash-btn-page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sebelumnya
            </motion.button>
            <motion.button
              type="button"
              className="dash-btn-page active"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Berikutnya
            </motion.button>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAlumni && (
        <AlumniDetailModal
          alumni={selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
        />
      )}

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <ScheduleModal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
        />
      )}
    </>
  );
}
