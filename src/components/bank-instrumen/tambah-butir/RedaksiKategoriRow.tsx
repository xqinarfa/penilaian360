"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Copy, AlertCircle } from "lucide-react";
import type { KategoriConfig, KategoriKey, RedaksiItemState } from "./types";

interface CopySource {
  key: KategoriKey;
  code: string;
  label: string;
  badgeClass: string;
  text: string;
}

interface RedaksiKategoriRowProps {
  config: KategoriConfig;
  data: RedaksiItemState;
  otherSources: CopySource[];
  error?: string;
  isTouched?: boolean;
  onToggle: (aktif: boolean) => void;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

export default function RedaksiKategoriRow({
  config,
  data,
  otherSources,
  error,
  isTouched,
  onToggle,
  onChangeText,
  onBlur,
}: RedaksiKategoriRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(76, textareaRef.current.scrollHeight)}px`;
    }
  }, [data.text, data.aktif]);

  // Close copy menu when clicking outside
  useEffect(() => {
    if (!isCopyMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(e.target as Node)) {
        setIsCopyMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCopyMenuOpen]);

  // Insert tag token at current cursor position
  const handleInsertTag = () => {
    if (!data.aktif || !textareaRef.current) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart ?? data.text.length;
    const end = ta.selectionEnd ?? data.text.length;
    const tag = "[nama agenda]";
    const newText = data.text.slice(0, start) + tag + data.text.slice(end);
    onChangeText(newText);

    setTimeout(() => {
      ta.focus();
      const newPos = start + tag.length;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Copy text from another category
  const handleCopyFrom = (sourceText: string) => {
    onChangeText(sourceText);
    setIsCopyMenuOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const charLength = data.text.length;
  const showError = Boolean(data.aktif && isTouched && error);

  return (
    <motion.div
      layout="position"
      className={`tb-kat-row ${!data.aktif ? "inactive" : ""}`}
      data-kat={config.key}
      animate={{ opacity: data.aktif ? 1 : 0.6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category Name & Badge */}
      <div className="tb-kat-name">
        <span className={`tb-kat-badge ${config.badgeClass}`} aria-hidden="true">
          {config.code}
        </span>
        <p>{config.label}</p>
      </div>

      {/* Active Toggle Checkbox */}
      <div className="tb-kat-toggle">
        <input
          type="checkbox"
          id={`toggle-${config.key}`}
          className="tb-cbx"
          checked={data.aktif}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label={`Aktifkan pertanyaan untuk kategori ${config.label}`}
        />
      </div>

      {/* Textarea, Toolbar, and Previews */}
      <div className="tb-kat-content">
        <div style={{ position: "relative" }}>
          <textarea
            ref={textareaRef}
            id={`textarea-${config.key}`}
            className={`tb-textarea ${showError ? "has-error" : ""}`}
            rows={3}
            placeholder={
              data.aktif
                ? config.placeholder
                : "Aktifkan kategori ini untuk mengisi redaksi pertanyaan."
            }
            value={data.text}
            disabled={!data.aktif}
            onChange={(e) => onChangeText(e.target.value)}
            onBlur={onBlur}
            aria-invalid={showError}
            aria-describedby={showError ? `error-${config.key}` : undefined}
          />
        </div>

        {/* Toolbar & Character Count */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          {/* Sisipkan [nama agenda] button */}
          <button
            type="button"
            className="tb-mini-btn"
            disabled={!data.aktif}
            onClick={handleInsertTag}
            title="Sisipkan penanda agenda otomatis"
          >
            <Plus size={13} strokeWidth={2.4} aria-hidden="true" />
            <span>Sisipkan [nama agenda]</span>
          </button>

          {/* Pratinjau button */}
          <button
            type="button"
            className={`tb-mini-btn ${isPreviewOpen ? "active" : ""}`}
            disabled={!data.aktif}
            onClick={() => setIsPreviewOpen((prev) => !prev)}
            title="Lihat pratinjau teks kuesioner"
          >
            <Eye size={13} strokeWidth={2} aria-hidden="true" />
            <span>{isPreviewOpen ? "Tutup Pratinjau" : "Pratinjau"}</span>
          </button>

          {/* Salin dari... button with animated popover */}
          {otherSources.length > 0 && (
            <div style={{ position: "relative" }} ref={copyMenuRef}>
              <button
                type="button"
                className="tb-mini-btn"
                disabled={!data.aktif}
                onClick={() => setIsCopyMenuOpen((prev) => !prev)}
                title="Salin redaksi dari kategori lain"
              >
                <Copy size={13} strokeWidth={2} aria-hidden="true" />
                <span>Salin dari…</span>
              </button>

              <AnimatePresence>
                {isCopyMenuOpen && (
                  <motion.div
                    className="tb-copy-menu"
                    role="menu"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <div
                      style={{
                        padding: "6px 10px 4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Salin redaksi dari:
                    </div>
                    {otherSources.map((source) => (
                      <button
                        key={source.key}
                        type="button"
                        className="tb-copy-item"
                        role="menuitem"
                        onClick={() => handleCopyFrom(source.text)}
                      >
                        <span className={`tb-kat-badge ${source.badgeClass}`}>
                          {source.code}
                        </span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {source.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Character Counter */}
          {data.aktif && (
            <span
              className={`tb-char-counter ${
                charLength > 480 ? "warning" : charLength > 500 ? "error" : ""
              }`}
            >
              {charLength} / 500 karakter
            </span>
          )}
        </div>

        {/* Inline Error Message with AnimatePresence */}
        <AnimatePresence>
          {showError && (
            <motion.div
              id={`error-${config.key}`}
              className="tb-field-error"
              role="alert"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              <AlertCircle size={13} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Preview Box with AnimatePresence */}
        <AnimatePresence>
          {isPreviewOpen && data.aktif && (
            <motion.div
              className="tb-preview-box"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              style={{ overflow: "hidden" }}
            >
              {data.text.trim() ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: data.text.replace(
                      /\[nama agenda\]/g,
                      `<span class="tag-preview">Latsar CPNS Gelombang II</span>`
                    ),
                  }}
                />
              ) : (
                <em style={{ color: "#94a3b8" }}>Belum ada redaksi.</em>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
