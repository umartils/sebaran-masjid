// lib/filters/userFilterFn.ts — logika filter dipisah agar testable
import type { DataUser } from "@/lib/types";

export function userFilterFn(
  item: DataUser,
  {
    query,
    categoryFilter,
    startDate,
    endDate,
  }: {
    query: string;
    categoryFilter: string;
    startDate: string;
    endDate: string;
  }
) {
  const q = query.toLowerCase();

  if (
    q &&
    ![item.name, item.role, item.userInput].some((f) =>
      f?.toLowerCase().includes(q)
    )
  )
    return false;

  if (
    categoryFilter &&
    categoryFilter !== "ALL" &&
    item.role !== categoryFilter
  )
    return false;

  if (startDate || endDate) {
    const createdAt = new Date(item.createdAt || "");
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (createdAt < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (createdAt > end) return false;
    }
  }

  return true;
}