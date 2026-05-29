import type { ProgresStatus } from "@/lib/types";

export const CATEGORY_OPTIONS: Array<{
  value: "ALL" | ProgresStatus;
  label: string;
}> = [
  {
    value: "ALL",
    label: "Semua Status",
  },
  {
    value: "ON_PROGRESS",
    label: "On Progres",
  },
  {
    value: "SELESAI",
    label: "Selesai",
  },
];