import type { UserRole } from "@/lib/types";

export const CATEGORY_OPTIONS: Array<{
  value: "ALL" | UserRole;
  label: string;
}> = [
  {
    value: "ALL",
    label: "Semua Role",
  },
  {
    value: "Admin",
    label: "Admin",
  },
  {
    value: "Relawan",
    label: "Relawan",
  },
];