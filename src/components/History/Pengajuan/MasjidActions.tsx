"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  MapPin,
} from "lucide-react";

import type { Masjid } from "@/lib/types";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

import styles from "./HistoryPengajuan.module.scss";

interface MasjidActionsProps {
  building: Masjid;
  pathname: string;

  onAction: (
    building: Masjid,
    action: BuildingAction
  ) => void;
}

export default function MasjidActions({
  building,
  onAction,
  pathname
}: MasjidActionsProps) {
  return (
    <div className={styles.tableActions}>
      {/* View */}
      <Link
        href={`/masjid/detail/${building.id}`}
        className={`${styles.actionBtn} ${styles.actionBtnView}`} 
        title="Lihat detail"
      >
        <Eye size={15} />
        <span>View</span>
      </Link>

      {/* Pending Actions */}
      {/* {building.statusPengajuan === "PENDING" && (
        <>
          <button
            type="button"
            onClick={() =>
              onAction(
                building,
                "APPROVED"
              )
            }
            className={`${styles.actionBtn} ${styles.actionBtnApprove}`}
            title="Setujui masjid ini"
          >
            <Check size={15} />
            <span>Approve</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onAction(
                building,
                "REJECTED"
              )
            }
            className={`${styles.actionBtn} ${styles.actionBtnReject}`}
            title="Tolak masjid ini"
          >
            <X size={15} />
            <span>Reject</span>
          </button>
        </>
      )} */}

      {/* Approved Actions */}
      {building.statusPengajuan ===
        "APPROVED" && (
        <>
          <Link
            href={`/masjid/edit/${building.id}?from=/history/pengajuan`}
            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
            title="Edit data"
          >
            <Pencil size={15} />
            <span>Edit</span>
          </Link>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${building.latitude},${building.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.actionBtn} ${styles.actionBtnMaps}`}
            title="Buka di Google Maps"
          >
            <MapPin size={15} />
            <span>Maps</span>
          </a>

          {/* <button
            type="button"
            onClick={() =>
              onAction(
                building,
                "DELETED"
              )
            }
            className={`${styles.actionBtn} ${styles.actionBtnReject}`}
            title="Hapus Data"
          >
            <Trash size={15} />
            <span>Hapus</span>
          </button> */}
        </>
      )}
    </div>
  );
}