"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, Calendar, AlertCircle, RefreshCw, CheckCircle2, X } from "lucide-react";
import { Sidebar, Topbar, ScheduleModal } from "@/components/dashboard";
import {
  PeriodeTable,
  AturanAntreanCards,
  PenilaianTertundaTable,
  DetailPenugasanPanel,
  CreatePeriodeModal,
} from "@/components/periode-evaluasi";
import type { PeriodeEvaluasiItem, PenilaianTertundaItem } from "@/types";
import {
  fetchPeriodeList,
  fetchPenilaianTertundaList,
  kirimPengingatPenugasan,
} from "@/lib/api";

function PeriodeEvaluasiContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeMainTab, setActiveMainTab] = useState<"periode" | "tertunda">(
    tabParam === "tertunda" ? "tertunda" : "periode"
  );

  const [periodeList, setPeriodeList] = useState<PeriodeEvaluasiItem[]>([]);
  const [isLoadingPeriode, setIsLoadingPeriode] = useState(true);

  const [tertundaList, setTertundaList] = useState<PenilaianTertundaItem[]>([]);
  const [isLoadingTertunda, setIsLoadingTertunda] = useState(true);

  const [selectedPendingItem, setSelectedPendingItem] = useState<PenilaianTertundaItem | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCreatePeriodeModalOpen, setIsCreatePeriodeModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync tab with URL query parameter when it changes
  useEffect(() => {
    if (tabParam === "tertunda") {
      setActiveMainTab("tertunda");
    } else if (tabParam === "periode") {
      setActiveMainTab("periode");
    }
  }, [tabParam]);

  // Auto clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load Periode list from backend
  const loadPeriodeData = useCallback(async () => {
    try {
      setIsLoadingPeriode(true);
      const data = await fetchPeriodeList();
      setPeriodeList(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar periode.";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoadingPeriode(false);
    }
  }, []);

  // Load Penilaian Tertunda list from backend
  const loadTertundaData = useCallback(async () => {
    try {
      setIsLoadingTertunda(true);
      const data = await fetchPenilaianTertundaList();
      setTertundaList(data);
      if (data.length > 0) {
        setSelectedPendingItem((prev) => {
          if (prev) {
            const found = data.find((x) => x.id === prev.id);
            if (found) return found;
          }
          return data[0];
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat penilaian tertunda.";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoadingTertunda(false);
    }
  }, []);

  useEffect(() => {
    loadPeriodeData();
    loadTertundaData();
  }, [loadPeriodeData, loadTertundaData]);

  const handleCreatePeriodeSuccess = (newPeriode: PeriodeEvaluasiItem) => {
    setPeriodeList((prev) => [newPeriode, ...prev]);
    setNotification({
      type: "success",
      message: `Periode "${newPeriode.nama}" berhasil dibuat dan tersimpan di database!`,
    });
    loadPeriodeData();
  };

  const handleSendReminder = async (penugasanId: string) => {
    try {
      await kirimPengingatPenugasan(penugasanId);
      setNotification({
        type: "success",
        message: "Pengingat evaluasi berhasil dikirimkan ke penilai!",
      });
      await loadTertundaData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim pengingat.";
      setNotification({ type: "error", message: msg });
    }
  };

  return (
    <div className="dash-layout">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Column */}
      <div className="dash-main-column">
        {/* Topbar Header */}
        <Topbar
          breadcrumbMain="EVALUASI"
          breadcrumbSub="PERIODE EVALUASI"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main className="dash-content-body">
          {/* Toast Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                className={`mb-4 p-4 rounded-lg flex items-center justify-between text-sm ${
                  notification.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                }`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="flex items-center gap-2">
                  {notification.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
                  )}
                  <span>{notification.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Header */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Periode Evaluasi</h1>
              <p className="dash-page-subtitle">
                Kelola periode evaluasi dan pantau penilaian yang belum selesai lintas pelatihan.
              </p>
            </div>

            <div className="dash-pegawai-actions">
              <motion.button
                type="button"
                className="dash-btn-action-outline"
                onClick={() => {
                  loadPeriodeData();
                  loadTertundaData();
                }}
                title="Segarkan data dari database backend"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw
                  size={14}
                  className={isLoadingPeriode || isLoadingTertunda ? "animate-spin" : ""}
                />
                <span>Segarkan</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-action-outline"
                onClick={() => setIsScheduleModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock size={15} />
                <span>Aturan Penjadwalan</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-action-primary"
                onClick={() => setIsCreatePeriodeModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                <span>Periode Manual</span>
              </motion.button>
            </div>
          </div>

          {/* Main Tabs Header */}
          <div className="dash-main-tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeMainTab === "periode"}
              className={`dash-main-tab-btn ${activeMainTab === "periode" ? "active" : ""}`}
              onClick={() => setActiveMainTab("periode")}
            >
              <Calendar size={16} />
              <span>Daftar Periode</span>
              <span className="dash-tab-count-badge" style={{ backgroundColor: "#e2e8f0", color: "#334155" }}>
                {periodeList.length}
              </span>
              {activeMainTab === "periode" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="dash-tab-active-indicator"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeMainTab === "tertunda"}
              className={`dash-main-tab-btn ${activeMainTab === "tertunda" ? "active" : ""}`}
              onClick={() => setActiveMainTab("tertunda")}
            >
              <AlertCircle size={16} />
              <span>Penilaian Tertunda</span>
              <span className="dash-tab-count-badge danger">{tertundaList.length}</span>
              {activeMainTab === "tertunda" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="dash-tab-active-indicator"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          </div>

          {/* Animated Tab Panel Content */}
          <AnimatePresence mode="wait">
            {activeMainTab === "periode" && (
              <motion.div
                key="tab-periode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <PeriodeTable data={periodeList} isLoading={isLoadingPeriode} />
                <AturanAntreanCards onOpenScheduleModal={() => setIsScheduleModalOpen(true)} />
              </motion.div>
            )}

            {activeMainTab === "tertunda" && (
              <motion.div
                key="tab-tertunda"
                className="dash-split-layout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="dash-split-table-side">
                  <PenilaianTertundaTable
                    data={tertundaList}
                    isLoading={isLoadingTertunda}
                    selectedItem={selectedPendingItem}
                    onSelectItem={(item) => setSelectedPendingItem(item)}
                  />
                </div>

                <AnimatePresence>
                  {selectedPendingItem && (
                    <DetailPenugasanPanel
                      item={selectedPendingItem}
                      onClose={() => setSelectedPendingItem(null)}
                      onSendReminder={handleSendReminder}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Aturan Penjadwalan Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Buat Periode Manual Modal */}
      <CreatePeriodeModal
        isOpen={isCreatePeriodeModalOpen}
        onClose={() => setIsCreatePeriodeModalOpen(false)}
        onSuccess={handleCreatePeriodeSuccess}
      />
    </div>
  );
}

export default function PeriodeEvaluasiPage() {
  return (
    <Suspense fallback={null}>
      <PeriodeEvaluasiContent />
    </Suspense>
  );
}

