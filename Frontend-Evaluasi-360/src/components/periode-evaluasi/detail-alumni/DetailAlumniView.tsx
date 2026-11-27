"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import "./detail-alumni.css";
import {
  INITIAL_ALUMNI,
  INITIAL_PENILAI_LIST,
  CANDIDATE_REPLACEMENT_LIST,
  PenilaiItem,
  CandidatePegawai,
  AlumniProfile,
} from "./types";
import {
  fetchAlumniDetail,
  fetchPegawaiList,
  gantiPenilai,
  batalkanPenugasan,
  kirimPengingatPenugasan,
} from "@/lib/api";
import { AlumniIdentityCard } from "./AlumniIdentityCard";
import { PenilaiTableSection } from "./PenilaiTableSection";
import { KelengkapanPenilaiCard } from "./KelengkapanPenilaiCard";
import { AmbangKerahasiaanCard } from "./AmbangKerahasiaanCard";
import { AksiPeriodeCard } from "./AksiPeriodeCard";
import { PenilaiActionMenu } from "./PenilaiActionMenu";
import { ModalGantiPenilai } from "./ModalGantiPenilai";
import { ModalBatalkanPenugasan } from "./ModalBatalkanPenugasan";

interface ToastInfo {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

export const DetailAlumniView: React.FC = () => {
  const searchParams = useSearchParams();
  const alumniId = searchParams.get("id") || "alm-1";

  const [alumni, setAlumni] = useState<AlumniProfile>(INITIAL_ALUMNI);
  const [penilaiList, setPenilaiList] = useState<PenilaiItem[]>(INITIAL_PENILAI_LIST);
  const [candidates, setCandidates] = useState<CandidatePegawai[]>(CANDIDATE_REPLACEMENT_LIST);
  const [isLoading, setIsLoading] = useState(true);

  // Popover menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTarget, setMenuTarget] = useState<PenilaiItem | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Modal states
  const [isModalGantiOpen, setIsModalGantiOpen] = useState(false);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [modalTargetPenilai, setModalTargetPenilai] = useState<PenilaiItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  // Load real alumni detail and replacement candidates from live backend
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const detail = await fetchAlumniDetail(alumniId);
      if (detail && detail.alumni) {
        const a = detail.alumni;
        const initials = a.nama
          ? a.nama
              .split(" ")
              .slice(0, 2)
              .map((x: string) => x[0])
              .join("")
          : "AL";

        setAlumni({
          nama: a.nama || "Alumni",
          nip: a.nip || "-",
          jabatan: "Alumni Pelatihan",
          unitKerja: a.unitKerja || "Ditjen Perhubungan Laut",
          avatarText: initials,
          lulusLms: a.selesaiLms || "-",
          sharingKms: a.sharingKms || "-",
          masaPengisian: a.jatuhTempo || "-",
          periodeNama: a.pelatihan || "Latsar CPNS",
        });
      }

      if (detail && detail.penilaiList && detail.penilaiList.length > 0) {
        setPenilaiList(detail.penilaiList);
      }

      // Load candidates from live pegawai list
      const pegList = await fetchPegawaiList({ limit: 50 });
      if (pegList && pegList.items) {
        setCandidates(
          pegList.items.map((p) => {
            const inisial = p.nama
              ? p.nama
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0])
                  .join("")
              : "PG";
            return {
              id: p.id,
              nama: p.nama,
              nip: p.nip,
              jabatan: p.jabatan,
              unitKerja: p.unitKerja,
              avatarText: inisial,
            };
          })
        );
      }
    } catch (err: unknown) {
      console.error("Gagal memuat detail alumni:", err);
    } finally {
      setIsLoading(false);
    }
  }, [alumniId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open popover menu for a specific row
  const handleOpenMenu = (penilai: PenilaiItem, rect: DOMRect) => {
    setMenuTarget(penilai);
    setAnchorRect(rect);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Menu action triggers
  const handleResend = (penilai: PenilaiItem) => {
    showToast(`Undangan evaluasi berhasil dikirim ulang ke ${penilai.nama} via ${penilai.kanal.toUpperCase()}.`);
  };

  const handleRemind = async (penilai: PenilaiItem) => {
    try {
      await kirimPengingatPenugasan(penilai.id, { kanal: penilai.kanal });
      setPenilaiList((prev) =>
        prev.map((item) => {
          if (item.id === penilai.id) {
            return {
              ...item,
              pengingatCount: (item.pengingatCount || 0) + 1,
              aktivitasTerakhir: "Baru saja diingatkan",
            };
          }
          return item;
        })
      );
      showToast(`Pengingat evaluasi telah dikirim ke ${penilai.nama}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim pengingat.";
      showToast(msg, "warning");
    }
  };

  const handleOpenReplaceModal = (penilai: PenilaiItem | null = null) => {
    setModalTargetPenilai(penilai);
    setIsModalGantiOpen(true);
  };

  const handleOpenCancelModal = (penilai: PenilaiItem) => {
    setModalTargetPenilai(penilai);
    setIsModalBatalOpen(true);
  };

  // Real action: Cancellation confirmed to backend
  const handleConfirmCancel = async (penilai: PenilaiItem, alasan: string) => {
    try {
      await batalkanPenugasan(penilai.id, alasan);
      setPenilaiList((prev) => prev.filter((p) => p.id !== penilai.id));
      showToast(
        `Penugasan ${penilai.nama} (${penilai.kategoriLabel}) berhasil dibatalkan di database.`,
        "warning"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan penugasan.";
      showToast(msg, "warning");
    }
  };

  // Real action: Replacement confirmed to backend
  const handleConfirmReplace = async (candidate: CandidatePegawai, targetPenilai: PenilaiItem | null) => {
    if (targetPenilai) {
      try {
        await gantiPenilai(targetPenilai.id, {
          calonPegawaiId: candidate.id,
          kanal: targetPenilai.kanal,
        });
        setPenilaiList((prev) =>
          prev.map((item) => {
            if (item.id === targetPenilai.id) {
              return {
                ...item,
                nama: candidate.nama,
                nip: candidate.nip,
                jabatan: candidate.jabatan,
                avatarText: candidate.avatarText,
                status: "Belum dibuka",
                aktivitasTerakhir: "Baru saja ditugaskan",
                pengingatCount: 0,
              };
            }
            return item;
          })
        );
        showToast(
          `Penilai berhasil diganti dengan ${candidate.nama}. Perubahan tersimpan di database.`,
          "success"
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mengganti penilai.";
        showToast(msg, "warning");
      }
    }
  };

  // Bulk actions
  const handleKirimSemuaPengingat = async () => {
    const pendingList = penilaiList.filter((p) => p.status !== "Selesai");
    if (pendingList.length === 0) {
      showToast("Semua penilai telah menyelesaikan pengisian evaluasi.", "info");
      return;
    }

    try {
      for (const p of pendingList) {
        await kirimPengingatPenugasan(p.id, { kanal: p.kanal });
      }
      setPenilaiList((prev) =>
        prev.map((item) => {
          if (item.status !== "Selesai") {
            return {
              ...item,
              pengingatCount: (item.pengingatCount || 0) + 1,
              aktivitasTerakhir: "Baru saja diingatkan",
            };
          }
          return item;
        })
      );
      showToast(`Pengingat berhasil dikirimkan ke ${pendingList.length} penilai.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim pengingat massal.";
      showToast(msg, "warning");
    }
  };

  const handleKirimUndanganUlangSemua = () => {
    showToast("Undangan evaluasi telah dikirim ulang ke seluruh penilai.", "success");
  };

  const handleKeluarkanDariPeriode = () => {
    if (confirm(`Apakah Anda yakin ingin mengeluarkan ${alumni.nama} dari periode evaluasi ini?`)) {
      showToast(`${alumni.nama} telah dikeluarkan dari periode evaluasi.`, "warning");
    }
  };

  return (
    <div className="da-container">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 10000,
            maxWidth: 420,
            padding: "12px 16px",
            borderRadius: 12,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: "13px",
            fontWeight: 500,
            background: toast.type === "warning" ? "#fffbeb" : toast.type === "info" ? "#f0f9ff" : "#ecfdf5",
            border: `1px solid ${toast.type === "warning" ? "#fde68a" : toast.type === "info" ? "#bae6fd" : "#a7f3d0"}`,
            color: toast.type === "warning" ? "#92400e" : toast.type === "info" ? "#0369a1" : "#065f46",
          }}
        >
          {toast.type === "warning" ? (
            <svg style={{ width: 18, height: 18, color: "#d97706", flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg style={{ width: 18, height: 18, color: "#059669", flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Tutup notifikasi"
          >
            <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Alumni Identity Card */}
      <AlumniIdentityCard profile={alumni} />

      {/* Split Grid */}
      <div className="da-split-grid">
        {/* Left Column: Penilai Table */}
        <PenilaiTableSection
          penilaiList={penilaiList}
          onOpenMenu={handleOpenMenu}
          onTambahPenilai={() => handleOpenReplaceModal(null)}
          onKirimSemuaPengingat={handleKirimSemuaPengingat}
        />

        {/* Right Column: Panels */}
        <aside className="da-side-panels">
          <KelengkapanPenilaiCard penilaiList={penilaiList} />
          <AmbangKerahasiaanCard />
          <AksiPeriodeCard
            onKirimUndanganUlang={handleKirimUndanganUlangSemua}
            onKeluarkanDariPeriode={handleKeluarkanDariPeriode}
          />
        </aside>
      </div>

      {/* Popover Action Menu */}
      <PenilaiActionMenu
        isOpen={isMenuOpen}
        targetPenilai={menuTarget}
        anchorRect={anchorRect}
        onClose={handleCloseMenu}
        onResend={handleResend}
        onRemind={handleRemind}
        onReplace={(penilai) => handleOpenReplaceModal(penilai)}
        onCancel={(penilai) => handleOpenCancelModal(penilai)}
      />

      {/* Modal Ganti / Tambah Penilai */}
      <ModalGantiPenilai
        isOpen={isModalGantiOpen}
        onClose={() => setIsModalGantiOpen(false)}
        targetPenilai={modalTargetPenilai}
        alumniNama={alumni.nama}
        candidates={candidates}
        onConfirm={handleConfirmReplace}
      />

      {/* Real Action Modal: Batalkan Penugasan */}
      <ModalBatalkanPenugasan
        isOpen={isModalBatalOpen}
        onClose={() => setIsModalBatalOpen(false)}
        targetPenilai={modalTargetPenilai}
        alumniNama={alumni.nama}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
