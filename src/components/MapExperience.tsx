"use client";

import dynamic from "next/dynamic";
import { Search, Hammer, CheckCircle, LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building, BuildingCondition, BuildingStatus } from "@/lib/types";
import { RotateCcw } from "lucide-react";

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

  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );

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

      const matchStatus =
        mapMode !== "renovasi" || building.buildingStatus === "APPROVED";

      return (
        matchStatus &&
        (!keyword || haystack.includes(keyword)) &&
        (condition === "ALL" || building.condition === condition) &&
        (province === "ALL" || building.provinceId === province)
      );
    });
  }, [activeBuildings, condition, province, query]);

  const [selectedId, setSelectedId] = useState<string>("");
  const selectedBuilding =
    filteredBuildings.find((b) => b.id === selectedId) ?? undefined;

  const [userSelected, setUserSelected] = useState(false);

  const isDirty =
    query !== "" ||
    condition !== "ALL" ||
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
    setCondition("ALL");
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
    setCondition("ALL");
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
        <div className="panel-actions">
          {/* Reset — hanya tampil jika ada filter aktif */}
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
              <h2>{building.name}</h2>
              <p>{building.address}</p>
              {mapMode === "renovasi" && (
                <span className={`badge ${conditionTone(building.condition)}`}>
                  {conditionLabel(building.condition)}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}