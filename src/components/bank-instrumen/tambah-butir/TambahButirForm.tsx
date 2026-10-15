"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import LokusButirSection from "./LokusButirSection";
import RedaksiPertanyaanSection from "./RedaksiPertanyaanSection";
import PropertiButirSection from "./PropertiButirSection";
import SkalaJawabanCard from "./SkalaJawabanCard";
import SebaranKategoriCard from "./SebaranKategoriCard";
import StickyActionBar from "./StickyActionBar";
import KonfirmasiBatalModal from "./KonfirmasiBatalModal";
import {
  DEFAULT_FORM_DATA,
  validateForm,
  type FormButirData,
  type TouchedFields,
  type KategoriKey,
  type TipeJawaban,
} from "./types";
import "./tambah-butir.css";

interface TambahButirFormProps {
  initialFokus?: string;
  initialSubdimensi?: string;
  initialIndikator?: string;
  onSuccess?: (savedData: FormButirData) => void;
  onCancel?: () => void;
}

export default function TambahButirForm({
  initialFokus,
  initialSubdimensi,
  initialIndikator,
  onSuccess,
  onCancel,
}: TambahButirFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<FormButirData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...(initialFokus ? { fokus: initialFokus } : {}),
    ...(initialSubdimensi ? { subdimensi: initialSubdimensi } : {}),
    ...(initialIndikator ? { indikator: initialIndikator } : {}),
  }));

  const [touched, setTouched] = useState<TouchedFields>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Compute live validation errors
  const errors = useMemo(() => {
    return validateForm(formData, touched, false);
  }, [formData, touched]);

  // Count active errors
  const activeErrorCount = useMemo(() => {
    let count = 0;
    if (errors.fokus) count++;
    if (errors.subdimensi) count++;
    if (errors.indikator) count++;
    if (errors.globalRedaksi) count++;
    if (errors.urutan) count++;
    count += Object.keys(errors.redaksi).length;
    return count;
  }, [errors]);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Field touch helpers
  const handleBlurField = (field: "fokus" | "subdimensi" | "indikator") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlurCategory = (key: KategoriKey) => {
    setTouched((prev) => ({ ...prev, [`redaksi_${key}`]: true }));
  };

  const handleBlurUrutan = () => {
    setTouched((prev) => ({ ...prev, urutan: true }));
  };

  // Field change handlers
  const handleChangeFokus = (val: string) => {
    markDirty();
    setFormData((prev) => ({ ...prev, fokus: val }));
  };

  const handleChangeSubdimensi = (val: string) => {
    markDirty();
    setFormData((prev) => ({ ...prev, subdimensi: val }));
  };

  const handleChangeIndikator = (val: string) => {
    markDirty();
    setFormData((prev) => ({ ...prev, indikator: val }));
  };

  const handleToggleCategory = (key: KategoriKey, aktif: boolean) => {
    markDirty();
    setFormData((prev) => ({
      ...prev,
      redaksi: {
        ...prev.redaksi,
        [key]: {
          ...prev.redaksi[key],
          aktif,
          text: aktif ? prev.redaksi[key].text : "",
        },
      },
    }));
    // Touch field when toggled active
    if (aktif) {
      setTouched((prev) => ({ ...prev, [`redaksi_${key}`]: true }));
    }
  };

  const handleChangeCategoryText = (key: KategoriKey, text: string) => {
    markDirty();
    setFormData((prev) => ({
      ...prev,
      redaksi: {
        ...prev.redaksi,
        [key]: {
          ...prev.redaksi[key],
          text,
        },
      },
    }));
  };

  const handleChangeTipeJawaban = (tipeJawaban: TipeJawaban) => {
    markDirty();
    setFormData((prev) => ({ ...prev, tipeJawaban }));
  };

  const handleChangeUrutan = (urutan: string) => {
    markDirty();
    setFormData((prev) => ({ ...prev, urutan }));
  };

  const handleChangeWajib = (wajib: boolean) => {
    markDirty();
    setFormData((prev) => ({ ...prev, wajib }));
  };

  // Submission handler
  const handleExecuteSave = useCallback(
    async (andAddMore: boolean) => {
      // Mark all fields as touched for exhaustive inline feedback
      const allTouched: TouchedFields = {
        fokus: true,
        subdimensi: true,
        indikator: true,
        urutan: true,
        redaksi_diri: true,
        redaksi_atasan: true,
        redaksi_rekan: true,
        redaksi_bawahan: true,
      };
      setTouched(allTouched);

      const submitErrors = validateForm(formData, allTouched, true);
      const hasErrors =
        Boolean(submitErrors.fokus) ||
        Boolean(submitErrors.subdimensi) ||
        Boolean(submitErrors.indikator) ||
        Boolean(submitErrors.globalRedaksi) ||
        Boolean(submitErrors.urutan) ||
        Object.keys(submitErrors.redaksi).length > 0;

      if (hasErrors) {
        showToast(
          "error",
          "Mohon periksa kembali isian formulir yang ditandai merah."
        );

        // Scroll to first invalid field
        const firstErrorEl = document.querySelector(".has-error, .tb-alert-error");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      setIsSubmitting(true);

      try {
        // Mock save delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        showToast("success", "Butir pertanyaan berhasil disimpan ke bank instrumen.");
        setIsDirty(false);

        if (onSuccess) {
          onSuccess(formData);
        }

        if (andAddMore) {
          // Reset redaksi text for next entry while preserving structural Lokus selections
          setFormData((prev) => ({
            ...prev,
            redaksi: {
              diri: { aktif: true, text: "" },
              atasan: { aktif: true, text: "" },
              rekan: { aktif: true, text: "" },
              bawahan: { aktif: false, text: "" },
            },
          }));
          setTouched({});
          showToast(
            "success",
            "Butir tersimpan! Silakan mengisi butir berikutnya."
          );
        } else {
          // Navigate back
          setTimeout(() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push("/bank-instrumen");
            }
          }, 600);
        }
      } catch (err) {
        console.error("Save error:", err);
        showToast("error", "Terjadi kesalahan saat menyimpan butir.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSuccess, onCancel, router, showToast]
  );

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSave(false);
  };

  const handleSimpanDanTambahLagi = () => {
    handleExecuteSave(true);
  };

  const handleBatalClick = () => {
    if (isDirty) {
      setIsModalBatalOpen(true);
    } else {
      if (onCancel) onCancel();
      else router.push("/bank-instrumen");
    }
  };

  const handleConfirmBatal = () => {
    setIsModalBatalOpen(false);
    if (onCancel) onCancel();
    else router.push("/bank-instrumen");
  };

  // Keyboard shortcut listener: Cmd/Ctrl + Enter -> Simpan & Tambah Lagi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSimpanDanTambahLagi();
      }
      if (e.key === "Escape" && !isModalBatalOpen) {
        if (isDirty) {
          setIsModalBatalOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSimpanDanTambahLagi, isDirty, isModalBatalOpen]);

  return (
    <div className="tb-container">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 90,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "12px",
              background: toastMessage.type === "success" ? "#065f46" : "#991b1b",
              color: "#ffffff",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
              fontSize: "13.5px",
              fontWeight: 500,
            }}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={18} color="#a7f3d0" />
            ) : (
              <AlertCircle size={18} color="#fecaca" />
            )}
            <span>{toastMessage.text}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
                marginLeft: "8px",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Grid */}
      <form onSubmit={handleSubmitForm} className="tb-form-grid" noValidate>
        {/* Kolom Kiri: Form Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
          {/* Section 1: Lokus */}
          <LokusButirSection
            fokus={formData.fokus}
            subdimensi={formData.subdimensi}
            indikator={formData.indikator}
            errors={errors}
            touched={touched}
            onChangeFokus={handleChangeFokus}
            onChangeSubdimensi={handleChangeSubdimensi}
            onChangeIndikator={handleChangeIndikator}
            onBlurField={handleBlurField}
          />

          {/* Section 2: Redaksi Pertanyaan */}
          <RedaksiPertanyaanSection
            redaksi={formData.redaksi}
            errors={errors}
            touched={touched}
            onToggleCategory={handleToggleCategory}
            onChangeCategoryText={handleChangeCategoryText}
            onBlurCategory={handleBlurCategory}
          />

          {/* Section 3: Properti Butir */}
          <PropertiButirSection
            tipeJawaban={formData.tipeJawaban}
            urutan={formData.urutan}
            wajib={formData.wajib}
            errors={errors}
            touched={touched}
            onChangeTipeJawaban={handleChangeTipeJawaban}
            onChangeUrutan={handleChangeUrutan}
            onChangeWajib={handleChangeWajib}
            onBlurUrutan={handleBlurUrutan}
          />

          {/* Sticky Action Bar */}
          <StickyActionBar
            errorCount={activeErrorCount}
            isSubmitting={isSubmitting}
            onBatal={handleBatalClick}
            onSimpanTambah={handleSimpanDanTambahLagi}
            onSubmit={handleSubmitForm}
          />
        </div>

        {/* Kolom Kanan: Aside Panels */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "84px",
          }}
        >
          {/* Skala Jawaban Accordion */}
          <SkalaJawabanCard />

          {/* Sebaran Kategori Live Indicator */}
          <SebaranKategoriCard redaksi={formData.redaksi} />
        </aside>
      </form>

      {/* Modal Konfirmasi Batal */}
      <KonfirmasiBatalModal
        isOpen={isModalBatalOpen}
        onClose={() => setIsModalBatalOpen(false)}
        onConfirm={handleConfirmBatal}
      />
    </div>
  );
}
