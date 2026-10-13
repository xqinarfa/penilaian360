"use client";

import { useState } from "react";
import { Info, AlertCircle, Clock, MoreHorizontal } from "lucide-react";
import type { PenilaianTertundaItem } from "@/types";
import TertundaFilterBar from "./TertundaFilterBar";
import TertundaBulkBar from "./TertundaBulkBar";

const initialTertundaData: PenilaianTertundaItem[] = [
  {
    id: "tertunda-1",
    penilaiNama: "Bambang Hartono",
    penilaiNip: "198503152010011003",
    alumniNama: "Lukman Hakim",
    pelatihan: "Latsar CPNS Gel. II",
    kategori: "A",
    kategoriLabel: "Atasan langsung",
    periode: "Latsar CPNS Gel. II",
    deadline: "5 Okt 2026",
    deadlineStatus: "Lewat 8 hari",
    isOverdue: true,
    status: "Kedaluwarsa",
    email: "bambang.h@kemenhub.go.id",
    phone: "+62 812-3456-7890",
  },
  {
    id: "tertunda-2",
    penilaiNama: "Maria Ulfa",
    penilaiNip: "198707202011012004",
    alumniNama: "Lukman Hakim",
    pelatihan: "Latsar CPNS Gel. II",
    kategori: "R",
    kategoriLabel: "Rekan kerja",
    periode: "Latsar CPNS Gel. II",
    deadline: "6 Okt 2026",
    deadlineStatus: "Lewat 7 hari",
    isOverdue: true,
    status: "Kedaluwarsa",
    email: "maria.ulfa@kemenhub.go.id",
    phone: "+62 813-8877-6655",
  },
  {
    id: "tertunda-3",
    penilaiNama: "Yoga Pratama",
    penilaiNip: "199205182019011005",
    alumniNama: "Dimas Prakoso",
    pelatihan: "Latsar CPNS Gel. II",
    kategori: "R",
    kategoriLabel: "Rekan kerja",
    periode: "Latsar CPNS Gel. II",
    deadline: "15 Okt 2026",
    deadlineStatus: "2 hari lagi",
    isOverdue: false,
    status: "Sedang mengisi",
    email: "yoga.p@kemenhub.go.id",
    phone: "+62 811-2233-4455",
  },
  {
    id: "tertunda-4",
    penilaiNama: "Anisa Fitriani",
    penilaiNip: "199804222022032009",
    alumniNama: "Dimas Prakoso",
    pelatihan: "Latsar CPNS Gel. II",
    kategori: "B",
    kategoriLabel: "Bawahan langsung",
    periode: "Latsar CPNS Gel. II",
    deadline: "21 Okt 2026",
    deadlineStatus: "8 hari lagi",
    isOverdue: false,
    status: "Belum dibuka",
    email: "anisa.f@kemenhub.go.id",
    phone: "+62 856-7890-1234",
  },
  {
    id: "tertunda-5",
    penilaiNama: "Reza Mahendra",
    penilaiNip: "198610092011011002",
    alumniNama: "Ayu Lestari",
    pelatihan: "ECM Angkatan 4",
    kategori: "A",
    kategoriLabel: "Atasan langsung",
    periode: "ECM Angkatan 4",
    deadline: "2 Nov 2026",
    deadlineStatus: "20 hari lagi",
    isOverdue: false,
    status: "Belum dibuka",
    email: "reza.m@kemenhub.go.id",
    phone: "+62 817-6543-2109",
  },
];

interface PenilaianTertundaTableProps {
  selectedItem: PenilaianTertundaItem | null;
  onSelectItem: (item: PenilaianTertundaItem) => void;
}

