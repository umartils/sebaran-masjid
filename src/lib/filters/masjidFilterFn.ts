// lib/filters/masjidFilterFn.ts — logika filter dipisah agar testable
import type { Masjid } from "@/lib/types";
import { start } from "repl";

export function masjidFilterFn(
  item: Masjid,
  { query, categoryFilter, startDate, endDate }: {
    query: string;
    categoryFilter: string;
    startDate: string;
    endDate: string;
  }
) {
  const q = query.toLowerCase();

  if (q && ![item.nama, item.alamat, item.namaKota, item.namaProvinsi, item.kategori]
    .some((f) => f?.toLowerCase().includes(q))) return false;

  if (categoryFilter && categoryFilter !== "ALL" && item.kategori !== categoryFilter)
    return false;

   if (startDate || endDate) {
    const updatedAt = new Date(item.updatedAt);   
    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (updatedAt < start) return false;
    }   
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (updatedAt > end) return false;
    }
   }

  return true;
}