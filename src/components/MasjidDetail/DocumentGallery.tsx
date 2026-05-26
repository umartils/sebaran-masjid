'use client';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import styles from './MasjidDetail.module.scss';

export default function DocumentGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className={styles.docGrid}>
        {images.map((src, i) => (
          <button
            key={i}
            className={styles.docItem}
            onClick={() => setLightbox(src)}
            aria-label={`Lihat dokumen ${i + 1}`}
          >
            <img src={src} alt={`Dokumen ${i + 1}`} />
            <div className={styles.docOverlay}>
              <ZoomIn size={20} />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} aria-label="Tutup">
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="Dokumen"
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}