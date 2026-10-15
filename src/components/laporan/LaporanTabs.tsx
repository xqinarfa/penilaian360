import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";

export type LaporanActiveTab = "rekap" | "individu";

interface LaporanTabsProps {
  activeTab: LaporanActiveTab;
  onChangeTab: (tab: LaporanActiveTab) => void;
}

export const LaporanTabs: React.FC<LaporanTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <div className="hl-tabs-bar" role="tablist" aria-label="Tab Laporan">
      <motion.button
        id="tab-btn-rekap"
        type="button"
        role="tab"
        aria-selected={activeTab === "rekap"}
        className={`hl-tab-btn ${activeTab === "rekap" ? "active" : ""}`}
        onClick={() => onChangeTab("rekap")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      >
        <TrendingUp size={16} />
        <span>Rekapitulasi</span>
        {activeTab === "rekap" && (
          <motion.div
            layoutId="activeLaporanTabIndicator"
            className="hl-tab-indicator"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </motion.button>

      <motion.button
        id="tab-btn-individu"
        type="button"
        role="tab"
        aria-selected={activeTab === "individu"}
        className={`hl-tab-btn ${activeTab === "individu" ? "active" : ""}`}
        onClick={() => onChangeTab("individu")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      >
        <Users size={16} />
        <span>Hasil Individu</span>
        {activeTab === "individu" && (
          <motion.div
            layoutId="activeLaporanTabIndicator"
            className="hl-tab-indicator"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </motion.button>
    </div>
  );
};
