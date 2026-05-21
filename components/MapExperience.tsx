"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building, BuildingCondition } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-screen min-h-[620px] w-full max-md:min-h-screen" />
});

const conditions: Array<{ value: "ALL" | BuildingCondition; label: string }> = [
  { value: "ALL", label: "Semua Kondisi" },
  { value: "RUSAK_BERAT", label: "Rusak Berat" },
  { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
  { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
  { value: "LAYAK", label: "Layak" }
];

const fieldClass = "mb-3 grid gap-[3px]";
const labelClass = "text-[15px] font-semibold text-slate-700";
const controlClass =
  "min-h-[54px] w-full rounded-lg border border-line bg-white px-[18px] text-slate-700 outline-0";
const badgeClass =
  "inline-flex min-h-5 items-center rounded-full px-[15px] py-1.5 text-[10px] font-medium";

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
    <section className="relative min-h-screen overflow-hidden">
      <LeafletMap buildings={filteredBuildings} selected={selectedBuilding} onSelect={setSelectedId} />

      <aside
        className="absolute bottom-[25px] left-2.5 top-[25px] z-[450] w-[min(430px,calc(100vw-132px))] overflow-auto rounded-[18px] bg-white/[0.96] p-[30px] shadow-[0_24px_60px_rgba(15,23,42,0.12)] max-md:bottom-3.5 max-md:left-5 max-md:right-5 max-md:top-auto max-md:max-h-[48vh] max-md:w-auto max-md:rounded-[14px]"
        aria-label="Panel pencarian bangunan"
      >
        <h1 className="m-0 text-[23px] leading-[1.15] max-md:text-[28px]">Cari Masjid</h1>
        <p className="mb-7 mt-1 text-base text-muted max-md:mb-[22px] max-md:text-lg">Temukan masjid yang membutuhkan bantuan</p>

        <label className={fieldClass}>
          <span className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
            <input
              className={`${controlClass} pl-[50px]`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau desa..."
              type="search"
            />
          </span>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>Filter Kondisi</span>
          <select className={controlClass} value={condition} onChange={(event) => setCondition(event.target.value as typeof condition)}>
            {conditions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>Provinsi</span>
          <select className={controlClass} value={province} onChange={(event) => setProvince(event.target.value)}>
            <option value="ALL">Seluruh Indonesia</option>
            {provinces.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="my-0 mb-5 mt-[34px] h-px bg-line" />
        <div className="text-base font-bold text-muted">Hasil Pencarian ({filteredBuildings.length})</div>

        <div className="mt-3.5 grid gap-2.5">
          {filteredBuildings.map((building) => (
            <button
              className={`w-full rounded-lg border bg-white p-5 text-left ${
                building.id === selectedBuilding?.id ? "border-brand" : "border-line"
              }`}
              key={building.id}
              type="button"
              onClick={() => setSelectedId(building.id)}
            >
              <h2 className="mb-1.5 mt-0 text-lg leading-[1.2]">{building.name}</h2>
              <p className="mb-3 mt-0 text-sm text-muted">{building.address}</p>
              <span className={`${badgeClass} ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}

