"use client";

import { useRef, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { KategoriMasjid } from "@/lib/types";
import { CATEGORY_OPTIONS } from "./constants/categories";
import styles from "../ListMasjid.module.scss";

interface FilterMasjidProps {
  query: string;
  categoryFilter: "ALL" | KategoriMasjid;
  totalCount: number;
  filteredCount: number;
  startDate: string;
  endDate: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: "ALL" | KategoriMasjid) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDateLabel(startDate: string, endDate: string) {
  if (startDate && endDate)
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  if (startDate) return `Dari ${formatDate(startDate)}`;
  if (endDate) return `S/d ${formatDate(endDate)}`;
  return "Semua tanggal";
}

export default function FilterMasjid({
  query,
  categoryFilter,
  totalCount,
  filteredCount,
  onQueryChange,
  onCategoryChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: FilterMasjidProps) {
  const hasFilter = query.trim() !== "" || categoryFilter !== "ALL";
  const hasDateFilter = startDate !== "" || endDate !== "";

  const [panelOpen, setPanelOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalStart(startDate);
  }, [startDate]);
  useEffect(() => {
    setLocalEnd(endDate);
  }, [endDate]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  function handleApply() {
    onStartDateChange(localStart);
    onEndDateChange(localEnd);
    setPanelOpen(false);
  }

  function handleReset() {
    setLocalStart("");
    setLocalEnd("");
    onStartDateChange("");
    onEndDateChange("");
  }

  return (
    <div className="table-controls">
      <label className="search-field">
        <Search size={18} className="search-icon" />
        <input
          type="search"
          className="search-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari nama, alamat, kota, provinsi, kategori..."
        />
      </label>

      <div className={styles.dropdownWrap} ref={panelRef}>
        <button
          type="button"
          className={`${styles.filterBtn} ${
            hasDateFilter ? styles.filterBtnActive : ""
          }`}
          onClick={() => setPanelOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={panelOpen}
        >
          <CalendarDays size={17} className={styles.filterBtnIcon} />
          <span className={styles.filterBtnLabel}>
            {getDateLabel(startDate, endDate)}
          </span>
          {panelOpen ? (
            <ChevronUp size={14} className={styles.filterBtnChevron} />
          ) : (
            <ChevronDown size={14} className={styles.filterBtnChevron} />
          )}
        </button>

        {panelOpen && (
          <div
            className={styles.datePanel}
            role="dialog"
            aria-label="Pilih rentang tanggal"
          >
            <p className={styles.datePanelTitle}>Rentang tanggal</p>

            <div className={styles.dateFields}>
              <div className={styles.dateField}>
                <label htmlFor="startDate">Dari</label>
                <input
                  id="startDate"
                  type="date"
                  value={localStart}
                  max={localEnd || undefined}
                  onChange={(e) => setLocalStart(e.target.value)}
                />
              </div>

              <div className={styles.dateSeparator}>sampai</div>

              <div className={styles.dateField}>
                <label htmlFor="endDate">Sampai</label>
                <input
                  id="endDate"
                  type="date"
                  value={localEnd}
                  min={localStart || undefined}
                  onChange={(e) => setLocalEnd(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.datePanelActions}>
              <button
                type="button"
                className={styles.btnReset}
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="button"
                className={styles.btnApply}
                onClick={handleApply}
              >
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className={styles.filterField}>
        <SlidersHorizontal size={18} className={styles.filterIcon} />
        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) =>
            onCategoryChange(e.target.value as "ALL" | KategoriMasjid)
          }
        >
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {(hasFilter || hasDateFilter) && (
        <span className={styles.resultCount}>
          {filteredCount} dari {totalCount} masjid
        </span>
      )}
    </div>
  );
}