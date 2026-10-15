import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Check, AlertCircle, ChevronRight, ChevronDown } from "lucide-react";
import { AlumniHasilIndividu } from "./types";

interface HasilIndividuTableProps {
  alumniList: AlumniHasilIndividu[];
  onSelectAlumni?: (alumni: AlumniHasilIndividu) => void;
}

export const HasilIndividuTable: React.FC<HasilIndividuTableProps> = ({
  alumniList,
  onSelectAlumni,
}) => {
  const router = useRouter();

  const handleRowClick = (item: AlumniHasilIndividu) => {
    if (onSelectAlumni) {
      onSelectAlumni(item);
    } else {
      router.push(`/laporan/detail-individu?id=${item.id}`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Info Callout */}
      <motion.div
        className="hl-info-callout"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Info size={16} style={{ color: "#1F6FD1", flexShrink: 0, marginTop: 2 }} />
        <p>
          Klik salah satu alumni untuk membuka <strong>laporan hasil individu lengkap</strong> dengan
          grafik radar, rincian per kategori penilai, dan kutipan hambatan.
        </p>
      </motion.div>

      {/* Main Table Card */}
      <div className="hl-card hl-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="hl-data-table">
            <thead>
              <tr>
                <th scope="col">ALUMNI</th>
                <th scope="col">PERIODE</th>
                <th scope="col" className="col-center">PENILAI</th>
                <th scope="col" className="col-center">INDEKS</th>
                <th scope="col">KATEGORI</th>
                <th scope="col">STATUS</th>
                <th scope="col" style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {alumniList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8" }}>
                    Tidak ada data alumni yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                alumniList.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    title={`Lihat detail laporan ${item.nama}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: Math.min(idx * 0.04, 0.3),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <td>
                      <p className="hl-alumni-name">{item.nama}</p>
                      <p className="hl-alumni-nip">{item.nip}</p>
                      <p className="hl-alumni-jabatan">{item.jabatan}</p>
                    </td>

                    <td style={{ fontSize: "12.5px", color: "#334155" }}>
                      {item.periode}
                    </td>

                    <td className="col-center">
                      <span style={{ fontWeight: 600, color: "#1e293b", fontVariantNumeric: "tabular-nums" }}>
                        {item.penilaiSelesai}
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>
                        /{item.penilaiTotal}
                      </span>
                    </td>

                    <td className="col-center">
                      <span className="hl-index-number">
                        {item.indeks.toFixed(2).replace(".", ",")}
                      </span>
                    </td>

                    <td>
                      {item.kategoriNilai === "Sangat baik" ? (
                        <span className="hl-status-pill selesai">Sangat baik</span>
                      ) : (
                        <span
                          className="hl-status-pill"
                          style={{ background: "#e8f1fc", color: "#1f6fd1" }}
                        >
                          {item.kategoriNilai}
                        </span>
                      )}
                    </td>

                    <td>
                      {item.status === "Selesai" ? (
                        <span className="hl-status-pill selesai">
                          <Check size={12} strokeWidth={3} />
                          Selesai
                        </span>
                      ) : (
                        <span className="hl-status-pill sebagian">
                          <AlertCircle size={12} strokeWidth={2.4} />
                          Sebagian
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <motion.div
                        style={{ display: "inline-block" }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                      >
                        <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
                      </motion.div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="hl-table-pagination">
          <p className="hl-pagination-info">
            Menampilkan <strong>1–{alumniList.length}</strong> dari <strong>223</strong> alumni
          </p>
          <div className="hl-pagination-controls">
            <div className="hl-select-wrapper" style={{ width: 110 }}>
              <select
                aria-label="Jumlah per halaman"
                defaultValue="25 / hal"
                className="hl-select-field"
                style={{ height: 32, fontSize: "12px", paddingLeft: 10, paddingRight: 28 }}
              >
                <option>25 / hal</option>
                <option>50 / hal</option>
                <option>100 / hal</option>
              </select>
              <ChevronDown size={14} className="hl-select-chevron" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button disabled className="hl-btn-page">
                Sebelumnya
              </button>
              <motion.button
                className="hl-btn-page"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Berikutnya</span>
                <ChevronRight size={13} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
