"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  AlertTriangle,
  AlertCircle,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import { KmsFailedModal } from "@/components/dashboard";

interface AturanAntreanCardsProps {
  onOpenScheduleModal?: () => void;
}

export default function AturanAntreanCards({ onOpenScheduleModal }: AturanAntreanCardsProps) {
  const [isKmsModalOpen, setIsKmsModalOpen] = useState(false);

  return (
    <>
      <div className="dash-periode-bottom-grid">
        {/* Card 1: Aturan Penjadwalan yang Berlaku */}
        <motion.div
          className="dash-periode-info-card"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Card Header */}
          <div className="dash-periode-card-head">
            <div className="dash-periode-card-title-group">
              <div className="dash-periode-card-icon-badge navy" aria-hidden="true">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="dash-periode-card-heading">Aturan penjadwalan yang berlaku</h3>
                <p className="dash-periode-card-subheading">Parameter yang dipakai penjadwal harian</p>
              </div>
            </div>

            <motion.button
              type="button"
              className="dash-btn-ubah-aturan"
              onClick={onOpenScheduleModal}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Sliders size={13} />
              <span>Ubah Aturan</span>
            </motion.button>
          </div>

          {/* Rules Key-Value List */}
          <dl className="dash-rules-table">
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Dasar jatuh tempo</dt>
              <dd className="dash-rules-val">Tanggal terakhir LMS / KMS</dd>
            </div>
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Bulan tunda</dt>
              <dd className="dash-rules-val">
                <span className="dash-rules-tag">6 bulan</span>
              </dd>
            </div>
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Hari persiapan</dt>
              <dd className="dash-rules-val">
                <span className="dash-rules-tag">7 hari</span>
              </dd>
            </div>
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Masa pengisian</dt>
              <dd className="dash-rules-val">
                <span className="dash-rules-tag">21 hari</span>
              </dd>
            </div>
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Pengingat otomatis</dt>
              <dd className="dash-rules-val">
                <span className="dash-rules-tag">Hari ke-3, 7, 14</span>
              </dd>
            </div>
            <div className="dash-rules-row">
              <dt className="dash-rules-key">Eskalasi ke admin</dt>
              <dd className="dash-rules-val">
                <span className="dash-rules-tag">Hari ke-18</span>
              </dd>
            </div>
          </dl>

          {/* Footer Note */}
          <div className="dash-rules-note-box">
            <Info size={14} className="text-blue shrink-0" />
            <span>
              Dieksekusi otomatis oleh <strong>daemon scheduler PPSDMAP</strong> setiap pukul 03.00 WIB.
            </span>
          </div>
        </motion.div>

        {/* Card 2: Antrean Penjadwal */}
        <motion.div
          className="dash-periode-info-card"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Card Header */}
          <div className="dash-periode-card-head">
            <div className="dash-periode-card-title-group">
              <div className="dash-periode-card-icon-badge emerald" aria-hidden="true">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="dash-periode-card-heading">Antrean penjadwal</h3>
                <p className="dash-periode-card-subheading">Diperbarui otomatis setiap 03.00 WIB</p>
              </div>
            </div>

            <span className="dash-queue-live-status">
              <span className="dash-dot-pulse-green" />
              Normal
            </span>
          </div>

          {/* Queue Boxes List */}
          <ul className="dash-queue-boxes-wrap">
            {/* Queue Item 1 */}
            <li className="dash-queue-card-item">
              <div className="dash-queue-avatar blue" aria-hidden="true">
                <Users size={18} />
              </div>
              <div className="dash-queue-text-group">
                <p className="dash-queue-headline">
                  <span className="dash-queue-accent-blue">36 alumni</span> jatuh tempo 30 hari ke depan
                </p>
                <p className="dash-queue-subtext">Siap masuk periode evaluasi otomatis</p>
              </div>
            </li>

            {/* Queue Item 2 */}
            <li className="dash-queue-card-item">
              <div className="dash-queue-avatar amber" aria-hidden="true">
                <AlertTriangle size={18} />
              </div>
              <div className="dash-queue-text-group">
                <p className="dash-queue-headline">
                  <span className="dash-queue-accent-amber">6 alumni</span> tertahan: belum ada data KMS
                </p>
                <div className="dash-queue-subtext">
                  <button
                    type="button"
                    className="dash-queue-action-btn"
                    onClick={() => setIsKmsModalOpen(true)}
                  >
                    <span>Lihat daftar log KMS</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </li>

            {/* Queue Item 3 */}
            <li className="dash-queue-card-item">
              <div className="dash-queue-avatar red" aria-hidden="true">
                <AlertCircle size={18} />
              </div>
              <div className="dash-queue-text-group">
                <p className="dash-queue-headline">
                  <span className="dash-queue-accent-red">3 alumni</span> tertahan: relasi kerja belum lengkap
                </p>
                <div className="dash-queue-subtext">
                  <Link href="/data-pegawai" className="dash-queue-action-btn">
                    <span>Lengkapi relasi pegawai</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* KMS Failed Records Modal */}
      <KmsFailedModal
        isOpen={isKmsModalOpen}
        onClose={() => setIsKmsModalOpen(false)}
      />
    </>
  );
}
