"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Loader2 } from "lucide-react";
import type { JenisPelatihanItem, PeriodeEvaluasiItem } from "@/types";
import { fetchPelatihanList, createPeriode } from "@/lib/api";

interface CreatePeriodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPeriode: PeriodeEvaluasiItem) => void;
}

export default function CreatePeriodeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePeriodeModalProps) {
  const [nama, setNama] = useState("");
  const [pelatihanList, setPelatihanList] = useState<JenisPelatihanItem[]>([]);
  const [selectedPelatihanId, setSelectedPelatihanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Berjalan");
  const [isLoadingPelatihan, setIsLoadingPelatihan] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Default dates
      const now = new Date();
      const future = new Date();
      future.setDate(now.getDate() + 21);

      const toIsoDate = (d: Date) => d.toISOString().split("T")[0];
      setStartDate(toIsoDate(now));
      setEndDate(toIsoDate(future));
      setNama("");
      setError(null);

      // Fetch pelatihan list
      setIsLoadingPelatihan(true);
      fetchPelatihanList()
        .then((list) => {
          setPelatihanList(list);
          if (list.length > 0) {
            setSelectedPelatihanId(list[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingPelatihan(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !selectedPelatihanId || !startDate || !endDate) {
      setError("Semua kolom bertanda bintang wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createPeriode({
        nama: nama.trim(),
        pelatihanId: selectedPelatihanId,
        startDate,
        endDate,
        status,
      });

      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat periode evaluasi.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="dash-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
          <motion.div
            className="dash-modal-container bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
            style={{ maxWidth: "480px", width: "100%" }}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Buat Periode Evaluasi Manual
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Buka jendela masa pengisian kuesioner evaluasi 360
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Tutup modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Nama Periode Evaluasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Latsar CPNS Gelombang IV 2026"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Jenis Pelatihan & Instrumen <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled={isLoadingPelatihan}
                  value={selectedPelatihanId}
                  onChange={(e) => setSelectedPelatihanId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {pelatihanList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} {p.useInstrumenInti ? "(Instrumen Inti)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Batas Akhir (Deadline) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Status Awal
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Berjalan">Berjalan (Langsung dibuka untuk penilai)</option>
                  <option value="Terjadwal">Terjadwal (Menunggu tanggal mulai)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !nama.trim()}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Buat Periode</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
