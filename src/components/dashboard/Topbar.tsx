"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  Clock,
  Menu,
} from "lucide-react";

interface TopbarProps {
  onSearchChange?: (term: string) => void;
  onToggleSidebar?: () => void;
  breadcrumbMain?: string;
  breadcrumbSub?: string;
}

export default function Topbar({
  onSearchChange,
  onToggleSidebar,
  breadcrumbMain = "DASHBOARD",
  breadcrumbSub = "TAHUN 2026",
}: TopbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="dash-topbar" aria-label="Bilah Navigasi Atas">
      {/* Mobile Hamburger Toggle */}
      {onToggleSidebar && (
        <motion.button
          type="button"
          className="dash-btn-mobile-menu"
          onClick={onToggleSidebar}
          aria-label="Buka menu navigasi"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={20} />
        </motion.button>
      )}

      {/* Breadcrumb */}
      <div className="dash-breadcrumb">
        <span className="dash-crumb-main">{breadcrumbMain}</span>
        <span className="dash-crumb-sep">/</span>
        <span className="dash-crumb-sub">{breadcrumbSub}</span>
      </div>

      {/* Global Search Bar */}
      <div className="dash-search-container">
        <div className="dash-search-box">
          <Search size={16} className="dash-search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari pegawai, NIP, atau pelatihan"
            value={searchTerm}
            onChange={handleSearch}
            className="dash-search-input"
            aria-label="Pencarian pegawai, NIP, atau pelatihan"
          />
        </div>
      </div>

      {/* Action Items: Notification + Profile */}
      <div className="dash-topbar-actions">
        {/* Notification Button & Popover */}
        <div className="dash-dropdown-anchor" ref={notifRef}>
          <motion.button
            type="button"
            className="dash-btn-notif"
            aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
            onClick={() => setIsNotifOpen((prev) => !prev)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Bell size={18} aria-hidden="true" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  className="dash-notif-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                className="dash-dropdown-panel dash-notif-panel"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              >
                <div className="dash-notif-header">
                  <span className="dash-notif-title">Notifikasi ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="dash-notif-clear-btn"
                      onClick={() => setUnreadCount(0)}
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="dash-notif-list">
                  <div className="dash-notif-item unread">
                    <div className="dash-notif-icon-box urgent"><AlertTriangle size={14} /></div>
                    <div className="dash-notif-content">
                      <p className="dash-notif-text"><strong>87 penilaian</strong> melewati batas waktu periode CPNS Gel. II.</p>
                      <span className="dash-notif-time">10 menit yang lalu</span>
                    </div>
                  </div>
                  <div className="dash-notif-item unread">
                    <div className="dash-notif-icon-box sync"><Clock size={14} /></div>
                    <div className="dash-notif-content">
                      <p className="dash-notif-text">Sinkronisasi KMS tertahan <strong>9 data berkas</strong>.</p>
                      <span className="dash-notif-time">1 jam yang lalu</span>
                    </div>
                  </div>
                  <div className="dash-notif-item unread">
                    <div className="dash-notif-icon-box info"><User size={14} /></div>
                    <div className="dash-notif-content">
                      <p className="dash-notif-text">Ayu Lestari siap ditetapkan penilai 360.</p>
                      <span className="dash-notif-time">3 jam yang lalu</span>
                    </div>
                  </div>
                  <div className="dash-notif-item">
                    <div className="dash-notif-icon-box default"><Clock size={14} /></div>
                    <div className="dash-notif-content">
                      <p className="dash-notif-text">Laporan evaluasi periode Q3 selesai dikompilasi.</p>
                      <span className="dash-notif-time">Kemarin</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Button & Dropdown */}
        <div className="dash-dropdown-anchor" ref={profileRef}>
          <motion.div
            className="dash-user-profile"
            role="button"
            tabIndex={0}
            aria-label="Menu akun Rina Setyowati"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="dash-user-avatar" aria-hidden="true">
              <span>RS</span>
            </div>
            <div className="dash-user-info">
              <span className="dash-user-name">Rina Setyowati</span>
              <span className="dash-user-role">Admin PPSDMAP</span>
            </div>
            <ChevronDown size={14} className="dash-user-chevron" aria-hidden="true" />
          </motion.div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="dash-dropdown-panel dash-profile-menu"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              >
                <div className="dash-profile-menu-header">
                  <div className="dash-profile-menu-name">Rina Setyowati</div>
                  <div className="dash-profile-menu-email">rina.setyowati@dephub.go.id</div>
                  <div className="dash-profile-menu-nip">NIP: 198504122008122001</div>
                </div>
                <div className="dash-profile-menu-items">
                  <button type="button" className="dash-menu-item" onClick={() => setIsProfileOpen(false)}>
                    <User size={15} />
                    <span>Profil Saya</span>
                  </button>
                  <button type="button" className="dash-menu-item" onClick={() => setIsProfileOpen(false)}>
                    <Settings size={15} />
                    <span>Pengaturan Akun</span>
                  </button>
                  <div className="dash-menu-divider" />
                  <button type="button" className="dash-menu-item text-danger" onClick={handleLogout}>
                    <LogOut size={15} />
                    <span>Keluar Aplikasi</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
