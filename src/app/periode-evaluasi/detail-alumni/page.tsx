"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar, Topbar } from "@/components/dashboard";
import { DetailAlumniView } from "@/components/periode-evaluasi/detail-alumni";

export default function DetailAlumniPage() {
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
          breadcrumbMain="PERIODE EVALUASI"
          breadcrumbSub="DETAIL ALUMNI"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main className="dash-content-body">
          {/* Breadcrumb Bar with Back Button */}
          <div className="da-breadcrumb-bar">
            <div className="da-breadcrumb-left">
              <Link
                href="/periode-evaluasi"
                className="da-back-btn"
                title="Kembali ke Periode Evaluasi"
              >
                <ArrowLeft size={16} />
              </Link>
              <nav aria-label="Breadcrumb" className="da-breadcrumb-nav">
                <Link href="/periode-evaluasi">
                  Periode Evaluasi
                </Link>
                <span className="da-breadcrumb-sep">/</span>
                <Link href="/periode-evaluasi">
                  Latsar CPNS Gel. II
                </Link>
                <span className="da-breadcrumb-sep">/</span>
                <span className="da-breadcrumb-current">Dimas Prakoso</span>
              </nav>
            </div>

            <div className="da-badge-active-period">
              <span className="da-dot-pulse" aria-hidden="true" />
              <span>Periode Aktif</span>
            </div>
          </div>

          {/* Main Detail View Component */}
          <DetailAlumniView />
        </main>
      </div>
    </div>
  );
}
