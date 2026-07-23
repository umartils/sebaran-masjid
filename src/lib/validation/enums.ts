import { z } from "zod";

export const kondisiSchema = z.enum([
    "LAYAK", 
    "RUSAK_RINGAN", 
    "RUSAK_SEDANG", 
    "RUSAK_BERAT"
]);

export const kategoriSchema = z.enum([
  "Pelosok_Pedalaman",
  "Kampung_Mualaf",
  "Muslim_Minoritas",
  "Terdampak_Bencana",
]);

export const pengajuanSchema = z.enum([
  "APPROVED",
  "REJECTED",
  "DELETED",
  "ON_AIR",
]);

export const roleSchema = z.enum([
  "Admin",
  "Relawan"
]);