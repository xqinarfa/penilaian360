import React from "react";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { AlumniDetailData } from "./types";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

export const StatRingkasanCards: React.FC<{ data: AlumniDetailData }> = ({ data }) => {
  const diff = data.selisihDiriVsPihakLain;
  const diffText = `${diff > 0 ? "+" : ""}${fmt(diff)}`;

  return (
    <div className="dhi-stat-cards-grid">
      <div className="dhi-card dhi-stat-card">
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">
            Indeks penerapan <span style={{ color: "#64748B", fontWeight: 500 }}>(pihak lain)</span>
          </p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <Users size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">{fmt(data.indeksPihakLain)}</span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer">
          <span className="dhi-badge-category">{data.kategoriPihakLain}</span>
        </div>
      </div>

      <div className="dhi-card dhi-stat-card">
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">Penilaian diri</p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <UserCheck size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">{fmt(data.penilaianDiri)}</span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer dhi-selisih-row">
          <span className={`selisih ${diff >= 0 ? "selisih-pos-high" : "selisih-neg"}`}>{diffText}</span>
          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>
            vs pihak lain
          </span>
        </div>
      </div>

      <div className="dhi-card dhi-stat-card">
        <div className="dhi-stat-top-row">
          <p className="dhi-stat-label">Rata-rata angkatan</p>
          <div className="dhi-stat-icon-wrap" aria-hidden="true">
            <TrendingUp size={15} />
          </div>
        </div>

        <div className="dhi-stat-val-row">
          <span className="dhi-stat-value">{fmt(data.rataRataAngkatan)}</span>
          <span className="dhi-stat-total">/ 4,00</span>
        </div>

        <div className="dhi-stat-footer">
          <div className="dhi-percentile-track" title={`Persentil: ${data.persentilAngkatan}%`}>
            <div
              className="dhi-percentile-fill"
              style={{ width: `${data.persentilAngkatan}%` }}
            />
          </div>
          <p className="dhi-stat-desc">
            Lebih baik dari{" "}
            <strong style={{ fontWeight: 700, color: "#1E293B" }}>
              {data.persentilAngkatan}% alumni
            </strong>{" "}
            angkatan
          </p>
        </div>
      </div>
    </div>
  );
};
