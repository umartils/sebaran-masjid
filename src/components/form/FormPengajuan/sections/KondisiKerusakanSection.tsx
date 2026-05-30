"use client";
import { AlertTriangle, ChevronDown } from "lucide-react";

interface kondisiKerusakanSectionProps {
  form: {
    statusTanah: string;
    kategori: string;
    statusListrik: string;
    waktuKerusakan: string;
    riwayatRoboh: string;
    alasan: string;
    dampakKerusakan: string;
    hambatanAktivitas: string;
    kondisiHujan: string;
    usahaPerbaikan: string;
    riwayatMenerimaBantuan: string;
  };
  setField: (
    name:
      | "statusTanah"
      | "kategori"
      | "statusListrik"
      | "waktuKerusakan"
      | "riwayatRoboh"
      | "alasan"
      | "dampakKerusakan"
      | "hambatanAktivitas"
      | "kondisiHujan"
      | "usahaPerbaikan"
      | "riwayatMenerimaBantuan",
    value: string
  ) => void;
}

export default function KondisiKerusakanSection({
  form,
  setField,
}: kondisiKerusakanSectionProps) {
  return (
    <>
      <h2 className="section-title">
        <AlertTriangle size={22} /> 3. Legalitas & Kondisi Kerusakan
      </h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Status Tanah*</span>
          <input
            className="control"
            required
            value={form.statusTanah}
            onChange={(e) => setField("statusTanah", e.target.value)}
            placeholder="Milik, Wakaf, Sewa, dll"
          />
        </label>
        <label className="field">
          <span className="label">Kondisi Bangunan*</span>
          <div className="select-wrapper">
            <select
              className="control"
              value={form.kategori}
              onChange={(e) => setField("kategori", e.target.value)}
            >
              <option value="Pelosok_Pedalaman">Pelosok Pedalaman</option>
              <option value="Muslim_Minoritas">Muslim Minoritas</option>
              <option value="Kampung_Mualaf">Kampung Mualaf</option>
              <option value="Terdampak_Bencana">Terdampak Bencana</option>
            </select>
            <ChevronDown className="select-icon" size={18} />
          </div>
        </label>
        <label className="field span-2">
          <span className="label">Jaringan Listrik</span>
          <input
            className="control"
            value={form.statusListrik}
            onChange={(e) => setField("statusListrik", e.target.value)}
            placeholder="Contoh: PLN, Genset, Tidak ada"
          />
        </label>
        <label className="field">
          <span className="label">Waktu Kerusakan</span>
          <input
            className="control"
            value={form.waktuKerusakan}
            onChange={(e) => setField("waktuKerusakan", e.target.value)}
            placeholder="Contoh: 2 tahun lalu"
          />
        </label>
        <label className="field">
          <span className="label">Riwayat Roboh</span>
          <input
            className="control"
            value={form.riwayatRoboh}
            onChange={(e) => setField("riwayatRoboh", e.target.value)}
            placeholder="Contoh: Pernah, 1 kali"
          />
        </label>
        <label className="field span-2">
          <span className="label">Alasan Mendesak Renovasi</span>
          <textarea
            className="control"
            value={form.alasan}
            onChange={(e) => setField("alasan", e.target.value)}
            placeholder="Jelaskan alasan utama mengapa renovasi mendesak..."
          />
        </label>
        <label className="field span-2">
          <span className="label">Dampak Kerusakan</span>
          <textarea
            className="control"
            value={form.dampakKerusakan}
            onChange={(e) => setField("dampakKerusakan", e.target.value)}
            placeholder="Contoh: Jamaah berkurang, aktivitas terganggu saat hujan..."
          />
        </label>
        <label className="field span-2">
          <span className="label">Hambatan Aktivitas Ibadah</span>
          <textarea
            className="control"
            value={form.hambatanAktivitas}
            onChange={(e) => setField("hambatanAktivitas", e.target.value)}
            placeholder="Contoh: Atap bocor, lantai retak, dinding miring..."
          />
        </label>
        <label className="field">
          <span className="label">Kondisi saat Hujan</span>
          <input
            className="control"
            value={form.kondisiHujan}
            onChange={(e) => setField("kondisiHujan", e.target.value)}
            placeholder="Contoh: Bocor di bagian atap depan"
          />
        </label>
        <label className="field">
          <span className="label">Usaha Perbaikan Sebelumnya</span>
          <input
            className="control"
            value={form.usahaPerbaikan}
            onChange={(e) => setField("usahaPerbaikan", e.target.value)}
            placeholder="Contoh: Tambal sementara pakai terpal"
          />
        </label>
        <label className="field span-2">
          <span className="label">Riwayat Menerima Bantuan</span>
          <textarea
            className="control"
            value={form.riwayatMenerimaBantuan}
            onChange={(e) => setField("riwayatMenerimaBantuan", e.target.value)}
            placeholder="Contoh: Pernah menerima bantuan dari Baznas tahun 2020..."
          />
        </label>
      </div>
    </>
  );
}