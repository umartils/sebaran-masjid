import { useState } from "react";
import styles from "./PhotoGallery.module.scss";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

export function PhotoGallery({
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