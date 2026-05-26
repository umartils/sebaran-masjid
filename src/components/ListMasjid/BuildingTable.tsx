"use client";

import { conditionLabel, conditionTone, statusTone, statusLabel } from "@/lib/format";
import { Search, SlidersHorizontal, Eye, Pencil, MapPin, Check, X, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { Masjid, KondisiMasjid, StatusMasjid } from "@/lib/types";
import { useRouter } from "next/navigation";
// import { MasjidStatus } from "@/generated/prisma/enums";

const conditions: Array<{ value: "ALL" | KondisiMasjid; label: string }> = [
  { value: "ALL", label: "Semua Kondisi" },
  { value: "RUSAK_BERAT", label: "Rusak Berat" },
  { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
  { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
  { value: "LAYAK", label: "Layak" },
];
type Props = {
  buildings: Masjid[];
};

export function BuildingTable({ buildings }: Props) {
  const router = useRouter();

  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });
  const [query, setQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"ALL" | KondisiMasjid>(
    "ALL"
  );

  // Approval state
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [actionType, setActionType] = useState<
    "APPROVED" | "REJECTED" | "DELETED" | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Approval function
  const openConfirmation = (
    building: Masjid,
    action: "APPROVED" | "REJECTED" | "DELETED"
  ) => {
    setSelectedMasjid(building);
    setActionType(action);
  };

  const closeConfirmation = () => {
    setSelectedMasjid(null);
    setActionType(null);
  };

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  }

  const handleUpdateStatus = async () => {
    if (!selectedMasjid || !actionType) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/buildings/${selectedMasjid.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: actionType,
          }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengubah status");
      }

      const successMessage =
        actionType === "APPROVED"
          ? "Masjid berhasil disetujui"
          : actionType === "REJECTED"
          ? "Masjid berhasil ditolak"
          : "Masjid berhasil dihapus";

      showToast(successMessage, "success");

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan saat memperbarui data", "error");
    } finally {
      setLoading(false);
      closeConfirmation();
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return buildings.filter((b) => {
      const matchesQuery =
        !q ||
        b.nama.toLowerCase().includes(q) ||
        b.alamat.toLowerCase().includes(q) ||
        b.namaKota.toLowerCase().includes(q) ||
        b.namaProvinsi.toLowerCase().includes(q) ||
        conditionLabel(b.kondisi).toLowerCase().includes(q);

      const matchesCondition =
        conditionFilter == "ALL" || b.kondisi === conditionFilter;

      const excludedData =
        b.statusPengajuan === "DELETED" || b.statusPengajuan === "REJECTED";

      return matchesQuery && matchesCondition && !excludedData;
    });
  }, [buildings, query, conditionFilter]);

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="table-controls">
        <label className="search-field">
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, alamat, kota, kabupaten, kondisi..."
            type="search"
          />
        </label>

        <div className="filter-field">
          <SlidersHorizontal size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={conditionFilter}
            onChange={(e) =>
              setConditionFilter(e.target.value as typeof conditionFilter)
            }
          >
            {conditions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {(query || conditionFilter !== "ALL") && (
          <span className="result-count">
            {filtered.length} dari {buildings.length} masjid
          </span>
        )}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Masjid</th>
              <th>Wilayah</th>
              <th>Kondisi</th>
              <th>Kapasitas</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  Tidak ada masjid yang sesuai dengan pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((building) => (
                <tr key={building.id}>
                  <td>
                    <strong>{building.nama}</strong>
                    <br />
                    <span className="table-address">{building.alamat}</span>
                  </td>
                  <td>
                    {building.namaKota},<br />
                    <span className="table-province">
                      {building.namaProvinsi}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${conditionTone(building.kondisi)}`}
                    >
                      {conditionLabel(building.kondisi)}
                    </span>
                  </td>
                  <td>
                    {building.kapasitas ? `${building.kapasitas} Jamaah` : "-"}
                  </td>
                  <td>
                    <span
                      className={`badge ${statusTone(
                        building.statusPengajuan
                      )}`}
                    >
                      {building.statusPengajuan}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {/* View */}
                      <a
                        href={`/masjid/${building.id}`}
                        className="action-btn action-btn--view"
                        title="Lihat detail"
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </a>
                      {building.statusPengajuan === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => openConfirmation(building, "APPROVED")}
                          className="action-btn action-btn--approve"
                          title="Setujui masjid ini"
                        >
                          <Check size={15} />
                          <span>Approve</span>
                        </button>
                      )}
                      {building.statusPengajuan === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => openConfirmation(building, "REJECTED")}
                          className="action-btn action-btn--reject"
                          title="Tolak masjid ini"
                        >
                          <X size={15} />
                          <span>Reject</span>
                        </button>
                      )}

                      {building.statusPengajuan === "APPROVED" && (
                        <a
                          href={`/admin/buildings/${building.id}/edit`}
                          className="action-btn action-btn--edit"
                          title="Edit data"
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </a>
                      )}
                      {building.statusPengajuan === "APPROVED" && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${building.latitude},${building.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn action-btn--maps"
                          title="Buka di Google Maps"
                        >
                          <MapPin size={15} />
                          <span>Maps</span>
                        </a>
                      )}
                      {building.statusPengajuan === "APPROVED" && (
                        <button
                          type="button"
                          onClick={() => openConfirmation(building, "DELETED")}
                          className="action-btn action-btn--reject"
                          title="Hapus Data"
                        >
                          <Trash size={15} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {selectedMasjid && actionType && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>
              {actionType === "APPROVED"
                ? "Approve Masjid"
                : actionType === "DELETED"
                ? "Hapus Masjid"
                : "Reject Masjid"}
            </h3>

            <p>
              Apakah Anda yakin ingin{" "}
              <strong>
                {actionType === "APPROVED"
                  ? "menyetujui"
                  : actionType === "DELETED"
                  ? "menghapus"
                  : "menolak"}
              </strong>{" "}
              masjid:
            </p>

            <div className="modal-building-name">{selectedMasjid.nama}</div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={closeConfirmation}
                disabled={loading}
              >
                Batal
              </button>

              <button
                type="button"
                className={`btn-confirm ${
                  actionType === "APPROVED"
                    ? "btn-confirm--approve"
                    : actionType === "DELETED"
                    ? "btn-confirm--reject"
                    : "btn-confirm--reject"
                }`}
                onClick={handleUpdateStatus}
                disabled={loading}
              >
                {loading
                  ? "Memproses..."
                  : actionType === "APPROVED"
                  ? "Approve"
                  : actionType === "DELETED"
                  ? "Delete"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

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