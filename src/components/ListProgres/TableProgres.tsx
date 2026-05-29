"use client";
import type {
  TrackingMasjidList,
} from "@/lib/types";
import { useSession } from "next-auth/react";

// Import Hooks
// import { useApprovalPengajuan } from "./hooks/useApprovalPengajuan";
import { useFilterProgres } from "./hooks/useFilterProgres";
import { usePagination } from "./hooks/usePagination";

import FilterMasjid from "./FilterMasjid";
import ProgresRow from "./ProgresRow";
// import ConfirmationModal from "./ConfirmationModal";

import styles from "./ListProgres.module.scss";


type Props = {
  progres: TrackingMasjidList[];
};

export function TablePengajuan({ progres }: Props) {
  const { data: session } = useSession();
  // const {
  //   selectedMasjid,
  //   actionType,
  //   loading,
  //   toast,
  //   openConfirmation,
  //   closeConfirmation,
  //   handleUpdateStatus,
  // } = useApprovalPengajuan(session?.user?.name ?? "");

  const {
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    filtered,
    hasFilter,
  } = useFilterProgres(
    progres
  );

  const {
    page,
    pageSize,
    totalPages,
    paginatedData,
    setPage,
    setPageSize,
    } = usePagination(filtered);


  return (
    <>
      {/* Search & Filter Bar */}
      <FilterMasjid
        query={query}
        categoryFilter={
            categoryFilter
        }
        totalCount={
            progres.length
        }
        filteredCount={
            filtered.length
        }
        onQueryChange={setQuery}
        onCategoryChange={
            setCategoryFilter
        }
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
            onClick={() =>
            setPage(page - 1)
            }
        >
            Prev
        </button>

        <span className={styles.pageIndicator}>
            Halaman {page} dari{" "}
            {totalPages}
        </span>

        <button
            type="button"
            disabled={
            page === totalPages
            }
            onClick={() =>
            setPage(page + 1)
            }
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