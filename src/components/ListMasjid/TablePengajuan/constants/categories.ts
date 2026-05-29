import type { KategoriMasjid } from "@/lib/types";

export const CATEGORY_OPTIONS: Array<{
  value: "ALL" | KategoriMasjid;
  label: string;
}> = [
  {
    value: "ALL",
    label: "Semua Kategori",
  },
  {
    value: "Pelosok_Pedalaman",
    label: "Pelosok Pedalaman",
  },
  {
    value: "Muslim_Minoritas",
    label: "Muslim Minoritas",
  },
  {
    value: "Kampung_Mualaf",
    label: "Kampung Mualaf",
  },
  {
    value: "Terdampak_Bencana",
    label: "Terdampak Bencana",
  },
];