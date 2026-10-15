"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
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
} from "@/components/bank-instrumen";
import { initialJenisPelatihan, initialFokusList } from "@/lib/mock-instrumen";
import type {
  JenisPelatihanItem,
  FokusItem,
  SubdimensiItem,
  ButirPertanyaanItem,
} from "@/types";
import type { KategoriPenilaiCode } from "@/components/bank-instrumen/PreviewQuestionnaireModal";

export default function BankInstrumenPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pelatihanList, setPelatihanList] = useState<JenisPelatihanItem[]>(initialJenisPelatihan);
  const [selectedPelatihanId, setSelectedPelatihanId] = useState<string>("pel-1");
  const [fokusList, setFokusList] = useState<FokusItem[]>(initialFokusList);
  const [versi, setVersi] = useState("2");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const activePelatihan =
    pelatihanList.find((p) => p.id === selectedPelatihanId) || pelatihanList[0];

  const targetFokus = fokusList.find((f) => f.id === targetFokusId);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDuplicateVersion = () => {
    const nextVer = `${parseInt(versi, 10) + 1}`;
    setVersi(nextVer);
    showNotification(
      `Berhasil menduplikasi ${activePelatihan.nama} menjadi Versi ${nextVer} (Draf).`
    );
  };

  const handleSaveButir = (savedItem: ButirPertanyaanItem) => {
    setFokusList((prev) =>
      prev.map((fokus) => {
        if (!fokus.subdimensis) return fokus;
        return {
          ...fokus,
          subdimensis: fokus.subdimensis.map((sub) => {
            if (!sub.indikators) return sub;
            return {
              ...sub,
              indikators: sub.indikators.map((ind) => {
                if (!ind.items) return ind;
                const existingIdx = ind.items.findIndex((i) => i.id === savedItem.id);
                if (existingIdx >= 0) {
                  const updatedItems = [...ind.items];
                  updatedItems[existingIdx] = savedItem;
                  return { ...ind, items: updatedItems };
                }
                if (savedItem.code.startsWith(ind.code)) {
                  return {
                    ...ind,
                    items: [...ind.items, savedItem],
                    butirCount: ind.butirCount + 1,
                  };
                }
                return ind;
              }),
            };
          }),
        };
      })
    );
    showNotification(`Butir ${savedItem.code} berhasil disimpan.`);
  };

  const handleSaveFokus = (newFokus: FokusItem) => {
    setFokusList((prev) => [...prev, newFokus]);
    showNotification(`Fokus "${newFokus.title}" berhasil ditambahkan.`);
  };

  const handleSaveSubdimensi = (newSub: SubdimensiItem) => {
    setFokusList((prev) =>
      prev.map((fokus) => {
        if (fokus.id === targetFokusId) {
          const currentSubs = fokus.subdimensis || [];
          return {
            ...fokus,
            subdimensiCount: (fokus.subdimensiCount || 0) + 1,
            butirCount: (fokus.butirCount || 0) + newSub.butirCount,
            subdimensis: [...currentSubs, newSub],
          };
        }
        return fokus;
      })
    );
    showNotification(`Subdimensi "${newSub.code} ${newSub.title}" berhasil ditambahkan.`);
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
                Kelola fokus, subdimensi, indikator, dan butir pertanyaan per jenis pelatihan.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <JenisPelatihanSidebar
              pelatihanList={pelatihanList}
              selectedId={selectedPelatihanId}
              onSelect={setSelectedPelatihanId}
              onNewPelatihan={() =>
                showNotification("Membuka formulir pembuatan instrumen jenis pelatihan baru.")
              }
            />

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
                onAddSubdimensi={(fokusId) => {
                  setTargetFokusId(fokusId);
                  setIsAddSubdimensiOpen(true);
                }}
                onAddPertanyaanOpen={() => {
                  showNotification("Membuka formulir pertanyaan terbuka untuk fokus 6.");
                }}
              />
            </section>
          </div>
        </main>
      </div>
      </div>

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
        onClose={() => setIsAddEditButirOpen(false)}
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
    </>
  );
}
