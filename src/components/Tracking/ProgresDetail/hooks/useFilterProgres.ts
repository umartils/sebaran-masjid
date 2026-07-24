"use client";

import { useMemo, useState } from "react";
import { kategoriLabel } from "@/lib/format";

import type {
  TrackingMasjidList,
  ProgresStatus,
} from "@/lib/types";

export function useFilterProgres(
  buildings: TrackingMasjidList[]
) {
  const [query, setQuery] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<"ALL" | ProgresStatus>(
      "ALL"
    );

  const filtered = useMemo(() => {
    const q = query
      .toLowerCase()
      .trim();

    return buildings.filter(
      (building) => {
        const matchesQuery =
          !q ||
          building.masjid.nama
            .toLowerCase()
            .includes(q) ||
          building.masjid.alamat
            .toLowerCase()
            .includes(q) ||
          building.masjid.namaKota
            .toLowerCase()
            .includes(q) ||
          building.masjid.namaProvinsi
            .toLowerCase()
            .includes(q) ||
          kategoriLabel(
            building.masjid.kategori
          )
            .toLowerCase()
            .includes(q);

        const matchesCategory =
          categoryFilter === "ALL" ||
          building.status ===
            categoryFilter;

        const excludedData =
          building.masjid.statusPengajuan ===
            "DELETED" ||
          building.masjid.statusPengajuan ===
            "REJECTED";

        return (
          matchesQuery &&
          matchesCategory &&
          !excludedData
        );
      }
    );
  }, [
    buildings,
    query,
    categoryFilter,
  ]);

  const hasFilter =
    query.trim() !== "" ||
    categoryFilter !== "ALL";

  return {
    query,
    setQuery,

    categoryFilter,
    setCategoryFilter,

    filtered,
    hasFilter,
  };
}