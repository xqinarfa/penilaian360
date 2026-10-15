"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface KonfirmasiBatalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function KonfirmasiBatalModal({
  isOpen,
  onClose,
  onConfirm,
}: KonfirmasiBatalModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="tb-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-batal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="tb-modal-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div style={{ padding: "28px 24px 20px 24px", textAlign: "center" }}>
              {/* Warning Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#fffbeb",
                  color: "#d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <AlertTriangle size={24} strokeWidth={2} />
              </div>

              <h3
                id="modal-batal-title"
                style={{ fontSize: "16px", fontWeight: 700, color: "#0b2e59" }}
              >
                Perubahan belum disimpan
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginTop: "8px",
                  lineHeight: 1.55,
                }}
              >
                Ada isian yang belum disimpan. Yakin ingin keluar tanpa menyimpan?
              </p>
            </div>

            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#f8fafc",
              }}
            >
              <button
                type="button"
                className="tb-btn-cancel"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Lanjut Mengisi
              </button>
              <button
                type="button"
                id="confirm-batal"
                style={{
                  flex: 1,
                  height: "40px",
                  padding: "0 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={onConfirm}
              >
                Keluar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
