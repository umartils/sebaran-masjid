"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash,
} from "lucide-react";

import type { TrackingMasjidList } from "@/lib/types";
// import type { BuildingAction } from "./hooks/useApprovalPengajuan";

import styles from "./ListProgres.module.scss";

interface ProgresActionsProps {
  progres: TrackingMasjidList;

  // onAction: (
  //   progres: TrackingMasjidList,
  //   // action: BuildingAction
  // ) => void;
}

export default function ProgresActions({
  progres,
  // onAction,
}: ProgresActionsProps) {
  return (
    <div className={styles.tableActions}>
      {/* View */}
      <Link
        href={`/admin/dashboard/tracking/detail/${progres.id}`}
        className={`${styles.actionBtn} ${styles.actionBtnView}`}
        title="Lihat detail"
      >
        <Eye size={15} />
        <span>View</span>
      </Link>

      <Link
        href={`/masjid/edit/${progres.id}`}
        className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
        title="Edit data"
      >
        <Pencil size={15} />
        <span>Edit</span>
      </Link>
    </div>
  );
}