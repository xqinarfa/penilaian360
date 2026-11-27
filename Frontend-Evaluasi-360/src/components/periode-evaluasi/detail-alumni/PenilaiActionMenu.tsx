import React, { useEffect, useRef } from "react";
import { Mail, Clock, RefreshCw, UserX } from "lucide-react";
import { PenilaiItem } from "./types";

interface PenilaiActionMenuProps {
  isOpen: boolean;
  targetPenilai: PenilaiItem | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onResend: (penilai: PenilaiItem) => void;
  onRemind: (penilai: PenilaiItem) => void;
  onReplace: (penilai: PenilaiItem) => void;
  onCancel: (penilai: PenilaiItem) => void;
}

export const PenilaiActionMenu: React.FC<PenilaiActionMenuProps> = ({
  isOpen,
  targetPenilai,
  anchorRect,
  onClose,
  onResend,
  onRemind,
  onReplace,
  onCancel,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !targetPenilai || !anchorRect) return null;

  // Calculate coordinates: ensure menu is visible within viewport
  const top = anchorRect.bottom + 6;
  const left = Math.min(
    anchorRect.left - 150,
    typeof window !== "undefined" ? window.innerWidth - 215 : 300
  );

  return (
    <div
      ref={menuRef}
      className="menu-pop"
      style={{
        top: `${top}px`,
        left: `${Math.max(12, left)}px`,
      }}
    >
      <button
        onClick={() => {
          onResend(targetPenilai);
          onClose();
        }}
      >
        <Mail size={13} />
        <span>Kirim ulang undangan</span>
      </button>

      <button
        onClick={() => {
          onRemind(targetPenilai);
          onClose();
        }}
      >
        <Clock size={13} />
        <span>Kirim pengingat</span>
      </button>

      <div className="sep" />

      <button
        onClick={() => {
          onReplace(targetPenilai);
          onClose();
        }}
      >
        <RefreshCw size={13} />
        <span>Ganti penilai</span>
      </button>

      {targetPenilai.kategori !== "D" && (
        <>
          <div className="sep" />
          <button
            onClick={() => {
              onCancel(targetPenilai);
              onClose();
            }}
            className="danger"
          >
            <UserX size={13} />
            <span>Batalkan penugasan</span>
          </button>
        </>
      )}
    </div>
  );
};
