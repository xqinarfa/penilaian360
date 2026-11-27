"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, RefreshCw, AlertCircle, Loader2, Layers, X, Check, Trash2, HelpCircle } from "lucide-react";
import { Sidebar, Topbar } from "@/components/dashboard";
import {
  JenisPelatihanSidebar,
  InstrumenHeader,
  FokusAccordionTree,
  PreviewQuestionnaireModal,
  LiveQuestionnaireModal,
  AddEditButirModal,
  AddFokusModal,
  AddSubdimensiModal,
  AddIndikatorModal,
  AddOpenQuestionModal,
} from "@/components/bank-instrumen";
import type {
  JenisPelatihanItem,
  FokusItem,
  SubdimensiItem,
  ButirPertanyaanItem,
  OpenQuestionItem,
} from "@/types";
import type { KategoriPenilaiCode } from "@/components/bank-instrumen/PreviewQuestionnaireModal";
import {
  fetchPelatihanList,
  fetchFokusList,
  createPelatihan,
  createFokus,
  createSubdimensi,
  createIndikator,
  createButir,
  updateButir,
  deleteButir,
  duplicateInstrumen,
} from "@/lib/api";

export default function BankInstrumenPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pelatihanList, setPelatihanList] = useState<JenisPelatihanItem[]>([]);
  const [selectedPelatihanId, setSelectedPelatihanId] = useState<string>("pel-1");
  const [fokusList, setFokusList] = useState<FokusItem[]>([]);
  const [versi, setVersi] = useState("2");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Loading & Error States
  const [isLoadingPelatihan, setIsLoadingPelatihan] = useState(true);
  const [isLoadingFokus, setIsLoadingFokus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLiveSurveyModalOpen, setIsLiveSurveyModalOpen] = useState(false);
  const [previewKategori, setPreviewKategori] = useState<KategoriPenilaiCode>("D");

  const [isAddEditButirOpen, setIsAddEditButirOpen] = useState(false);
  const [editingButir, setEditingButir] = useState<ButirPertanyaanItem | null>(null);
  const [targetIndikatorCode, setTargetIndikatorCode] = useState("1.1.1");

  const [isAddFokusOpen, setIsAddFokusOpen] = useState(false);
  const [isAddSubdimensiOpen, setIsAddSubdimensiOpen] = useState(false);
  const [targetFokusId, setTargetFokusId] = useState<string>("fokus-1");

  // Indikator Modal State
  const [isAddIndikatorOpen, setIsAddIndikatorOpen] = useState(false);
  const [targetSubdimensi, setTargetSubdimensi] = useState<{
    id: string;
    code: string;
    title: string;
  } | null>(null);

  // Open Question Modal State (Fokus 6)
  const [isAddOpenQuestionOpen, setIsAddOpenQuestionOpen] = useState(false);
  const [editingOpenQuestion, setEditingOpenQuestion] = useState<OpenQuestionItem | null>(null);
  const [targetOpenQuestionFokusId, setTargetOpenQuestionFokusId] = useState<string>("fokus-6");

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    code: string;
    label: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Pelatihan Modal State
  const [isNewPelatihanModalOpen, setIsNewPelatihanModalOpen] = useState(false);
  const [newPelatihanNama, setNewPelatihanNama] = useState("");
  const [newPelatihanUseInti, setNewPelatihanUseInti] = useState(false);
  const [newPelatihanDeskripsi, setNewPelatihanDeskripsi] = useState("");
  const [isCreatingPelatihan, setIsCreatingPelatihan] = useState(false);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Load list of Pelatihan from live Backend
  const loadPelatihanData = useCallback(async () => {
    try {
      setIsLoadingPelatihan(true);
      setError(null);
      const list = await fetchPelatihanList();
      setPelatihanList(list);
      if (list.length > 0) {
        setSelectedPelatihanId((prev) => {
          const exists = list.some((p) => p.id === prev);
          return exists ? prev : list[0].id;
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal memuat jenis pelatihan dari database backend.";
      setError(msg);
    } finally {
      setIsLoadingPelatihan(false);
    }
  }, []);

  // Load tree of Fokus Evaluasi for the currently selected Pelatihan
  const loadFokusData = useCallback(async (pelatihanId: string) => {
    if (!pelatihanId) return;
    try {
      setIsLoadingFokus(true);
      setError(null);
      const data = await fetchFokusList(pelatihanId);
      setFokusList(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal memuat instrumen evaluasi dari database backend.";
      setError(msg);
    } finally {
      setIsLoadingFokus(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPelatihanData();
  }, [loadPelatihanData]);

  // Load Fokus whenever selectedPelatihanId changes
  useEffect(() => {
    if (selectedPelatihanId) {
      loadFokusData(selectedPelatihanId);
    }
  }, [selectedPelatihanId, loadFokusData]);

  const activePelatihan =
    pelatihanList.find((p) => p.id === selectedPelatihanId) ||
    pelatihanList[0] || {
      id: "pel-1",
      nama: "Latsar CPNS",
      useInstrumenInti: false,
    };

  const targetFokus = fokusList.find((f) => f.id === targetFokusId);

  // Duplikasi Versi Instrumen via Backend
  const handleDuplicateVersion = async () => {
    const nextVer = `${parseInt(versi, 10) + 1}`;
    try {
      await duplicateInstrumen({
        sourcePelatihanId: selectedPelatihanId,
        newVersion: nextVer,
      });
      setVersi(nextVer);
      showNotification(
        `Berhasil menduplikasi ${activePelatihan.nama} menjadi Versi ${nextVer} ke database.`
      );
      loadFokusData(selectedPelatihanId);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menduplikasi instrumen.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Simpan / Perbarui Butir Pertanyaan ke Backend
  const handleSaveButir = async (savedItem: ButirPertanyaanItem) => {
    try {
      if (editingButir && editingButir.id) {
        // Update existing butir
        await updateButir(editingButir.id, {
          text: savedItem.text,
          agendaHint: savedItem.agendaHint,
          categories: savedItem.categories,
          isOpenEnded: false,
        });
        showNotification(`Butir ${savedItem.code} berhasil diperbarui di database.`);
      } else {
        // Create new butir
        await createButir({
          pelatihanId: selectedPelatihanId,
          code: savedItem.code,
          text: savedItem.text,
          agendaHint: savedItem.agendaHint,
          categories: savedItem.categories,
          isOpenEnded: false,
        });
        showNotification(`Butir baru ${savedItem.code} berhasil ditambahkan ke database.`);
      }

      setIsAddEditButirOpen(false);
      setEditingButir(null);
      // Reload live tree from database
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan butir instrumen.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Simpan Fokus Baru ke Backend
  const handleSaveFokus = async (newFokus: FokusItem) => {
    try {
      await createFokus({
        pelatihanId: selectedPelatihanId,
        number: newFokus.number,
        title: newFokus.title,
        isIsianTerbuka: newFokus.isIsianTerbuka,
      });
      setIsAddFokusOpen(false);
      showNotification(`Fokus "${newFokus.title}" berhasil ditambahkan ke database.`);
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menambah fokus evaluasi.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Simpan Subdimensi Baru ke Backend
  const handleSaveSubdimensi = async (newSub: SubdimensiItem) => {
    try {
      await createSubdimensi({
        fokusId: targetFokusId,
        code: newSub.code,
        title: newSub.title,
      });
      setIsAddSubdimensiOpen(false);
      showNotification(
        `Subdimensi "${newSub.code} ${newSub.title}" berhasil ditambahkan ke database.`
      );
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menambah subdimensi.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Simpan Indikator Baru ke Backend
  const handleSaveIndikator = async (newInd: { code: string; title: string }) => {
    if (!targetSubdimensi) return;
    try {
      await createIndikator({
        subdimensiId: targetSubdimensi.id,
        code: newInd.code,
        title: newInd.title,
      });
      setIsAddIndikatorOpen(false);
      showNotification(
        `Indikator "${newInd.code} ${newInd.title}" berhasil ditambahkan ke database.`
      );
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menambah indikator.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Simpan / Perbarui Pertanyaan Terbuka (Fokus 6) ke Backend
  const handleSaveOpenQuestion = async (item: { id?: string; code: string; text: string }) => {
    try {
      if (item.id) {
        await updateButir(item.id, {
          text: item.text,
          categories: ["D", "A", "R", "B"],
          isOpenEnded: true,
        });
        showNotification(`Pertanyaan terbuka "${item.code}" berhasil diperbarui di database.`);
      } else {
        await createButir({
          pelatihanId: selectedPelatihanId,
          fokusId: targetOpenQuestionFokusId,
          code: item.code,
          text: item.text,
          categories: ["D", "A", "R", "B"],
          isOpenEnded: true,
        });
        showNotification(`Pertanyaan terbuka "${item.code}" berhasil ditambahkan ke database.`);
      }
      setIsAddOpenQuestionOpen(false);
      setEditingOpenQuestion(null);
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan pertanyaan terbuka.";
      showNotification(`Error: ${msg}`);
    }
  };

  // Konfirmasi & Hapus Butir atau Pertanyaan Terbuka dari Database
  const handleDeleteItem = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteButir(deleteConfirm.id);
      showNotification(`${deleteConfirm.label} "${deleteConfirm.code}" berhasil dihapus dari database.`);
      setDeleteConfirm(null);
      await loadFokusData(selectedPelatihanId);
      await loadPelatihanData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus butir instrumen.";
      showNotification(`Error: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Buat Jenis Pelatihan Baru ke Backend
  const handleCreateNewPelatihan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPelatihanNama.trim()) return;

    setIsCreatingPelatihan(true);
    try {
      const created = await createPelatihan({
        nama: newPelatihanNama.trim(),
        useInstrumenInti: newPelatihanUseInti,
        deskripsi: newPelatihanDeskripsi.trim(),
      });

      setIsNewPelatihanModalOpen(false);
      setNewPelatihanNama("");
      setNewPelatihanDeskripsi("");
      setNewPelatihanUseInti(false);
      showNotification(
        `Jenis Pelatihan "${created.nama}" berhasil dibuat di database!`
      );

      await loadPelatihanData();
      setSelectedPelatihanId(created.id);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal membuat jenis pelatihan.";
      showNotification(`Error: ${msg}`);
    } finally {
      setIsCreatingPelatihan(false);
    }
  };

  return (
    <>
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
            breadcrumbSub="BANK INSTRUMEN"
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />

          {/* Content Body */}
          <main className="dash-content-body">
            {/* Header Row: Title & Subtitle */}
            <div className="dash-page-header">
              <div>
                <h1 className="dash-page-title">Bank Instrumen</h1>
                <p className="dash-page-subtitle">
                  Kelola fokus, subdimensi, indikator, dan butir pertanyaan per jenis pelatihan yang tersimpan di PostgreSQL.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    loadPelatihanData();
                    if (selectedPelatihanId) loadFokusData(selectedPelatihanId);
                  }}
                  className="dash-btn-outline"
                  title="Segarkan data instrumen dari backend"
                >
                  <RefreshCw
                    size={14}
                    className={isLoadingFokus || isLoadingPelatihan ? "animate-spin" : ""}
                  />
                  <span>Segarkan</span>
                </button>
                <Link
                  href="/bank-instrumen/tambah-butir"
                  className="dash-btn-action-primary"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  <Plus size={15} />
                  <span>Tambah Butir Pertanyaan</span>
                </Link>
              </div>
            </div>

            {/* Error Banner with Retry */}
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
                  onClick={() => {
                    loadPelatihanData();
                    if (selectedPelatihanId) loadFokusData(selectedPelatihanId);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Toast Notification Banner */}
            {statusMessage && (
              <div className="dash-toast-banner" role="status">
                <span>{statusMessage}</span>
                <button
                  type="button"
                  className="dash-toast-close"
                  onClick={() => setStatusMessage(null)}
                >
                  ×
                </button>
              </div>
            )}

            {/* Split Container: Left Aside + Right Tree */}
            <div className="dash-instrumen-split-layout">
              {/* Kolom Kiri: Jenis Pelatihan */}
              {isLoadingPelatihan ? (
                <aside className="dash-pelatihan-sidebar" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                  <Loader2 size={24} className="animate-spin text-primary-600" />
                  <span style={{ marginLeft: "8px", fontSize: "13px", color: "#64748b" }}>Memuat pelatihan...</span>
                </aside>
              ) : (
                <JenisPelatihanSidebar
                  pelatihanList={pelatihanList}
                  selectedId={selectedPelatihanId}
                  onSelect={setSelectedPelatihanId}
                  onNewPelatihan={() => setIsNewPelatihanModalOpen(true)}
                />
              )}

              {/* Kolom Kanan: Metadata Header + Tree Instrumen */}
              <section className="dash-instrumen-main-section" aria-label="Detail Instrumen">
                <InstrumenHeader
                  title={`Instrumen ${activePelatihan.nama}`}
                  versi={versi}
                  tanggalTerbit="2 Okt 2026"
                  periodeAktif="1 periode aktif"
                  onPreview={() => setIsPreviewModalOpen(true)}
                  onDuplicate={handleDuplicateVersion}
                  onAddFokus={() => setIsAddFokusOpen(true)}
                />

                {isLoadingFokus ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "12px" }}>
                    <Loader2 size={32} className="animate-spin text-primary-600" />
                    <span style={{ fontSize: "14px", color: "#64748b" }}>Memuat struktur fokus & butir instrumen dari database...</span>
                  </div>
                ) : (
                  <FokusAccordionTree
                    fokusList={fokusList}
                    onAddButir={(indId, indCode) => {
                      setEditingButir(null);
                      setTargetIndikatorCode(indCode);
                      setIsAddEditButirOpen(true);
                    }}
                    onEditButir={(butir) => {
                      setEditingButir(butir);
                      setIsAddEditButirOpen(true);
                    }}
                    onDeleteButir={(butirId, butirCode) => {
                      setDeleteConfirm({
                        isOpen: true,
                        id: butirId,
                        code: butirCode,
                        label: "Butir pertanyaan",
                      });
                    }}
                    onAddSubdimensi={(fokusId) => {
                      setTargetFokusId(fokusId);
                      setIsAddSubdimensiOpen(true);
                    }}
                    onAddIndikator={(subId, subCode) => {
                      const allSubs = fokusList.flatMap((f) => f.subdimensis || []);
                      const found = allSubs.find((s) => s.id === subId);
                      setTargetSubdimensi({
                        id: subId,
                        code: subCode,
                        title: found ? found.title : "",
                      });
                      setIsAddIndikatorOpen(true);
                    }}
                    onAddPertanyaanOpen={(fokusId) => {
                      setEditingOpenQuestion(null);
                      setTargetOpenQuestionFokusId(fokusId || "fokus-6");
                      setIsAddOpenQuestionOpen(true);
                    }}
                    onEditOpenQuestion={(oq) => {
                      setEditingOpenQuestion(oq);
                      setTargetOpenQuestionFokusId("fokus-6");
                      setIsAddOpenQuestionOpen(true);
                    }}
                    onDeleteOpenQuestion={(id, code) => {
                      setDeleteConfirm({
                        isOpen: true,
                        id,
                        code,
                        label: "Pertanyaan terbuka",
                      });
                    }}
                  />
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL: Tambah Jenis Pelatihan Baru */}
      {isNewPelatihanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-primary-600" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Tambah Jenis Pelatihan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPelatihanModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewPelatihan} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Nama Jenis Pelatihan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pelatihan Teknis Fungsional Maritim"
                  value={newPelatihanNama}
                  onChange={(e) => setNewPelatihanNama(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan tujuan atau cakupan pelatihan..."
                  value={newPelatihanDeskripsi}
                  onChange={(e) => setNewPelatihanDeskripsi(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-use-inti"
                  checked={newPelatihanUseInti}
                  onChange={(e) => setNewPelatihanUseInti(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="chk-use-inti" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  Gunakan Instrumen Inti (Standar 6 Fokus Evaluasi)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewPelatihanModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingPelatihan || !newPelatihanNama.trim()}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
                >
                  {isCreatingPelatihan ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Pelatihan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: Pilih Kategori Penilai untuk Pratinjau */}
      <PreviewQuestionnaireModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onOpenLivePreview={(kategori) => {
          setPreviewKategori(kategori);
          setIsPreviewModalOpen(false);
          setIsLiveSurveyModalOpen(true);
        }}
      />

      {/* MODAL 2: Lembar Pratinjau Kuesioner Interaktif */}
      <LiveQuestionnaireModal
        isOpen={isLiveSurveyModalOpen}
        kategori={previewKategori}
        pelatihanNama={activePelatihan.nama}
        fokusList={fokusList}
        onClose={() => setIsLiveSurveyModalOpen(false)}
        onChangeKategori={setPreviewKategori}
      />

      {/* MODAL 3: Tambah / Edit Butir Pertanyaan */}
      <AddEditButirModal
        isOpen={isAddEditButirOpen}
        initialData={editingButir}
        indikatorCode={targetIndikatorCode}
        onClose={() => {
          setIsAddEditButirOpen(false);
          setEditingButir(null);
        }}
        onSave={handleSaveButir}
      />

      {/* MODAL 4: Tambah Fokus Baru */}
      <AddFokusModal
        isOpen={isAddFokusOpen}
        nextNumber={fokusList.length + 1}
        onClose={() => setIsAddFokusOpen(false)}
        onSave={handleSaveFokus}
      />

      {/* MODAL 5: Tambah Subdimensi Baru */}
      <AddSubdimensiModal
        isOpen={isAddSubdimensiOpen}
        fokusTitle={targetFokus ? targetFokus.title : "Fokus"}
        suggestedCode={targetFokus ? `${targetFokus.number}.${(targetFokus.subdimensis?.length || 0) + 1}` : "1.5"}
        onClose={() => setIsAddSubdimensiOpen(false)}
        onSave={handleSaveSubdimensi}
      />

      {/* MODAL 6: Tambah Indikator Baru */}
      <AddIndikatorModal
        isOpen={isAddIndikatorOpen}
        subdimensiTitle={targetSubdimensi ? targetSubdimensi.title : "Subdimensi"}
        subdimensiCode={targetSubdimensi ? targetSubdimensi.code : "1.1"}
        suggestedCode={targetSubdimensi ? `${targetSubdimensi.code}.1` : "1.1.1"}
        onClose={() => setIsAddIndikatorOpen(false)}
        onSave={handleSaveIndikator}
      />

      {/* MODAL 7: Tambah / Edit Pertanyaan Terbuka (Fokus 6) */}
      <AddOpenQuestionModal
        isOpen={isAddOpenQuestionOpen}
        initialData={editingOpenQuestion}
        suggestedCode={`6.${(fokusList.find((f) => f.isIsianTerbuka)?.openQuestions?.length || 0) + 1}`}
        onClose={() => {
          setIsAddOpenQuestionOpen(false);
          setEditingOpenQuestion(null);
        }}
        onSave={handleSaveOpenQuestion}
      />

      {/* MODAL 8: Konfirmasi Hapus Butir / Pertanyaan */}
      {deleteConfirm && deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Hapus {deleteConfirm.label}?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.code}</strong> secara permanen dari database?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteItem}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
