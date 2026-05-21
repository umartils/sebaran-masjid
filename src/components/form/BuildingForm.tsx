"use client";

import {
  Info,
  Landmark,
  MapPinned,
  MapPinnedIcon,
  Save,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Region } from "@/lib/types";

const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

const emptyRegions: Region[] = [];

async function fetchRegions(path: string): Promise<Region[]> {
  const response = await fetch(`${API_BASE}/${path}`);
  if (!response.ok) throw new Error("Gagal mengambil data wilayah");
  return response.json();
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
    if (match?.[1] && match?.[2]) {
      return { latitude: match[1], longitude: match[2] };
    }
  }

  return { latitude: "", longitude: "" };
}

export function BuildingForm() {
  const [regions, setRegions] = useState({
    provinces: emptyRegions,
    regencies: emptyRegions,
    districts: emptyRegions,
    villages: emptyRegions,
  });
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    provinceId: "",
    regencyId: "",
    districtId: "",
    villageId: "",
    condition: "RUSAK_SEDANG",
    establishedYear: "",
    initialBudget: "",
    currentArea: "",
    capacity: "",
    mainMaterial: "",
    expansionStatus: "",
    renovationHistory: "",
    expansionTarget: "",
    landStatus: "",
    notes: "",
  });
  const [status, setStatus] = useState("");
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [coordinateInput, setCoordinateInput] = useState("");

  useEffect(() => {
    fetchRegions("provinces.json")
      .then((provinces) => setRegions((current) => ({ ...current, provinces })))
      .catch(() =>
        setStatus(
          "Data provinsi gagal dimuat. Cek koneksi internet lalu muat ulang halaman."
        )
      );
  }, []);

  useEffect(() => {
    if (!form.provinceId) return;
    fetchRegions(`regencies/${form.provinceId}.json`)
      .then((regencies) =>
        setRegions((current) => ({
          ...current,
          regencies,
          districts: emptyRegions,
          villages: emptyRegions,
        }))
      )
      .catch(() => setStatus("Data kabupaten/kota gagal dimuat."));
  }, [form.provinceId]);

  useEffect(() => {
    if (!form.regencyId) return;
    fetchRegions(`districts/${form.regencyId}.json`)
      .then((districts) =>
        setRegions((current) => ({
          ...current,
          districts,
          villages: emptyRegions,
        }))
      )
      .catch(() => setStatus("Data kecamatan gagal dimuat."));
  }, [form.regencyId]);

  useEffect(() => {
    if (!form.districtId) return;
    fetchRegions(`villages/${form.districtId}.json`)
      .then((villages) => setRegions((current) => ({ ...current, villages })))
      .catch(() => setStatus("Data desa/kelurahan gagal dimuat."));
  }, [form.districtId]);

  const selectedNames = useMemo(() => {
    return {
      provinceName:
        regions.provinces.find((region) => region.id === form.provinceId)
          ?.name ?? "",
      regencyName:
        regions.regencies.find((region) => region.id === form.regencyId)
          ?.name ?? "",
      districtName:
        regions.districts.find((region) => region.id === form.districtId)
          ?.name ?? "",
      villageName:
        regions.villages.find((region) => region.id === form.villageId)?.name ??
        "",
    };
  }, [
    form.districtId,
    form.provinceId,
    form.regencyId,
    form.villageId,
    regions,
  ]);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "provinceId") {
        next.regencyId = "";
        next.districtId = "";
        next.villageId = "";
      }
      if (name === "regencyId") {
        next.districtId = "";
        next.villageId = "";
      }
      if (name === "districtId") {
        next.villageId = "";
      }
      return next;
    });
  }

  function locatePosition() {
    if (!navigator.geolocation) {
      setStatus("Browser tidak mendukung fitur lokasi otomatis.");
      return;
    }

    setLoadingPosition(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setCoordinateInput(
          `${position.coords.latitude.toFixed(
            6
          )}, ${position.coords.longitude.toFixed(6)}`
        );
        setLoadingPosition(false);
        setStatus("Koordinat berhasil diambil dari lokasi perangkat.");
      },
      () => {
        setLoadingPosition(false);
        setStatus("Izin lokasi ditolak atau lokasi tidak tersedia.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Menyimpan data...");

    const payload = {
      ...form,
      ...selectedNames,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    const response = await fetch("/api/buildings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus(
        "Data berhasil disimpan. Titik akan tampil pada peta setelah halaman dimuat ulang."
      );
      return;
    }

    const data = await response.json().catch(() => ({}));
    setStatus(data.message ?? "Data belum bisa disimpan.");
  }

  return (
    <form
      className="form-card"
      onSubmit={submitForm}
    >
      <header className="form-header">
        <h1>Formulir Pendataan Masjid</h1>
        <p>
          Masukkan data masjid yang membutuhkan bantuan renovasi atau
          pembangunan.
        </p>
      </header>

      <h2 className="section-title">
        <Info size={26} /> 1. Info Umum
      </h2>
      <div className="form-grid">
        <label className="field span-2">
          <span className="label">1. Nama Masjid / Musholla*</span>
          <input
            className="control"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Contoh: Masjid Al Ikhlas"
          />
        </label>
        <label className="field span-2">
          <span className="label">2. Alamat Lengkap*</span>
          <textarea
            className="control"
            required
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Jalan, RT/RW, Patokan..."
          />
        </label>
        <label className="field span-2">
          <span className="label">Titik Koordinat Lokasi*</span>
          <span className="coordinate-row">
            <input
              className="control"
              required
              value={coordinateInput}
              onChange={(event) => {
                const value = event.target.value;
                const coordinates = parseCoordinates(value);
                setCoordinateInput(value);
                updateField("latitude", coordinates.latitude);
                updateField("longitude", coordinates.longitude);
              }}
              placeholder="Contoh: -7.214, 107.821 atau paste link maps"
            />
            <button
              className="secondary-button"
              type="button"
              onClick={locatePosition}
            >
              <MapPinnedIcon size={18} className="button-icon" />{" "}
              {loadingPosition ? "Melacak..." : "Lacak Posisi"}
            </button>
          </span>
          <p className="help">
            Wajib diisi agar masjid bisa langsung ditayangkan di Peta Sebaran.
          </p>
        </label>
        <RegionSelect
          label="Provinsi*"
          value={form.provinceId}
          regions={regions.provinces}
          onChange={(value) => updateField("provinceId", value)}
        />
        <RegionSelect
          label="Kabupaten/Kota*"
          value={form.regencyId}
          regions={regions.regencies}
          onChange={(value) => updateField("regencyId", value)}
          disabled={!form.provinceId}
        />
        <RegionSelect
          label="Kecamatan*"
          value={form.districtId}
          regions={regions.districts}
          onChange={(value) => updateField("districtId", value)}
          disabled={!form.regencyId}
        />
        <RegionSelect
          label="Desa/Kelurahan*"
          value={form.villageId}
          regions={regions.villages}
          onChange={(value) => updateField("villageId", value)}
          disabled={!form.districtId}
        />
        <label className="field">
          <span className="label">3. Tahun Berdiri*</span>
          <input
            className="control"
            required
            inputMode="numeric"
            value={form.establishedYear}
            onChange={(event) =>
              updateField("establishedYear", event.target.value)
            }
            placeholder="Contoh: 1990"
          />
        </label>
        <label className="field">
          <span className="label">4. Biaya Pembangunan Awal*</span>
          <input
            className="control"
            inputMode="numeric"
            value={form.initialBudget}
            onChange={(event) =>
              updateField("initialBudget", event.target.value)
            }
            placeholder="Contoh: 50000000"
          />
        </label>
      </div>

      <h2 className="section-title">
        <Landmark size={26} /> 2. Detail Fisik & Bangunan
      </h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">5. Luas Masjid Saat Ini*</span>
          <input
            className="control"
            required
            value={form.currentArea}
            onChange={(event) => updateField("currentArea", event.target.value)}
            placeholder="Contoh: 10 x 10 meter"
          />
        </label>
        <label className="field">
          <span className="label">6. Kapasitas Jamaah*</span>
          <input
            className="control"
            required
            inputMode="numeric"
            value={form.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
            placeholder="Contoh: 100"
          />
        </label>
        <label className="field span-2">
          <span className="label">7. Material Bangunan Utama*</span>
          <input
            className="control"
            required
            value={form.mainMaterial}
            onChange={(event) =>
              updateField("mainMaterial", event.target.value)
            }
            placeholder="Contoh: Bata merah, Kayu, Bambu, dll"
          />
        </label>
        <label className="field span-2">
          <span className="label">8. Status Perluasan (Opsional)</span>
          <textarea
            className="control"
            value={form.expansionStatus}
            onChange={(event) =>
              updateField("expansionStatus", event.target.value)
            }
            placeholder="Contoh: Ya, diperluas menjadi 15x10 meter"
          />
        </label>
        <label className="field span-2">
          <span className="label">9. Riwayat Singkat Renovasi</span>
          <textarea
            className="control"
            value={form.renovationHistory}
            onChange={(event) =>
              updateField("renovationHistory", event.target.value)
            }
            placeholder="Contoh: 2 kali (Perbaikan atap dan penambahan tempat wudhu)"
          />
        </label>
        <label className="field span-2">
          <span className="label">10. Target Ekstensi/Perluasan Baru</span>
          <input
            className="control"
            value={form.expansionTarget}
            onChange={(event) =>
              updateField("expansionTarget", event.target.value)
            }
            placeholder="Contoh: Rencana menjadi 20x15 meter"
          />
        </label>
      </div>

      <h2 className="section-title">
        <MapPinned size={26} /> 3. Legalitas Tanah & Infrastruktur
      </h2>
      <div className="form-grid">
        <label className="field">
          <span className="label">11. Status Lahan Berdiri*</span>
          <input
            className="control"
            required
            value={form.landStatus}
            onChange={(event) => updateField("landStatus", event.target.value)}
            placeholder="Milik, Wakaf, Sewa, dll"
          />
        </label>
        <label className="field">
          <span className="label">Kondisi Bangunan*</span>
          <select
            className="control"
            value={form.condition}
            onChange={(event) => updateField("condition", event.target.value)}
          >
            <option value="RUSAK_BERAT">Rusak Berat</option>
            <option value="RUSAK_SEDANG">Rusak Sedang</option>
            <option value="RUSAK_RINGAN">Rusak Ringan</option>
            <option value="LAYAK">Layak</option>
          </select>
        </label>
        <label className="field span-2">
          <span className="label">Catatan Tambahan</span>
          <textarea
            className="control"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Kebutuhan utama, kontak relawan, atau catatan verifikasi"
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Save size={18} /> Simpan Data
        </button>
      </div>
      {status ? <p className="status-message">{status}</p> : null}
    </form>
  );
}

function RegionSelect({
  label,
  value,
  regions,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  regions: Region[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <select className="control" required value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        <option value="">Pilih {label.replace("*", "")}</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </label>
  );
}
