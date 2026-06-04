"use client";

import dynamic from "next/dynamic";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { kategoriLabel, kategoriTone } from "@/lib/format";
import type {
  KategoriMasjid,
  MapMasjid,
  MapMasjidMNBaru,
} from "@/lib/types";

const LeafletMap = dynamic(
  () => import("@/components/SebaranMasjid/LeafletMap"),
  {
    ssr: false,
    loading: () => <div className="leaflet-container" />,
  }
);

// const conditions: Array<{ value: "ALL" | KondisiMasjid; label: string }> = [
//   { value: "ALL", label: "Semua Kondisi" },
//   { value: "RUSAK_BERAT", label: "Rusak Berat" },
//   { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
//   { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
//   { value: "LAYAK", label: "Layak" },
// ];

const categories: Array<{ value: "ALL" | KategoriMasjid; label: string }> = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "Pelosok_Pedalaman", label: "Pelosok Pedalaman" },
  { value: "Muslim_Minoritas", label: "Muslim Minorits" },
  { value: "Kampung_Mualaf", label: "Kampung Mualaf" },
  { value: "Terdampak_Bencana", label: "Terdampak Bencana" },
];

type MapMode = "renovasi" | "dibangun";

interface Props {
  buildingsRenovasi: MapMasjid[];
  buildingsDibangun: MapMasjidMNBaru[];
}

export function MapExperience({ buildingsRenovasi, buildingsDibangun }: Props) {
  const [mapMode, setMapMode] = useState<MapMode>("renovasi");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | KategoriMasjid>("ALL");
  const [province, setProvince] = useState("ALL");

  // Pilih dataset aktif berdasarkan mode
  const activeBuildings: (MapMasjid | MapMasjidMNBaru)[] =
    mapMode === "renovasi" ? buildingsRenovasi : buildingsDibangun;

  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );

  const provinces = useMemo(() => {
    return Array.from(
      new Map(
        activeBuildings.map((item) => [item.idProvinsi, item.namaProvinsi])
      ).entries()
    );
  }, [activeBuildings]);

  const filteredBuildings = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return activeBuildings.filter((building) => {
      const haystack = [
        building.nama,
        building.alamat,
        building.namaProvinsi,
        building.namaKota,
        building.namaKecamatan,
        building.namaDesa,
        building.kategori,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchStatus =
        mapMode !== "renovasi" ||
        ("statusPengajuan" in building &&
          building.statusPengajuan === "APPROVED");

      return (
        matchStatus &&
        (!keyword || haystack.includes(keyword)) &&
        (category === "ALL" || building.kategori === category) &&
        (province === "ALL" || building.idProvinsi === province)
      );
    });
  }, [activeBuildings, category, province, query]);

  const [selectedId, setSelectedId] = useState<string>("");
  const selectedBuilding =
    filteredBuildings.find((b) => b.id === selectedId) ?? undefined;

  const [userSelected, setUserSelected] = useState(false);

  const isDirty =
    query !== "" ||
    category !== "ALL" ||
    province !== "ALL" ||
    selectedId !== "";

  function handleSelectFromList(id: string) {
    setSelectedId(id);
    setUserSelected(true);
  }

  function handleSelectFromMap(id: string) {
    setSelectedId(id);
    setUserSelected(false); // ← tidak perlu fly
  }

  const [resetViewTrigger, setResetViewTrigger] = useState(0);
  function handleReset() {
    setQuery("");
    setCategory("ALL");
    setProvince("ALL");
    setSelectedId("");
    setUserSelected(false);
    setGeoStatus("idle");
    setResetViewTrigger((n) => n + 1);
    selectedBuilding == null;
  }

  /** Haversine — jarak dua koordinat dalam km */
  function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Reset filter & selected saat ganti mode
  function switchMode(mode: MapMode) {
    setMapMode(mode);
    setQuery("");
    setCategory("ALL");
    setProvince("ALL");
    setSelectedId("");
    setUserSelected(false);
    setGeoStatus("idle");
    setResetViewTrigger((n) => n + 1); // zoom out saat ganti mode
  }

  return (
    <section className="map-page">
      <LeafletMap
        buildings={filteredBuildings}
        selected={selectedBuilding}
        onSelect={handleSelectFromMap}
        mapMode={mapMode}
        shouldFocus={userSelected}
        resetView={resetViewTrigger}
      />
      {/* ── Floating Toggle Button ── */}
      <div className="map-mode-toggle">
        <button
          className={`toggle-btn ${mapMode === "renovasi" ? "active" : ""}`}
          onClick={() => switchMode("renovasi")}
          title="Masjid Butuh Renovasi"
        >
          {/* <Hammer size={18} /> */}
          <span>Butuh Renovasi</span>
        </button>
        <button
          className={`toggle-btn ${mapMode === "dibangun" ? "active" : ""}`}
          onClick={() => switchMode("dibangun")}
          title="Masjid Sudah Dibangun"
        >
          {/* <CheckCircle size={18} /> */}
          <span>Sudah Dibangun</span>
        </button>
      </div>
      <aside className="map-panel" aria-label="Panel pencarian bangunan">
        <h1>Cari Masjid</h1>
        <p className="subtitle">
          Temukan masjid{" "}
          {mapMode == "renovasi"
            ? "yang membutuhkan bantuan"
            : "yang sudah dibangun"}{" "}
        </p>
        <label className="field">
          <span className="search-control">
            <Search size={22} />
            <input
              className="control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau desa..."
              type="search"
            />
          </span>
        </label>
        {mapMode === "renovasi" && (
          <label className="field hidden">
            <span className="label">Filter Kategori</span>
            <div className="select-wrapper">
              <select
                className="control"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" size={20} />
            </div>
          </label>
        )}
        <label className="field">
          <span className="label">Provinsi</span>
          <div className="select-wrapper">
            <select
              className="control"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              <option value="ALL">Seluruh Indonesia</option>

              {provinces.map(([id, nama]) => (
                <option key={id} value={id}>
                  {nama}
                </option>
              ))}
            </select>

            <ChevronDown className="select-icon" size={20} />
          </div>
        </label>
        <div className="panel-actions">
          {isDirty && (
            <button
              className="action-btn reset-btn"
              onClick={handleReset}
              title="Reset pencarian"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="divider" />
        <div className="result-count">
          Hasil Pencarian ({filteredBuildings.length})
        </div>
        <div className="result-list">
          {filteredBuildings.map((building) => (
            <button
              className={`result-card ${
                building.id === selectedBuilding?.id ? "active" : ""
              }`}
              key={building.id}
              type="button"
              onClick={() => handleSelectFromList(building.id)}
            >
              <h2>{building.nama}</h2>
              <p>{building.alamat}</p>
              {mapMode === "renovasi" && (
                <span className={`badge ${kategoriTone(building.kategori)}`}>
                  {kategoriLabel(building.kategori)}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
