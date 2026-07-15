"use client";

import type { Masjid } from "@/lib/types";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

interface BuildingConfirmationModalProps {
  building: Masjid | null;
  actionType: BuildingAction | null;
  loading: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

export default function BuildingConfirmationModal({
  building,
  actionType,
  loading,
  onCancel,
  onConfirm,
}: BuildingConfirmationModalProps) {
  if (!building || !actionType) {
    return null;
  }

  const title =
    actionType === "APPROVED"
      ? "Approve Masjid"
      : actionType === "REJECTED"
      ? "Reject Masjid"
      : actionType === "ON_AIR"
      ? "Mulai Pembangunan Masjid"
      : "Hapus Masjid";

  const actionText =
    actionType === "APPROVED"
      ? "menyetujui"
      : actionType === "REJECTED"
      ? "menolak"
      : actionType === "ON_AIR"
      ? "mulai pembangunan"
      : "menghapus";

  const buttonText =
    actionType === "APPROVED"
      ? "Approve"
      : actionType === "REJECTED"
      ? "Reject"
      : actionType === "ON_AIR"
      ? "Start"
      : "Delete";

  const buttonClass =
    actionType === "APPROVED" || actionType === "ON_AIR"
      ? "btn-confirm--approve"
      : "btn-confirm--reject";

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{title}</h3>

        <p>
          Apakah Anda yakin ingin{" "}
          <strong>{actionText}</strong>{" "}
          masjid:
        </p>

        <div className="modal-building-name">
          {building.nama}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="button"
            className={`btn-confirm ${buttonClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}