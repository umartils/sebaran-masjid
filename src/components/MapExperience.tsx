"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building, BuildingCondition } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="leaflet-container" />
});

const conditions: Array<{ value: "ALL" | BuildingCondition; label: string }> = [
  { value: "ALL", label: "Semua Kondisi" },
  { value: "RUSAK_BERAT", label: "Rusak Berat" },
  { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
  { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
  { value: "LAYAK", label: "Layak" }
];

export function MapExperience({ buildings }: { buildings: Building[] }) {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState<"ALL" | BuildingCondition>("ALL");
  const [province, setProvince] = useState("ALL");
  const [selectedId, setSelectedId] = useState(buildings[0]?.id ?? "");

  const provinces = useMemo(() => {
    return Array.from(new Map(buildings.map((item) => [item.provinceId, item.provinceName])).entries());
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return buildings.filter((building) => {
      const haystack = [
        building.name,
        building.address,
        building.provinceName,
        building.regencyName,
        building.districtName,
        building.villageName,
        building.condition,
        building.mainMaterial,
        building.landStatus
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
  }, [buildings, condition, province, query]);

  const selectedBuilding =
    filteredBuildings.find((building) => building.id === selectedId) ?? filteredBuildings[0] ?? buildings[0];

  return (
    <section className="map-page">
      <LeafletMap buildings={filteredBuildings} selected={selectedBuilding} onSelect={setSelectedId} />

      <aside
        className="map-panel"
        aria-label="Panel pencarian bangunan"
      >
        <h1>Cari Masjid</h1>
        <p className="subtitle">Temukan masjid yang membutuhkan bantuan</p>

        <label className="field">
          <span className="search-control">
            <Search size={22} />
            <input
              className="control"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau desa..."
              type="search"
            />
          </span>
        </label>

        <label className="field">
          <span className="label">Filter Kondisi</span>
          <select className="control" value={condition} onChange={(event) => setCondition(event.target.value as typeof condition)}>
            {conditions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label">Provinsi</span>
          <select className="control" value={province} onChange={(event) => setProvince(event.target.value)}>
            <option value="ALL">Seluruh Indonesia</option>
            {provinces.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="divider" />
        <div className="result-count">Hasil Pencarian ({filteredBuildings.length})</div>

        <div className="result-list">
          {filteredBuildings.map((building) => (
            <button
              className={`result-card ${building.id === selectedBuilding?.id ? "active" : ""}`}
              key={building.id}
              type="button"
              onClick={() => setSelectedId(building.id)}
            >
              <h2>{building.name}</h2>
              <p>{building.address}</p>
              <span className={`badge ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}

