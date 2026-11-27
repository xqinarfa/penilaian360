"use client";

import { KATEGORI_CONFIGS, type KategoriKey, type RedaksiItemState } from "./types";

interface SebaranKategoriCardProps {
  redaksi: Record<KategoriKey, RedaksiItemState>;
}

export default function SebaranKategoriCard({ redaksi }: SebaranKategoriCardProps) {
  const activeCount = Object.values(redaksi).filter((r) => r.aktif).length;

  return (
    <div className="tb-card" id="panel-sebaran">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0b2e59" }}>
          Sebaran kategori
        </span>
        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
          {activeCount} dari 4 aktif
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {KATEGORI_CONFIGS.map((cfg) => {
          const isAktif = redaksi[cfg.key]?.aktif;
          return (
            <div
              key={cfg.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12.5px",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className={`tb-kat-badge ${cfg.badgeClass}`}>{cfg.code}</span>
                <span
                  style={{
                    color: isAktif ? "#334155" : "#94a3b8",
                    fontWeight: isAktif ? 500 : 400,
                    transition: "color 0.15s ease",
                  }}
                >
                  {cfg.label}
                </span>
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: isAktif ? "#059669" : "#94a3b8",
                  background: isAktif ? "#ecfdf5" : "#f1f5f9",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  border: isAktif ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                  transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                }}
              >
                {isAktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
