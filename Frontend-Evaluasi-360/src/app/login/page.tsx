"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFeedback {
  type: "success" | "info" | "error";
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<LoginFeedback | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nip.trim() || !password) {
      setLoginFeedback({
        type: "error",
        message: "Silakan masukkan NIP atau Email dinas dan Kata Sandi.",
      });
      return;
    }

    setIsLoading(true);
    setLoginFeedback(null);

    try {
      const loggedUser = await login(nip.trim(), password);
      setLoginFeedback({
        type: "success",
        message: `Selamat datang kembali, ${loggedUser.full_name}! Mengarahkan ke dashboard...`,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login gagal. Periksa kredensial Anda.";
      setLoginFeedback({
        type: "error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetUser = (presetNip: string) => {
    setNip(presetNip);
    setPassword("password123");
    setLoginFeedback(null);
  };

  const handleSsoClick = () => {
    setIsLoading(true);
    setLoginFeedback(null);
    setTimeout(() => {
      setIsLoading(false);
      setLoginFeedback({
        type: "info",
        message: "Mengarahkan ke Layanan Otentikasi Tunggal (SSO Kemenhub)...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }, 600);
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        {/* Left Form Column */}
        <div className="login-form-side">
          {/* Header Brand */}
          <Link href="/" className="login-brand-header" title="Kembali ke Beranda">
            <div className="login-brand-badge" aria-hidden="true">
              <span>360°</span>
            </div>
            <div className="login-brand-text">
              <div className="login-brand-title">Penilaian 360</div>
              <div className="login-brand-sub">PPSDM Aparatur Perhubungan</div>
            </div>
          </Link>

          <div className="login-title-group">
            <span className="login-badge-tag">AKSES PEGAWAI</span>
            <h1 className="login-heading">Selamat datang kembali</h1>
            <p className="login-subtext">
              Masuk untuk melihat tugas penilaian dan memantau evaluasi pasca pelatihan.
            </p>
          </div>

          {/* Feedback Alert if triggered */}
          {loginFeedback && (
            <div
              className={`login-feedback-alert ${loginFeedback.type}`}
              role="status"
              aria-live="polite"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                backgroundColor:
                  loginFeedback.type === "success"
                    ? "#ecfdf5"
                    : loginFeedback.type === "error"
                    ? "#fef2f2"
                    : "#eff6ff",
                color:
                  loginFeedback.type === "success"
                    ? "#065f46"
                    : loginFeedback.type === "error"
                    ? "#991b1b"
                    : "#1e40af",
                border: `1px solid ${
                  loginFeedback.type === "success"
                    ? "#a7f3d0"
                    : loginFeedback.type === "error"
                    ? "#fecaca"
                    : "#bfdbfe"
                }`,
              }}
            >
              {loginFeedback.type === "success" ? (
                <CheckCircle2 size={18} color="#059669" />
              ) : loginFeedback.type === "error" ? (
                <AlertCircle size={18} color="#dc2626" />
              ) : (
                <AlertCircle size={18} color="#2563eb" />
              )}
              <span>{loginFeedback.message}</span>
            </div>
          )}

          {/* SSO Button */}
          <button
            type="button"
            className="btn-sso"
            onClick={handleSsoClick}
            disabled={isLoading}
            aria-label="Masuk dengan SSO"
          >
            <Shield size={21} color="#0878f8" aria-hidden="true" />
            <span>Masuk dengan SSO</span>
          </button>

          <div className="login-divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-text">atau gunakan NIP / email</span>
            <span className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="nip" className="form-label">
                NIP atau email dinas
              </label>
              <div className="input-field-box">
                <User size={19} className="input-icon" aria-hidden="true" />
                <input
                  id="nip"
                  type="text"
                  placeholder="Masukkan NIP atau email"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="form-input"
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Kata sandi
              </label>
              <div className="input-field-box">
                <Lock size={19} className="input-icon" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-eye"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-password-link">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spin-animate" aria-hidden="true" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk Aplikasi</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Accounts Box for effortless role switching / testing */}
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.75rem 1rem",
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "0.5rem",
              fontSize: "0.8125rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              <KeyRound size={14} />
              <span>Akun Uji Coba Cepat (Password: password123):</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              <button
                type="button"
                onClick={() => setPresetUser("198501012010121001")}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                title="Rina Wulandari - Super Administrator"
              >
                👑 <strong>Admin</strong> (Rina)
              </button>
              <button
                type="button"
                onClick={() => setPresetUser("199603122022031004")}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                title="Dimas Prakoso - Alumni Latsar CPNS"
              >
                🎓 <strong>Alumni</strong> (Dimas)
              </button>
              <button
                type="button"
                onClick={() => setPresetUser("197805122002121001")}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                title="Ir. Bambang Trihatmojo - Evaluator/Atasan"
              >
                📋 <strong>Evaluator</strong> (Bambang)
              </button>
              <button
                type="button"
                onClick={() => setPresetUser("199507212022032011")}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                title="Ayu Lestari - Pegawai"
              >
                👤 <strong>Pegawai</strong> (Ayu)
              </button>
            </div>
          </div>

          <div className="login-footer-help">
            <span>Belum menerima undangan?</span>{" "}
            <a href="#" className="help-link">Hubungi admin PPSDMAP</a>
          </div>

          <div className="login-back-wrapper">
            <Link href="/" className="back-to-home-link">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Right Visual Banner Column (Matching Figma node 976:2192) */}
        <div className="login-visual-side">
          <div className="login-visual-img-wrapper">
            <img
              src="/login-bg.png"
              alt="Pegawai ASN Kementerian Perhubungan berdiskusi di depan laptop"
              className="login-visual-img"
            />
            <div className="login-visual-gradient" aria-hidden="true" />
          </div>

          {/* Organic Cutout Curves from Figma Vector */}
          <div className="login-cutout-topleft" aria-hidden="true">
            <img
              src="/login-curve-tl.svg"
              alt=""
              className="login-cutout-img"
            />
          </div>

          <div className="login-cutout-bottomright" aria-hidden="true">
            <img
              src="/login-curve-br.svg"
              alt=""
              className="login-cutout-img"
            />
          </div>

          {/* Top-Right Header Content */}
          <div className="login-visual-header">
            <span className="login-visual-tag">EVALUASI PASCA PELATIHAN</span>
            <h2 className="login-visual-heading">
              Tumbuh bersama melalui<br />setiap perspektif.
            </h2>
          </div>

          {/* Bottom Floating Pill Card */}
          <div className="login-visual-card">
            <img
              src="/login-collaborators.svg"
              alt=""
              className="login-visual-card-icon"
              aria-hidden="true"
            />
            <span className="login-visual-card-text">
              Penilaian diri, atasan, rekan kerja, dan bawahan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
