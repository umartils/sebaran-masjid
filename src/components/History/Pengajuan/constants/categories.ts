import type { StatusMasjid } from "@/lib/types";

export const CATEGORY_OPTIONS: Array<{
  value: "ALL" | StatusMasjid;
  label: string;
}> = [
  {
    value: "ALL",
    label: "Semua Status",
  },
  {
    value: "APPROVED",
    label: "APPROVED",
  },
  {
    value: "PENDING",
    label: "PENDING",
  },
  {
    value: "REJECTED",
    label: "REJECTED",
  },
  // {
  //   value: "Terdampak_Bencana",
  //   label: "Terdampak Bencana",
  // },
];
