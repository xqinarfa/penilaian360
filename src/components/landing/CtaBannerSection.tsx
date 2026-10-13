"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { easeExpo } from "@/lib/animations";

export default function CtaBannerSection() {
  return (
    <section id="panduan" className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-container">
        <motion.div
          className="cta-banner-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <img
            src="/cta-bg.png"
            alt="Aparatur Sipil Negara tersenyum memegang tablet"
            className="cta-bg-img"
          />
          <div className="cta-gradient-overlay" aria-hidden="true" />
          <div className="cta-shape-left" aria-hidden="true" />
          <div className="cta-shape-right" aria-hidden="true" />

          <div className="cta-content">
            <motion.h2
              id="cta-heading"
              className="cta-title"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: easeExpo }}
            >
              Sudah menerima undangan?
            </motion.h2>

            <motion.p
              className="cta-desc"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: easeExpo }}
            >
              Masuk untuk melihat tugas penilaian dan mengisi kuesioner Anda.
            </motion.p>

            <motion.div
              className="cta-actions"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: easeExpo }}
            >
              {/* Animated Button from Uiverse.io by ryota1231 */}
              <Link href="/login" className="animated-button" aria-label="Masuk Aplikasi">
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">Masuk Aplikasi</span>
                <span className="circle" aria-hidden="true" />
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </Link>

              <motion.a
                href="#panduan"
                className="btn-cta-secondary"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span>Panduan pengisian</span>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
