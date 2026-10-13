"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, MessageCircle, Camera, PlayCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Logos */}
          <div className="footer-col-brand">
            <div className="footer-logos">
              <img
                src="/kemenhub.svg"
                alt="Logo Kementerian Perhubungan"
                className="footer-logo-img"
                width={41}
                height={48}
              />
              <img
                src="/bpsdmp.png"
                alt="Logo BPSDMP"
                className="footer-logo-img"
                width={51}
                height={48}
              />
              <img
                src="/ppsdmap.png"
                alt="Logo PPSDMAP"
                className="footer-logo-img"
                width={48}
                height={48}
              />
              <img
                src="/corpus.png"
                alt="Logo Corpus"
                className="footer-logo-img"
                width={41}
                height={48}
              />
            </div>

            <div className="footer-brand-text-block">
              <h3 className="footer-brand-title">Kemenhub</h3>
              <p className="footer-brand-subtitle">Pusat Pengetahuan Terpadu</p>
            </div>

            <p className="footer-brand-desc">
              Platform Knowledge Management System (KMS) Kementerian Perhubungan
              Republik Indonesia untuk mewujudkan budaya berbagi pengetahuan dan
              kolaborasi antar pegawai.
            </p>
          </div>

          {/* Column 2: Tautan Cepat */}
          <div className="footer-col">
            <div className="footer-col-header">
              <h4 className="footer-heading">Tautan Cepat</h4>
            </div>
            <ul className="footer-nav-list">
              <li>
                <Link href="/" className="footer-nav-link">
                  Beranda
                </Link>
              </li>
              <li>
                <a href="#tentang" className="footer-nav-link">
                  Tentang KMS
                </a>
              </li>
              <li>
                <a href="#alur" className="footer-nav-link">
                  Modul Repositori
                </a>
              </li>
              <li>
                <a href="#" className="footer-nav-link">
                  Forum Diskusi
                </a>
              </li>
              <li>
                <a href="#panduan" className="footer-nav-link">
                  Panduan Pengguna
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hubungi Kami */}
          <div className="footer-col">
            <div className="footer-col-header">
              <h4 className="footer-heading">Hubungi Kami</h4>
            </div>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={20} className="footer-contact-icon" aria-hidden="true" />
                <span className="footer-contact-text">
                  Jl. Medan Merdeka Barat No. 8
                  <br />
                  Jakarta Pusat, DKI Jakarta 10110
                </span>
              </li>
              <li className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" aria-hidden="true" />
                <span className="footer-contact-text">151 (Contact Center)</span>
              </li>
              <li className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" aria-hidden="true" />
                <span className="footer-contact-text">info151@dephub.go.id</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Ikuti Kami */}
          <div className="footer-col">
            <div className="footer-col-header">
              <h4 className="footer-heading">Ikuti Kami</h4>
            </div>
            <div className="footer-social-row">
              <motion.a
                href="https://dephub.go.id"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Website Resmi Kemenhub"
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={20} />
              </motion.a>
              <motion.a
                href="https://dephub.go.id/kontak"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Kontak Kemenhub"
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com/kemenhub151"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Instagram Kemenhub"
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera size={20} />
              </motion.a>
              <motion.a
                href="https://youtube.com/@kemenhub151"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="YouTube Kemenhub"
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle size={20} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 Kementerian Perhubungan RI. Hak Cipta Dilindungi.
          </p>
          <div className="footer-legal-links">
            <a href="#terms" className="footer-legal-link">
              Syarat &amp; Ketentuan
            </a>
            <a href="#privacy" className="footer-legal-link">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
