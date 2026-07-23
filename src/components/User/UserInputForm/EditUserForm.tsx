"use client";

import { Save, User, Mail, Phone, Shield, Lock, ArrowLeft } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DataUser } from "@/lib/types";
import styles from "./AddUserForm.module.scss";

import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { executeRequest } from "@/lib/api/request";
import { updateUserApi } from "@/lib/api/user"
import { UserRole } from "@/lib/validation";

interface Props {
  user: DataUser;
  from: string;
}

export function EditUserForm({ user, from }: Props) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    nomorTelepon: user.nomorTelepon || "",
    role: (user.role as UserRole) || "Relawan",
    // userInput: user.userInput || "",
  });

  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(user.id);
  const [selectedField, setSelectedField] = useState(false);

  const { data: session } = useSession();
  const userInputId = session?.user?.id ?? "";
  

  useEffect(() => {
    if (session?.user?.id) {
      setForm((current) => ({
        ...current,
        userInput: userInputId ?? "",
      }));
    }
  }, [session]);

  function updateField<K extends keyof typeof form>(
    name: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);

    try {
      setLoading(true);
      setStatus("Menyimpan data...");

      const payload = {
        id: userId,
        name: form.name,
        email: form.email,
        nomorTelepon: form.nomorTelepon,
        role: form.role,
        userInput: user.userInput || "",
        editedBy: userInputId,
      }

      const result = await executeRequest(
        updateUserApi(payload),
        showToast
      );
      console.log(payload);

      if (!result) return;

      setTimeout(() => {
          router.push(from);
          router.refresh();
        }, 1500);
    
    } catch (error) {
      console.error(error);
      setIsError(true);
      setStatus("Terjadi kesalahan server. ${error}");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submitForm}>
      <Link className="button-back" href={`${from}`}>
        <ArrowLeft size={20} />
        Kembali
      </Link>
      <header className="form-header">
        <h1 className={styles.formHeader__title}>
          Update Data User {user.name}
        </h1>
        {/* <p className={styles.formHeader__subtitle}>
          Tambahkan akun administrator atau relawan yang akan menggunakan
          sistem.
        </p> */}
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
              value={form.name ?? " "}
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
              value={form.email ?? " "}
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
              value={form.nomorTelepon ?? " "}
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
              value={form.role ?? " "}
              onChange={(e) => updateField("role", e.target.value as UserRole)}
            >
              <option value="Admin">Admin</option>
              <option value="Relawan">Relawan</option>
            </select>
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
              value={form.userInput ?? " "}
              readOnly
            />
          </div>
        </label> */}
      </div>
      {/* {status && <div className="status-message">{status}</div>} */}
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
      {toast.show && (
        <div
          className={`custom-toast ${
            toast.type === "success"
              ? "custom-toast--success"
              : "custom-toast--error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </form>
  );
}