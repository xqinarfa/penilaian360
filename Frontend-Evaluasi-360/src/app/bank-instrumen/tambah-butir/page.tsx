"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sidebar, Topbar } from "@/components/dashboard";
import { TambahButirForm } from "@/components/bank-instrumen/tambah-butir";

export default function TambahButirPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <a href="#konten" className="skip-to-content">
        Lewati ke konten utama
      </a>

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
            breadcrumbMain="BANK INSTRUMEN"
            breadcrumbSub="LATSAR CPNS / TAMBAH BUTIR"
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />

          {/* Content Body */}
          <main id="konten" className="dash-content-body" style={{ paddingBottom: "80px" }}>
            {/* Header Row: Title & Subtitle */}
            <motion.div
              className="dash-page-header"
              style={{ marginBottom: "24px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                {/* Visual breadcrumbs */}
                <nav
                  aria-label="Breadcrumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "8px",
                  }}
                >
                  <Link
                    href="/bank-instrumen"
                    style={{
                      color: "#64748b",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Bank Instrumen
                  </Link>
                  <span style={{ color: "#cbd5e1" }}>/</span>
                  <Link
                    href="/bank-instrumen"
                    style={{
                      color: "#64748b",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Latsar CPNS
                  </Link>
                  <span style={{ color: "#cbd5e1" }}>/</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    Tambah Butir
                  </span>
                </nav>

                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#0b2e59",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Tambah Butir Pertanyaan
                </h1>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Instrumen{" "}
                  <strong style={{ color: "#1e293b", fontWeight: 600 }}>
                    Latsar CPNS
                  </strong>{" "}
                  · Fokus{" "}
                  <strong style={{ color: "#1e293b", fontWeight: 600 }}>
                    3. Sikap dan perilaku kerja
                  </strong>
                </p>
              </div>
            </motion.div>

            {/* Form Tambah Butir (Componentized with Inline Validation) */}
            <TambahButirForm />
          </main>
        </div>
      </div>
    </>
  );
}
