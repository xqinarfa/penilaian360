import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { UnitKerjaHeatmapRow } from "./types";

interface PetaIndeksUnitKerjaTableProps {
  data: UnitKerjaHeatmapRow[];
}

export const PetaIndeksUnitKerjaTable: React.FC<PetaIndeksUnitKerjaTableProps> = ({
  data,
}) => {
  const getHeatmapStyle = (val: number) => {
    if (val >= 3.25) {
      return { background: "#1F6FD1", color: "#ffffff" };
    }
    if (val >= 2.75) {
      return { background: "#B8D4F0", color: "#0B2E59" };
    }
    if (val >= 2.5) {
      return { background: "#E3EEF9", color: "#0B2E59" };
    }
    return { background: "#FEE2E2", color: "#B91C1C" };
  };

  return (
    <section className="hl-card hl-heatmap-card" aria-label="Peta Indeks per Unit Kerja">
      {/* Header */}
      <div className="hl-heatmap-header">
        <div>
          <h2 className="hl-section-title">Peta indeks per unit kerja</h2>
          <p className="hl-section-subtitle">
            Rata-rata penilaian pihak lain · sel lebih gelap = indeks lebih tinggi
          </p>
        </div>
        <div className="hl-heatmap-legend">
          <span className="hl-heatmap-legend-item">
            <span className="hl-legend-color-box" style={{ background: "#1F6FD1" }} />
            &ge; 3,25
          </span>
          <span className="hl-heatmap-legend-item">
            <span className="hl-legend-color-box" style={{ background: "#B8D4F0" }} />
            2,75–3,24
          </span>
          <span className="hl-heatmap-legend-item">
            <span className="hl-legend-color-box" style={{ background: "#E3EEF9" }} />
            2,50–2,74
          </span>
          <span className="hl-heatmap-legend-item">
            <span className="hl-legend-color-box" style={{ background: "#FEE2E2" }} />
            &lt; 2,50
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="hl-data-table">
          <thead>
            <tr>
              <th scope="col">Unit Kerja</th>
              <th scope="col" className="col-center">Relevansi</th>
              <th scope="col" className="col-center">Dukungan</th>
              <th scope="col" className="col-center">Sikap</th>
              <th scope="col" className="col-center">Ketepatan</th>
              <th scope="col" className="col-center">Manfaat</th>
              <th scope="col" className="col-center">Rata-rata</th>
              <th scope="col" style={{ textAlign: "right" }}>Alumni</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              if (row.isUnderThreshold) {
                return (
                  <tr key={row.id}>
                    <td style={{ fontStyle: "italic", color: "#94a3b8" }}>
                      {row.unitKerja}
                    </td>
                    <td colSpan={5} className="col-center">
                      <span style={{ fontSize: "11.5px", color: "#94a3b8", fontStyle: "italic" }}>
                        Data tidak ditampilkan (minimal 3 alumni per unit)
                      </span>
                    </td>
                    <td className="col-center">
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>—</span>
                    </td>
                    <td style={{ textAlign: "right", color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
                      {row.alumniCount}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={row.id}>
                  <td style={{ fontWeight: 500, color: "#1e293b" }}>{row.unitKerja}</td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.relevansi)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.relevansi.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.dukungan)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.dukungan.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.sikap)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.sikap.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.ketepatan)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.ketepatan.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.manfaat)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.manfaat.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td className="col-center">
                    <motion.div
                      className="heat-cell"
                      style={getHeatmapStyle(row.rataRata)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    >
                      {row.rataRata.toFixed(2).replace(".", ",")}
                    </motion.div>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                    {row.alumniCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Privacy threshold note */}
      <div className="hl-privacy-notice-box">
        <ShieldCheck size={16} style={{ color: "#1F6FD1", flexShrink: 0, marginTop: 1 }} />
        <span>
          Rekapitulasi unit kerja hanya ditampilkan bila jumlah alumni di unit tersebut minimal{" "}
          <strong style={{ color: "#1e293b" }}>3 orang</strong> sesuai Bab 5.6 untuk menjaga kerahasiaan penilai.
        </span>
      </div>
    </section>
  );
};
