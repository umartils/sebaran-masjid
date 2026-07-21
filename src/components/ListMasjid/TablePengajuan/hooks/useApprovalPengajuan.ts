"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Masjid } from "@/lib/types";

export type BuildingAction =
  | "APPROVED"
  | "REJECTED"
  | "DELETED"
  | "ON_AIR";

interface ToastState {
  show: boolean;
  type: "success" | "error";
  message: string;
}

interface UpdateStatusParams {
  approvedBy?: string;
  idApproval?: string;
} 

export function useApprovalPengajuan( approvedBy?: string, idApproval?: string) {
  const router = useRouter();

  const [selectedMasjid, setSelectedMasjid] =
    useState<Masjid | null>(null);

  const [actionType, setActionType] =
    useState<BuildingAction | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState<ToastState>({
      show: false,
      type: "success",
      message: "",
    });

  function showToast(
    message: string,
    type: "success" | "error" = "success"
  ) {
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

  function openConfirmation(
    masjid: Masjid,
    action: BuildingAction
  ) {
    setSelectedMasjid(masjid);
    setActionType(action);
  }

  function closeConfirmation() {
    setSelectedMasjid(null);
    setActionType(null);
  }

  async function handleUpdateStatus() {
    if (!selectedMasjid || !actionType) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/buildings/${selectedMasjid.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: actionType,
            approvedBy,
            idApproval
          }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengubah status"
        );
      }

      const successMessage =
        actionType === "APPROVED"
          ? "Masjid berhasil disetujui"
          : actionType === "REJECTED"
          ? "Masjid berhasil ditolak"
          : actionType === "ON_AIR"
          ? "Pembangunan Masjid Dimulai"
          : "Masjid berhasil dihapus";

      showToast(successMessage);

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);

      showToast(
        "Terjadi kesalahan saat memperbarui data",
        "error"
      );
    } finally {
      setLoading(false);
      closeConfirmation();
    }
  }

  return {
    selectedMasjid,
    actionType,
    loading,
    toast,

    openConfirmation,
    closeConfirmation,
    handleUpdateStatus,
    showToast,
  };
}