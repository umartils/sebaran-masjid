"use client";

import { memo } from "react";

import { kategoriLabel, statusTone } from "@/lib/format";
import type { Masjid } from "@/lib/types";

import { MapPinned } from "lucide-react";

import MasjidActions from "./MasjidActions";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

import styles from "./HistoryPengajuan.module.scss";

interface BuildingRowProps {
  building: Masjid;
  pathname: string;

  onAction: (
    building: Masjid,
    action: BuildingAction
  ) => void;
}

function BuildingRow({
  building,
  onAction,
  pathname
}: BuildingRowProps) {
  return (
    <tr>
      <td>
        <strong>{building.nama}</strong>

        <br />

        <span className={styles.tableAddress}>
          <MapPinned className={styles.iconAddress} /> {building.alamat}
        </span>
      </td>

      <td>
        {building.namaKota},
        <br />
        <span className={styles.tableProvince}>{building.namaProvinsi}</span>
      </td>

      <td>{kategoriLabel(building.kategori)}</td>

      <td>{building.kapasitas ? `${building.kapasitas} Jamaah` : "-"}</td>

      <td>
        <span className={`badge ${statusTone(building.statusPengajuan)}`}>
          {building.statusPengajuan}
        </span>
      </td>

      <td>
        <MasjidActions
          building={building}
          onAction={onAction}
          pathname={pathname}
        />
      </td>
    </tr>
  );
}

export default memo(BuildingRow);