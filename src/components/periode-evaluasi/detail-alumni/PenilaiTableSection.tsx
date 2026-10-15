import React from "react";
import { Mail, Plus, Info } from "lucide-react";
import { PenilaiItem } from "./types";
import { PenilaiTableRow } from "./PenilaiTableRow";

interface PenilaiTableSectionProps {
  penilaiList: PenilaiItem[];
  onOpenMenu: (penilai: PenilaiItem, anchorRect: DOMRect) => void;
  onTambahPenilai: () => void;
  onKirimSemuaPengingat: () => void;
}

export const PenilaiTableSection: React.FC<PenilaiTableSectionProps> = ({
  penilaiList,
  onOpenMenu,
  onTambahPenilai,
  onKirimSemuaPengingat,
}) => {
  const totalCount = penilaiList.length;
  const selesaiCount = penilaiList.filter((p) => p.status === "Selesai").length;
  const sedangMengisiCount = penilaiList.filter((p) => p.status === "Sedang mengisi").length;
  const belumDibukaCount = penilaiList.filter((p) => p.status === "Belum dibuka").length;

  return (
    <section className="da-card da-table-section">
      {/* Header */}
      <div className="da-table-header">
        <div>
          <h2 className="da-table-title">Penilai yang ditugaskan</h2>
          <p className="da-table-subtitle">
            <strong style={{ color: "#334155" }}>{totalCount} penilai</strong> ·{" "}
            {selesaiCount} selesai
            {sedangMengisiCount > 0 ? `, ${sedangMengisiCount} sedang mengisi` : ""}
            {belumDibukaCount > 0 ? `, ${belumDibukaCount} belum dibuka` : ""}
          </p>
        </div>
        <div className="da-table-actions">
          <button
            id="btn-kirim-pengingat"
            onClick={onKirimSemuaPengingat}
            className="da-btn-secondary"
          >
            <Mail size={14} />
            <span>Kirim Pengingat</span>
          </button>
          <button
            id="btn-tambah-penilai"
            onClick={onTambahPenilai}
            className="da-btn-primary"
          >
            <Plus size={15} />
            <span>Tambah Penilai</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="da-table-scroll">
        <table className="da-data-table">
          <thead>
            <tr>
              <th scope="col" className="col-penilai">PENILAI</th>
              <th scope="col">KATEGORI</th>
              <th scope="col" className="col-center">KANAL</th>
              <th scope="col">STATUS</th>
              <th scope="col">AKTIVITAS TERAKHIR</th>
              <th scope="col" className="col-action"></th>
            </tr>
          </thead>
          <tbody>
            {penilaiList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                  Belum ada penilai yang ditugaskan.
                </td>
              </tr>
            ) : (
              penilaiList.map((item) => (
                <PenilaiTableRow key={item.id} penilai={item} onOpenMenu={onOpenMenu} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="da-table-footer">
        <Info size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
        <span>Admin tidak dapat melihat isi jawaban per penilai. Hanya status pengisian yang ditampilkan.</span>
      </div>
    </section>
  );
};
