// hooks/useMasjidFilters.ts

"use client";

import { useState } from "react";
import type { KategoriMasjid } from "@/lib/types";

export function useMasjidFilters() {
  const [query, setQuery] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<"ALL" | KategoriMasjid>("ALL");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return {
    query,
    setQuery,

    categoryFilter,
    setCategoryFilter,

    startDate,
    setStartDate,

    endDate,
    setEndDate,
  };
}