import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface LaporanHeaderProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
}

export const LaporanHeader: React.FC<LaporanHeaderProps> = ({
  onExportExcel,
  onExportPdf,
}) => {
  return (
    <div className="hl-header">
      <div>
        <h1 className="hl-title">Hasil &amp; Laporan</h1>
        <p className="hl-subtitle">
          Ringkasan hasil evaluasi pasca pelatihan dan laporan per alumni.
        </p>
      </div>

      <div className="hl-header-actions">
        <motion.button
          type="button"
          onClick={onExportExcel}
          className="hl-btn-export-outline"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
        >
          <Download size={15} />
          <span>Unduh Excel</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={onExportPdf}
          className="hl-btn-export-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
        >
          <Download size={15} />
          <span>Unduh PDF</span>
        </motion.button>
      </div>
    </div>
  );
};
