"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import type { SIKSyncHistoryItem } from "@/types";
import { fetchSyncHistory, triggerSyncSIK } from "@/lib/api";

interface SyncHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

export default function SyncHistoryModal({
  isOpen,
  onClose,
  onSyncSuccess,
}: SyncHistoryModalProps) {
  const [historyList, setHistoryList] = useState<SIKSyncHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedSyncId, setExpandedSyncId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSyncHistory();
      setHistoryList(data);
      if (data.length > 0 && !expandedSyncId) {
        setExpandedSyncId(data[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat riwayat sync";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const result = await triggerSyncSIK("Administrator PPSDMAP");
      setHistoryList((prev) => [result, ...prev]);
      setExpandedSyncId(result.id);
      if (onSyncSuccess) onSyncSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal melakukan sinkronisasi SI-K";
      setError(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  const totalRuns = historyList.length;
  const lastSync = historyList.length > 0 ? historyList[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-gray-800/50 dark:to-gray-900/50">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20">
              <Database size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Riwayat Sinkronisasi SI-K & Perubahan Data
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  SI-K Kemenhub
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Audit trail pencatatan riwayat perubahan mutasi, promosi, jabatan, dan relasi kerja pegawai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Overview Metric Bar */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 text-xs">
          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {lastSync?.status === "SUCCESS" ? "Sinkronisasi Normal" : "Siap Sinkron"}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Total {totalRuns} sesi audit tercatat
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <ShieldCheck size={18} className="text-blue-600 shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {lastSync?.totalFetched || 10} Pegawai Terverifikasi
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Sumber: {lastSync?.source || "SI-K Kemenhub SOAP v2"}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Clock size={18} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {lastSync ? new Date(lastSync.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB" : "-"}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                {lastSync ? new Date(lastSync.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Loader2 size={24} className="animate-spin text-primary-600" />
              <span className="text-xs">Memuat riwayat sinkronisasi SI-K...</span>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Belum ada riwayat sinkronisasi.</p>
              <p className="text-xs mt-1">Klik tombol &quot;Sinkronkan Sekarang&quot; untuk menjalankan sinkronisasi perdana.</p>
            </div>
          ) : (
            historyList.map((item) => {
              const isExpanded = expandedSyncId === item.id;
              const formattedDate = new Date(item.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-sm overflow-hidden transition"
                >
                  {/* Item Header */}
                  <div
                    onClick={() => setExpandedSyncId(isExpanded ? null : item.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/40 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {item.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              item.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : item.status === "PARTIAL"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {item.syncType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {formattedDate} WIB
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Oleh: {item.triggeredByName} · {item.durationMs}ms
                      </div>
                    </div>
                  </div>

                  {/* Expanded Audit Log Table */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Log Riwayat Perubahan & Verifikasi ({item.changesLog?.length || 0})
                          </h4>
                          <span className="text-[11px] text-gray-500">
                            Diproses: {item.totalFetched} data · Diperbarui: {item.totalUpdated}
                          </span>
                        </div>

                        {(!item.changesLog || item.changesLog.length === 0) ? (
                          <div className="py-4 text-center text-xs text-gray-400">
                            Tidak ada perubahan data pada sinkronisasi ini (semua profil sudah sesuai).
                          </div>
                        ) : (
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                  <th className="py-2 px-3">Pegawai / NIP</th>
                                  <th className="py-2 px-3">Jenis</th>
                                  <th className="py-2 px-3">Bidang</th>
                                  <th className="py-2 px-3">Nilai Lama</th>
                                  <th className="py-2 px-3">Nilai Baru</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {item.changesLog.map((log, logIdx) => (
                                  <tr key={logIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="py-2 px-3">
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        {log.nama}
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-mono">
                                        {log.nip}
                                      </div>
                                    </td>
                                    <td className="py-2 px-3">
                                      <span
                                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                                          log.changeType === "MUTASI"
                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                                            : log.changeType === "PROMOSI"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                            : log.changeType === "RELASI"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        {log.changeType}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                                      {log.field}
                                    </td>
                                    <td className="py-2 px-3 text-gray-500 line-through text-[11px]">
                                      {log.oldValue}
                                    </td>
                                    <td className="py-2 px-3 font-medium text-emerald-700 dark:text-emerald-400 text-[11px]">
                                      {log.newValue}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Data tersimpan dan teraudit di database PostgreSQL Evaluasi 360</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

