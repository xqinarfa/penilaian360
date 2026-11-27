"use client";

import { useState } from "react";
import { Info, AlertCircle, Clock, MoreHorizontal, Loader2 } from "lucide-react";
import type { PenilaianTertundaItem } from "@/types";
import TertundaFilterBar from "./TertundaFilterBar";
import TertundaBulkBar from "./TertundaBulkBar";

interface PenilaianTertundaTableProps {
  data?: PenilaianTertundaItem[];
  isLoading?: boolean;
  selectedItem: PenilaianTertundaItem | null;
  onSelectItem: (item: PenilaianTertundaItem) => void;
  onSendReminderBatch?: (ids: string[]) => void;
}

export default function PenilaianTertundaTable({
  data = [],
  isLoading = false,
  selectedItem,
  onSelectItem,
  onSendReminderBatch,
}: PenilaianTertundaTableProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("Semua");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [periodeFilter, setPeriodeFilter] = useState("Semua periode");
  const [kategoriFilter, setKategoriFilter] = useState("Semua kategori");
  const [unitFilter, setUnitFilter] = useState("Semua unit kerja");
  const [deadlineFilter, setDeadlineFilter] = useState("Semua deadline");

  const overdueCount = data.filter(
    (x) => x.isOverdue || x.status === "Kedaluwarsa"
  ).length;
  const belumDibukaCount = data.filter((x) => x.status === "Belum dibuka").length;
  const sedangMengisiCount = data.filter(
    (x) => x.status === "Sedang mengisi"
  ).length;

  const subTabs = [
    { label: "Semua", count: data.length, isDanger: false },
    { label: "Lewat batas waktu", count: overdueCount, isDanger: true },
    { label: "Belum dibuka", count: belumDibukaCount, isDanger: false },
    { label: "Sedang mengisi", count: sedangMengisiCount, isDanger: false },
  ];

  const filteredData = data.filter((item) => {
    if (activeSubTab === "Lewat batas waktu") {
      if (!item.isOverdue && item.status !== "Kedaluwarsa") return false;
    } else if (activeSubTab === "Belum dibuka") {
      if (item.status !== "Belum dibuka") return false;
    } else if (activeSubTab === "Sedang mengisi") {
      if (item.status !== "Sedang mengisi") return false;
    }

    if (kategoriFilter !== "Semua kategori" && item.kategori !== kategoriFilter) {
      return false;
    }
    if (periodeFilter !== "Semua periode" && item.periode !== periodeFilter) {
      return false;
    }
    return true;
  });

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
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "48px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <Loader2 size={24} className="animate-spin text-primary-600" />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>Memuat penilaian tertunda...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "48px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={24} style={{ color: "#94a3b8" }} />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>
                        Tidak ada penilaian tertunda pada filter ini.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
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
              }))}
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
