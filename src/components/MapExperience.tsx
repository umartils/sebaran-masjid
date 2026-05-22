"use client";

import dynamic from "next/dynamic";
import { Search, Hammer, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building, BuildingCondition } from "@/lib/types";
import { map } from "leaflet";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="leaflet-container" />,
});

const conditions: Array<{ value: "ALL" | BuildingCondition; label: string }> = [
  { value: "ALL", label: "Semua Kondisi" },
  { value: "RUSAK_BERAT", label: "Rusak Berat" },
  { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
  { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
  { value: "LAYAK", label: "Layak" },
];

type MapMode = "renovasi" | "dibangun";

interface Props {
  buildingsRenovasi: Building[];
  buildingsDibangun: Building[];
}

export function MapExperience({ buildingsRenovasi, buildingsDibangun }: Props) {
  const [mapMode, setMapMode] = useState<MapMode>("renovasi");
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState<"ALL" | BuildingCondition>("ALL");
  const [province, setProvince] = useState("ALL");

  // Pilih dataset aktif berdasarkan mode
  const activeBuildings =
    mapMode === "renovasi" ? buildingsRenovasi : buildingsDibangun;

  const [selectedId, setSelectedId] = useState(activeBuildings[0]?.id ?? "");

  const provinces = useMemo(() => {
    return Array.from(
      new Map(
        activeBuildings.map((item) => [item.provinceId, item.provinceName])
      ).entries()
    );
  }, [activeBuildings]);

  const filteredBuildings = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return activeBuildings.filter((building) => {
      const haystack = [
        building.name,
        building.address,
        building.provinceName,
        building.regencyName,
        building.districtName,
        building.villageName,
        building.condition,
        building.mainMaterial,
        building.landStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!keyword || haystack.includes(keyword)) &&
        (condition === "ALL" || building.condition === condition) &&
        (province === "ALL" || building.provinceId === province)
      );
    });
  }, [activeBuildings, condition, province, query]);

  const selectedBuilding =
    filteredBuildings.find((b) => b.id === selectedId) ??
    filteredBuildings[0] ??
    activeBuildings[0];

  // Reset filter & selected saat ganti mode
  function switchMode(mode: MapMode) {
    setMapMode(mode);
    setQuery("");
    setCondition("ALL");
    setProvince("ALL");
    const nextBuildings =
      mode === "renovasi" ? buildingsRenovasi : buildingsDibangun;
    setSelectedId(nextBuildings[0]?.id ?? "");
  }

  return (
    <section className="map-page">
      <LeafletMap
        buildings={filteredBuildings}
        selected={selectedBuilding}
        onSelect={setSelectedId}
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
        {/* Label mode aktif */}
        {/* <div
          className={`mode-badge ${
            mapMode === "renovasi" ? "badge-renovasi" : "badge-dibangun"
          }`}
        >
          {mapMode === "renovasi" ? (
            <>
              <Hammer size={14} /> Masjid Butuh Renovasi
            </>
          ) : (
            <>
              <CheckCircle size={14} /> Masjid Sudah Dibangun
            </>
          )}
        </div> */}

        <h1>Cari Masjid</h1>
        <p className="subtitle">Temukan masjid yang membutuhkan bantuan</p>

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
            <span className="label">Filter Kondisi</span>
            <select
              className="control"
              value={condition}
              onChange={(e) => setCondition(e.target.value as typeof condition)}
            >
              {conditions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="field">
          <span className="label">Provinsi</span>
          <select
            className="control"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value="ALL">Seluruh Indonesia</option>
            {provinces.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

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
              onClick={() => setSelectedId(building.id)}
            >
              <h2>{building.name}</h2>
              <p>{building.address}</p>
              <span className={`badge ${conditionTone(building.condition)}`}>
                {conditionLabel(building.condition)}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}