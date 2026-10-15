import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FokusEvaluasiItem } from "./types";

interface FokusEvaluasiChartProps {
  items: FokusEvaluasiItem[];
  onDetailClick?: () => void;
}

export const FokusEvaluasiChart: React.FC<FokusEvaluasiChartProps> = ({
  items,
  onDetailClick,
}) => {
  // Height calculation relative to max score of 4.0
  const getHeightPercent = (score: number) => {
    return Math.min(100, Math.round((score / 4.0) * 100));
  };

  return (
    <section className="hl-card hl-chart-card" aria-label="Grafik Indeks per Fokus Evaluasi">
      {/* Header */}
      <div className="hl-chart-header">
        <div>
          <h2 className="hl-section-title">Indeks per fokus evaluasi</h2>
          <p className="hl-section-subtitle">Rata-rata penilaian pihak lain · skala 1–4</p>
        </div>
        <div className="hl-legend-wrap">
          <span className="hl-legend-item">
            <span className="legend-dot" style={{ background: "#0B2E59" }} />
            Latsar CPNS
          </span>
          <span className="hl-legend-item">
            <span className="legend-dot" style={{ background: "#1F6FD1" }} />
            ECM
          </span>
          <span className="hl-legend-item">
            <span className="legend-dot" style={{ background: "#93C5FD" }} />
            PKA
          </span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="bar-chart-grid">
        <div className="y-axis" aria-hidden="true">
          <span>4,0</span>
          <span>3,0</span>
          <span>2,0</span>
          <span>1,0</span>
        </div>

        <div className="hl-bars-container">
          {items.map((fokus, idx) => {
            const hLatsar = getHeightPercent(fokus.latsar);
            const hEcm = getHeightPercent(fokus.ecm);
            const hPka = getHeightPercent(fokus.pka);

            return (
              <div key={fokus.id} className="bar-group">
                <div className="bars">
                  <motion.div
                    className="bar"
                    style={{
                      height: `${hLatsar}%`,
                      background: "#0B2E59",
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    whileHover={{ scaleY: 1.03 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: idx * 0.07,
                    }}
                    title={`Latsar CPNS: ${fokus.latsar.toFixed(2)}`}
                    aria-label={`Latsar CPNS: ${fokus.latsar.toFixed(2)}`}
                  />
                  <motion.div
                    className="bar"
                    style={{
                      height: `${hEcm}%`,
                      background: "#1F6FD1",
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    whileHover={{ scaleY: 1.03 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: idx * 0.07 + 0.03,
                    }}
                    title={`ECM: ${fokus.ecm.toFixed(2)}`}
                    aria-label={`ECM: ${fokus.ecm.toFixed(2)}`}
                  />
                  <motion.div
                    className="bar"
                    style={{
                      height: `${hPka}%`,
                      background: "#93C5FD",
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    whileHover={{ scaleY: 1.03 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: idx * 0.07 + 0.06,
                    }}
                    title={`PKA: ${fokus.pka.toFixed(2)}`}
                    aria-label={`PKA: ${fokus.pka.toFixed(2)}`}
                  />
                </div>
                <p className="bar-label">{fokus.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="hl-chart-footer">
        <span>Fokus 6 (Hambatan) tidak masuk perhitungan indeks.</span>
        <motion.button
          type="button"
          onClick={onDetailClick}
          className="hl-chart-detail-link"
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
        >
          <span>Detail per fokus</span>
          <ArrowRight size={13} />
        </motion.button>
      </div>
    </section>
  );
};
