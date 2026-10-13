"use client";

import { ChevronDown } from "lucide-react";

interface TertundaFilterBarProps {
  periodeFilter: string;
  onPeriodeFilterChange: (val: string) => void;
  kategoriFilter: string;
  onKategoriFilterChange: (val: string) => void;
  unitFilter: string;
  onUnitFilterChange: (val: string) => void;
  deadlineFilter: string;
  onDeadlineFilterChange: (val: string) => void;
}

export default function TertundaFilterBar({
  periodeFilter,
  onPeriodeFilterChange,
  kategoriFilter,
  onKategoriFilterChange,
  unitFilter,
  onUnitFilterChange,
  deadlineFilter,
  onDeadlineFilterChange,
}: TertundaFilterBarProps) {
  return (
    <div className="dash-filter-bar mb-4">
      <div className="dash-filter-select-wrapper">
        <select
          value={periodeFilter}
          onChange={(e) => onPeriodeFilterChange(e.target.value)}
          className="dash-filter-select"
          aria-label="Filter periode"
        >
          <option>Semua periode</option>
          <option>Latsar CPNS Gel. II</option>
          <option>ECM Angkatan 4</option>
          <option>PKA Angkatan 2</option>
        </select>
        <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
      </div>

      <div className="dash-filter-select-wrapper">
        <select
          value={kategoriFilter}
          onChange={(e) => onKategoriFilterChange(e.target.value)}
          className="dash-filter-select"
          aria-label="Filter kategori penilai"
        >
          <option>Semua kategori</option>
          <option>Diri sendiri</option>
          <option>Atasan</option>
          <option>Rekan kerja</option>
          <option>Bawahan</option>
        </select>
        <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
      </div>

      <div className="dash-filter-select-wrapper">
        <select
          value={unitFilter}
          onChange={(e) => onUnitFilterChange(e.target.value)}
          className="dash-filter-select"
          aria-label="Filter unit kerja"
        >
          <option>Semua unit kerja</option>
          <option>Ditjen Perhubungan Laut</option>
          <option>Ditjen Perhubungan Darat</option>
          <option>Ditjen Perhubungan Udara</option>
        </select>
        <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
      </div>

      <div className="dash-filter-select-wrapper">
        <select
          value={deadlineFilter}
          onChange={(e) => onDeadlineFilterChange(e.target.value)}
          className="dash-filter-select"
          aria-label="Filter deadline"
        >
          <option>Semua deadline</option>
          <option>Hari ini</option>
          <option>7 hari ke depan</option>
          <option>Sudah lewat</option>
        </select>
        <ChevronDown size={14} className="dash-select-chevron" aria-hidden="true" />
      </div>
    </div>
  );
}
