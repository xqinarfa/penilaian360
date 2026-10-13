"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { slideContentVariants, easeExpo } from "@/lib/animations";
import type { HeroSlide } from "@/types";

const slides: HeroSlide[] = [
  {
    tag: "Evaluasi Pasca Pelatihan",
    title: "Bersama Membangun",
    highlight: "ASN yang Kompeten",
    desc: "Pahami penerapan hasil pelatihan melalui penilaian diri, atasan, rekan kerja, dan bawahan.",
  },
  {
    tag: "Transparan & Akuntabel",
    title: "Umpan Balik Holistik",
    highlight: "Budaya Kerja Unggul",
    desc: "Menghadirkan penilaian 360 derajat yang objektif untuk memetakan kekuatan dan akselerasi pengembangan kompetensi.",
  },
  {
    tag: "Ekosistem Terintegrasi",
    title: "Terhubung Langsung",
    highlight: "LMS & KMS Kemenhub",
    desc: "Data kelulusan diklat dan knowledge sharing berpadu menghasilkan rekomendasi pelatihan yang terarah.",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="hero-wrapper"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      aria-label="Sorotan Utama"
    >
      <img
        src="/hero-bg.png"
        alt="ASN Kementerian Perhubungan berdiskusi"
        className="hero-bg-img"
      />
      <div className="hero-gradient-overlay" aria-hidden="true" />
      {/* 1440px Framed Canvas Matching Exact Figma Artboard */}
      <div className="hero-stage">
        <div className="hero-curve-decoration" aria-hidden="true" />

        {/* Carousel Side Arrows */}
        <motion.button
          type="button"
          className="hero-nav-arrow hero-arrow-left"
          onClick={handlePrevSlide}
          aria-label="Slide sebelumnya"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(8, 120, 248, 0.9)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={22} />
        </motion.button>
        <motion.button
          type="button"
          className="hero-nav-arrow hero-arrow-right"
          onClick={handleNextSlide}
          aria-label="Slide berikutnya"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(8, 120, 248, 0.9)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={22} />
        </motion.button>

        <div className="hero-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              variants={slideContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="hero-tag">
                <span className="hero-tag-dash" aria-hidden="true">—</span>
                <span className="hero-tag-text">{slides[activeSlide].tag}</span>
              </div>

              <h1 className="hero-heading">
                {slides[activeSlide].title}
                <span className="hero-heading-highlight">
                  {slides[activeSlide].highlight}
                </span>
              </h1>

              <p className="hero-desc">{slides[activeSlide].desc}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: easeExpo }}
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
              href="#alur"
              className="btn-hero-secondary"
              whileHover={{ y: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span>Pelajari alurnya</span>
              <ArrowDown size={21} aria-hidden="true" />
            </motion.a>
          </motion.div>
        </div>

        {/* Carousel Pagination */}
        <div className="hero-carousel-nav">
          <div className="carousel-indicators" role="tablist" aria-label="Pilih slide">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className="indicator-btn"
                aria-label={`Slide ${idx + 1} dari ${slides.length}`}
                aria-selected={activeSlide === idx}
                role="tab"
              >
                <motion.span
                  className={activeSlide === idx ? "indicator-bar" : "indicator-dot"}
                  animate={{
                    width: activeSlide === idx ? 55 : 10,
                    height: activeSlide === idx ? 13 : 10,
                    backgroundColor: activeSlide === idx ? "#ffffff" : "#dce7f6",
                    borderRadius: activeSlide === idx ? 8 : 5,
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              </button>
            ))}
          </div>
          <div className="carousel-counter" aria-live="polite">
            0{activeSlide + 1} / 0{slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
