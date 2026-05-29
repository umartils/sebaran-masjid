"use client";

import { useMemo, useState } from "react";
import { kategoriLabel } from "@/lib/format";

import type {
  Masjid,
  KategoriMasjid,
} from "@/lib/types";

export function useFilterMasjid(
  buildings: Masjid[]
) {
  const [query, setQuery] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<"ALL" | KategoriMasjid>(
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
          building.nama
            .toLowerCase()
            .includes(q) ||
          building.alamat
            .toLowerCase()
            .includes(q) ||
          building.namaKota
            .toLowerCase()
            .includes(q) ||
          building.namaProvinsi
            .toLowerCase()
            .includes(q) ||
          kategoriLabel(
            building.kategori
          )
            .toLowerCase()
            .includes(q);

        const matchesCategory =
          categoryFilter === "ALL" ||
          building.kategori ===
            categoryFilter;

        const excludedData =
          building.statusPengajuan ===
            "DELETED" ||
          building.statusPengajuan ===
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