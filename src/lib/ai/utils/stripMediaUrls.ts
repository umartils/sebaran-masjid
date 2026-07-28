// utils/stripMediaUrls.ts

// Sesuaikan domain dengan yang kamu pakai (Cloudinary, S3, dsb)
const MEDIA_URL_PATTERN =
  /https?:\/\/res\.cloudinary\.com\/[^\s)]+|https?:\/\/[^\s)]+\.(mp4|mov|webm|jpg|jpeg|png|pdf)(\?[^\s)]*)?/gi;

export function stripMediaUrls(text: string): string {
  return text
    // hapus URL media, sisakan jejak minimal (opsional, biar tidak "menggantung")
    .replace(MEDIA_URL_PATTERN, "")
    // rapikan baris yang jadi kosong/redundan setelah URL dihapus
    // contoh: "Video 1: \nVideo 2: " -> baris kosong ganda
    .replace(/^(Video|Foto|Link|URL)\s*\d*:\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}