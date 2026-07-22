"user client";

import { ChevronDown, Navigation } from "lucide-react";
// import { useSession } from "next-auth/react";

interface AksesLingunganSectionProps {
  form: {
    jarakKeKota: string;
    waktuTempuhKeKota: string;
    kondisiAksesKota: string;
    kondisiAksesDesa: string;
    jenisKendaraan: string;
    hambatanAkses: string;
    masjidTerdekat: string;
    gantiNama: string;
  };
  setField: (
    name:
      | "jarakKeKota"
      | "waktuTempuhKeKota"
      | "kondisiAksesKota"
      | "kondisiAksesDesa"
      | "jenisKendaraan"
      | "hambatanAkses"
      | "masjidTerdekat"
      | "gantiNama",
    value: string
  ) => void;
}

export default function AksesLingunganSection({
  form,
  setField,
}: AksesLingunganSectionProps) {
  return (
    <>
      <h2 className="section-title">
        <Navigation size={22} /> 5. Akses & Kondisi Lingkungan
      </h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Jarak ke Kota</span>
          <input
            className="control"
            value={form.jarakKeKota}
            onChange={(e) => setField("jarakKeKota", e.target.value)}
            placeholder="Contoh: 15 km"
          />
        </label>
        <label className="field">
          <span className="label">Waktu Tempuh ke Kota</span>
          <input
            className="control"
            value={form.waktuTempuhKeKota}
            onChange={(e) => setField("waktuTempuhKeKota", e.target.value)}
            placeholder="Contoh: 30 menit"
          />
        </label>
        <label className="field">
          <span className="label">Kondisi Jalan ke Kota</span>
          <input
            className="control"
            value={form.kondisiAksesKota}
            onChange={(e) => setField("kondisiAksesKota", e.target.value)}
            placeholder="Contoh: Aspal, baik"
          />
        </label>
        <label className="field">
          <span className="label">Kondisi Jalan ke Desa</span>
          <input
            className="control"
            value={form.kondisiAksesDesa}
            onChange={(e) => setField("kondisiAksesDesa", e.target.value)}
            placeholder="Contoh: Makadam, rusak"
          />
        </label>
        <label className="field">
          <span className="label">Jenis Kendaraan yang Bisa Masuk</span>
          <input
            className="control"
            value={form.jenisKendaraan}
            onChange={(e) => setField("jenisKendaraan", e.target.value)}
            placeholder="Contoh: Motor, Mobil kecil"
          />
        </label>
        <label className="field">
          <span className="label">Hambatan Akses</span>
          <input
            className="control"
            value={form.hambatanAkses}
            onChange={(e) => setField("hambatanAkses", e.target.value)}
            placeholder="Contoh: Jembatan sempit"
          />
        </label>
        <label className="field">
          <span className="label">Masjid Terdekat</span>
          <input
            className="control"
            value={form.masjidTerdekat}
            onChange={(e) => setField("masjidTerdekat", e.target.value)}
            placeholder="Contoh: Masjid Al-Hidayah, 2 km"
          />
        </label>
        <label className="field">
          <span className="label">Kesediaan Ganti Nama</span>
          <div className="select-wrapper">
            <select
              className="control"
              value={form.gantiNama}
              onChange={(e) => setField("gantiNama", e.target.value)}
            >
              <option value="">Pilih...</option>
              <option value="Ya">Ya, bersedia</option>
              <option value="Tidak">Tidak bersedia</option>
              <option value="Negosiasi">Perlu negosiasi</option>
            </select>
            <ChevronDown className="select-icon" size={18} />
          </div>
        </label>
      </div>
    </>
  );
}