"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Check } from "lucide-react";
import {
  Sidebar,
  Topbar,
  PriorityBanner,
  MetricsGrid,
  ActionQueueCard,
  IntegrationStatusCard,
  AlumniEvaluationTable,
} from "@/components/dashboard";

const availableYears = ["2026", "2025", "2024"];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  // Close year dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dash-layout">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="dash-main-column">
        {/* Topbar Header */}
        <Topbar
          onSearchChange={setSearchTerm}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dashboard Main Content Body */}
        <main className="dash-content-body">
          {/* Header Row: Title & Year Selector */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Beranda</h1>
              <p className="dash-page-subtitle">
                Selamat pagi, Rina. Berikut yang perlu diperhatikan hari ini.
              </p>
            </div>

            {/* Year Selector Dropdown */}
            <div className="dash-year-selector-wrapper" ref={yearDropdownRef}>
              <button
                type="button"
                className="dash-year-selector"
                aria-expanded={isYearDropdownOpen}
                aria-haspopup="listbox"
                onClick={() => setIsYearDropdownOpen((prev) => !prev)}
              >
                <Calendar size={16} className="dash-year-icon" aria-hidden="true" />
                <span className="dash-year-text">Tahun {selectedYear}</span>
                <ChevronDown
                  size={14}
                  className={`dash-year-chevron ${isYearDropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {isYearDropdownOpen && (
                  <motion.div
                    className="dash-year-dropdown-menu"
                    role="listbox"
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  >
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        role="option"
                        aria-selected={selectedYear === year}
                        className={`dash-year-option ${selectedYear === year ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                      >
                        <span>Tahun {year} {year === "2026" ? "(Aktif)" : ""}</span>
                        {selectedYear === year && <Check size={14} className="text-blue" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Section: Prioritas Hari Ini Banner */}
          <PriorityBanner />

          {/* Section: Ringkasan 3 Metrik Utama */}
          <MetricsGrid />

          {/* Section: Antrean Tindakan (2/3) + Status Integrasi (1/3) */}
          <div className="dash-two-col-row">
            <ActionQueueCard />
            <IntegrationStatusCard />
          </div>

          {/* Section: Tabel Alumni Memasuki Masa Evaluasi */}
          <AlumniEvaluationTable searchTerm={searchTerm} />

          {/* Footer Note */}
          <footer className="dash-footer-note">
            Data contoh · Angka pada halaman ini diperbarui otomatis setiap kali periode berjalan.
          </footer>
        </main>
      </div>
    </div>
  );
}
