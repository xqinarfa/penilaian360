"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, Calendar, AlertCircle } from "lucide-react";
import { Sidebar, Topbar, ScheduleModal } from "@/components/dashboard";
import {
  PeriodeTable,
  AturanAntreanCards,
  PenilaianTertundaTable,
  DetailPenugasanPanel,
} from "@/components/periode-evaluasi";
import type { PenilaianTertundaItem } from "@/types";

const defaultPendingItem: PenilaianTertundaItem = {
  id: "tertunda-1",
  penilaiNama: "Bambang Hartono",
  penilaiNip: "198503152010011003",
  alumniNama: "Lukman Hakim",
  pelatihan: "Latsar CPNS Gel. II",
  kategori: "A",
  kategoriLabel: "Atasan langsung",
  periode: "Latsar CPNS Gel. II",
  deadline: "5 Okt 2026",
  deadlineStatus: "Lewat 8 hari",
  isOverdue: true,
  status: "Kedaluwarsa",
  email: "bambang.h@kemenhub.go.id",
  phone: "+62 812-3456-7890",
};

function PeriodeEvaluasiContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeMainTab, setActiveMainTab] = useState<"periode" | "tertunda">(
    tabParam === "tertunda" ? "tertunda" : "periode"
  );
  const [selectedPendingItem, setSelectedPendingItem] = useState<PenilaianTertundaItem | null>(defaultPendingItem);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync tab with URL query parameter when it changes
  useEffect(() => {
    if (tabParam === "tertunda") {
      setActiveMainTab("tertunda");
    } else if (tabParam === "periode") {
      setActiveMainTab("periode");
    }
  }, [tabParam]);

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
          {/* Page Header */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Periode Evaluasi</h1>
              <p className="dash-page-subtitle">
                Kelola periode evaluasi dan pantau penilaian yang belum selesai.
              </p>
            </div>

            <div className="dash-pegawai-actions">
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
                onClick={() => alert("Membuka formulir pembuatan periode evaluasi manual.")}
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
              <span className="dash-tab-count-badge danger">312</span>
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
                <PeriodeTable />
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
                    selectedItem={selectedPendingItem}
                    onSelectItem={(item) => setSelectedPendingItem(item)}
                  />
                </div>

                <AnimatePresence>
                  {selectedPendingItem && (
                    <DetailPenugasanPanel
                      item={selectedPendingItem}
                      onClose={() => setSelectedPendingItem(null)}
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
