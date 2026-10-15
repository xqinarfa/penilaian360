import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { HambatanItem } from "./types";

interface HambatanTerbanyakCardProps {
  items: HambatanItem[];
  onManageClick?: () => void;
}

export const HambatanTerbanyakCard: React.FC<HambatanTerbanyakCardProps> = ({
  items,
  onManageClick,
}) => {
  return (
    <section className="hl-card hl-hambatan-card" aria-label="Hambatan Terbanyak">
      {/* Header */}
      <div className="hl-hambatan-header">
        <div>
          <h2 className="hl-section-title">Hambatan terbanyak</h2>
          <p className="hl-section-subtitle">Dikelompokkan oleh admin</p>
        </div>
        <motion.button
          type="button"
          onClick={onManageClick}
          className="icon-btn"
          title="Kelola kategori hambatan"
          aria-label="Kelola kategori hambatan"
          whileHover={{ rotate: 45, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Settings size={16} />
        </motion.button>
      </div>

      {/* Progress Bars */}
      <div className="hl-hambatan-list">
        {items.map((item, idx) => (
          <div key={item.id} className="hambatan-row">
            <div>
              <p className="hambatan-text">{item.label}</p>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.barWidthPercent}%` }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                    delay: idx * 0.08,
                  }}
                />
              </div>
            </div>
            <span className="hambatan-val">{item.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="hl-hambatan-footer">
        Isian asli alumni tetap tersimpan. Kategori baku dipakai agar dapat dihitung.
      </div>
    </section>
  );
};
