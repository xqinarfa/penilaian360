"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";

interface KmsFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FailedRecord {
  id: string;
  nip: string;
  nama: string;
  pelatihan: string;
  alasan: string;
  waktu: string;
}

const mockFailedRecords: FailedRecord[] = [
  { id: "ERR-01", nip: "199709122022032008", nama: "Sari Wahyuni", pelatihan: "PKA Angkatan 2", alasan: "Dokumen Best Practice belum diunggah ke repositori KMS", waktu: "02.15 WIB" },
  { id: "ERR-02", nip: "199402112021021003", nama: "Budi Santoso", pelatihan: "Pelatihan Manajerial Dasar", alasan: "Metadata NIP tidak cocok dengan master data BKN", waktu: "02.15 WIB" },
  { id: "ERR-03", nip: "199105152019031002", nama: "Indra Lesmana", pelatihan: "PKP Angkatan 1", alasan: "Format video sharing knowledge melebihi batas 500MB", waktu: "02.15 WIB" },
  { id: "ERR-04", nip: "199308202020122001", nama: "Dewi Sartika", pelatihan: "PKA Angkatan 1", alasan: "Koneksi repositori penyimpanan timeout (>30s)", waktu: "02.15 WIB" },
  { id: "ERR-05", nip: "198901042014021001", nama: "Hendra Wijaya", pelatihan: "Latsar CPNS Gel. I", alasan: "Status persetujuan mentor di KMS masih 'Draft'", waktu: "02.15 WIB" },
  { id: "ERR-06", nip: "199511122022032004", nama: "Fitri Handayani", pelatihan: "ECM Angkatan 3", alasan: "Dokumen Rencana Aksi Perubahan (RAP) korup", waktu: "02.15 WIB" },
  { id: "ERR-07", nip: "199207072018011003", nama: "Yoga Pratama", pelatihan: "Pelatihan Auditor Internal", alasan: "Nomor sertifikat belum diterbitkan oleh penyelenggara", waktu: "02.15 WIB" },
  { id: "ERR-08", nip: "199604182022031002", nama: "Reza Pahlevi", pelatihan: "Latsar CPNS Gel. II", alasan: "Token autentikasi KMS kedaluwarsa pada batch kedua", waktu: "02.15 WIB" },
  { id: "ERR-09", nip: "199803252023012001", nama: "Nadya Putri", pelatihan: "ECM Angkatan 4", alasan: "Aktivitas forum sharing belum mencapai batas minimal 3 interaksi", waktu: "02.15 WIB" },
];

export default function KmsFailedModal({ isOpen, onClose }: KmsFailedModalProps) {
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRetrySingle = (id: string) => {
    setRetryingId(id);
    setTimeout(() => {
      setRetryingId(null);
      setResolvedIds((prev) => [...prev, id]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dash-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-kms-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="dash-modal-container kms-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="dash-modal-header">
              <div>
                <span className="dash-modal-pill pill-amber">Log Sinkronisasi KMS</span>
                <h3 id="modal-kms-title" className="dash-modal-title">9 Baris Data Gagal Tersinkron</h3>
                <p className="dash-modal-subtitle">Sinkronisasi batch harian tanggal 13 Okt 2026 pukul 02.00 WIB</p>
              </div>
              <motion.button
                type="button"
                className="dash-modal-close-btn"
                onClick={onClose}
                aria-label="Tutup modal"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="dash-modal-body">
              <div className="dash-kms-table-wrapper">
                <table className="dash-kms-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>NIP & NAMA</th>
                      <th style={{ width: "25%" }}>PROGRAM PELATIHAN</th>
                      <th style={{ width: "35%" }}>PENYEBAB KEGAGALAN</th>
                      <th style={{ width: "15%", textAlign: "center" }}>TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFailedRecords.map((rec) => {
                      const isResolved = resolvedIds.includes(rec.id);
                      const isRetrying = retryingId === rec.id;
                      return (
                        <tr key={rec.id} className={isResolved ? "row-resolved" : ""}>
                          <td>
                            <span className="dash-kms-emp-name">{rec.nama}</span>
                            <span className="dash-kms-emp-nip">{rec.nip}</span>
                          </td>
                          <td>
                            <span className="dash-kms-program">{rec.pelatihan}</span>
                          </td>
                          <td>
                            <div className="dash-kms-reason-box">
                              <AlertTriangle size={13} className="text-amber" />
                              <span className="dash-kms-reason-text">{rec.alasan}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {isResolved ? (
                              <span className="dash-kms-badge-success">
                                <CheckCircle2 size={12} /> Tersinkron
                              </span>
                            ) : (
                              <motion.button
                                type="button"
                                className="dash-btn-retry"
                                disabled={isRetrying}
                                onClick={() => handleRetrySingle(rec.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <RefreshCw size={12} className={isRetrying ? "spin-animate" : ""} />
                                <span>{isRetrying ? "Mencoba..." : "Sinkron Ulang"}</span>
                              </motion.button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dash-modal-footer">
              <span className="dash-modal-footer-note">
                Sinkronisasi otomatis berikutnya dijadwalkan besok pukul 02.00 WIB.
              </span>
              <motion.button
                type="button"
                className="dash-btn-primary"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tutup Log
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
