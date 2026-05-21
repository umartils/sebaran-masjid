"use client";

import {
  Crosshair,
  Info,
  Landmark,
  LocateFixed,
  MapPinned,
  MapPinnedIcon,
  Save,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Region } from "@/lib/types";

const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

const emptyRegions: Region[] = [];
const fieldClass = "mb-3 grid gap-[3px]";
const labelClass = "text-[15px] font-semibold text-slate-700";
const spanTwoClass = "col-span-2 max-md:col-span-1";
const controlClass =
  "min-h-[54px] w-full rounded-lg border border-line bg-white px-[18px] text-slate-700 outline-0";
const textareaClass = `${controlClass} min-h-[78px] resize-y py-4`;
const sectionTitleClass =
  "mb-[22px] mt-[34px] flex items-center gap-3 text-[26px] max-md:mb-5 max-md:mt-7 max-md:gap-2.5 max-md:text-[23px]";

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
      className="mx-auto w-[min(1000px,100%)] rounded-[18px] bg-white px-[50px] py-[52px] shadow-[0_18px_50px_rgba(15,23,42,0.08)] max-md:px-5 max-md:py-7"
      onSubmit={submitForm}
    >
      <header className="mb-9 border-b border-line pb-7 text-center">
        <h1 className="mb-2 mt-0 text-4xl text-brand max-md:text-[27px]">Formulir Pendataan Masjid</h1>
        <p className="m-0 text-[21px] text-[#53647c] max-md:text-[17px]">
          Masukkan data masjid yang membutuhkan bantuan renovasi atau
          pembangunan.
        </p>
      </header>

      <h2 className={sectionTitleClass}>
        <Info size={26} /> 1. Info Umum
      </h2>
      <div className="grid grid-cols-2 gap-x-[30px] gap-y-5 max-md:grid-cols-1">
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>1. Nama Masjid / Musholla*</span>
          <input
            className={controlClass}
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Contoh: Masjid Al Ikhlas"
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>2. Alamat Lengkap*</span>
          <textarea
            className={textareaClass}
            required
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Jalan, RT/RW, Patokan..."
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>Titik Koordinat Lokasi*</span>
          <span className="grid grid-cols-[minmax(0,1fr)_174px] gap-3 max-md:grid-cols-1">
            <input
              className={controlClass}
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
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-[18px] font-bold text-[#1f334f]"
              type="button"
              onClick={locatePosition}
            >
              <MapPinnedIcon size={18} className="shrink-0" />{" "}
              {loadingPosition ? "Melacak..." : "Lacak Posisi"}
            </button>
          </span>
          <p className="mb-0 mt-0.5 text-sm text-[#53647c]">
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
        <label className={fieldClass}>
          <span className={labelClass}>3. Tahun Berdiri*</span>
          <input
            className={controlClass}
            required
            inputMode="numeric"
            value={form.establishedYear}
            onChange={(event) =>
              updateField("establishedYear", event.target.value)
            }
            placeholder="Contoh: 1990"
          />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>4. Biaya Pembangunan Awal*</span>
          <input
            className={controlClass}
            inputMode="numeric"
            value={form.initialBudget}
            onChange={(event) =>
              updateField("initialBudget", event.target.value)
            }
            placeholder="Contoh: 50000000"
          />
        </label>
      </div>

      <h2 className={sectionTitleClass}>
        <Landmark size={26} /> 2. Detail Fisik & Bangunan
      </h2>
      <div className="grid grid-cols-2 gap-x-[30px] gap-y-5 max-md:grid-cols-1">
        <label className={fieldClass}>
          <span className={labelClass}>5. Luas Masjid Saat Ini*</span>
          <input
            className={controlClass}
            required
            value={form.currentArea}
            onChange={(event) => updateField("currentArea", event.target.value)}
            placeholder="Contoh: 10 x 10 meter"
          />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>6. Kapasitas Jamaah*</span>
          <input
            className={controlClass}
            required
            inputMode="numeric"
            value={form.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
            placeholder="Contoh: 100"
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>7. Material Bangunan Utama*</span>
          <input
            className={controlClass}
            required
            value={form.mainMaterial}
            onChange={(event) =>
              updateField("mainMaterial", event.target.value)
            }
            placeholder="Contoh: Bata merah, Kayu, Bambu, dll"
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>8. Status Perluasan (Opsional)</span>
          <textarea
            className={textareaClass}
            value={form.expansionStatus}
            onChange={(event) =>
              updateField("expansionStatus", event.target.value)
            }
            placeholder="Contoh: Ya, diperluas menjadi 15x10 meter"
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>9. Riwayat Singkat Renovasi</span>
          <textarea
            className={textareaClass}
            value={form.renovationHistory}
            onChange={(event) =>
              updateField("renovationHistory", event.target.value)
            }
            placeholder="Contoh: 2 kali (Perbaikan atap dan penambahan tempat wudhu)"
          />
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>10. Target Ekstensi/Perluasan Baru</span>
          <input
            className={controlClass}
            value={form.expansionTarget}
            onChange={(event) =>
              updateField("expansionTarget", event.target.value)
            }
            placeholder="Contoh: Rencana menjadi 20x15 meter"
          />
        </label>
      </div>

      <h2 className={sectionTitleClass}>
        <MapPinned size={26} /> 3. Legalitas Tanah & Infrastruktur
      </h2>
      <div className="grid grid-cols-2 gap-x-[30px] gap-y-5 max-md:grid-cols-1">
        <label className={fieldClass}>
          <span className={labelClass}>11. Status Lahan Berdiri*</span>
          <input
            className={controlClass}
            required
            value={form.landStatus}
            onChange={(event) => updateField("landStatus", event.target.value)}
            placeholder="Milik, Wakaf, Sewa, dll"
          />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Kondisi Bangunan*</span>
          <select
            className={controlClass}
            value={form.condition}
            onChange={(event) => updateField("condition", event.target.value)}
          >
            <option value="RUSAK_BERAT">Rusak Berat</option>
            <option value="RUSAK_SEDANG">Rusak Sedang</option>
            <option value="RUSAK_RINGAN">Rusak Ringan</option>
            <option value="LAYAK">Layak</option>
          </select>
        </label>
        <label className={`${fieldClass} ${spanTwoClass}`}>
          <span className={labelClass}>Catatan Tambahan</span>
          <textarea
            className={textareaClass}
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Kebutuhan utama, kontak relawan, atau catatan verifikasi"
          />
        </label>
      </div>

      <div className="mt-[34px] flex justify-end">
        <button className="flex min-h-[54px] items-center gap-2 rounded-lg border-0 bg-brand px-[18px] font-bold text-white" type="submit">
          <Save size={18} /> Simpan Data
        </button>
      </div>
      {status ? <p className="mt-[18px] font-bold text-slate-700">{status}</p> : null}
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
    <label className={fieldClass}>
      <span className={labelClass}>{label}</span>
      <select className={controlClass} required value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
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
