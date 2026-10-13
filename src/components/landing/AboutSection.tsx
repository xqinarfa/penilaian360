"use client";

import { motion, type Variants } from "framer-motion";
import { Users, Settings, MonitorSmartphone } from "lucide-react";
import {
  fadeInLeft,
  staggerContainer,
} from "@/lib/animations";
import type { AboutFeature } from "@/types";

const features: AboutFeature[] = [
  {
    title: "Penilaian multi perspektif",
    desc: "Masukan dari diri sendiri dan lingkungan kerja secara komprehensif.",
    Icon: Users,
  },
  {
    title: "Terintegrasi LMS dan KMS",
    desc: "Data kelulusan dan berbagi pengetahuan menjadi dasar evaluasi objektif.",
    Icon: Settings,
  },
  {
    title: "Pengisian fleksibel",
    desc: "Akses melalui komputer atau ponsel. Jawaban tersimpan otomatis secara aman.",
    Icon: MonitorSmartphone,
  },
];

// Presisi tumpukan rapi (stacked deck): kartu bertingkat simetris, lalu meluncur auto-tersusun saat scroll
const stackedCardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0.9,
    y: i === 0 ? 0 : i === 1 ? -124 : -248,
    scale: 1 - i * 0.04,
    zIndex: 3 - i,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    zIndex: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
      mass: 0.85,
      delay: 0.1 + i * 0.16,
    },
  }),
};

export default function AboutSection() {
  return (
    <section id="tentang" className="about-section" aria-labelledby="about-heading">
      <div className="about-container">
        {/* Left Column: Animasi hanya berjalan sekali (once: true), berulang hanya saat reload */}
        <motion.div
          className="about-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInLeft} className="section-label">
            TENTANG APLIKASI
          </motion.span>

          <motion.h2 id="about-heading" variants={fadeInLeft} className="about-title">
            Beragam perspektif.
            <br />
            Satu arah pengembangan.
          </motion.h2>

          <motion.p variants={fadeInLeft} className="about-desc">
            Penilaian 360 mendukung evaluasi penerapan hasil pelatihan sebagai bahan
            pengembangan pegawai secara holistik dan berkelanjutan.
          </motion.p>
        </motion.div>

        {/* Right Column: 3 Cards stacked rapi, auto-tersusun sekali saat scroll (once: true) */}
        <motion.div
          className="about-right"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="about-features-column">
            {features.map((feature, idx) => {
              const Icon = feature.Icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  custom={idx}
                  variants={stackedCardVariants}
                  whileHover={{ scale: 1.02, x: 6 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div className="feature-icon-bubble" aria-hidden="true">
                    <Icon size={32} className="feature-icon" />
                  </div>
                  <div className="feature-text-block">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
