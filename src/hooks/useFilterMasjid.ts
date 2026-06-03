"use client";

import { useMemo, useState } from "react";

import { kategoriLabel } from "@/lib/format";

import type { Masjid, KategoriMasjid } from "@/lib/types";

export function useFilterMasjid(
  buildings: Masjid[],
  query: string,
  categoryFilter: "ALL" | KategoriMasjid,
  startDate: string,
  endDate: string
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
        kategoriLabel(building.kategori).toLowerCase().includes(q) ||
        building.statusPengajuan.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" || building.kategori === categoryFilter;

      let matchesDate = true;

      if (startDate || endDate) {
        const updatedAt = new Date(building.updatedAt);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);

          matchesDate = matchesDate && updatedAt >= start;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);

          matchesDate = matchesDate && updatedAt <= end;
        }
      }

      return matchesQuery && matchesCategory && matchesDate;
    });
  }, [buildings, query, categoryFilter, startDate, endDate]);

  return filtered;
}