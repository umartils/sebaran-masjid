"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") ?? "/input";

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );

    setLoading(false);

    if (result?.ok) {
      router.push(redirectTo);
      return;
    }

    setError(
      "Email atau password salah"
    );
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
          href="/"
        >
          <ArrowLeft size={16} />
          Kembali ke Peta
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
            Masuk Akun
          </h1>

          {/* <p className="login-subtitle">
            Sistem Informasi Masjid Nusantara
          </p>

          <p className="login-desc">
            Masuk sebagai relawan untuk
            mengelola data
          </p> */}
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label
              className="login-label"
              htmlFor="email"
            >
              Email Relawan
            </label>

            <div className="login-input-wrap">
              <User
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
                autoComplete="email"
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
                autoComplete="current-password"
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

          {error && (
            <div
              className="login-error"
              role="alert"
            >
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
              "Masuk"
            )}
          </button>
        </form>

        <p className="login-hint">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="login-link"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}