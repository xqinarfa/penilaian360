"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  CheckSquare,
  TrendingUp,
  Cloud,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [{ name: "Beranda", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Data",
    items: [
      { name: "Data Pegawai", href: "/data-pegawai", icon: Users },
      { name: "Bank Instrumen", href: "/bank-instrumen", icon: FileText },
    ],
  },
  {
    title: "Evaluasi",
    items: [
      { name: "Periode Evaluasi", href: "/periode-evaluasi", icon: Calendar },
      { name: "Penilaian Aktif", href: "#penilaian", icon: CheckSquare, badge: 12 },
      { name: "Hasil & Laporan", href: "/laporan", icon: TrendingUp },
    ],
  },
  {
    title: "Sistem",
    items: [
      { name: "Integrasi", href: "#integrasi", icon: Cloud },
      { name: "Pengaturan", href: "#pengaturan", icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dash-sidebar-overlay"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <aside
        className={`dash-sidebar ${isOpen ? "mobile-open" : ""}`}
        aria-label="Navigasi Utama"
      >
        {/* Brand Header */}
        <div className="dash-sidebar-header">
          <Link href="/" className="dash-sidebar-logo" title="Beranda Penilaian 360">
            <motion.div
              className="dash-logo-box"
              aria-hidden="true"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span>360</span>
            </motion.div>
            <div className="dash-logo-text">
              <span className="dash-logo-title">Penilaian 360</span>
              <span className="dash-logo-sub">EVALUASI PASCA PELATIHAN</span>
            </div>
          </Link>
          {onClose && (
            <motion.button
              type="button"
              className="dash-sidebar-close-btn"
              onClick={onClose}
              aria-label="Tutup navigasi"
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* Nav Menu Items */}
        <nav className="dash-sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title} className="dash-nav-section">
              <div className="dash-nav-section-title">{section.title}</div>
              <ul className="dash-nav-list">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" &&
                      item.href !== "#" &&
                      !item.href.startsWith("#") &&
                      pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`dash-nav-item ${isActive ? "active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={onClose}
                      >
                        <Icon size={18} className="dash-nav-icon" aria-hidden="true" />
                        <span className="dash-nav-label">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className="dash-nav-badge">{item.badge}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Help Card & Version Footer */}
        <div className="dash-sidebar-footer">
          <motion.div
            className="dash-help-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="dash-help-icon-box" aria-hidden="true">
              <HelpCircle size={15} color="#ffffff" />
            </div>
            <div className="dash-help-text">
              <div className="dash-help-title">Butuh bantuan?</div>
              <Link href="#panduan" className="dash-help-link">
                Lihat panduan penilaian
              </Link>
            </div>
          </motion.div>
          <div className="dash-version-tag">v1.0 · PPSDMAP</div>
        </div>
      </aside>
    </>
  );
}
