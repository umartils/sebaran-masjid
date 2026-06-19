import { useState } from "react";
import styles from "./ChatWidget.module.scss";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

export function ToolResultRenderer({ result }: { result: any }) {
  if (!result) return null;

  // --- Hasil getFotoMasjid: { found, id, nama, imageUrl: string[] } ---
  // Dicek lebih dulu sebelum cek `result.masjid`, karena shape-nya beda
  // (imageUrl ada di root object, bukan nested di `masjid`).
  if ("imageUrl" in result && !result.masjid) {
    if (!result.found) {
      return <p className={styles.notFoundText}>Masjid tidak ditemukan.</p>;
    }

    if (!result.imageUrl || result.imageUrl.length === 0) {
      return (
        <p className={styles.notFoundText}>
          Masjid "{result.nama}" belum memiliki foto.
        </p>
      );
    }

    return <PhotoGallery nama={result.nama} imageUrl={result.imageUrl} />;
  }

  // Detail satu masjid
  if (result.masjid && !Array.isArray(result.masjid)) {
    return (
      <div className={styles.masjidCard}>
        {result.masjid.imageUrl?.[0] && (
          <img
            src={result.masjid.imageUrl[0]}
            alt={result.masjid.nama}
            className={styles.masjidImage}
          />
        )}

        <div className={styles.masjidInfo}>
          <h4>{result.masjid.nama}</h4>
          <p>{result.masjid.alamat}</p>
        </div>
      </div>
    );
  }

  // List masjid
  if (Array.isArray(result.masjid)) {
    return (
      <div className={styles.masjidList}>
        {result.masjid.map((item: any) => (
          <div key={item.id} className={styles.masjidCard}>
            {item.imageUrl?.[0] && (
              <img
                src={item.imageUrl[0]}
                alt={item.nama}
                className={styles.masjidImage}
              />
            )}

            <div className={styles.masjidInfo}>
              <h4>{item.nama}</h4>
              <p>{item.namaKota}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* ---------- Photo Gallery untuk hasil getFotoMasjid ---------- */

function PhotoGallery({
  nama,
  imageUrl,
}: {
  nama: string;
  imageUrl: string[];
}) {
  const { isMobile, setIsMobile } = useMobileOverlay();
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className={styles.photoGallery}>
      {/* <p className={styles.photoGalleryCaption}>Foto {nama}</p> */}

      {/* Gambar utama */}
      <img
        src={imageUrl[activeIdx]}
        alt={`${nama} - foto ${activeIdx + 1}`}
        className={styles.photoGalleryMain}
        onClick={() => [setLightboxOpen(true), setIsMobile(true)]}
        loading="lazy"
      />

      {/* Thumbnail strip — hanya tampil kalau lebih dari 1 foto */}
      {imageUrl.length > 1 && (
        <div className={styles.photoGalleryThumbs}>
          {imageUrl.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`thumbnail ${idx + 1}`}
              className={
                idx === activeIdx ? styles.photoThumbActive : styles.photoThumb
              }
              onClick={() => setActiveIdx(idx)}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Lightbox sederhana untuk lihat full size */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => [setLightboxOpen(false), setIsMobile(false)]}
        >
          <img
            src={imageUrl[activeIdx]}
            alt={nama}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.lightboxClose}
            onClick={() => [setLightboxOpen(false), setIsMobile(false)]}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}