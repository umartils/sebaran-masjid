"use client";

import { memo } from "react";

import { kategoriLabel, statusTone } from "@/lib/format";
import type { Masjid } from "@/lib/types";

import { MapPinned } from "lucide-react";

import MasjidActions from "./MasjidActions";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

import styles from "../ListMasjid.module.scss";

interface BuildingRowProps {
  building: Masjid;

  onAction: (
    building: Masjid,
    action: BuildingAction
  ) => void;
}

function BuildingRow({
  building,
  onAction,
}: BuildingRowProps) {
  return (
    <tr>
      <td>
        <strong>{building.nama}</strong>

        <br />

        <span className={styles.tableAddress}>
          <MapPinned size={13} /> {building.alamat}
        </span>
      </td>

      <td>
        {building.namaKota},

        <br />

        <span className={styles.tableProvince}>
          {building.namaProvinsi}
        </span>
      </td>

      <td>
        {kategoriLabel(
          building.kategori
        )}
      </td>

      <td>
        {building.kapasitas
          ? `${building.kapasitas} Jamaah`
          : "-"}
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
        <MasjidActions
          building={building}
          onAction={onAction}
        />
      </td>
    </tr>
  );
}

export default memo(BuildingRow);