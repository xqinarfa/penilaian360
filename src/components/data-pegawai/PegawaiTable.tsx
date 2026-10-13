"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Check,
  Download,
  Upload,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import type { PegawaiItem } from "@/types";

interface PegawaiTableProps {
  data: PegawaiItem[];
  selectedEmployee: PegawaiItem | null;
  onSelectEmployee: (emp: PegawaiItem) => void;
  onDeleteEmployees?: (ids: string[]) => void;
}

export default function PegawaiTable({
  data,
  selectedEmployee,
  onSelectEmployee,
  onDeleteEmployees,
}: PegawaiTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("Semua unit kerja");
  const [statusFilter, setStatusFilter] = useState("Semua status");
  const [selectedIds, setSelectedIds] = useState<string[]>(["peg-2"]); // Default Ayu Lestari selected per Figma

  const unitOptions = [
    "Semua unit kerja",
    "Ditjen Perhubungan Laut",
    "BPSDM Perhubungan",
    "Ditjen Perhubungan Darat",
    "Sekretariat Jenderal",
    "Inspektorat Jenderal",
    "Ditjen Perhubungan Udara",
  ];

  const statusOptions = ["Semua status", "Lengkap", "Rekan kurang", "Atasan kosong"];

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nip.includes(searchTerm);
    const matchUnit =
      unitFilter === "Semua unit kerja" || item.unitKerja.includes(unitFilter);
    const matchStatus =
      statusFilter === "Semua status" || item.statusRelasi === statusFilter;
    return matchSearch && matchUnit && matchStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredData.length > 0 && selectedIds.length === filteredData.length;

  return (
    <div className="dash-pegawai-table-container">
      {/* Filter Bar */}
      <div className="dash-filter-bar">
        <div className="dash-filter-search-box">
          <Search size={16} className="dash-search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari nama atau NIP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dash-filter-search-input"
            aria-label="Cari nama atau NIP"
          />
        </div>

        <div className="dash-filter-select-wrapper">
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="dash-filter-select"
            aria-label="Filter unit kerja"
          >
            {unitOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
        </div>

        <div className="dash-filter-select-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dash-filter-select"
            aria-label="Filter status relasi"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
        </div>
      </div>

      {/* Bulk Action Bar (Muncul saat ada pegawai yang dicentang) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            className="dash-bulk-bar"
            role="region"
            aria-label="Aksi Massal"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <div className="dash-bulk-left">
              <div className="dash-bulk-check-box" aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="dash-bulk-count">
                <strong>{selectedIds.length}</strong> pegawai dipilih
              </span>
            </div>

            <div className="dash-bulk-right">
              <motion.button
                type="button"
                className="dash-btn-bulk"
                onClick={() => alert(`Mengekspor ${selectedIds.length} data pegawai.`)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download size={14} aria-hidden="true" />
                <span>Ekspor</span>
              </motion.button>

              <motion.button
                type="button"
                className="dash-btn-bulk"
                onClick={() => alert("Membuka panduan impor relasi kerja.")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Upload size={14} aria-hidden="true" />
                <span>Impor Relasi</span>
              </motion.button>

              <motion.button
                type="button"
                className="dash-btn-bulk danger"
                onClick={() => onDeleteEmployees && onDeleteEmployees(selectedIds)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Trash2 size={14} aria-hidden="true" />
                <span>Hapus</span>
              </motion.button>

              <motion.button
                type="button"
                className="dash-btn-bulk-close"
                onClick={() => setSelectedIds([])}
                aria-label="Batal pilih"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <div className="dash-card dash-table-card">
        <div className="dash-table-wrapper">
          <table className="dash-data-table">
            <thead>
              <tr>
                <th style={{ width: "48px" }} scope="col">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="dash-table-checkbox"
                    aria-label="Pilih semua baris"
                  />
                </th>
                <th scope="col">
                  <div className="dash-th-content active-col">
                    <span>NAMA / NIP</span>
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </div>
                </th>
                <th scope="col">
                  <div className="dash-th-content">
                    <span>JABATAN</span>
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </div>
                </th>
                <th scope="col">
                  <div className="dash-th-content">
                    <span>UNIT KERJA</span>
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </div>
                </th>
                <th scope="col">
                  <div className="dash-th-content">
                    <span>RELASI KERJA</span>
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                const isActiveRow = selectedEmployee?.id === emp.id;

                return (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className={`dash-table-clickable-row ${isActiveRow ? "row-active-blue" : ""}`}
                  >
                    <td onClick={(e) => handleToggleRow(emp.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="dash-table-checkbox"
                        aria-label={`Pilih ${emp.nama}`}
                      />
                    </td>

                    <td>
                      <div className="dash-cell-employee">
                        <span className="dash-emp-name">{emp.nama}</span>
                        <span className="dash-emp-nip mono-font">{emp.nip}</span>
                      </div>
                    </td>

                    <td>
                      <span className="dash-cell-text">{emp.jabatan}</span>
                    </td>

                    <td>
                      <span className="dash-cell-text">{emp.unitKerja}</span>
                    </td>

                    <td>
                      {emp.statusRelasi === "Lengkap" && (
                        <span className="dash-status-pill connected">
                          <CheckCircle2 size={12} color="#047857" aria-hidden="true" />
                          <span>Lengkap</span>
                        </span>
                      )}
                      {emp.statusRelasi === "Rekan kurang" && (
                        <span className="dash-status-pill partial">
                          <AlertTriangle size={12} color="#92400e" aria-hidden="true" />
                          <span>Rekan kurang</span>
                        </span>
                      )}
                      {emp.statusRelasi === "Atasan kosong" && (
                        <span className="dash-status-pill urgent">
                          <AlertCircle size={12} color="#dc2626" aria-hidden="true" />
                          <span>Atasan kosong</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="dash-table-footer">
          <div className="dash-pagination-info">
            Menampilkan <strong>1–{filteredData.length}</strong> dari 4.812 pegawai
          </div>

          <div className="dash-pagination-controls">
            <div className="dash-pagesize-select-wrapper">
              <select className="dash-pagesize-select" defaultValue="25" aria-label="Jumlah per halaman">
                <option value="10">10 / hal</option>
                <option value="25">25 / hal</option>
                <option value="50">50 / hal</option>
              </select>
              <ChevronDown size={12} className="dash-select-chevron" aria-hidden="true" />
            </div>

            <div className="dash-pagination-btns">
              <button type="button" className="dash-btn-page" disabled>
                Sebelumnya
              </button>
              <button type="button" className="dash-btn-page active">
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
