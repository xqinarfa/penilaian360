"use client";

import { motion } from "framer-motion";
import { Calendar, Users, BarChart3 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
};

export default function MetricsGrid() {
  return (
    <motion.section
      className="dash-metrics-grid"
      aria-label="Ringkasan Metrik Evaluasi"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Metric Card 1 */}
      <motion.div
        className="dash-metric-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="dash-metric-top">
          <span className="dash-metric-label">Periode aktif</span>
          <div className="dash-metric-icon-box" aria-hidden="true">
            <Calendar size={16} color="#155bbb" />
          </div>
        </div>
        <div className="dash-metric-value">3</div>
        <div className="dash-metric-sub">
          <span className="dash-sub-highlight">2</span> berakhir Okt
        </div>
      </motion.div>

      {/* Metric Card 2 */}
      <motion.div
        className="dash-metric-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="dash-metric-top">
          <span className="dash-metric-label">Alumni dievaluasi</span>
          <div className="dash-metric-icon-box" aria-hidden="true">
            <Users size={16} color="#155bbb" />
          </div>
        </div>
        <div className="dash-metric-value">248</div>
        <div className="dash-metric-sub green">
          <span className="dash-sub-highlight">+36</span> bulan ini
        </div>
      </motion.div>

      {/* Metric Card 3 */}
      <motion.div
        className="dash-metric-card"
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="dash-metric-top">
          <span className="dash-metric-label">Tingkat pengisian</span>
          <div className="dash-metric-icon-box" aria-hidden="true">
            <BarChart3 size={16} color="#155bbb" />
          </div>
        </div>
        <div className="dash-metric-value">
          71,4<span className="dash-metric-unit">%</span>
        </div>
        <div className="dash-metric-sub green">
          <span className="dash-sub-highlight">↑ 8,2%</span> dibanding periode lalu
        </div>
      </motion.div>
    </motion.section>
  );
}
