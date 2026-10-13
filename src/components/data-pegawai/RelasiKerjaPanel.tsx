"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, AlertTriangle, ChevronDown } from "lucide-react";
import type { PegawaiItem } from "@/types";

interface RelasiKerjaPanelProps {
  pegawai: PegawaiItem | null;
  onClose: () => void;
  onSave: (updated: PegawaiItem) => void;
}

const mockAtasanOptions = [
  "Fajar Nugroho — Kasubbag Program",
  "Ir. Bambang Trihatmojo — Kepala Seksi Sarana",
  "Dra. Hendriani Kusumastuti — Koordinator Pelatihan",
  "Capt. Mochammad Yusuf — Direktur Akademik",
];

export default function RelasiKerjaPanel({
  pegawai,
  onClose,
  onSave,
}: RelasiKerjaPanelProps) {
  const [atasan, setAtasan] = useState("");
  const [rekanList, setRekanList] = useState<string[]>([]);
  const [bawahanList, setBawahanList] = useState<string[]>([]);
  const [newRekanInput, setNewRekanInput] = useState("");
  const [newBawahanInput, setNewBawahanInput] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (pegawai) {
      setAtasan(pegawai.atasan || mockAtasanOptions[0]);
      setRekanList(pegawai.rekanKerja || []);
      setBawahanList(pegawai.bawahan || []);
      setHasChanges(false);
    }
  }, [pegawai]);

  if (!pegawai) return null;

  const initials = pegawai.nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAddRekan = () => {
    if (!newRekanInput.trim()) return;
    setRekanList((prev) => [...prev, newRekanInput.trim()]);
    setNewRekanInput("");
    setHasChanges(true);
  };

  const handleRemoveRekan = (index: number) => {
    setRekanList((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleAddBawahan = () => {
    if (!newBawahanInput.trim()) return;
    setBawahanList((prev) => [...prev, newBawahanInput.trim()]);
    setNewBawahanInput("");
    setHasChanges(true);
  };

  const handleRemoveBawahan = (index: number) => {
    setBawahanList((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({
      ...pegawai,
      atasan,
      rekanKerja: rekanList,
      bawahan: bawahanList,
      statusRelasi:
        !atasan || rekanList.length < 2
          ? "Rekan kurang"
          : "Lengkap",
    });
    setHasChanges(false);
  };

  return (
    <motion.aside
      className="dash-relasi-panel"
      aria-label="Edit Relasi Kerja Pegawai"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      {/* Header Panel */}
      <div className="dash-relasi-header">
        <div>
          <h2 className="dash-relasi-title">Relasi Kerja</h2>
          {hasChanges && (
            <div className="dash-relasi-unsaved">
              <span className="dash-unsaved-dot" />
              <span>Ada perubahan belum disimpan</span>
            </div>
          )}
        </div>
        <motion.button
          type="button"
          className="dash-relasi-close-btn"
          onClick={onClose}
          aria-label="Tutup panel relasi"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
        </motion.button>
      </div>

      {/* Body Formulir */}
      <div className="dash-relasi-body">
        {/* Ringkasan Profil Pegawai Terpilih */}
        <div className="dash-relasi-profile">
          <div className="dash-relasi-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="dash-relasi-info">
            <span className="dash-relasi-name">{pegawai.nama}</span>
            <span className="dash-relasi-role">NIP: {pegawai.nip}</span>
          </div>
        </div>

        {/* Input Atasan */}
        <div className="dash-relasi-field">
          <label className="dash-field-label" htmlFor="select-atasan">
            Atasan Langsung <span className="text-danger">*</span>
          </label>
          <div className="dash-select-wrapper">
            <select
              id="select-atasan"
              value={atasan}
              onChange={(e) => {
                setAtasan(e.target.value);
                setHasChanges(true);
              }}
              className="dash-relasi-select"
            >
              {mockAtasanOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* Input Rekan Kerja (Peers) */}
        <div className="dash-relasi-field">
          <label className="dash-field-label">
            Rekan Kerja (Peer) <span className="text-danger">*</span>{" "}
            <span className="text-muted">(min. 2 orang)</span>
          </label>
          <div className="dash-chips-box">
            {rekanList.map((rekan, idx) => (
              <motion.div
                key={idx}
                className="dash-chip-item"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <span>{rekan}</span>
                <button
                  type="button"
                  className="dash-chip-remove"
                  onClick={() => handleRemoveRekan(idx)}
                  aria-label={`Hapus ${rekan}`}
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
            <input
              type="text"
              placeholder="+ Tambah rekan"
              value={newRekanInput}
              onChange={(e) => setNewRekanInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRekan())}
              className="dash-chip-input"
            />
          </div>
          {rekanList.length < 2 && (
            <div className="dash-relasi-warning-box">
              <AlertTriangle size={14} className="dash-warning-icon" aria-hidden="true" />
              <p className="dash-warning-text">
                Rekan kerja minimal 2 orang untuk objektivitas penilaian 360°. Saat ini baru {rekanList.length} orang.
              </p>
            </div>
          )}
        </div>

        {/* Input Bawahan (Optional) */}
        <div className="dash-relasi-field">
          <label className="dash-field-label">
            Bawahan <span className="text-muted">(opsional, maks. 3)</span>
          </label>
          <div className="dash-chips-box">
            {bawahanList.map((bawahan, idx) => (
              <motion.div
                key={idx}
                className="dash-chip-item"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <span>{bawahan}</span>
                <button
                  type="button"
                  className="dash-chip-remove"
                  onClick={() => handleRemoveBawahan(idx)}
                  aria-label={`Hapus ${bawahan}`}
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
            {bawahanList.length < 3 && (
              <input
                type="text"
                placeholder="+ Tambah bawahan"
                value={newBawahanInput}
                onChange={(e) => setNewBawahanInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBawahan())}
                className="dash-chip-input"
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Aksi */}
      <div className="dash-relasi-footer">
        <motion.button
          type="button"
          className="dash-btn-panel-cancel"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Batal
        </motion.button>
        <motion.button
          type="button"
          className="dash-btn-panel-save"
          onClick={handleSave}
          disabled={!hasChanges && pegawai.rekanKerja.length === rekanList.length}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Check size={14} aria-hidden="true" />
          <span>Simpan</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
