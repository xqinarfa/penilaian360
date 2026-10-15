import React from "react";
import { ChevronDown } from "lucide-react";

interface RekapFilterBarProps {
  pelatihan: string;
  onPelatihanChange: (val: string) => void;
  tahun: string;
  onTahunChange: (val: string) => void;
  unitKerja: string;
  onUnitKerjaChange: (val: string) => void;
}

export const RekapFilterBar: React.FC<RekapFilterBarProps> = ({
  pelatihan,
  onPelatihanChange,
  tahun,
  onTahunChange,
  unitKerja,
  onUnitKerjaChange,
}) => {
  return (
    <div className="hl-card hl-filter-card">
      <div className="hl-filter-grid-3">
        {/* Filter Pelatihan */}
        <div className="hl-select-wrapper">
          <select
            aria-label="Filter pelatihan"
            value={pelatihan}
            onChange={(e) => onPelatihanChange(e.target.value)}
            className="hl-select-field"
          >
            <option>Semua pelatihan</option>
            <option>Latsar CPNS</option>
            <option>Coaching &amp; Mentoring (ECM)</option>
            <option>PKA</option>
          </select>
          <ChevronDown size={16} className="hl-select-chevron" />
        </div>

        {/* Filter Tahun */}
        <div className="hl-select-wrapper">
          <select
            aria-label="Filter tahun"
            value={tahun}
            onChange={(e) => onTahunChange(e.target.value)}
            className="hl-select-field"
          >
            <option>Tahun 2026</option>
            <option>Tahun 2025</option>
          </select>
          <ChevronDown size={16} className="hl-select-chevron" />
        </div>

        {/* Filter Unit Kerja */}
        <div className="hl-select-wrapper">
          <select
            aria-label="Filter unit kerja"
            value={unitKerja}
            onChange={(e) => onUnitKerjaChange(e.target.value)}
            className="hl-select-field"
          >
            <option>Semua unit kerja</option>
            <option>Ditjen Perhubungan Laut</option>
            <option>Ditjen Perhubungan Darat</option>
            <option>Ditjen Perhubungan Udara</option>
            <option>BPSDM Perhubungan</option>
            <option>Sekretariat Jenderal</option>
          </select>
          <ChevronDown size={16} className="hl-select-chevron" />
        </div>
      </div>
    </div>
  );
};
