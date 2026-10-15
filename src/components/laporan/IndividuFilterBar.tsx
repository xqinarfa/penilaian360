import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface IndividuFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  periodeFilter: string;
  onPeriodeChange: (val: string) => void;
}

export const IndividuFilterBar: React.FC<IndividuFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  periodeFilter,
  onPeriodeChange,
}) => {
  return (
    <div className="hl-card hl-filter-card">
      <div className="hl-filter-grid-2">
        {/* Search */}
        <div className="hl-search-field-wrap">
          <Search size={16} className="hl-search-icon" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama atau NIP alumni…"
            className="hl-search-input"
          />
        </div>

        {/* Filter Periode */}
        <div className="hl-select-wrapper">
          <select
            aria-label="Filter periode"
            value={periodeFilter}
            onChange={(e) => onPeriodeChange(e.target.value)}
            className="hl-select-field"
          >
            <option>Semua periode</option>
            <option>Latsar CPNS Gel. II</option>
            <option>ECM Angkatan 4</option>
            <option>PKA Angkatan 2</option>
            <option>Pelatihan Teknis K3 Pelabuhan</option>
          </select>
          <ChevronDown size={16} className="hl-select-chevron" />
        </div>
      </div>
    </div>
  );
};
