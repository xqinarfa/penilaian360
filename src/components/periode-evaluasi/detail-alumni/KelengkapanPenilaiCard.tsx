import React from "react";
import { Check } from "lucide-react";
import { PenilaiItem } from "./types";

interface KelengkapanPenilaiCardProps {
  penilaiList: PenilaiItem[];
}

export const KelengkapanPenilaiCard: React.FC<KelengkapanPenilaiCardProps> = ({ penilaiList }) => {
  const getCategoryStats = (kategori: "D" | "A" | "R" | "B", target: number) => {
    const list = penilaiList.filter((p) => p.kategori === kategori);
    const completed = list.filter((p) => p.status === "Selesai").length;
    return {
      total: list.length,
      completed,
      target,
      isFulfilled: completed >= target,
    };
  };

  const statD = getCategoryStats("D", 1);
  const statA = getCategoryStats("A", 1);
  const statR = getCategoryStats("R", 2);
  const statB = getCategoryStats("B", 1);

  const totalAssigned = penilaiList.length;
  const totalSelesai = penilaiList.filter((p) => p.status === "Selesai").length;
  const progressPercent = totalAssigned > 0 ? Math.round((totalSelesai / totalAssigned) * 100) : 0;

  return (
    <div className="da-card da-panel-padding">
      <h3 className="da-panel-title">Kelengkapan penilai</h3>
      <p className="da-panel-sub">Berdasarkan Bab 5.2</p>

      <div className="da-quota-list">
        {/* Diri Sendiri */}
        <div className="da-quota-row">
          <span className="da-quota-left">
            <span className="kat-badge kat-D">D</span>
            <span>Diri sendiri</span>
          </span>
          <div className="da-quota-right">
            <span className={`da-quota-num ${!statD.isFulfilled ? "warning" : ""}`}>
              {statD.completed}/{statD.target}
            </span>
            {statD.isFulfilled ? (
              <Check size={16} strokeWidth={2.5} style={{ color: "#10b981" }} />
            ) : (
              <span className="da-pill-warning">Belum cukup</span>
            )}
          </div>
        </div>

        {/* Atasan */}
        <div className="da-quota-row">
          <span className="da-quota-left">
            <span className="kat-badge kat-A">A</span>
            <span>Atasan</span>
          </span>
          <div className="da-quota-right">
            <span className={`da-quota-num ${!statA.isFulfilled ? "warning" : ""}`}>
              {statA.completed}/{statA.target}
            </span>
            {statA.isFulfilled ? (
              <Check size={16} strokeWidth={2.5} style={{ color: "#10b981" }} />
            ) : (
              <span className="da-pill-warning">Belum cukup</span>
            )}
          </div>
        </div>

        {/* Rekan Kerja */}
        <div className="da-quota-row">
          <span className="da-quota-left">
            <span className="kat-badge kat-R">R</span>
            <span>Rekan kerja</span>
          </span>
          <div className="da-quota-right">
            <span className={`da-quota-num ${!statR.isFulfilled ? "warning" : ""}`}>
              {statR.completed}/{statR.target}
            </span>
            {statR.isFulfilled ? (
              <Check size={16} strokeWidth={2.5} style={{ color: "#10b981" }} />
            ) : (
              <span className="da-pill-warning">Belum cukup</span>
            )}
          </div>
        </div>

        {/* Bawahan */}
        <div className="da-quota-row">
          <span className="da-quota-left">
            <span className="kat-badge kat-B">B</span>
            <span>Bawahan</span>
          </span>
          <div className="da-quota-right">
            <span className={`da-quota-num ${!statB.isFulfilled ? "warning" : ""}`}>
              {statB.completed}/{statB.target}
            </span>
            {statB.isFulfilled ? (
              <Check size={16} strokeWidth={2.5} style={{ color: "#10b981" }} />
            ) : (
              <span className="da-pill-warning">Belum cukup</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Box */}
      <div className="da-progress-box">
        <div className="da-progress-meta">
          <span>Progress keseluruhan</span>
          <span>{totalSelesai} dari {totalAssigned} selesai</span>
        </div>
        <div className="da-progress-bar-track">
          <div
            className="da-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
