"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, UserCheck, RefreshCw, ChevronRight } from "lucide-react";
import type { ActionQueueItem } from "@/types";

interface ActionItemWithHref extends ActionQueueItem {
  href: string;
}

const defaultActions: ActionItemWithHref[] = [
  {
    id: "act-1",
    title: "87 penilaian",
    highlight: " melewati batas waktu",
    subtitle: "Latasr CPNS Gel. II · tindakan segera",
    badgeText: "Mendesak",
    badgeType: "urgent",
    href: "/periode-evaluasi?tab=tertunda",
  },
  {
    id: "act-2",
    title: "36 alumni",
    highlight: " siap ditetapkan penilai",
    subtitle: "Masa evaluasi dimulai dalam 3 hari",
    badgeText: "Tinjau hari ini",
    badgeType: "today",
    href: "/data-pegawai",
  },
  {
    id: "act-3",
    title: "6 data KMS",
    highlight: " belum tersinkron",
    subtitle: "Cek koneksi sebelum pukul 17.00",
    badgeText: "Butuh sinkron",
    badgeType: "sync",
    href: "#integrasi",
  },
];

export default function ActionQueueCard() {
  return (
    <div id="antrean" className="dash-card dash-action-queue-card">
      <div className="dash-card-header">
        <div>
          <h2 className="dash-card-title">Antrean tindakan</h2>
          <p className="dash-card-sub">Selesaikan yang paling berdampak terlebih dahulu</p>
        </div>
        <Link href="/periode-evaluasi?tab=tertunda">
          <motion.span
            className="dash-btn-link-pill"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Lihat semua
          </motion.span>
        </Link>
      </div>

      <div className="dash-action-list">
        {defaultActions.map((action, idx) => {
          let Icon = AlertCircle;
          let iconColor = "#dc2626";
          let bgClass = "bg-urgent";

          if (action.badgeType === "today") {
            Icon = UserCheck;
            iconColor = "#1f6fd1";
            bgClass = "bg-today";
          } else if (action.badgeType === "sync") {
            Icon = RefreshCw;
            iconColor = "#b45309";
            bgClass = "bg-sync";
          }

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.25 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
            >
              <Link
                href={action.href}
                className="dash-action-item"
              >
                <div className={`dash-action-icon-box ${bgClass}`} aria-hidden="true">
                  <Icon size={16} color={iconColor} />
                </div>

                <div className="dash-action-info">
                  <div className="dash-action-title">
                    <span className={`highlight-${action.badgeType}`}>{action.title}</span>
                    <span className="text-dark">{action.highlight}</span>
                  </div>
                  <div className="dash-action-sub">{action.subtitle}</div>
                </div>

                <span className={`dash-badge-pill ${action.badgeType}`}>
                  {action.badgeText}
                </span>

                <ChevronRight size={16} className="dash-chevron-icon" aria-hidden="true" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
