"use client";

import { useRef, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import styles from "./FilterBar.module.scss";

export interface SelectOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  // Search
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder?: string;

  // Date range
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;

  // Select (opsional)
  selectOptions?: SelectOption[];
  selectValue?: string;
  onSelectChange?: (value: string) => void;
  selectPlaceholder?: string;

  // Result count (opsional)
  totalCount?: number;
  filteredCount?: number;
  entityLabel?: string;
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

export default function FilterBar({
  query,
  onQueryChange,
  searchPlaceholder = "Cari...",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectOptions,
  selectValue,
  onSelectChange,
  totalCount,
  filteredCount,
  entityLabel = "data",
}: FilterBarProps) {
  const hasSelect = Boolean(selectOptions && onSelectChange);
  const hasDateFilter = startDate !== "" || endDate !== "";
  const hasQueryFilter = query.trim() !== "";
  const hasSelectFilter = Boolean(
    selectValue && selectOptions?.find((o) => o.value === selectValue && o.value !== selectOptions[0].value)
  );
  const showCount =
    totalCount !== undefined &&
    filteredCount !== undefined &&
    (hasQueryFilter || hasDateFilter || hasSelectFilter);

  const [panelOpen, setPanelOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalStart(startDate); }, [startDate]);
  useEffect(() => { setLocalEnd(endDate); }, [endDate]);

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
    <div className={styles.filterBar}>
      {/* Search */}
      <label className={styles.searchField}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </label>

      {/* Date range dropdown */}
      <div className={styles.dropdownWrap} ref={panelRef}>
        <button
          type="button"
          className={`${styles.filterBtn} ${hasDateFilter ? styles.filterBtnActive : ""}`}
          onClick={() => setPanelOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={panelOpen}
        >
          <CalendarDays size={17} className={styles.filterBtnIcon} />
          <span className={styles.filterBtnLabel}>
            {getDateLabel(startDate, endDate)}
          </span>
          {panelOpen
            ? <ChevronUp size={14} className={styles.filterBtnChevron} />
            : <ChevronDown size={14} className={styles.filterBtnChevron} />
          }
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
                <label htmlFor="filterbar-start">Dari</label>
                <input
                  id="filterbar-start"
                  type="date"
                  value={localStart}
                  max={localEnd || undefined}
                  onChange={(e) => setLocalStart(e.target.value)}
                />
              </div>

              <div className={styles.dateSeparator}>sampai</div>

              <div className={styles.dateField}>
                <label htmlFor="filterbar-end">Sampai</label>
                <input
                  id="filterbar-end"
                  type="date"
                  value={localEnd}
                  min={localStart || undefined}
                  onChange={(e) => setLocalEnd(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.datePanelActions}>
              <button type="button" className={styles.btnReset} onClick={handleReset}>
                Reset
              </button>
              <button type="button" className={styles.btnApply} onClick={handleApply}>
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Select (opsional) */}
      {hasSelect && (
        <div className={styles.filterField}>
          <SlidersHorizontal size={18} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={selectValue}
            onChange={(e) => onSelectChange!(e.target.value)}
          >
            {/* {selectPlaceholder && (
              <option value="ALL">{selectPlaceholder}</option>
            )} */}
            {selectOptions!.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Result count */}
      {showCount && (
        <span className={styles.resultCount}>
          {filteredCount} dari {totalCount} {entityLabel}
        </span>
      )}
    </div>
  );
}