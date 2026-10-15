"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { User, Briefcase, Shield } from "lucide-react";
import { KutipanHambatanItem } from "./types";

interface HambatanKutipanSectionProps {
  items: KutipanHambatanItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const quoteCardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HambatanKutipanSection: React.FC<HambatanKutipanSectionProps> = ({
  items,
}) => {
  return (
    <motion.section
      className="dhi-card dhi-hambatan-card"
      aria-label="Hambatan penerapan yang disampaikan"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="dhi-card-header" style={{ marginBottom: 16 }}>
        <h2 className="dhi-card-title">Hambatan penerapan yang disampaikan</h2>
        <p className="dhi-card-subtitle">
          Kutipan catatan evaluasi (isian verbatim tanpa identitas penilai rekan dan bawahan)
        </p>
      </div>

      <div className="dhi-quotes-grid">
        {items.map((item) => {
          const isDiri = item.sumber.toLowerCase().includes("diri");

          return (
            <motion.div
              key={item.id}
              className="dhi-quote-box"
              variants={quoteCardVariants}
            >
              <p className="dhi-quote-text">
                &ldquo;{item.kutipan}&rdquo;
              </p>

              <div className="dhi-quote-footer">
                <span className="dhi-quote-source-badge">
                  {isDiri ? (
                    <User size={13} style={{ color: "#0B2E59" }} />
                  ) : (
                    <Briefcase size={13} style={{ color: "#1F6FD1" }} />
                  )}
                  <span>Penilai: {item.sumber}</span>
                </span>

                <span className="dhi-quote-privacy-pill">
                  <Shield size={11} style={{ display: "inline", verticalAlign: "-1px", marginRight: 3, color: "#10B981" }} />
                  Kerahasiaan terjamin
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
