"use client";

import { conditionLabel, conditionTone, statusTone, statusLabel } from "@/lib/format";
import { Search, SlidersHorizontal, Eye, Pencil, MapPin, Check, X, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { Building, BuildingCondition, BuildingStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
// import { BuildingStatus } from "@/generated/prisma/enums";

const conditions: Array<{ value: "ALL" | BuildingCondition; label: string }> = [
  { value: "ALL", label: "Semua Kondisi" },
  { value: "RUSAK_BERAT", label: "Rusak Berat" },
  { value: "RUSAK_SEDANG", label: "Rusak Sedang" },
  { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
  { value: "LAYAK", label: "Layak" },
];
type Props = {
  buildings: Building[];
};

export function BuildingTable({ buildings }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<
    "ALL" | BuildingCondition
  >("ALL");

  // Approval state
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [actionType, setActionType] = useState<
    "APPROVED" | "REJECTED" | "DELETED" | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Approval function
  const openConfirmation = (
    building: Building,
    action: "APPROVED" | "REJECTED" | "DELETED"
  ) => {
    setSelectedBuilding(building);
    setActionType(action);
  };

  const closeConfirmation = () => {
    setSelectedBuilding(null);
    setActionType(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBuilding || !actionType) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/buildings/${selectedBuilding.id}/status`,
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

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
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
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.regencyName.toLowerCase().includes(q) ||
        b.provinceName.toLowerCase().includes(q) ||
        conditionLabel(b.condition).toLowerCase().includes(q);

      const matchesCondition =
        conditionFilter == "ALL" || b.condition === conditionFilter;

      const excludedData =
        b.buildingStatus === "DELETED" || b.buildingStatus === "REJECTED";

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
                    <strong>{building.name}</strong>
                    <br />
                    <span className="table-address">{building.address}</span>
                  </td>
                  <td>
                    {building.regencyName},<br />
                    <span className="table-province">
                      {building.provinceName}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${conditionTone(building.condition)}`}
                    >
                      {conditionLabel(building.condition)}
                    </span>
                  </td>
                  <td>
                    {building.capacity ? `${building.capacity} Jamaah` : "-"}
                  </td>
                  <td>
                    <span
                      className={`badge ${statusTone(building.buildingStatus)}`}
                    >
                      {building.buildingStatus}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {building.buildingStatus === "PENDING" && (
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
                      {building.buildingStatus === "PENDING" && (
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
                      {/* View */}
                      {building.buildingStatus === "APPROVED" && (
                        <a
                          href={`/admin/buildings/${building.id}`}
                          className="action-btn action-btn--view"
                          title="Lihat detail"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </a>
                      )}
                      {building.buildingStatus === "APPROVED" && (
                        <a
                          href={`/admin/buildings/${building.id}/edit`}
                          className="action-btn action-btn--edit"
                          title="Edit data"
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </a>
                      )}
                      {building.buildingStatus === "APPROVED" && (
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
                      {building.buildingStatus === "APPROVED" && (
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
      {selectedBuilding && actionType && (
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

            <div className="modal-building-name">{selectedBuilding.name}</div>

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
    </>
  );
}