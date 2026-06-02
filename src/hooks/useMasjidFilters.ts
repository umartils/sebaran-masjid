// hooks/useMasjidFilters.ts

"use client";

import { useState } from "react";
import type { KategoriMasjid } from "@/lib/types";

export type DateRangeFilter =
  | "ALL"
  | "TODAY"
  | "WEEK"
  | "MONTH"
  | "YEAR";

export function useMasjidFilters() {
  const [query, setQuery] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<"ALL" | KategoriMasjid>("ALL");

  const [dateFilter, setDateFilter] =
    useState<DateRangeFilter>("ALL");

  return {
    query,
    setQuery,

    categoryFilter,
    setCategoryFilter,

    dateFilter,
    setDateFilter,
  };
}