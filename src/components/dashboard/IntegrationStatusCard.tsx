"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import KmsFailedModal from "./KmsFailedModal";

export default function IntegrationStatusCard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isKmsModalOpen, setIsKmsModalOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("besok 02.00 WIB");

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncStatus("Menghubungkan ke API Kemenhub...");
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Baru saja (07:50 WIB) · Terhubung");
      setSyncStatus("Sinkronisasi 1.213 data berhasil diperbarui!");
      setTimeout(() => setSyncStatus(null), 3500);
    }, 1200);
  };

  return (
    <>
      <div id="integrasi" className="dash-card dash-integration-card">
        <div className="dash-card-header">
          <div>
            <h2 className="dash-card-title">Status integrasi</h2>
            <p className="dash-card-sub">Sinkronisasi terjadwal 02.00 WIB</p>
          </div>
          <motion.button
            type="button"
            className="dash-btn-detail"
            onClick={() => setIsKmsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Detail
          </motion.button>
        </div>

        <div className="dash-integration-list">
          {/* LMS Kemenhub Item */}
          <motion.div
            className="dash-integration-item"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <div className="dash-integration-item-top">
              <span className="dash-integration-name">LMS Kemenhub</span>
              <div className="dash-status-pill connected">
                <CheckCircle2 size={12} color="#047857" aria-hidden="true" />
                <span>Terhubung</span>
              </div>
            </div>
            <div className="dash-integration-sub">
              Hari ini 02.00 · <strong className="text-dark">1.204 data</strong>
            </div>
          </motion.div>

          {/* KMS Kemenhub Item */}
          <motion.div
            className="dash-integration-item warning-bg"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <div className="dash-integration-item-top">
              <span className="dash-integration-name">KMS Kemenhub</span>
              <div className="dash-status-pill partial">
                <AlertTriangle size={12} color="#92400e" aria-hidden="true" />
                <span>Sebagian</span>
              </div>
            </div>
            <div className="dash-integration-sub">
              Hari ini 02.15 · <strong className="text-amber">9 data gagal</strong>
            </div>
            <button
              type="button"
              className="dash-integration-link-failed"
              onClick={() => setIsKmsModalOpen(true)}
            >
              <span>Lihat 9 baris gagal</span>
              <ArrowRight size={12} aria-hidden="true" />
            </button>
          </motion.div>
        </div>

        {/* Footer Info & Sync Action Button */}
        <div className="dash-integration-footer">
          <div className="dash-next-sync-text">
            <AnimatePresence mode="wait">
              {syncStatus ? (
                <motion.span
                  key="status"
                  className="text-blue font-semibold"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {syncStatus}
                </motion.span>
              ) : (
                <motion.span
                  key="time"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sinkron berikutnya: <strong className="text-dark">{lastSyncTime}</strong>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="dash-btn-sync"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw
              size={14}
              className={isSyncing ? "spin-animate" : ""}
              aria-hidden="true"
            />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan sekarang"}</span>
          </motion.button>
        </div>
      </div>

      {/* KMS Failed Records Modal */}
      <KmsFailedModal
        isOpen={isKmsModalOpen}
        onClose={() => setIsKmsModalOpen(false)}
      />
    </>
  );
}
