import React from "react";
import { Mail, Check, Clock, MoreHorizontal } from "lucide-react";
import { PenilaiItem } from "./types";

interface PenilaiTableRowProps {
  penilai: PenilaiItem;
  onOpenMenu: (penilai: PenilaiItem, anchorRect: DOMRect) => void;
}

export const PenilaiTableRow: React.FC<PenilaiTableRowProps> = ({ penilai, onOpenMenu }) => {
  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onOpenMenu(penilai, rect);
  };

  const getKatClass = (kat: string) => {
    switch (kat) {
      case "D":
        return "kat-D";
      case "A":
        return "kat-A";
      case "R":
        return "kat-R";
      case "B":
        return "kat-B";
      default:
        return "kat-D";
    }
  };

  return (
    <tr>
      {/* Penilai Avatar + Info */}
      <td className="col-penilai">
        <div className="da-user-cell">
          <span
            className={`da-user-avatar ${penilai.kategori === "D" ? "self" : "other"}`}
            aria-hidden="true"
          >
            {penilai.avatarText}
          </span>
          <div className="da-user-meta">
            <p className="da-user-name">{penilai.nama}</p>
            <p className="da-user-sub">{penilai.jabatan}</p>
          </div>
        </div>
      </td>

      {/* Kategori Badge */}
      <td>
        <div className="da-kat-cell">
          <span className={`kat-badge ${getKatClass(penilai.kategori)}`}>
            {penilai.kategori}
          </span>
          <span className="da-kat-label">{penilai.kategoriLabel}</span>
        </div>
      </td>

      {/* Kanal (Surel / WhatsApp) */}
      <td className="col-center">
        <div className="da-kanal-group">
          {(penilai.kanal === "mail" || penilai.kanal === "both") && (
            <span className="kanal-icon mail" title="Surel">
              <Mail size={13} strokeWidth={2} />
            </span>
          )}
          {(penilai.kanal === "wa" || penilai.kanal === "both") && (
            <span className="kanal-icon wa" title="WhatsApp">
              <svg className="w-3.5 h-3.5" style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.7-1.3 1.3-1.8 1.4-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-4-4.6-4.1-.1-.2-1-1.4-1-2.7 0-1.2.6-1.9.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .4-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.2.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.3.6.4.1.2.1.9-.1 1.6z" />
              </svg>
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td>
        {penilai.status === "Selesai" && (
          <span className="da-status-badge da-status-selesai">
            <Check size={12} strokeWidth={3} />
            Selesai
          </span>
        )}
        {penilai.status === "Sedang mengisi" && (
          <span className="da-status-badge da-status-proses">
            <span className="da-dot-pulse" aria-hidden="true" />
            Sedang mengisi
          </span>
        )}
        {penilai.status === "Belum dibuka" && (
          <span className="da-status-badge da-status-belum">
            Belum dibuka
          </span>
        )}
      </td>

      {/* Aktivitas Terakhir */}
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{penilai.aktivitasTerakhir}</span>
          {penilai.pengingatCount && penilai.pengingatCount > 0 ? (
            <span
              className="tt"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "2px 6px",
                borderRadius: 4,
                background: "#fef3c7",
                color: "#b45309",
                fontSize: "10.5px",
                fontWeight: 700,
                cursor: "help",
              }}
              data-tt={`Pengingat otomatis sudah dikirim ${penilai.pengingatCount} kali`}
            >
              <Clock size={10} strokeWidth={2.4} />
              {penilai.pengingatCount}×
            </span>
          ) : null}
        </div>
      </td>

      {/* Row Action Trigger */}
      <td className="col-action">
        <button
          className="da-row-action icon-btn"
          aria-label={`Aksi untuk ${penilai.nama}`}
          onClick={handleMenuClick}
        >
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
};
