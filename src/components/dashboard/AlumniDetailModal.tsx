"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, AlertCircle, Plus, CheckCircle2, Building, BookOpen, Clock } from "lucide-react";
import type { AlumniEvaluationItem } from "@/types";

interface AlumniDetailModalProps {
  alumni: AlumniEvaluationItem | null;
  onClose: () => void;
}

export default function AlumniDetailModal({ alumni, onClose }: AlumniDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {alumni && (
        <motion.div
          className="dash-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-alumni-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="dash-modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {/* Modal Header */}
            <div className="dash-modal-header">
              <div>
                <span className="dash-modal-pill">Detail Evaluasi 360</span>
                <h3 id="modal-alumni-title" className="dash-modal-title">{alumni.nama}</h3>
                <p className="dash-modal-subtitle">NIP: {alumni.nip} · {alumni.unitKerja || "PPSDM Aparatur Perhubungan"}</p>
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

            {/* Modal Body */}
            <div className="dash-modal-body">
              {/* Metadata Grid */}
              <div className="dash-modal-meta-grid">
                <div className="dash-modal-meta-card">
                  <div className="dash-meta-icon"><BookOpen size={16} /></div>
                  <div>
                    <span className="dash-meta-label">Program Pelatihan</span>
                    <span className="dash-meta-value">{alumni.pelatihan}</span>
                  </div>
                </div>

                <div className="dash-modal-meta-card">
                  <div className="dash-meta-icon"><Clock size={16} /></div>
                  <div>
                    <span className="dash-meta-label">Jatuh Tempo Evaluasi</span>
                    <span className="dash-meta-value">{alumni.jatuhTempo} ({alumni.bulanPascaPelatihan} Bulan Pasca Pelatihan)</span>
                  </div>
                </div>

                <div className="dash-modal-meta-card">
                  <div className="dash-meta-icon"><Building size={16} /></div>
                  <div>
                    <span className="dash-meta-label">Status Penilai</span>
                    <span className={`dash-meta-status ${alumni.statusPenilai === "Lengkap" ? "complete" : "incomplete"}`}>
                      {alumni.statusPenilai === "Lengkap" ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>4 Penilai Terverifikasi</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={13} />
                          <span>{alumni.statusPenilai}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluators Section */}
              <div className="dash-evaluators-section">
                <div className="dash-evaluators-header">
                  <h4 className="dash-evaluators-title">Daftar Penilai Terdaftar (360°)</h4>
                  <button type="button" className="dash-btn-add-evaluator">
                    <Plus size={14} />
                    <span>Tambah Penilai</span>
                  </button>
                </div>

                <div className="dash-evaluators-list">
                  <div className="dash-evaluator-item">
                    <span className="dash-evaluator-role role-self">Diri Sendiri</span>
                    <div className="dash-evaluator-info">
                      <span className="dash-evaluator-name">{alumni.nama}</span>
                      <span className="dash-evaluator-nip">Pegawai yang bersangkutan</span>
                    </div>
                    <span className="dash-evaluator-status confirmed"><CheckCircle2 size={12} /> Terhubung</span>
                  </div>

                  <div className="dash-evaluator-item">
                    <span className="dash-evaluator-role role-boss">Atasan Langsung</span>
                    <div className="dash-evaluator-info">
                      <span className="dash-evaluator-name">Ir. Bambang Trihatmojo, M.T.</span>
                      <span className="dash-evaluator-nip">NIP: 197805122002121001 · Kepala Seksi Sarana</span>
                    </div>
                    <span className="dash-evaluator-status confirmed"><CheckCircle2 size={12} /> Terhubung</span>
                  </div>

                  <div className="dash-evaluator-item">
                    <span className="dash-evaluator-role role-peer">Rekan Sejawat (Peer)</span>
                    <div className="dash-evaluator-info">
                      <span className="dash-evaluator-name">Siti Rahmawati, S.Tr.Tra</span>
                      <span className="dash-evaluator-nip">NIP: 199508192022032005 · Analis Kebijakan</span>
                    </div>
                    <span className="dash-evaluator-status confirmed"><CheckCircle2 size={12} /> Terhubung</span>
                  </div>

                  <div className="dash-evaluator-item">
                    <span className="dash-evaluator-role role-sub">Bawahan / Mitra Kerja</span>
                    <div className="dash-evaluator-info">
                      {alumni.statusPenilai === "Belum Ada Penilai" ? (
                        <span className="dash-evaluator-name text-muted">Belum ditetapkan penilai</span>
                      ) : (
                        <>
                          <span className="dash-evaluator-name">Rian Ardiansyah</span>
                          <span className="dash-evaluator-nip">NIP: 199901152023011002 · Pengadministrasi Umum</span>
                        </>
                      )}
                    </div>
                    {alumni.statusPenilai === "Belum Ada Penilai" ? (
                      <button type="button" className="dash-btn-link-action">Pilih Pegawai</button>
                    ) : (
                      <span className="dash-evaluator-status confirmed"><CheckCircle2 size={12} /> Terhubung</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="dash-modal-footer">
              <button type="button" className="dash-btn-outline" onClick={onClose}>
                Tutup
              </button>
              <motion.button
                type="button"
                className="dash-btn-primary"
                onClick={() => {
                  alert("Relasi penilai berhasil diperbarui!");
                  onClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCheck size={16} />
                <span>Simpan Perubahan Relasi</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
