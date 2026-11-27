"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PriorityBanner() {
  return (
    <motion.section
      className="dash-priority-banner"
      aria-labelledby="priority-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-priority-decoration" aria-hidden="true" />
      <div className="dash-priority-content">
        <div className="dash-priority-text-block">
          <span className="dash-priority-tag">PRIORITAS HARI INI</span>
          <h2 id="priority-heading" className="dash-priority-title">
            312 penilaian membutuhkan perhatian
          </h2>
          <p className="dash-priority-desc">
            87 di antaranya melewati batas waktu. Tetapkan penilai agar evaluasi tidak tertunda.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Link href="/periode-evaluasi?tab=tertunda" className="dash-btn-priority">
            <span>Tinjau penilaian</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
