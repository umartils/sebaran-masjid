"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  MapPin,
  Check,
  X,
  Trash,
} from "lucide-react";

import type { Masjid } from "@/lib/types";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

import styles from "./ListMasjid.module.scss";

interface UserActionsProps {
  building: Masjid;

  onAction: (
    building: Masjid,
    action: BuildingAction
  ) => void;
}

export default function UserActions({
  building,
  onAction,
}: UserActionsProps) {
  return (
    <div className={styles.tableActions}>
      {/* View */}
      {/* <Link
        href={`/masjid/detail/${building.id}?from=/admin/dashboard/masjid`}
        className={`${styles.actionBtn} ${styles.actionBtnView}`}
        title="Lihat detail"
      >
        <Eye size={15} />
        <span>View</span>
      </Link> */}

      {/* Approved Actions */}
      <Link
        href={`/admin/user/${building.id}/edit?from=/admin/user/list`}
        className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
        title="Edit data"
      >
        <Pencil size={15} />
        <span>Edit</span>
      </Link>
      <button
        type="button"
        onClick={() => onAction(building, "DELETED")}
        className={`${styles.actionBtn} ${styles.actionBtnReject}`}
        title="Hapus Data"
      >
        <Trash size={15} />
        <span>Hapus</span>
      </button>
    </div>
  );
}