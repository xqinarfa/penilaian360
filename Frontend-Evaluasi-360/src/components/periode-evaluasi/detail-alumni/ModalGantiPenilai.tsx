import React, { useState } from "react";
import { Search, X, Check, AlertCircle } from "lucide-react";
import { CandidatePegawai, PenilaiItem } from "./types";

interface ModalGantiPenilaiProps {
  isOpen: boolean;
  onClose: () => void;
  targetPenilai: PenilaiItem | null;
  alumniNama: string;
  candidates: CandidatePegawai[];
  onConfirm: (selectedCandidate: CandidatePegawai, targetPenilai: PenilaiItem | null) => void;
}

export const ModalGantiPenilai: React.FC<ModalGantiPenilaiProps> = ({
  isOpen,
  onClose,
  targetPenilai,
  alumniNama,
  candidates,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(candidates[0]?.id || "");

  if (!isOpen) return null;

  const filteredCandidates = candidates.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nip.includes(searchQuery) ||
      c.unitKerja.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    const selected = candidates.find((c) => c.id === selectedId);
    if (selected) {
      onConfirm(selected, targetPenilai);
      onClose();
    }
  };

  return (
    <div className="da-modal-overlay" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="da-modal-backdrop" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="da-modal-dialog">
        <div className="da-modal-header">
          <div>
            <h3 className="da-modal-title">
              {targetPenilai ? "Ganti Penilai" : "Tambah Penilai Baru"}
            </h3>
            <p className="da-modal-desc">
              {targetPenilai ? (
                <>
                  Menggantikan{" "}
                  <strong style={{ color: "#334155" }}>{targetPenilai.nama}</strong> sebagai{" "}
                  {targetPenilai.kategoriLabel.toLowerCase()} untuk {alumniNama}.
                </>
              ) : (
                `Pilih pegawai penilai untuk penugasan ${alumniNama}.`
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="da-modal-close-btn"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="da-modal-body">
          {/* Search Box */}
          <div className="da-search-input-wrap">
            <Search size={15} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIP pegawai…"
              className="da-search-input-field"
            />
          </div>

          {/* Candidate Options List */}
          <div className="da-search-results-list">
            {filteredCandidates.length === 0 ? (
              <p style={{ textAlign: "center", padding: "24px 0", fontSize: "12px", color: "#94a3b8" }}>
                Pegawai tidak ditemukan.
              </p>
            ) : (
              filteredCandidates.map((cand) => {
                const isSelected = cand.id === selectedId;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedId(cand.id)}
                    className={`person-option ${isSelected ? "selected" : ""}`}
                  >
                    <div className="da-user-avatar other" aria-hidden="true">
                      {cand.avatarText}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="person-nama" style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                        {cand.nama}
                      </p>
                      <p style={{ fontSize: "11.5px", color: "#64748b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {cand.jabatan} · {cand.unitKerja}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} style={{ color: "#1f6fd1", flexShrink: 0 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Notice Alert */}
          <div className="da-warning-notice">
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Penilai lama akan menerima notifikasi bahwa tugasnya dibatalkan. Undangan baru akan
              dikirim ke penilai pengganti.
            </span>
          </div>
        </div>

        <div className="da-modal-footer">
          <button
            onClick={onClose}
            className="da-btn-secondary"
            style={{ flex: 1, justifyContent: "center", height: 40 }}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className="da-btn-primary"
            style={{ flex: 1, justifyContent: "center", height: 40 }}
          >
            <Check size={14} strokeWidth={2.4} />
            <span>{targetPenilai ? "Ganti & Kirim Undangan" : "Simpan & Kirim Undangan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
