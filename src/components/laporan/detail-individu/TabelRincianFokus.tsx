"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { RincianFokusItem, SelisihType } from "./types";

interface TabelRincianFokusProps {
  items: RincianFokusItem[];
}

export const TabelRincianFokus: React.FC<TabelRincianFokusProps> = ({ items }) => {
  const getBadgeClass = (type: SelisihType) => {
    switch (type) {
      case "pos-high":
        return "selisih selisih-pos-high";
      case "pos-low":
        return "selisih selisih-pos-low";
      case "neutral":
        return "selisih selisih-neutral";
      case "neg":
        return "selisih selisih-neg";
      default:
        return "selisih selisih-neutral";
    }
  };

  const formatSelisih = (val: number) => {
    const prefix = val > 0 ? "+" : "";
    return `${prefix}${val.toFixed(2).replace(".", ",")}`;
  };

  return (
    <section
      className="dhi-card dhi-rincian-card"
      aria-label="Tabel Rincian per Fokus Evaluasi"
    >
      <div className="dhi-card-header">
        <h2 className="dhi-card-title">Rincian per fokus</h2>
        <p className="dhi-card-subtitle">Perbandingan skor pada skala 1,00 s.d. 4,00</p>
      </div>

      <div className="dhi-table-responsive">
        <table className="dhi-table">
          <thead>
            <tr>
              <th scope="col">Fokus Evaluasi</th>
              <th scope="col" className="dhi-col-center" style={{ width: 54 }}>
                Diri
              </th>
              <th scope="col" className="dhi-col-center" style={{ width: 58 }}>
                Atasan
              </th>
              <th scope="col" className="dhi-col-center" style={{ width: 58 }}>
                Rekan
              </th>
              <th scope="col" className="dhi-col-center" style={{ width: 68 }}>
                Bawahan
              </th>
              <th scope="col" className="dhi-col-center" style={{ width: 78 }}>
                Pihak Lain <span style={{ color: "#94A3B8" }}>*</span>
              </th>
              <th scope="col" className="dhi-col-center" style={{ width: 78 }}>
                Selisih
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <td style={{ fontWeight: 600, color: "#1E293B" }}>{row.fokus}</td>

                <td className="dhi-col-center dhi-tabular" style={{ color: "#334155" }}>
                  {row.diri.toFixed(2).replace(".", ",")}
                </td>

                <td className="dhi-col-center dhi-tabular" style={{ color: "#334155" }}>
                  {row.atasan.toFixed(2).replace(".", ",")}
                </td>

                <td className="dhi-col-center">
                  {row.rekan !== null && row.rekan !== undefined ? (
                    <span className="dhi-tabular" style={{ color: "#334155" }}>
                      {row.rekan.toFixed(2).replace(".", ",")}
                    </span>
                  ) : (
                    <span style={{ color: "#94A3B8", fontWeight: 600 }}>-</span>
                  )}
                </td>

                <td className="dhi-col-center">
                  {row.bawahan !== null && row.bawahan !== undefined ? (
                    <span className="dhi-tabular" style={{ color: "#334155" }}>
                      {row.bawahan.toFixed(2).replace(".", ",")}
                    </span>
                  ) : (
                    <span style={{ color: "#94A3B8", fontWeight: 600 }}>-</span>
                  )}
                </td>

                <td className="dhi-col-center dhi-tabular dhi-td-bold">
                  {row.pihakLain.toFixed(2).replace(".", ",")}
                </td>

                <td className="dhi-col-center">
                  <span className={getBadgeClass(row.selisihType)}>
                    {formatSelisih(row.selisih)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Callout Informasi Kerahasiaan */}
      <div className="dhi-callout-info" role="note">
        <Info size={17} style={{ color: "#1E40AF", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p>
            Kolom <strong>rekan</strong> dan <strong>bawahan</strong> bertanda strip (-): belum ditampilkan karena masih dalam proses pengisian serta menjaga ambang batas kerahasiaan (minimal 2 penilai per kategori).
          </p>
          <p style={{ color: "#1E3A8A", fontSize: "11.5px" }}>
            * Nilai pihak lain sementara dihitung dari atasan langsung; akan diperbarui otomatis setelah rekan dan bawahan selesai mengisi instrumen.
          </p>
        </div>
      </div>

      {/* Legend Selisih */}
      <div className="dhi-selisih-legend">
        <span style={{ fontWeight: 600, color: "#334155" }}>Keterangan selisih:</span>
        <span className="dhi-legend-group">
          <span
            className="selisih selisih-pos-high"
            style={{ minWidth: 0, padding: "2px 6px", fontSize: "10.5px" }}
          >
            &ge; +0,30
          </span>
          gap besar
        </span>
        <span className="dhi-legend-group">
          <span
            className="selisih selisih-pos-low"
            style={{ minWidth: 0, padding: "2px 6px", fontSize: "10.5px" }}
          >
            +0,10 s.d. +0,29
          </span>
          gap kecil
        </span>
        <span className="dhi-legend-group">
          <span
            className="selisih selisih-neutral"
            style={{ minWidth: 0, padding: "2px 6px", fontSize: "10.5px" }}
          >
            &plusmn; 0,10
          </span>
          netral
        </span>
        <span className="dhi-legend-group">
          <span
            className="selisih selisih-neg"
            style={{ minWidth: 0, padding: "2px 6px", fontSize: "10.5px" }}
          >
            &le; -0,30
          </span>
          di bawah
        </span>
      </div>
    </section>
  );
};
