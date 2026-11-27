"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/dashboard";
import { LaporanView } from "@/components/laporan";

export default function LaporanPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          breadcrumbSub="HASIL & LAPORAN"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main id="konten" className="dash-content-body">
          <LaporanView />
        </main>
      </div>
    </div>
  );
}
