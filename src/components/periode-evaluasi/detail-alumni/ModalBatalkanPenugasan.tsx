import React, { useState } from "react";
import { AlertTriangle, X, UserX } from "lucide-react";
import { PenilaiItem } from "./types";

interface ModalBatalkanPenugasanProps {
  isOpen: boolean;
  onClose: () => void;
  targetPenilai: PenilaiItem | null;
  alumniNama: string;
  onConfirmCancel: (penilai: PenilaiItem, alasan: string) => void;
}

export const ModalBatalkanPenugasan: React.FC<ModalBatalkanPenugasanProps> = ({
  isOpen,
  onClose,
  targetPenilai,
  alumniNama,
  onConfirmCancel,
}) => {
  const [alasan, setAlasan] = useState("Salah penugasan");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !targetPenilai) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(targetPenilai, alasan);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="da-modal-overlay" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="da-modal-backdrop" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="da-modal-dialog confirm">
        {/* Header */}
        <div className="da-modal-header">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div className="da-modal-header-icon danger" aria-hidden="true">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="da-modal-title">Batalkan Penugasan?</h3>
              <p className="da-modal-desc">
                Konfirmasi pembatalan penilai untuk evaluasi {alumniNama}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="da-modal-close-btn"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="da-modal-body">
          {/* Target Penilai Detail Card */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div className="da-user-avatar other" aria-hidden="true" style={{ width: 36, height: 36, fontSize: 12 }}>
              {targetPenilai.avatarText}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                  {targetPenilai.nama}
                </p>
                <span
                  style={{
                    fontSize: "10.5px",
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  {targetPenilai.kategoriLabel}
                </span>
              </div>
              <p style={{ fontSize: "11.5px", color: "#64748b", margin: "2px 0 0" }}>
                {targetPenilai.jabatan}
              </p>
              <p style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "var(--font-mono, monospace)", margin: "2px 0 0" }}>
                {targetPenilai.nip}
              </p>
            </div>
          </div>

          {/* Warning Impact */}
          <div
            style={{
              borderRadius: 10,
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              padding: "12px 14px",
              fontSize: "12px",
              color: "#991b1b",
              lineHeight: 1.5,
            }}
          >
            <p style={{ fontWeight: 700, margin: "0 0 6px", color: "#b91c1c" }}>
              Dampak Pembatalan:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: "11.5px", color: "#475569" }}>
              <li>Tautan kuesioner pada surel / WhatsApp penilai otomatis dinonaktifkan.</li>
              <li>Data penugasan dan pengisian penilai ini akan dihapus dari periode ini.</li>
              <li>
                Kuota kategori <strong style={{ color: "#1e293b" }}>{targetPenilai.kategoriLabel}</strong> akan berkurang.
              </li>
            </ul>
          </div>

          {/* Reason Selection */}
          <div>
            <label
              htmlFor="select-alasan-batal"
              style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 6 }}
            >
              Alasan Pembatalan
            </label>
            <select
              id="select-alasan-batal"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              style={{
                width: "100%",
                height: 38,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: "12.5px",
                color: "#1e293b",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="Salah penugasan">Salah penugasan pegawai</option>
              <option value="Pegawai mutasi/pindah tugas">Pegawai mutasi / rotasi / pindah tugas</option>
              <option value="Cuti / Berhalangan hadir">Pegawai sedang cuti / tugas belajar</option>
              <option value="Permintaan alumni/atasan">Atas persetujuan alumni atau atasan langsung</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="da-modal-footer">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="da-btn-secondary"
            style={{ flex: 1, justifyContent: "center", height: 40 }}
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="da-action-btn-danger"
            style={{
              flex: 1.2,
              justifyContent: "center",
              height: 40,
              background: "#dc2626",
              borderColor: "#dc2626",
              color: "#ffffff",
            }}
          >
            <UserX size={15} />
            <span>{isSubmitting ? "Membatalkan..." : "Ya, Batalkan Penugasan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
