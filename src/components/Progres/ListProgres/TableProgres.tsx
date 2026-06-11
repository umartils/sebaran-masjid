"use client";
import type {
  TrackingMasjidList,
} from "@/lib/types";
import { useSession } from "next-auth/react";

import { usePagination } from "@/hooks/usePagination";
import ProgresRow from "./ProgresRow";

import styles from "./ListProgres.module.scss";

// Global Filter
import FilterBar from "@/components/UI/FilterBar/FilterBar";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useFilteredData } from "@/hooks/useFilteredData";
import { progresFilterFn } from "@/lib/filters/progresFilterFn";

import { CATEGORY_OPTIONS } from "./constants/categories";
import { ProgresStatus } from "@/lib/types";

type Props = {
  progres: TrackingMasjidList[];
};

export function TablePengajuan({ progres }: Props) {
  const { data: session } = useSession();
  const {
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useTableFilters<"ALL" | ProgresStatus>({ defaultCategory: "ALL" });

  const filtered = useFilteredData({
    data: progres,
    query,
    categoryFilter,
    startDate,
    endDate,
    filterFn: progresFilterFn,
  });

  const { page, pageSize, totalPages, paginatedData, setPage, setPageSize } =
    usePagination(filtered);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari nama, alamat, kota, provinsi..."
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        selectOptions={CATEGORY_OPTIONS}
        selectValue={categoryFilter}
        onSelectChange={(v) => setCategoryFilter(v as ProgresStatus)}
        filteredCount={filtered.length}
        totalCount={progres.length}
        entityLabel="masjid"
      />

      <div className={styles.adminTableWrap}>
        <div className={styles.paginationTop}>
          <div className={styles.pageSize}>
            <span>Tampilkan</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>data</span>
          </div>
        </div>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Nama Masjid</th>
              <th>Wilayah</th>
              <th>Status</th>
              <th>Persentase</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.tableEmpty}>
                  Tidak ada masjid yang sesuai dengan pencarian.
                </td>
              </tr>
            ) : (
              paginatedData.map((progres) => (
                <ProgresRow
                  key={progres.id}
                  progres={progres}
                  // onAction={openConfirmation}
                />
              ))
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className={styles.pageIndicator}>
            Halaman {page} dari {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {/* <ConfirmationModal
        building={selectedMasjid}
        actionType={actionType}
        loading={loading}
        onCancel={closeConfirmation}
        onConfirm={handleUpdateStatus}
      /> */}
    </>
  );
}