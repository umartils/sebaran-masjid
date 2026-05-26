"use client";

import {
  Info, Landmark, MapPinned, MapPinnedIcon,
  Save, Users, Navigation, Sun, UserCircle, AlertTriangle, UserPen
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Region } from "@/lib/types";
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import { useSession } from "next-auth/react";

const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";
const emptyRegions: Region[] = [];



async function fetchRegions(path: string): Promise<Region[]> {
  const res = await fetch(`${API_BASE}/${path}`);
  if (!res.ok) throw new Error("Gagal mengambil data wilayah");
  return res.json();
}

function parseCoordinates(value: string) {
  const decoded = decodeURIComponent(value);
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match?.[1] && match?.[2]) return { latitude: match[1], longitude: match[2] };
  }
  return { latitude: "", longitude: "" };
}

// Semua field form sesuai schema Masjid
const initialForm = {
  // Info Umum
  nama: "",
  alamat: "",
  latitude: "",
  longitude: "",
  idProvinsi: "",
  idKota: "",
  idKecamatan: "",
  idDesa: "",
  tahunDibangun: "",
  budgetAwal: "",
  // Fisik & Bangunan
  luasSekarang: "",
  kapasitas: "",
  materialUtama: "",
  statusPerluasan: "",
  riwayatRenovasi: "",
  targetPerluasan: "",
  // Legalitas & Kondisi
  statusTanah: "",
  statusListrik: "",
  kondisi: "RUSAK_SEDANG",
  waktuKerusakan: "",
  alasan: "",
  dampakKerusakan: "",
  hambatanAktivitas: "",
  kondisiHujan: "",
  riwayatRoboh: "",
  usahaPerbaikan: "",
  riwayatMenerimaBantuan: "",
  // Data Masyarakat
  kkMuslim: "",
  jumlahJamaah: "",
  avgProfesiJamaah: "",
  avgGajiJamaah: "",
  usahaJamaah: "",
  // Akses & Lingkungan
  jarakKeKota: "",
  waktuTempuhKeKota: "",
  kondisiAksesKota: "",
  kondisiAksesDesa: "",
  jenisKendaraan: "",
  hambatanAkses: "",
  gantiNama: "",
  masjidTerdekat: "",
  // Aktivitas Ibadah
  kelayakan: "",
  aktivitasMasjid: "",
  jamaahSubuh: "",
  jumlahSantri: "",
  // PIC & Catatan
  namaPic: "",
  jabatanPic: "",
  kontakPic: "",
  catatan: "",
};

