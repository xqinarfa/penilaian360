"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/dashboard";
import { DetailIndividuView } from "@/components/laporan/detail-individu";

export default function DetailHasilIndividuPage() {
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
          breadcrumbMain="HASIL & LAPORAN"
          breadcrumbSub="HASIL INDIVIDU"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main id="konten" className="dash-content-body">
          <DetailIndividuView />
        </main>
      </div>
    </div>
  );
}
