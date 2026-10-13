"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "tentang", label: "Tentang", href: "#tentang" },
  { id: "alur", label: "Alur Evaluasi", href: "#alur" },
  { id: "panduan", label: "Panduan", href: "#panduan" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener for sticky elevation and precision scroll-spy
  useEffect(() => {
    // Initial sync with URL hash if present
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      if (navItems.some((item) => item.id === hashId)) {
        setActiveSection(hashId);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Avoid overriding active state during programmatic smooth scrolling
      if (isClickScrollingRef.current) return;

      // Bottom of page detection (highlights last section 'panduan')
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        setActiveSection("panduan");
        return;
      }

      // Detection threshold line at 38% of viewport height (natural reading eye level)
      const detectionLine = window.scrollY + Math.min(320, window.innerHeight * 0.38);

      const sectionPositions = navItems
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return { id: item.id, top };
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      for (let i = sectionPositions.length - 1; i >= 0; i--) {
        const { id, top } = sectionPositions[i];
        if (detectionLine >= top) {
          setActiveSection(id);
          return;
        }
      }

      // Above all sections (in Hero area) -> no nav item active
      setActiveSection(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);

    // Lock scroll spy listener during programmatic smooth scrolling
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const navOffset = 82;
      const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection(null);
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Left: Ministry and Brand Logo Block */}
        <Link
          href="/"
          onClick={handleBrandClick}
          className="brand-section"
          aria-label="Beranda Penilaian 360"
        >
          <motion.img
            src="/kemenhub-emblem.svg"
            alt="Lambang Kementerian Perhubungan"
            className="emblem-img"
            width={40}
            height={40}
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
          <div className="brand-titles">
            <span className="brand-title-main">Kementerian Perhubungan</span>
            <span className="brand-title-sub">Republik Indonesia</span>
          </div>
          <div className="brand-divider" aria-hidden="true" />
          <div className="subbrand-section">
            <span className="subbrand-title">Penilaian 360</span>
            <span className="subbrand-caption">PPSDM Aparatur Perhubungan</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links with Animated Underline */}
        <nav className="nav-links" aria-label="Navigasi Utama">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="nav-active-bar"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Authentication Action Button */}
        <div className="nav-actions">
          <motion.div
            className="nav-desktop-login-wrap"
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link href="/login" className="btn-nav-login">
              <span>Masuk Aplikasi</span>
              <ArrowRight size={16} aria-hidden="true" className="btn-arrow-icon" />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-nav-list" aria-label="Menu navigasi mobile">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mobile-nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/login"
                className="btn-mobile-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Masuk Aplikasi</span>
                <ArrowRight size={18} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