export function FormPengajuan() {
  const { data: session } = useSession();

  const namaRelawan =
    session?.user?.name ??
    session?.user?.email ??
    "";

  const kontakRelawan =
    session?.user?.nomorTelepon ??
    session?.user?.email ??
    "";
  console.log("Nama:", namaRelawan, "Kontak:", kontakRelawan);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [buildingImageUrls, setBuildingImageUrls] = useState<string[]>([]);
  const [regions, setRegions] = useState({
    provinces: emptyRegions,
    regencies: emptyRegions,
    districts: emptyRegions,
    villages: emptyRegions,
  });
  const [form, setForm] = useState({
    ...initialForm,
    namaRelawan: namaRelawan,
    noTelpRelawan: kontakRelawan,
  });
  const [status, setStatus] = useState("");
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [coordinateInput, setCoordinateInput] = useState("");

  useEffect(() => {
    fetchRegions("provinces.json")
      .then((provinces) => setRegions((c) => ({ ...c, provinces })))
      .catch(() => setStatus("Data provinsi gagal dimuat."));
  }, []);

  useEffect(() => {
    if (!form.idProvinsi) return;
    fetchRegions(`regencies/${form.idProvinsi}.json`)
      .then((regencies) => setRegions((c) => ({ ...c, regencies, districts: emptyRegions, villages: emptyRegions })))
      .catch(() => setStatus("Data kabupaten/kota gagal dimuat."));
  }, [form.idProvinsi]);

  useEffect(() => {
    if (!form.idKota) return;
    fetchRegions(`districts/${form.idKota}.json`)
      .then((districts) => setRegions((c) => ({ ...c, districts, villages: emptyRegions })))
      .catch(() => setStatus("Data kecamatan gagal dimuat."));
  }, [form.idKota]);

  useEffect(() => {
    if (!form.idKecamatan) return;
    fetchRegions(`villages/${form.idKecamatan}.json`)
      .then((villages) => setRegions((c) => ({ ...c, villages })))
      .catch(() => setStatus("Data desa gagal dimuat."));
  }, [form.idKecamatan]);

  useEffect(() => {
    if (!session?.user) return;
    setForm((prev) => ({
      ...prev,
      namaRelawan: namaRelawan ?? "",
      noTelpRelawan:
        kontakRelawan ??
        "",
    }));
  }, [session]);

  const selectedNames = useMemo(() => ({
    namaProvinsi:  regions.provinces.find((r) => r.id === form.idProvinsi)?.name  ?? "",
    namaKota:      regions.regencies.find((r) => r.id === form.idKota)?.name      ?? "",
    namaKecamatan: regions.districts.find((r) => r.id === form.idKecamatan)?.name ?? "",
    namaDesa:      regions.villages.find((r)  => r.id === form.idDesa)?.name      ?? "",
  }), [form.idProvinsi, form.idKota, form.idKecamatan, form.idDesa, regions]);

  function set(name: keyof typeof form, value: string) {
    setForm((c) => {
      const next = { ...c, [name]: value };
      if (name === "idProvinsi") { next.idKota = ""; next.idKecamatan = ""; next.idDesa = ""; }
      if (name === "idKota")     { next.idKecamatan = ""; next.idDesa = ""; }
      if (name === "idKecamatan"){ next.idDesa = ""; }
      return next;
    });
  }

  function locatePosition() {
    if (!navigator.geolocation) { setStatus("Browser tidak mendukung fitur lokasi."); return; }
    setLoadingPosition(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setForm((c) => ({ ...c, latitude: lat, longitude: lng }));
        setCoordinateInput(`${lat}, ${lng}`);
        setLoadingPosition(false);
        setStatus("Koordinat berhasil diambil.");
      },
      () => { setLoadingPosition(false); setStatus("Izin lokasi ditolak."); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Menyimpan data...");

    const payload = {
      ...form,
      ...selectedNames,
      documentImgUrl: documentUrls,
      imageUrl: buildingImageUrls,
      // coerce numerics
      kapasitas: form.kapasitas ? Number(form.kapasitas) : undefined,
      tahunDibangun: form.tahunDibangun ? Number(form.tahunDibangun) : undefined,
      budgetAwal: form.budgetAwal ? Number(form.budgetAwal) : undefined,
      kkMuslim: form.kkMuslim ? Number(form.kkMuslim) : undefined,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      namaRelawan: form.namaRelawan,
      noTelpRelawan: form.noTelpRelawan,
    };

    const response = await fetch("/api/pengajuan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Data berhasil disimpan.");
      return;
    }
    const data = await response.json().catch(() => ({}));
    setStatus(data.message ?? "Data belum bisa disimpan.");
  }

  return (
    <form className="form-card" onSubmit={submitForm}>
      <header className="form-header">
        <h1>Formulir Pendataan Masjid</h1>
        <p>Masukkan data masjid yang membutuhkan bantuan renovasi atau pembangunan.</p>
      </header>

      {/* ── 1. Info Umum ── */}
      <h2 className="section-title"><Info size={22} /> 1. Info Umum</h2>
      <div className="form-grid">
        <label className="field span-2">
          <span className="label">Nama Masjid / Musholla*</span>
          <input className="control" required value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="Contoh: Masjid Al Ikhlas" />
        </label>
        <label className="field span-2">
          <span className="label">Alamat Lengkap*</span>
          <textarea className="control" required value={form.alamat}
            onChange={(e) => set("alamat", e.target.value)}
            placeholder="Jalan, RT/RW, Patokan..." />
        </label>
        <label className="field span-2">
          <span className="label">Titik Koordinat Lokasi*</span>
          <span className="coordinate-row">
            <input className="control" required value={coordinateInput}
              onChange={(e) => {
                const val = e.target.value;
                const coords = parseCoordinates(val);
                setCoordinateInput(val);
                set("latitude", coords.latitude);
                set("longitude", coords.longitude);
              }}
              placeholder="Contoh: -7.214, 107.821 atau paste link Google Maps" />
            <button className="secondary-button" type="button" onClick={locatePosition}>
              <MapPinnedIcon size={18} className="button-icon" />
              {loadingPosition ? "Melacak..." : "Lacak Posisi"}
            </button>
          </span>
          <p className="help">Wajib diisi agar masjid bisa ditayangkan di Peta Sebaran.</p>
        </label>
        <RegionSelect label="Provinsi*"       value={form.idProvinsi}  regions={regions.provinces} onChange={(v) => set("idProvinsi", v)} />
        <RegionSelect label="Kabupaten/Kota*" value={form.idKota}      regions={regions.regencies} onChange={(v) => set("idKota", v)}     disabled={!form.idProvinsi} />
        <RegionSelect label="Kecamatan"       value={form.idKecamatan} regions={regions.districts}  onChange={(v) => set("idKecamatan", v)} disabled={!form.idKota} />
        <RegionSelect label="Desa/Kelurahan"  value={form.idDesa}      regions={regions.villages}   onChange={(v) => set("idDesa", v)}    disabled={!form.idKecamatan} />
        <label className="field">
          <span className="label">Tahun Berdiri*</span>
          <input className="control" required inputMode="numeric" value={form.tahunDibangun}
            onChange={(e) => set("tahunDibangun", e.target.value)} placeholder="Contoh: 1990" />
        </label>
        <label className="field">
          <span className="label">Biaya Pembangunan Awal (Rp)</span>
          <input className="control" inputMode="numeric" value={form.budgetAwal}
            onChange={(e) => set("budgetAwal", e.target.value)} placeholder="Contoh: 50000000" />
        </label>
      </div>

      {/* ── 2. Fisik & Bangunan ── */}
      <h2 className="section-title"><Landmark size={22} /> 2. Detail Fisik & Bangunan</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Luas Bangunan Saat Ini*</span>
          <input className="control" required value={form.luasSekarang}
            onChange={(e) => set("luasSekarang", e.target.value)} placeholder="Contoh: 10 x 10 meter" />
        </label>
        <label className="field">
          <span className="label">Kapasitas Jamaah*</span>
          <input className="control" required inputMode="numeric" value={form.kapasitas}
            onChange={(e) => set("kapasitas", e.target.value)} placeholder="Contoh: 100" />
        </label>
        <label className="field span-2">
          <span className="label">Material Bangunan Utama*</span>
          <input className="control" required value={form.materialUtama}
            onChange={(e) => set("materialUtama", e.target.value)}
            placeholder="Contoh: Bata merah, Kayu, Bambu, dll" />
        </label>
        <label className="field span-2">
          <span className="label">Status Perluasan</span>
          <textarea className="control" value={form.statusPerluasan}
            onChange={(e) => set("statusPerluasan", e.target.value)}
            placeholder="Contoh: Ya, diperluas menjadi 15x10 meter" />
        </label>
        <label className="field span-2">
          <span className="label">Riwayat Renovasi</span>
          <textarea className="control" value={form.riwayatRenovasi}
            onChange={(e) => set("riwayatRenovasi", e.target.value)}
            placeholder="Contoh: 2 kali (Perbaikan atap dan penambahan tempat wudhu)" />
        </label>
        <label className="field span-2">
          <span className="label">Target Perluasan</span>
          <input className="control" value={form.targetPerluasan}
            onChange={(e) => set("targetPerluasan", e.target.value)}
            placeholder="Contoh: Rencana menjadi 20x15 meter" />
        </label>
      </div>

      {/* ── 3. Legalitas & Kondisi Kerusakan ── */}
      <h2 className="section-title"><AlertTriangle size={22} /> 3. Legalitas & Kondisi Kerusakan</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Status Tanah*</span>
          <input className="control" required value={form.statusTanah}
            onChange={(e) => set("statusTanah", e.target.value)}
            placeholder="Milik, Wakaf, Sewa, dll" />
        </label>
        <label className="field">
          <span className="label">Kondisi Bangunan*</span>
          <select className="control" value={form.kondisi}
            onChange={(e) => set("kondisi", e.target.value)}>
            <option value="RUSAK_BERAT">Rusak Berat</option>
            <option value="RUSAK_SEDANG">Rusak Sedang</option>
            <option value="RUSAK_RINGAN">Rusak Ringan</option>
            <option value="LAYAK">Layak</option>
          </select>
        </label>
        <label className="field span-2">
          <span className="label">Jaringan Listrik</span>
          <input className="control" value={form.statusListrik}
            onChange={(e) => set("statusListrik", e.target.value)}
            placeholder="Contoh: PLN, Genset, Tidak ada" />
        </label>
        <label className="field">
          <span className="label">Waktu Kerusakan</span>
          <input className="control" value={form.waktuKerusakan}
            onChange={(e) => set("waktuKerusakan", e.target.value)}
            placeholder="Contoh: 2 tahun lalu" />
        </label>
        <label className="field">
          <span className="label">Riwayat Roboh</span>
          <input className="control" value={form.riwayatRoboh}
            onChange={(e) => set("riwayatRoboh", e.target.value)}
            placeholder="Contoh: Pernah, 1 kali" />
        </label>
        <label className="field span-2">
          <span className="label">Alasan Mendesak Renovasi</span>
          <textarea className="control" value={form.alasan}
            onChange={(e) => set("alasan", e.target.value)}
            placeholder="Jelaskan alasan utama mengapa renovasi mendesak..." />
        </label>
        <label className="field span-2">
          <span className="label">Dampak Kerusakan</span>
          <textarea className="control" value={form.dampakKerusakan}
            onChange={(e) => set("dampakKerusakan", e.target.value)}
            placeholder="Contoh: Jamaah berkurang, aktivitas terganggu saat hujan..." />
        </label>
        <label className="field span-2">
          <span className="label">Hambatan Aktivitas Ibadah</span>
          <textarea className="control" value={form.hambatanAktivitas}
            onChange={(e) => set("hambatanAktivitas", e.target.value)}
            placeholder="Contoh: Atap bocor, lantai retak, dinding miring..." />
        </label>
        <label className="field">
          <span className="label">Kondisi saat Hujan</span>
          <input className="control" value={form.kondisiHujan}
            onChange={(e) => set("kondisiHujan", e.target.value)}
            placeholder="Contoh: Bocor di bagian atap depan" />
        </label>
        <label className="field">
          <span className="label">Usaha Perbaikan Sebelumnya</span>
          <input className="control" value={form.usahaPerbaikan}
            onChange={(e) => set("usahaPerbaikan", e.target.value)}
            placeholder="Contoh: Tambal sementara pakai terpal" />
        </label>
        <label className="field span-2">
          <span className="label">Riwayat Menerima Bantuan</span>
          <textarea className="control" value={form.riwayatMenerimaBantuan}
            onChange={(e) => set("riwayatMenerimaBantuan", e.target.value)}
            placeholder="Contoh: Pernah menerima bantuan dari Baznas tahun 2020..." />
        </label>
      </div>

      {/* ── 4. Data Masyarakat ── */}
      <h2 className="section-title"><Users size={22} /> 4. Data Masyarakat</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Jumlah KK Muslim</span>
          <input className="control" inputMode="numeric" value={form.kkMuslim}
            onChange={(e) => set("kkMuslim", e.target.value)} placeholder="Contoh: 150" />
        </label>
        <label className="field">
          <span className="label">Jumlah Jamaah Aktif</span>
          <input className="control" value={form.jumlahJamaah}
            onChange={(e) => set("jumlahJamaah", e.target.value)} placeholder="Contoh: 80 orang" />
        </label>
        <label className="field">
          <span className="label">Profesi Mayoritas Jamaah</span>
          <input className="control" value={form.avgProfesiJamaah}
            onChange={(e) => set("avgProfesiJamaah", e.target.value)} placeholder="Contoh: Petani, Buruh" />
        </label>
        <label className="field">
          <span className="label">Rata-rata Gaji Jamaah</span>
          <input className="control" value={form.avgGajiJamaah}
            onChange={(e) => set("avgGajiJamaah", e.target.value)} placeholder="Contoh: Rp 2.000.000/bulan" />
        </label>
        <label className="field span-2">
          <span className="label">Usaha / Bisnis Jamaah</span>
          <input className="control" value={form.usahaJamaah}
            onChange={(e) => set("usahaJamaah", e.target.value)} placeholder="Contoh: Warung, Pertanian, UMKM" />
        </label>
      </div>

      {/* ── 5. Akses & Lingkungan ── */}
      <h2 className="section-title"><Navigation size={22} /> 5. Akses & Kondisi Lingkungan</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Jarak ke Kota</span>
          <input className="control" value={form.jarakKeKota}
            onChange={(e) => set("jarakKeKota", e.target.value)} placeholder="Contoh: 15 km" />
        </label>
        <label className="field">
          <span className="label">Waktu Tempuh ke Kota</span>
          <input className="control" value={form.waktuTempuhKeKota}
            onChange={(e) => set("waktuTempuhKeKota", e.target.value)} placeholder="Contoh: 30 menit" />
        </label>
        <label className="field">
          <span className="label">Kondisi Jalan ke Kota</span>
          <input className="control" value={form.kondisiAksesKota}
            onChange={(e) => set("kondisiAksesKota", e.target.value)} placeholder="Contoh: Aspal, baik" />
        </label>
        <label className="field">
          <span className="label">Kondisi Jalan ke Desa</span>
          <input className="control" value={form.kondisiAksesDesa}
            onChange={(e) => set("kondisiAksesDesa", e.target.value)} placeholder="Contoh: Makadam, rusak" />
        </label>
        <label className="field">
          <span className="label">Jenis Kendaraan yang Bisa Masuk</span>
          <input className="control" value={form.jenisKendaraan}
            onChange={(e) => set("jenisKendaraan", e.target.value)} placeholder="Contoh: Motor, Mobil kecil" />
        </label>
        <label className="field">
          <span className="label">Hambatan Akses</span>
          <input className="control" value={form.hambatanAkses}
            onChange={(e) => set("hambatanAkses", e.target.value)} placeholder="Contoh: Jembatan sempit" />
        </label>
        <label className="field">
          <span className="label">Masjid Terdekat</span>
          <input className="control" value={form.masjidTerdekat}
            onChange={(e) => set("masjidTerdekat", e.target.value)} placeholder="Contoh: Masjid Al-Hidayah, 2 km" />
        </label>
        <label className="field">
          <span className="label">Kesediaan Ganti Nama</span>
          <select className="control" value={form.gantiNama}
            onChange={(e) => set("gantiNama", e.target.value)}>
            <option value="">Pilih...</option>
            <option value="Ya">Ya, bersedia</option>
            <option value="Tidak">Tidak bersedia</option>
            <option value="Negosiasi">Perlu negosiasi</option>
          </select>
        </label>
      </div>

      {/* ── 6. Aktivitas Ibadah ── */}
      <h2 className="section-title"><Sun size={22} /> 6. Aktivitas Ibadah</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Kelayakan Shalat Jumat</span>
          <select className="control" value={form.kelayakan}
            onChange={(e) => set("kelayakan", e.target.value)}>
            <option value="">Pilih...</option>
            <option value="Layak">Layak</option>
            <option value="Tidak Layak">Tidak Layak</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          </select>
        </label>
        <label className="field">
          <span className="label">Rata-rata Jamaah Subuh</span>
          <input className="control" value={form.jamaahSubuh}
            onChange={(e) => set("jamaahSubuh", e.target.value)} placeholder="Contoh: 20 orang" />
        </label>
        <label className="field">
          <span className="label">Jumlah Santri</span>
          <input className="control" value={form.jumlahSantri}
            onChange={(e) => set("jumlahSantri", e.target.value)} placeholder="Contoh: 30 santri" />
        </label>
        <label className="field span-2">
          <span className="label">Aktivitas / Kegiatan Masjid</span>
          <textarea className="control" value={form.aktivitasMasjid}
            onChange={(e) => set("aktivitasMasjid", e.target.value)}
            placeholder="Contoh: TPA, Pengajian rutin, Majelis taklim..." />
        </label>
      </div>

      {/* ── 7. PIC & Dokumen ── */}
      <h2 className="section-title"><UserCircle size={22} /> 7. Narahubung & Dokumentasi</h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">Nama PIC / Narahubung*</span>
          <input className="control" required value={form.namaPic}
            onChange={(e) => set("namaPic", e.target.value)} placeholder="Nama lengkap" />
        </label>
        <label className="field">
          <span className="label">Jabatan PIC</span>
          <input className="control" value={form.jabatanPic}
            onChange={(e) => set("jabatanPic", e.target.value)} placeholder="Contoh: Ketua DKM" />
        </label>
        <label className="field span-2">
          <span className="label">Kontak PIC (WA/Telp)*</span>
          <input className="control" required value={form.kontakPic}
            onChange={(e) => set("kontakPic", e.target.value)} placeholder="Contoh: 08123456789" />
        </label>
        <label className="field span-2">
          <span className="label">Catatan Tambahan</span>
          <textarea className="control" value={form.catatan}
            onChange={(e) => set("catatan", e.target.value)}
            placeholder="Kebutuhan utama, informasi tambahan, atau catatan verifikasi..." />
        </label>

        <ImageUploadField
          label="Foto Dokumen Kepemilikan Tanah"
          maxFiles={5}
          onUrlsChange={setDocumentUrls}
        />
        <ImageUploadField
          label="Foto Bangunan"
          maxFiles={5}
          onUrlsChange={setBuildingImageUrls}
        />
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Save size={18} /> Simpan Data
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}
    </form>
  );
}

function RegionSelect({
  label, value, regions, disabled, onChange,
}: {
  label: string; value: string; regions: Region[];
  disabled?: boolean; onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <select className="control" required={label.includes("*")} value={value}
        disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">Pilih {label.replace("*", "")}</option>
        {regions.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
    </label>
  );
}