export default function PenilaianTertundaTable({
  selectedItem,
  onSelectItem,
}: PenilaianTertundaTableProps) {
  const [data] = useState<PenilaianTertundaItem[]>(initialTertundaData);
  const [activeSubTab, setActiveSubTab] = useState<string>("Semua");
  const [selectedIds, setSelectedIds] = useState<string[]>(["tertunda-1", "tertunda-2"]);
  const [periodeFilter, setPeriodeFilter] = useState("Semua periode");
  const [kategoriFilter, setKategoriFilter] = useState("Semua kategori");
  const [unitFilter, setUnitFilter] = useState("Semua unit kerja");
  const [deadlineFilter, setDeadlineFilter] = useState("Semua deadline");

  const subTabs = [
    { label: "Semua", count: 312, isDanger: false },
    { label: "Lewat batas waktu", count: 87, isDanger: true },
    { label: "Belum dibuka", count: 180, isDanger: false },
    { label: "Sedang mengisi", count: 45, isDanger: false },
  ];

  const handleToggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((x) => x.id));
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected = selectedIds.length === data.length;

  return (
    <div className="dash-tertunda-container">
      {/* Context Info Banner */}
      <div className="dash-context-banner">
        <Info size={16} className="dash-context-icon" aria-hidden="true" />
        <p className="dash-context-text">
          Daftar <strong>semua penugasan penilai yang belum selesai</strong>, lintas periode. Urut dari deadline terdekat.
        </p>
      </div>

      {/* Sub-tabs Row */}
      <div className="dash-subtabs-row" role="tablist" aria-label="Status penugasan">
        {subTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeSubTab === tab.label}
            className={`dash-subtab ${activeSubTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.label)}
          >
            {tab.isDanger && <span className="dash-dot-red" />}
            <span>{tab.label}</span>
            <span className="dash-subtab-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filter Dropdowns Bar */}
      <TertundaFilterBar
        periodeFilter={periodeFilter}
        onPeriodeFilterChange={setPeriodeFilter}
        kategoriFilter={kategoriFilter}
        onKategoriFilterChange={setKategoriFilter}
        unitFilter={unitFilter}
        onUnitFilterChange={setUnitFilter}
        deadlineFilter={deadlineFilter}
        onDeadlineFilterChange={setDeadlineFilter}
      />

      {/* Bulk Action Bar */}
      <TertundaBulkBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onSendReminder={() => alert(`Mengirim reminder untuk ${selectedIds.length} penugasan.`)}
        onChangeEvaluator={() => alert("Membuka dialog ganti penilai massal.")}
        onExtendDeadline={() => alert("Membuka perpanjangan masa pengisian.")}
        onCancelAssignment={() => alert("Membatalkan penugasan terpilih.")}
      />

      {/* Data Table */}
      <div className="dash-card dash-table-card">
        <div className="dash-table-wrapper">
          <table className="dash-data-table">
            <thead>
              <tr>
                <th style={{ width: "42px" }} scope="col">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleToggleCheckAll(e.target.checked)}
                    className="dash-table-checkbox"
                    aria-label="Pilih semua penugasan"
                  />
                </th>
                <th scope="col" style={{ width: "22%" }}>PENILAI</th>
                <th scope="col" style={{ width: "18%" }}>ALUMNI</th>
                <th scope="col" style={{ width: "8%", textAlign: "center" }}>KAT.</th>
                <th scope="col" style={{ width: "18%" }}>PERIODE</th>
                <th scope="col" style={{ width: "16%" }}>DEADLINE</th>
                <th scope="col" style={{ width: "14%" }}>STATUS</th>
                <th scope="col" style={{ width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isSelected = selectedItem?.id === row.id;
                const isChecked = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`${isSelected ? "active-row" : ""} ${isChecked ? "checked-row" : ""}`}
                    onClick={() => onSelectItem(row)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleCheck(row.id, e as unknown as React.MouseEvent)}
                        className="dash-table-checkbox"
                        aria-label={`Pilih ${row.penilaiNama}`}
                      />
                    </td>
                    <td>
                      <p className="dash-table-emp-name">{row.penilaiNama}</p>
                      <p className="dash-table-nip-mono">{row.penilaiNip}</p>
                    </td>
                    <td>
                      <p className="dash-table-emp-name">{row.alumniNama}</p>
                      <p className="dash-table-sub-text">{row.pelatihan}</p>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`dash-kat-badge kat-${row.kategori}`}>
                        {row.kategori}
                      </span>
                    </td>
                    <td>
                      <span className="dash-table-text-slate">{row.periode}</span>
                    </td>
                    <td>
                      <p className={`dash-table-deadline-val ${row.isOverdue ? "overdue" : ""}`}>
                        {row.deadline}
                      </p>
                      <p className={`dash-table-deadline-sub ${row.isOverdue ? "overdue" : ""}`}>
                        {row.deadlineStatus}
                      </p>
                    </td>
                    <td>
                      {row.status === "Kedaluwarsa" && (
                        <span className="dash-pill-kedaluwarsa">
                          <AlertCircle size={12} />
                          Kedaluwarsa
                        </span>
                      )}
                      {row.status === "Sedang mengisi" && (
                        <span className="dash-pill-berjalan">
                          <Clock size={12} />
                          Sedang mengisi
                        </span>
                      )}
                      {row.status === "Belum dibuka" && (
                        <span className="dash-pill-terjadwal">
                          Belum dibuka
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dash-row-more-btn"
                        aria-label="Aksi baris"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(row);
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="dash-table-pagination">
          <p className="dash-pagination-info">
            Menampilkan <strong>1–5</strong> dari <strong>312</strong> penugasan
          </p>
          <div className="dash-pagination-btns">
            <button type="button" disabled className="dash-btn-page prev">
              Sebelumnya
            </button>
            <button type="button" className="dash-btn-page next">
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
