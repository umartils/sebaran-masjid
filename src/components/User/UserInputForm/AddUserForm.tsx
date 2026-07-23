"use client";

import { Save, User, Mail, Phone, Shield, Lock } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./AddUserForm.module.scss"; // Mengimpor file scss sebagai modul

export function AddUserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    nomorTelepon: "",
    role: "Relawan",
    password: "",
    confirmPassword: "",
    userInput: "",
  });

  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      setForm((current) => ({
        ...current,
        userInput: session.user.id ?? "",
      }));
    }
  }, [session]);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);

    if (form.password !== form.confirmPassword) {
      setIsError(true);
      setStatus("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Menyimpan data...");

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          nomorTelepon: form.nomorTelepon,
          role: form.role,
          password: form.password,
          userInput: form.userInput,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setIsError(true);
        setStatus(result.message ?? "Registrasi gagal dilakukan.");
        return;
      }

      setStatus("User berhasil didaftarkan.");
      setForm({
        name: "",
        email: "",
        nomorTelepon: "",
        role: "RELAWAN",
        password: "",
        confirmPassword: "",
        userInput: session?.user?.id ?? "",
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
      setStatus("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <form className="form-card" onSubmit={submitForm}>
      <header className="form-header">
        <h1 className={styles.formHeader__title}>Registrasi User Baru</h1>
      </header>
      <div className={styles.formGrid}>
        {/* Nama Lengkap */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Nama Lengkap *</span>
          <div className={styles.formField__inputContainer}>
            <User size={18} className={styles.formField__icon} />
            <input
              type="text"
              className={styles.formField__input}
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </label>
        {/* Email */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Email *</span>
          <div className={styles.formField__inputContainer}>
            <Mail size={18} className={styles.formField__icon} />
            <input
              type="email"
              className={styles.formField__input}
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </label>
        {/* Nomor Telepon */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Nomor Telepon *</span>
          <div className={styles.formField__inputContainer}>
            <Phone size={18} className={styles.formField__icon} />
            <input
              type="tel"
              className={styles.formField__input}
              required
              value={form.nomorTelepon}
              onChange={(e) => updateField("nomorTelepon", e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </label>
        {/* Role */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Role *</span>
          <div className={styles.formField__inputContainer}>
            <Shield size={18} className={styles.formField__icon} />
            <select
              className={`${styles.formField__input} ${styles["formField__input--select"]}`}
              required
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Relawan">Relawan</option>
            </select>
          </div>
        </label>
        {/* Password */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Password *</span>
          <div className={styles.formField__inputContainer}>
            <Lock size={18} className={styles.formField__icon} />
            <input
              type="password"
              className={styles.formField__input}
              required
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </div>
        </label>
        {/* Konfirmasi Password */}
        <label className={styles.formField}>
          <span className={styles.formField__label}>Konfirmasi Password *</span>
          <div className={styles.formField__inputContainer}>
            <Lock size={18} className={styles.formField__icon} />
            <input
              type="password"
              className={styles.formField__input}
              required
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="Masukkan ulang password"
            />
          </div>
        </label>
        {/* User Input (Read Only) */}
        {/* <label className={`${styles.formField} ${styles["formField--span2"]}`}>
          <span className={styles.formField__label}>User Input</span>
          <div
            className={`${styles.formField__inputContainer} ${styles["formField__inputContainer--readonly"]}`}
          >
            <User size={18} className={styles.formField__icon} />
            <input
              type="text"
              className={styles.formField__input}
              value={form.userInput}
              readOnly
            />
          </div>
        </label> */}
      </div>
      {/* {status && (
        <div
          className={`${styles.formStatus} ${
            isError
              ? styles["formStatus--error"]
              : styles["formStatus--success"]
          }`}
        >
          {status}
        </div>
      )} */}
      <div className={styles.formActions}>
        <button
          className={styles.formActions__submitBtn}
          type="submit"
          disabled={loading}
        >
          <Save size={18} />
          {loading ? "Menyimpan..." : "Simpan User"}
        </button>
      </div>
    </form>
  );
}