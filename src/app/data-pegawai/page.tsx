"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus, CheckCircle2 } from "lucide-react";
import { Sidebar, Topbar } from "@/components/dashboard";
import { PegawaiTable, RelasiKerjaPanel } from "@/components/data-pegawai";
import type { PegawaiItem } from "@/types";

const initialPegawaiData: PegawaiItem[] = [
  {
    id: "peg-1",
    nama: "Dimas Prakoso",
    nip: "199603122022031004",
    jabatan: "Analis Kebijakan Ahli Pertama",
    unitKerja: "Ditjen Perhubungan Laut",
    statusRelasi: "Lengkap",
    atasan: "Ir. Bambang Trihatmojo — Kepala Seksi Sarana",
    rekanKerja: ["Siti Rahmawati", "Ahmad Fauzi"],
    bawahan: ["Rian Ardiansyah"],
  },
  {
    id: "peg-2",
    nama: "Ayu Lestari",
    nip: "199507212022032011",
    jabatan: "Pranata Komputer Ahli Pertama",
    unitKerja: "BPSDM Perhubungan",
    statusRelasi: "Rekan kurang",
    atasan: "Fajar Nugroho — Kasubbag Program",
    rekanKerja: ["Hendra Saputra"],
    bawahan: [],
  },
  {
    id: "peg-3",
    nama: "Fajar Nugroho",
    nip: "198805102022011007",
    jabatan: "Kepala Subbagian Program",
    unitKerja: "BPSDM Perhubungan",
    statusRelasi: "Lengkap",
    atasan: "Dra. Hendriani Kusumastuti — Koordinator Pelatihan",
    rekanKerja: ["Capt. Mochammad Yusuf", "Bayu Adi"],
    bawahan: ["Ayu Lestari"],
  },
  {
    id: "peg-4",
    nama: "Sri Wahyuni",
    nip: "198806182015032002",
    jabatan: "Perencana Ahli Muda",
    unitKerja: "Ditjen Perhubungan Darat",
    statusRelasi: "Atasan kosong",
    atasan: "",
    rekanKerja: ["Dewi Sartika"],
    bawahan: [],
  },
  {
    id: "peg-5",
    nama: "Hendra Saputra",
    nip: "199707032022031009",
    jabatan: "Analis SDM Aparatur Ahli Pertama",
    unitKerja: "Sekretariat Jenderal",
    statusRelasi: "Lengkap",
    atasan: "Dra. Hendriani Kusumastuti — Koordinator Pelatihan",
    rekanKerja: ["Ayu Lestari", "Nur Aini Rahmah"],
    bawahan: [],
  },
  {
    id: "peg-6",
    nama: "Nur Aini Rahmah",
    nip: "199311272019032006",
    jabatan: "Auditor Ahli Pertama",
    unitKerja: "Inspektorat Jenderal",
    statusRelasi: "Lengkap",
    atasan: "Ir. Bambang Trihatmojo — Kepala Seksi Sarana",
    rekanKerja: ["Hendra Saputra", "Yoga Pratama"],
    bawahan: [],
  },
  {
    id: "peg-7",
    nama: "Rizky Ramadhan",
    nip: "199806112022031012",
    jabatan: "Pengelola Kepegawaian",
    unitKerja: "Ditjen Perhubungan Udara",
    statusRelasi: "Rekan kurang",
    atasan: "Capt. Mochammad Yusuf — Direktur Akademik",
    rekanKerja: ["Reza Pahlevi"],
    bawahan: [],
  },
];

export default function DataPegawaiPage() {
  const [pegawaiList, setPegawaiList] = useState<PegawaiItem[]>(initialPegawaiData);
  const [selectedEmployee, setSelectedEmployee] = useState<PegawaiItem | null>(initialPegawaiData[1]); // Ayu Lestari active by default
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSaveRelasi = (updated: PegawaiItem) => {
    setPegawaiList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedEmployee(updated);
  };

  const handleDeleteEmployees = (ids: string[]) => {
    setPegawaiList((prev) => prev.filter((item) => !ids.includes(item.id)));
    if (selectedEmployee && ids.includes(selectedEmployee.id)) {
      setSelectedEmployee(null);
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
        {/* Topbar Header dengan Breadcrumb DATA / DATA PEGAWAI */}
        <Topbar
          breadcrumbMain="DATA"
          breadcrumbSub="DATA PEGAWAI"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Page Content Body */}
        <main className="dash-content-body">
          {/* Header Bar */}
          <div className="dash-page-header">
            <div>
              <h1 className="dash-page-title">Data Pegawai</h1>
              <div className="dash-pegawai-header-meta">
                <span>Disinkronkan dari LMS</span>
                <span className="dash-meta-dot">·</span>
                <strong>4.812 pegawai</strong>
                <span className="dash-meta-dot">·</span>
                <span className="dash-sync-badge-green">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  <span>terakhir 02.00 WIB</span>
                </span>
              </div>
            </div>

            <div className="dash-header-action-btns">
              <motion.button
                type="button"
                className="dash-btn-outline"
                onClick={() => alert("Mengimpor berkas Excel pegawai...")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={14} aria-hidden="true" />
                <span>Impor Excel</span>
              </motion.button>
              <motion.button
                type="button"
                className="dash-btn-primary"
                onClick={() => alert("Membuka form Tambah Pegawai...")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} aria-hidden="true" />
                <span>Tambah Pegawai</span>
              </motion.button>
            </div>
          </div>

          {/* Split Layout: Kolom Kiri (Tabel) + Kolom Kanan (Panel Relasi Kerja) */}
          <div className="dash-split-layout">
            <div className="dash-split-table-side">
              <PegawaiTable
                data={pegawaiList}
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
                    onClose={() => setSelectedEmployee(null)}
                    onSave={handleSaveRelasi}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <footer className="dash-footer-note">
            Data contoh · Sumber data pegawai dari LMS Kemenhub (sinkron harian 02.00 WIB)
          </footer>
        </main>
      </div>
    </div>
  );
}
