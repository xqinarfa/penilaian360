"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Loader2,
  UserCheck,
  Database,
} from "lucide-react";
import { Sidebar, Topbar } from "@/components/dashboard";
import {
  PegawaiTable,
  RelasiKerjaPanel,
  SyncHistoryModal,
} from "@/components/data-pegawai";
import type { PegawaiItem } from "@/types";
import {
  fetchPegawaiList,
  updatePegawaiRelasi,
  createPegawai,
  updatePegawai,
  deletePegawaiBatch,
} from "@/lib/api";

export default function DataPegawaiPage() {
  const [pegawaiList, setPegawaiList] = useState<PegawaiItem[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<PegawaiItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("memuat...");

  // Form state for Tambah Pegawai
  const [newPegawaiForm, setNewPegawaiForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
    unitKerja: "Ditjen Perhubungan Laut",
    email: "",
    phone: "",
    role: "pegawai",
    password: "password123",
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Form state for Edit Pegawai
  const [editPegawaiForm, setEditPegawaiForm] = useState({
    id: "",
    nip: "",
    nama: "",
    jabatan: "",
    unitKerja: "Ditjen Perhubungan Laut",
    email: "",
    phone: "",
    role: "pegawai",
    password: "",
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Load data from live backend API
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setIsLoading(true);
      setError(null);
      const res = await fetchPegawaiList();
      setPegawaiList(res.items);

      const now = new Date();
      setLastSyncTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} WIB`
      );

      // Keep current selected if still present, or select the first item
      setSelectedEmployee((prev) => {
        if (prev) {
          const found = res.items.find((p) => p.id === prev.id);
          if (found) return found;
        }
        return res.items.length > 0 ? res.items[0] : null;
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal memuat data pegawai dari backend.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle saving relations to backend
  const handleSaveRelasi = async (updated: PegawaiItem) => {
    setIsSaving(true);
    try {
      const saved = await updatePegawaiRelasi(updated.id, {
        atasan: updated.atasan,
        rekanKerja: updated.rekanKerja,
        bawahan: updated.bawahan,
      });

      setPegawaiList((prev) =>
        prev.map((item) => (item.id === saved.id ? saved : item))
      );
      setSelectedEmployee(saved);
      setNotification({
        type: "success",
        message: `Relasi kerja ${saved.nama} berhasil diperbarui di database!`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memperbarui relasi kerja.";
      setNotification({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting employees from backend
  const handleDeleteEmployees = async (ids: string[]) => {
    try {
      await deletePegawaiBatch(ids);
      setPegawaiList((prev) => prev.filter((item) => !ids.includes(item.id)));
      if (selectedEmployee && ids.includes(selectedEmployee.id)) {
        setSelectedEmployee(null);
      }
      setNotification({
        type: "success",
        message: `${ids.length} pegawai berhasil dihapus dari database.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus pegawai.";
      setNotification({
        type: "error",
        message: msg,
      });
    }
  };

  // Handle creating new employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPegawaiForm.nip || !newPegawaiForm.nama || !newPegawaiForm.email) {
      setNotification({
        type: "error",
        message: "NIP, Nama, dan Email wajib diisi.",
      });
      return;
    }

    setIsSubmittingNew(true);
    try {
      const created = await createPegawai(newPegawaiForm);
      setPegawaiList((prev) => [created, ...prev]);
      setSelectedEmployee(created);
      setIsAddModalOpen(false);
      setNewPegawaiForm({
        nip: "",
        nama: "",
        jabatan: "",
        unitKerja: "Ditjen Perhubungan Laut",
        email: "",
        phone: "",
        role: "pegawai",
        password: "password123",
      });
      setNotification({
        type: "success",
        message: `Pegawai ${created.nama} (Role: ${created.role || "pegawai"}) berhasil ditambahkan!`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menambahkan pegawai.";
      setNotification({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleOpenEditModal = (emp: PegawaiItem) => {
    setEditPegawaiForm({
      id: emp.id,
      nip: emp.nip || "",
      nama: emp.nama || "",
      jabatan: emp.jabatan || "",
      unitKerja: emp.unitKerja || "Ditjen Perhubungan Laut",
      email: emp.email || "",
      phone: emp.phone || "",
      role: emp.role || "pegawai",
      password: "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPegawaiForm.id || !editPegawaiForm.nama || !editPegawaiForm.nip) {
      setNotification({
        type: "error",
        message: "NIP dan Nama tidak boleh kosong.",
      });
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const payload: Record<string, string | undefined> = {
        nama: editPegawaiForm.nama,
        nip: editPegawaiForm.nip,
        jabatan: editPegawaiForm.jabatan,
        unitKerja: editPegawaiForm.unitKerja,
        email: editPegawaiForm.email,
        phone: editPegawaiForm.phone,
        role: editPegawaiForm.role,
      };
      if (editPegawaiForm.password) {
        payload.password = editPegawaiForm.password;
      }

      const updated = await updatePegawai(editPegawaiForm.id, payload);
      setPegawaiList((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      if (selectedEmployee?.id === updated.id) {
        setSelectedEmployee(updated);
      }
      setIsEditModalOpen(false);
      setNotification({
        type: "success",
        message: `Data pegawai ${updated.nama} berhasil diperbarui!`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memperbarui pegawai.";
      setNotification({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  return (
    <div className="dash-layout">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="dash-main-column">
        {/* Topbar Header */}
        <Topbar
          breadcrumbMain="DATA"
          breadcrumbSub="DATA PEGAWAI"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Page Content Body */}
        <main className="dash-content-body">
          {/* Toast Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                className={`mb-4 p-4 rounded-lg flex items-center justify-between text-sm ${
                  notification.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                }`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="flex items-center gap-2">
                  {notification.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
                  )}
                  <span>{notification.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Bar */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Data Pegawai</h1>
              <div className="dash-pegawai-header-meta">
                <span>Terhubung ke Backend Database</span>
                <span className="dash-meta-dot">·</span>
                <strong>{pegawaiList.length} pegawai terdaftar</strong>
                <span className="dash-meta-dot">·</span>
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(true)}
                  className="dash-sync-badge-green cursor-pointer hover:opacity-85 transition"
                  title="Klik untuk membuka riwayat perubahan & sinkronisasi SI-K"
                >
                  <CheckCircle2 size={12} aria-hidden="true" />
                  <span>sinkron {lastSyncTime}</span>
                </button>
              </div>
            </div>

            <div className="dash-header-action-btns">
              <motion.button
                type="button"
                className="dash-btn-outline"
                onClick={() => setIsSyncModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Buka panel riwayat sinkronisasi & log perubahan SI-K"
              >
                <Database size={14} className="text-primary-600" aria-hidden="true" />
                <span>Riwayat Sync SI-K</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-outline"
                onClick={() => loadData(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Muat ulang data dari backend"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
                <span>Segarkan</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-outline"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(pegawaiList, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `data-pegawai-360-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={14} aria-hidden="true" />
                <span>Unduh JSON</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-primary"
                onClick={() => setIsAddModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} aria-hidden="true" />
                <span>Tambah Pegawai</span>
              </motion.button>
            </div>
          </div>

          {/* Error Alert with Retry */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-600" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                    Koneksi Backend Terkendala
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => loadData()}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Split Layout: Kolom Kiri (Tabel) + Kolom Kanan (Panel Relasi Kerja) */}
          <div className="dash-split-layout">
            <div className="dash-split-table-side">
              <PegawaiTable
                data={pegawaiList}
                isLoading={isLoading}
                selectedEmployee={selectedEmployee}
                onSelectEmployee={(emp) => setSelectedEmployee(emp)}
                onDeleteEmployees={handleDeleteEmployees}
              />
            </div>

            <AnimatePresence>
              {selectedEmployee && (
                <div className="dash-split-panel-side">
                  <RelasiKerjaPanel
                    pegawai={selectedEmployee}
                    allPegawai={pegawaiList}
                    isSaving={isSaving}
                    onClose={() => setSelectedEmployee(null)}
                    onSave={handleSaveRelasi}
                    onEditPegawai={handleOpenEditModal}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Tambah Pegawai */}
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <UserCheck size={18} className="text-primary-600" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Tambah Pegawai Baru
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateEmployee} className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        NIP <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 199501012022031001"
                        value={newPegawaiForm.nip}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, nip: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dr. Budi Santoso, S.T., M.T."
                        value={newPegawaiForm.nama}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, nama: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Analis Kebijakan Ahli Muda"
                        value={newPegawaiForm.jabatan}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, jabatan: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Unit Kerja
                      </label>
                      <select
                        value={newPegawaiForm.unitKerja}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, unitKerja: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Ditjen Perhubungan Laut">Ditjen Perhubungan Laut</option>
                        <option value="BPSDM Perhubungan">BPSDM Perhubungan</option>
                        <option value="Ditjen Perhubungan Darat">Ditjen Perhubungan Darat</option>
                        <option value="Ditjen Perhubungan Udara">Ditjen Perhubungan Udara</option>
                        <option value="Sekretariat Jenderal">Sekretariat Jenderal</option>
                        <option value="Inspektorat Jenderal">Inspektorat Jenderal</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Peran / Role <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={newPegawaiForm.role}
                          onChange={(e) =>
                            setNewPegawaiForm({ ...newPegawaiForm, role: e.target.value })
                          }
                          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pegawai">Pegawai</option>
                          <option value="admin">Administrator</option>
                          <option value="evaluator">Evaluator (Penilai 360)</option>
                          <option value="alumni">Alumni Pelatihan</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Kata Sandi Awal
                        </label>
                        <input
                          type="text"
                          placeholder="Default: password123"
                          value={newPegawaiForm.password}
                          onChange={(e) =>
                            setNewPegawaiForm({ ...newPegawaiForm, password: e.target.value })
                          }
                          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Email Resmi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nama@kemenhub.go.id"
                        value={newPegawaiForm.email}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, email: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Nomor Handphone
                      </label>
                      <input
                        type="tel"
                        placeholder="+62 812-xxxx-xxxx"
                        value={newPegawaiForm.phone}
                        onChange={(e) =>
                          setNewPegawaiForm({ ...newPegawaiForm, phone: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingNew}
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
                      >
                        {isSubmittingNew ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <span>Simpan Pegawai</span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal Edit Pegawai / Akun */}
          <AnimatePresence>
            {isEditModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <UserCheck size={18} className="text-primary-600" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Edit Data & Akun Pegawai
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateEmployee} className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        NIP <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editPegawaiForm.nip}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, nip: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editPegawaiForm.nama}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, nama: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={editPegawaiForm.jabatan}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, jabatan: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Unit Kerja
                      </label>
                      <select
                        value={editPegawaiForm.unitKerja}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, unitKerja: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Ditjen Perhubungan Laut">Ditjen Perhubungan Laut</option>
                        <option value="BPSDM Perhubungan">BPSDM Perhubungan</option>
                        <option value="Ditjen Perhubungan Darat">Ditjen Perhubungan Darat</option>
                        <option value="Ditjen Perhubungan Udara">Ditjen Perhubungan Udara</option>
                        <option value="Sekretariat Jenderal">Sekretariat Jenderal</option>
                        <option value="Inspektorat Jenderal">Inspektorat Jenderal</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Peran / Role
                        </label>
                        <select
                          value={editPegawaiForm.role}
                          onChange={(e) =>
                            setEditPegawaiForm({ ...editPegawaiForm, role: e.target.value })
                          }
                          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pegawai">Pegawai</option>
                          <option value="admin">Administrator</option>
                          <option value="evaluator">Evaluator (Penilai 360)</option>
                          <option value="alumni">Alumni Pelatihan</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          placeholder="Kosongkan bila tetap"
                          value={editPegawaiForm.password}
                          onChange={(e) =>
                            setEditPegawaiForm({ ...editPegawaiForm, password: e.target.value })
                          }
                          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={editPegawaiForm.email}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, email: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Nomor Handphone
                      </label>
                      <input
                        type="tel"
                        value={editPegawaiForm.phone}
                        onChange={(e) =>
                          setEditPegawaiForm({ ...editPegawaiForm, phone: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingEdit}
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
                      >
                        {isSubmittingEdit ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <span>Simpan Perubahan</span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal Riwayat Sinkronisasi SI-K */}
          <SyncHistoryModal
            isOpen={isSyncModalOpen}
            onClose={() => setIsSyncModalOpen(false)}
            onSyncSuccess={() => {
              loadData(true);
              setNotification({
                type: "success",
                message: "Sinkronisasi SI-K berhasil diproses dan data diperbarui!",
              });
            }}
          />

          {/* Footer Note */}
          <footer className="dash-footer-note">
            Data Pegawai Evaluasi 360 terintegrasi langsung dengan database PostgreSQL Backend (Port 8081).
          </footer>
        </main>
      </div>
    </div>
  );
}
