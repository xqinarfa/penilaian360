"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, CheckCircle2, Clock } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleWave {
  gelombang: string;
  pelatihan: string;
  periodePenilaian: string;
  kuotaAlumni: number;
  status: "Sedang Berjalan" | "Siap Dibuka" | "Mendatang";
}

const mockWaves: ScheduleWave[] = [
  { gelombang: "Gelombang 1 - 2026", pelatihan: "Latsar CPNS Golongan II & III", periodePenilaian: "14 Okt – 28 Okt 2026", kuotaAlumni: 120, status: "Sedang Berjalan" },
  { gelombang: "Gelombang 2 - 2026", pelatihan: "Executive Competency Management (ECM) 4", periodePenilaian: "16 Okt – 30 Okt 2026", kuotaAlumni: 48, status: "Sedang Berjalan" },
  { gelombang: "Gelombang 3 - 2026", pelatihan: "Pelatihan Kepemimpinan Administrator (PKA) 2", periodePenilaian: "20 Okt – 05 Nov 2026", kuotaAlumni: 80, status: "Siap Dibuka" },
  { gelombang: "Gelombang 4 - 2026", pelatihan: "Pelatihan Auditor Internal Perhubungan", periodePenilaian: "10 Nov – 24 Nov 2026", kuotaAlumni: 64, status: "Mendatang" },
];

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dash-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sched-title"
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
            <div className="dash-modal-header">
              <div>
                <span className="dash-modal-pill">Jadwal Evaluasi Pasca Pelatihan</span>
                <h3 id="modal-sched-title" className="dash-modal-title">Kalender Periode Evaluasi 2026</h3>
                <p className="dash-modal-subtitle">Jadwal pembukaan dan batas akhir penilaian 360 pegawai alumni</p>
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
              <div className="dash-sched-list">
                {mockWaves.map((wave, idx) => (
                  <motion.div
                    key={idx}
                    className="dash-sched-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 + 0.1, duration: 0.3 }}
                  >
                    <div className="dash-sched-icon-box">
                      <Calendar size={18} />
                    </div>
                    <div className="dash-sched-content">
                      <div className="dash-sched-top">
                        <span className="dash-sched-wave">{wave.gelombang}</span>
                        <span className={`dash-sched-status ${
                          wave.status === "Sedang Berjalan" ? "status-live" :
                          wave.status === "Siap Dibuka" ? "status-ready" : "status-upcoming"
                        }`}>
                          {wave.status === "Sedang Berjalan" && <Clock size={12} />}
                          {wave.status === "Siap Dibuka" && <CheckCircle2 size={12} />}
                          <span>{wave.status}</span>
                        </span>
                      </div>
                      <h4 className="dash-sched-program">{wave.pelatihan}</h4>
                      <div className="dash-sched-meta-row">
                        <span className="dash-sched-meta-item">
                          <strong>Periode:</strong> {wave.periodePenilaian}
                        </span>
                        <span className="dash-sched-meta-sep">·</span>
                        <span className="dash-sched-meta-item">
                          <strong>Target:</strong> {wave.kuotaAlumni} Alumni Pegawai
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="dash-modal-footer">
              <span className="dash-modal-footer-note">
                Penjadwalan harian berjalan otomatis berdasarkan tanggal kelulusan di LMS.
              </span>
              <motion.button
                type="button"
                className="dash-btn-primary"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tutup Kalender
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
