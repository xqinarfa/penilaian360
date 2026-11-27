import React from "react";
import { Mail, Trash2 } from "lucide-react";

interface AksiPeriodeCardProps {
  onKirimUndanganUlang: () => void;
  onKeluarkanDariPeriode: () => void;
}

export const AksiPeriodeCard: React.FC<AksiPeriodeCardProps> = ({
  onKirimUndanganUlang,
  onKeluarkanDariPeriode,
}) => {
  return (
    <div className="da-card da-actions-card">
      <button
        onClick={onKirimUndanganUlang}
        className="da-action-btn-neutral"
      >
        <Mail size={14} />
        <span>Kirim Undangan Ulang ke Semua</span>
      </button>

      <button
        onClick={onKeluarkanDariPeriode}
        className="da-action-btn-danger"
      >
        <Trash2 size={14} />
        <span>Keluarkan dari Periode</span>
      </button>
    </div>
  );
};
