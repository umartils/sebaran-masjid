"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import type { KategoriMasjid } from "@/lib/types";

import { CATEGORY_OPTIONS } from "./constants/categories";

import styles from "../ListMasjid.module.scss";

interface FilterMasjidProps {
  query: string;

  categoryFilter:
    | "ALL"
    | KategoriMasjid;

  totalCount: number;

  filteredCount: number;

  onQueryChange: (
    value: string
  ) => void;

  onCategoryChange: (
    value:
      | "ALL"
      | KategoriMasjid
  ) => void;
}

export default function FilterMasjid({
  query,
  categoryFilter,
  totalCount,
  filteredCount,
  onQueryChange,
  onCategoryChange,
}: FilterMasjidProps) {
  const hasFilter =
    query.trim() !== "" ||
    categoryFilter !== "ALL";

  return (
    <div className={styles.tableControls}>
      <label className={styles.searchField}>
        <Search
          size={18}
          className={
            styles.searchIcon
          }
        />

        <input
          type="search"
          className={
            styles.searchInput
          }
          value={query}
          onChange={(e) =>
            onQueryChange(
              e.target.value
            )
          }
          placeholder="Cari nama, alamat, kota, provinsi, kategori..."
        />
      </label>

      <div className={styles.filterField}>
        <SlidersHorizontal
          size={18}
          className={
            styles.filterIcon
          }
        />

        <select
          className={
            styles.filterSelect
          }
          value={categoryFilter}
          onChange={(e) =>
            onCategoryChange(
              e.target.value as
                | "ALL"
                | KategoriMasjid
            )
          }
        >
          {CATEGORY_OPTIONS.map(
            (item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            )
          )}
        </select>
      </div>

      {hasFilter && (
        <span
          className={
            styles.resultCount
          }
        >
          {filteredCount} dari{" "}
          {totalCount} masjid
        </span>
      )}
    </div>
  );
}