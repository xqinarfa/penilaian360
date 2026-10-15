"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, AlertCircle, Mail, Phone, Send } from "lucide-react";
import type { PenilaianTertundaItem } from "@/types";

interface DetailPenugasanPanelProps {
  item: PenilaianTertundaItem;
  onClose: () => void;
  onSendReminder?: (id: string) => void;
}

export default function DetailPenugasanPanel({
  item,
  onClose,
  onSendReminder,
}: DetailPenugasanPanelProps) {
  return (
    <motion.aside
      className="dash-card dash-split-panel-side"
      aria-label="Detail Penugasan"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      {/* Header */}
      <div className="dash-panel-header">
        <div className="dash-panel-header-text">
          <p className="dash-panel-meta-label">DETAIL PENUGASAN</p>
          <h2 className="dash-panel-title">{item.penilaiNama}</h2>
        </div>
        <motion.button
          type="button"
          onClick={onClose}
          className="dash-btn-panel-close"
          aria-label="Tutup panel detail"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
        </motion.button>
      </div>

      <div className="dash-panel-content">
        {/* Overdue Warning Card */}
        {item.isOverdue && (
          <motion.div
            className="dash-overdue-alert"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dash-overdue-icon-box" aria-hidden="true">
              <AlertCircle size={18} />
            </div>
            <div className="dash-overdue-text">
              <p className="dash-overdue-title">{item.deadlineStatus}</p>
              <p className="dash-overdue-sub">
                Deadline {item.deadline} · belum ada jawaban tersimpan
              </p>
            </div>
          </motion.div>
        )}

        {/* Details Definition List */}
        <dl className="dash-detail-dl">
          <div className="dash-detail-row">
            <dt className="dash-detail-dt">Peran</dt>
            <dd className="dash-detail-dd">
              <span className={`dash-kat-badge kat-${item.kategori}`}>
                {item.kategori}
              </span>
              <span className="dash-detail-strong">{item.kategoriLabel}</span>
            </dd>
          </div>

          <div className="dash-detail-row">
            <dt className="dash-detail-dt">Menilai</dt>
            <dd className="dash-detail-dd-col">
              <Link
                href="/periode-evaluasi/detail-alumni"
                className="dash-detail-strong text-blue-600 hover:underline"
              >
                {item.alumniNama}
              </Link>
              <span className="dash-table-nip-mono">
                {item.alumniNip || "198902152014031002"}
              </span>
            </dd>
          </div>

          <div className="dash-detail-row">
            <dt className="dash-detail-dt">Periode</dt>
            <dd className="dash-detail-dd-col">
              <span className="dash-detail-strong">{item.periode}</span>
              <span className="dash-detail-meta-date">1–21 Okt 2026</span>
            </dd>
          </div>

          <div className="dash-detail-row">
            <dt className="dash-detail-dt">Kontak</dt>
            <dd className="dash-detail-dd-col">
              <div className="dash-contact-line">
                <Mail size={12} className="dash-contact-icon" />
                <span className="dash-contact-text">{item.email}</span>
              </div>
              <div className="dash-contact-line">
                <Phone size={12} className="dash-contact-icon" />
                <span className="dash-contact-text mono">{item.phone}</span>
              </div>
            </dd>
          </div>
        </dl>

        {/* Riwayat Pengiriman Timeline */}
        <div className="dash-timeline-block">
          <h3 className="dash-timeline-title">Riwayat pengiriman</h3>
          <ul className="dash-timeline-list">
            <li className="dash-timeline-item">
              <span className="dash-timeline-dot blue" aria-hidden="true" />
              <div className="dash-timeline-info">
                <p className="dash-timeline-event">Undangan dikirim</p>
                <p className="dash-timeline-time">1 Okt 2026, 09.12</p>
              </div>
            </li>
            <li className="dash-timeline-item">
              <span className="dash-timeline-dot amber" aria-hidden="true" />
              <div className="dash-timeline-info">
                <p className="dash-timeline-event">Pengingat 1 dikirim</p>
                <p className="dash-timeline-time">4 Okt 2026, 08.00</p>
              </div>
            </li>
            <li className="dash-timeline-item">
              <span className="dash-timeline-dot amber" aria-hidden="true" />
              <div className="dash-timeline-info">
                <p className="dash-timeline-event">Pengingat 2 dikirim</p>
                <p className="dash-timeline-time">8 Okt 2026, 08.00</p>
              </div>
            </li>
            {item.isOverdue && (
              <li className="dash-timeline-item">
                <span className="dash-timeline-dot red" aria-hidden="true" />
                <div className="dash-timeline-info">
                  <p className="dash-timeline-event red">Lewat batas waktu</p>
                  <p className="dash-timeline-time red">{item.deadline}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dash-panel-footer">
        <motion.button
          type="button"
          className="dash-btn-panel-primary"
          onClick={() => {
            if (onSendReminder) onSendReminder(item.id);
            alert(`Reminder berhasil dikirim ke ${item.penilaiNama} (${item.email})`);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send size={14} />
          <span>Kirim Reminder Sekarang</span>
        </motion.button>

        <div className="dash-panel-footer-grid">
          <motion.button
            type="button"
            className="dash-btn-panel-secondary"
            onClick={() => alert(`Buka dialog ganti penilai untuk ${item.penilaiNama}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ganti Penilai
          </motion.button>
          <motion.button
            type="button"
            className="dash-btn-panel-danger"
            onClick={() => alert(`Batalkan penugasan evaluasi untuk ${item.penilaiNama}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Batalkan
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
