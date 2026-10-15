"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle } from "lucide-react";

export default function SkalaJawabanCard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const skalaItems = [
    { num: "1", label: "Sangat tidak setuju", isDash: false },
    { num: "2", label: "Tidak setuju", isDash: false },
    { num: "3", label: "Setuju", isDash: false },
    { num: "4", label: "Sangat setuju", isDash: false },
    { num: "–", label: "Tidak dapat menilai", isDash: true, note: "(tidak dihitung)" },
  ];

  return (
    <div
      className="tb-card"
      style={{ padding: 0, overflow: "hidden" }}
      id="panel-skala"
    >
      <button
        type="button"
        className="tb-collapsible-btn"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-expanded={!isCollapsed}
        aria-controls="skala-content"
      >
        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0b2e59" }}>
          Skala jawaban
        </span>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.18 }}
        >
          <ChevronDown size={16} strokeWidth={2.4} color="#94a3b8" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            id="skala-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 16px 16px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "12px",
              }}
            >
              {skalaItems.map((item) => (
                <div
                  key={item.num}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      color: item.isDash ? "#94a3b8" : "#334155",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                  <span style={{ color: item.isDash ? "#475569" : "#334155" }}>
                    {item.label}{" "}
                    {item.note && <span style={{ color: "#94a3b8" }}>{item.note}</span>}
                  </span>
                </div>
              ))}

              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5 }}>
                  Butir yang sudah dipakai pada periode berjalan tidak dapat diubah. Perubahan dilakukan dengan menduplikat versi instrumen.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
