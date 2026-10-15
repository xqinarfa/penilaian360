"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RadarFokusScore } from "./types";

interface RadarProfilCardProps {
  scores: RadarFokusScore[];
}

export const RadarProfilCard: React.FC<RadarProfilCardProps> = ({ scores }) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    label: string;
    diri: number;
    pihakLain: number;
  } | null>(null);

  const [highlightedSeries, setHighlightedSeries] = useState<
    "all" | "diri" | "pihakLain"
  >("all");

  // Geometry constants
  const MAX_RADIUS = 110;
  const MAX_SCORE = 4.0;
  const NUM_AXES = 5;

  // Compute angle for axis i (-90 deg at top, clockwise)
  const getAngle = (index: number) => {
    return -Math.PI / 2 + index * ((2 * Math.PI) / NUM_AXES);
  };

  // Convert score to coordinates (x, y) relative to center
  const getCoordinates = (score: number, index: number) => {
    const angle = getAngle(index);
    const radius =
      (Math.max(0, Math.min(MAX_SCORE, score)) / MAX_SCORE) * MAX_RADIUS;
    const x = Math.round(radius * Math.cos(angle) * 10) / 10;
    const y = Math.round(radius * Math.sin(angle) * 10) / 10;
    return { x, y };
  };

  // Label coordinates (positioned safely outside MAX_RADIUS)
  const labelPositions: {
    x: number;
    y: number;
    anchor: "middle" | "start" | "end";
  }[] = [
    { x: 0, y: -124, anchor: "middle" },
    { x: 124, y: -38, anchor: "middle" },
    { x: 82, y: 106, anchor: "middle" },
    { x: -82, y: 106, anchor: "middle" },
    { x: -124, y: -38, anchor: "middle" },
  ];

  // Polygon points
  const diriPoints = scores
    .map((s, i) => {
      const { x, y } = getCoordinates(s.diri, i);
      return `${x},${y}`;
    })
    .join(" ");

  const pihakLainPoints = scores
    .map((s, i) => {
      const { x, y } = getCoordinates(s.pihakLain, i);
      return `${x},${y}`;
    })
    .join(" ");

  // Average calculations
  const avgDiri = (
    scores.reduce((sum, s) => sum + s.diri, 0) / scores.length
  ).toFixed(2).replace(".", ",");

  const avgPihakLain = (
    scores.reduce((sum, s) => sum + s.pihakLain, 0) / scores.length
  ).toFixed(2).replace(".", ",");

  return (
    <section
      className="dhi-card dhi-radar-card"
      aria-label="Profil per fokus evaluasi"
    >
      <div className="dhi-card-header">
        <h2 className="dhi-card-title">Profil per fokus evaluasi</h2>
        <p className="dhi-card-subtitle">
          Perbandingan penilaian diri dengan penilaian pihak lain (skala 1-4)
        </p>
      </div>

      <div className="dhi-radar-chart-area">
        <svg
          viewBox="0 0 320 280"
          className="dhi-radar-svg"
          aria-label="Grafik radar per fokus evaluasi"
        >
          <g transform="translate(160,150)">
            {/* Concentric Grid Rings */}
            <motion.polygon
              points="0,-110 104.6,-34 64.6,89 -64.6,89 -104.6,-34"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            />
            <motion.polygon
              points="0,-82.5 78.5,-25.5 48.5,66.8 -48.5,66.8 -78.5,-25.5"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.polygon
              points="0,-55 52.3,-17 32.3,44.5 -32.3,44.5 -52.3,-17"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />
            <motion.polygon
              points="0,-27.5 26.2,-8.5 16.2,22.3 -16.2,22.3 -26.2,-8.5"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />

            {/* 5 Radial Axis Lines */}
            <line x1="0" y1="0" x2="0" y2="-110" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="0" x2="104.6" y2="-34" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="0" y1="0" x2="64.6" y2="89" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="0" y1="0" x2="-64.6" y2="89" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="0" y1="0" x2="-104.6" y2="-34" stroke="#e2e8f0" strokeWidth="1" />

            {/* Scale Labels along top axis */}
            <text x="5" y="-110" className="dhi-radar-scale-text">4,0</text>
            <text x="5" y="-82.5" className="dhi-radar-scale-text">3,0</text>
            <text x="5" y="-55" className="dhi-radar-scale-text">2,0</text>
            <text x="5" y="-27.5" className="dhi-radar-scale-text">1,0</text>

            {/* Polygon: Diri Sendiri (Solid Navy with light blue fill) */}
            <motion.polygon
              points={diriPoints}
              fill="rgba(31,111,209,0.16)"
              stroke="#0B2E59"
              strokeWidth={highlightedSeries === "diri" ? 2.6 : 1.8}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: highlightedSeries === "pihakLain" ? 0.3 : 1,
                scale: 1,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Polygon: Pihak Lain (Dashed Orange) */}
            <motion.polygon
              points={pihakLainPoints}
              fill="none"
              stroke="#D97706"
              strokeWidth={highlightedSeries === "pihakLain" ? 2.6 : 1.8}
              strokeDasharray="4 3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: highlightedSeries === "diri" ? 0.3 : 1,
                scale: 1,
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Dots: Diri Sendiri */}
            {scores.map((s, idx) => {
              const { x, y } = getCoordinates(s.diri, idx);
              return (
                <motion.circle
                  key={`dot-diri-${s.id}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#0B2E59"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  style={{ cursor: "pointer" }}
                  whileHover={{ r: 5.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  onMouseEnter={() =>
                    setActiveTooltip({
                      label: s.label,
                      diri: s.diri,
                      pihakLain: s.pihakLain,
                    })
                  }
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              );
            })}

            {/* Dots: Pihak Lain */}
            {scores.map((s, idx) => {
              const { x, y } = getCoordinates(s.pihakLain, idx);
              return (
                <motion.circle
                  key={`dot-pihak-${s.id}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#D97706"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  style={{ cursor: "pointer" }}
                  whileHover={{ r: 5.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  onMouseEnter={() =>
                    setActiveTooltip({
                      label: s.label,
                      diri: s.diri,
                      pihakLain: s.pihakLain,
                    })
                  }
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              );
            })}

            {/* Axis Category Labels */}
            {scores.map((s, idx) => {
              const pos = labelPositions[idx] || {
                x: 0,
                y: 0,
                anchor: "middle",
              };
              return (
                <text
                  key={`label-${s.id}`}
                  x={pos.x}
                  y={pos.y}
                  textAnchor={pos.anchor}
                  fontSize="11"
                  fill="#334155"
                  fontWeight="600"
                >
                  {s.label}
                </text>
              );
            })}

            {/* Interactive Tooltip Overlay */}
            <AnimatePresence>
              {activeTooltip && (
                <motion.g
                  transform="translate(0, -12)"
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  <rect
                    x="-75"
                    y="-30"
                    width="150"
                    height="40"
                    rx="8"
                    fill="#081A33"
                    opacity="0.96"
                    stroke="#1E293B"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-16"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {activeTooltip.label}
                  </text>
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fill="#93C5FD"
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    Diri: {activeTooltip.diri.toFixed(2).replace(".", ",")} &bull; Pihak Lain:{" "}
                    {activeTooltip.pihakLain.toFixed(2).replace(".", ",")}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </svg>
      </div>

      {/* Interactive Legend with Average Score Pills */}
      <div className="dhi-radar-legend">
        <button
          type="button"
          className={`dhi-legend-btn ${highlightedSeries === "diri" ? "active" : ""}`}
          onClick={() =>
            setHighlightedSeries((prev) => (prev === "diri" ? "all" : "diri"))
          }
          onMouseEnter={() => setHighlightedSeries("diri")}
          onMouseLeave={() => setHighlightedSeries("all")}
          title="Klik untuk menyorot penilaian diri sendiri"
        >
          <span className="dhi-legend-dot-navy" aria-hidden="true" />
          <span style={{ fontWeight: 600, color: "#0B2E59" }}>Diri sendiri</span>
          <span className="dhi-legend-score-pill">{avgDiri}</span>
        </button>

        <button
          type="button"
          className={`dhi-legend-btn ${highlightedSeries === "pihakLain" ? "active" : ""}`}
          onClick={() =>
            setHighlightedSeries((prev) =>
              prev === "pihakLain" ? "all" : "pihakLain"
            )
          }
          onMouseEnter={() => setHighlightedSeries("pihakLain")}
          onMouseLeave={() => setHighlightedSeries("all")}
          title="Klik untuk menyorot penilaian pihak lain"
        >
          <span className="dhi-legend-line-orange" aria-hidden="true" />
          <span style={{ fontWeight: 600, color: "#92400E" }}>Pihak lain (rata-rata)</span>
          <span className="dhi-legend-score-pill">{avgPihakLain}</span>
        </button>
      </div>
    </section>
  );
};
