// utils/stripMediaUrls.ts
const MEDIA_DOMAIN = /res\.cloudinary\.com/i;

export function stripMediaUrls(text: string): string {
  return text
    // 1. Hapus markdown image syntax: ![alt](url)
    .replace(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g, (match, url) =>
      MEDIA_DOMAIN.test(url) ? "" : match
    )
    // 2. Hapus markdown link syntax: [teks](url)
    .replace(/\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (match, label, url) =>
      MEDIA_DOMAIN.test(url) ? "" : match
    )
    // 3. Hapus URL polos
    .replace(/https?:\/\/res\.cloudinary\.com\/[^\s)]+/gi, "")
    // 4. ⬅️ BARU: hapus baris list (angka ATAU bullet) yang jadi kosong setelah strip di atas
    .replace(/^\s*(\d+[.)]|[-*+][0-9])\s*$/gm, "")
    // 5. Rapikan label kosong sisa ("Video 1: ", "Foto: ")
    .replace(/^(Video|Foto|Link|URL)\s*\d*:\s*$/gim, "")
    // 6. Collapse baris kosong berlebih
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}