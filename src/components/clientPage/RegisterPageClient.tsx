"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function RegisterPageClient() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const [showPassword,
    setShowPassword] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
  e: FormEvent
) {
  e.preventDefault();

  setError("");

  if (password !== confirmPassword) {
    setError(
      "Konfirmasi password tidak cocok"
    );
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message ||
          "Gagal membuat akun"
      );

      setLoading(false);
      return;
    }

    router.push("/login");
  } catch (error) {
    console.error("Error:", error);

    setError(
      "Tidak dapat terhubung ke server"
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-circle login-bg-circle--1" />
        <div className="login-bg-circle login-bg-circle--2" />
        <div className="login-bg-circle login-bg-circle--3" />
      </div>

      <div className="login-card">
        <Link
          className="login-back"
          href="/login"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>

        <div className="login-header">
          <div className="login-logo">
            <Image
              src="/assets/cropped-logo-masjid-nusantara.png"
              alt="Logo MasjidCare"
              width={72}
              height={72}
            />
          </div>

          <h1 className="login-title">
            Registrasi Akun
          </h1>

          {/* <p className="login-subtitle">
            Sistem Informasi Masjid Nusantara
          </p> */}
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label
              className="login-label"
              htmlFor="name"
            >
              Nama Lengkap
            </label>

            <div className="login-input-wrap">
              <User
                size={18}
                className="login-input-icon"
              />

              <input
                id="name"
                className="login-input"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Nama lengkap"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label
              className="login-label"
              htmlFor="email"
            >
              Email
            </label>

            <div className="login-input-wrap">
              <Mail
                size={18}
                className="login-input-icon"
              />

              <input
                id="email"
                className="login-input"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Masukkan email"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label
              className="login-label"
              htmlFor="password"
            >
              Password
            </label>

            <div className="login-input-wrap">
              <Lock
                size={18}
                className="login-input-icon"
              />

              <input
                id="password"
                className="login-input login-input--password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Masukkan password"
                required
              />

              <button
                type="button"
                className="login-eye"
                onClick={() =>
                  setShowPassword((v) => !v)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label
              className="login-label"
              htmlFor="confirmPassword"
            >
              Konfirmasi Password
            </label>

            <div className="login-input-wrap">
              <Lock
                size={18}
                className="login-input-icon"
              />

              <input
                id="confirmPassword"
                className="login-input"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        <p className="login-hint">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="login-link"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}