"use client";
import type {
  User,
} from "@/lib/types";
import { useSession } from "next-auth/react";

// Import Hooks
import { useApprovalPengajuan } from "./hooks/useApprovalPengajuan";
import { usePagination } from "@/hooks/usePagination";

import UserRow from "./UserRow";
import ConfirmationModal from "./ConfirmationModal";

import styles from "./ListMasjid.module.scss";
import { CATEGORY_OPTIONS } from "./constants/categories";
import type { UserRole } from "@/lib/types";

// Global Filter
import FilterBar from "@/components/UI/FilterBar/FilterBar";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useFilteredData } from "@/hooks/useFilteredData";
import { userFilterFn } from "@/lib/filters/userFilterFn";


type Props = {
  user: User[];
};

export function TableUser({ user }: Props) {
  const { data: session } = useSession();

  const {
    selectedMasjid,
    actionType,
    loading,
    toast,
    openConfirmation,
    closeConfirmation,
    handleUpdateStatus,
  } = useApprovalPengajuan(session?.user?.name ?? "");

  const {
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useTableFilters<"ALL" | UserRole>({ defaultCategory: "ALL" });

  const filtered = useFilteredData({
    data: user,
    query,
    categoryFilter,
    startDate,
    endDate,
    filterFn: userFilterFn,
  });

  const { page, pageSize, totalPages, paginatedData, setPage, setPageSize } =
    usePagination(filtered);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari nama, role, user input"
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        selectOptions={CATEGORY_OPTIONS}
        selectValue={categoryFilter}
        onSelectChange={(v) => setCategoryFilter(v as UserRole)}
        filteredCount={filtered.length}
        totalCount={user.length}
        entityLabel="user"
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
              <th>Nama User</th>
              <th>Email</th>
              <th>Nomor Telepon</th>
              <th>Role</th>
              <th>User Input</th>
              {/* <th>Aksi</th> */}
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
              paginatedData.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
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
      <ConfirmationModal
        building={selectedMasjid}
        actionType={actionType}
        loading={loading}
        onCancel={closeConfirmation}
        onConfirm={handleUpdateStatus}
      />

      {toast.show && (
        <div
          className={`custom-toast ${
            toast.type === "success"
              ? "custom-toast--success"
              : "custom-toast--error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}