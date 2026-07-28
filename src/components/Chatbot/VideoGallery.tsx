import { useState } from "react";
import { useMobileOverlay } from "@/context/MobileOverlayContext";
import styles from "./VideoGallery.module.scss";

export function VideoGallery({
  videoUrl,
}: {
  videoUrl: string[];
}) {
  const { isMobile, setIsMobile } = useMobileOverlay();
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className={styles.videoGallery}>
      {/* Video utama */}
      <div
        className={styles.videoGalleryMainWrapper}
        onClick={() => [setLightboxOpen(true), setIsMobile(true)]}
      >
        <video
          src={videoUrl[activeIdx]}
          className={styles.videoGalleryMain}
          muted
          playsInline
          preload="metadata"
        />
        <div className={styles.videoPlayOverlay}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Thumbnail strip — hanya tampil kalau lebih dari 1 video */}
      {videoUrl.length > 1 && (
        <div className={styles.videoGalleryThumbs}>
          {videoUrl.map((url, idx) => (
            <div
              key={idx}
              className={
                idx === activeIdx
                  ? styles.videoThumbActiveWrapper
                  : styles.videoThumbWrapper
              }
              onClick={() => setActiveIdx(idx)}
            >
              <video
                src={url}
                className={
                  idx === activeIdx ? styles.videoThumbActive : styles.videoThumb
                }
                muted
                playsInline
                preload="metadata"
              />
              <div className={styles.videoThumbPlayIcon}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox untuk pemutaran video full size */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => [setLightboxOpen(false), setIsMobile(false)]}
        >
          <video
            src={videoUrl[activeIdx]}
            className={styles.lightboxVideo}
            controls
            autoPlay
            playsInline
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