"use client";

import { useMemo } from "react";

import { kategoriLabel } from "@/lib/format";

import type {
  Masjid,
  KategoriMasjid,
} from "@/lib/types";

import type { DateRangeFilter } from "./useMasjidFilters";

export function useFilterMasjid(
  buildings: Masjid[],
  query: string,
  categoryFilter: "ALL" | KategoriMasjid,
  dateFilter: DateRangeFilter
) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return buildings.filter((building) => {
      const matchesQuery =
        !q ||
        building.nama.toLowerCase().includes(q) ||
        building.alamat.toLowerCase().includes(q) ||
        building.namaKota.toLowerCase().includes(q) ||
        building.namaProvinsi.toLowerCase().includes(q) ||
        kategoriLabel(building.kategori)
          .toLowerCase()
          .includes(q) ||
        building.statusPengajuan
          .toLowerCase()
          .includes(q);

      const matchesCategory =
        categoryFilter === "ALL" ||
        building.kategori === categoryFilter;

      const updatedAt = new Date(
        building.updatedAt
      );

      const now = new Date();

      let matchesDate = true;

      switch (dateFilter) {
        case "TODAY":
          matchesDate =
            updatedAt.toDateString() ===
            now.toDateString();
          break;

        case "WEEK":
          const weekAgo = new Date();
          weekAgo.setDate(
            now.getDate() - 7
          );

          matchesDate =
            updatedAt >= weekAgo;
          break;

        case "MONTH":
          matchesDate =
            updatedAt.getMonth() ===
              now.getMonth() &&
            updatedAt.getFullYear() ===
              now.getFullYear();
          break;

        case "YEAR":
          matchesDate =
            updatedAt.getFullYear() ===
            now.getFullYear();
          break;

        default:
          matchesDate = true;
      }

      return (
        matchesQuery &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    buildings,
    query,
    categoryFilter,
    dateFilter,
  ]);

  return filtered;
}