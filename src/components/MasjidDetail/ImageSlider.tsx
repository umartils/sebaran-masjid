'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import styles from './MasjidDetail.module.scss';

export default function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <>
      <div className={styles.slider}>
        {/* Gambar utama — klik untuk lightbox */}
        <div className={styles.sliderMain} onClick={() => setLightbox(true)}
          style={{ cursor: 'zoom-in' }}>
          <img
            src={images[current]}
            alt={`Foto bangunan ${current + 1}`}
            className={styles.sliderImg}
          />
          {images.length > 1 && (
            <>
              <button
                className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`}
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`${styles.sliderBtn} ${styles.sliderBtnRight}`}
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Berikutnya"
              >
                <ChevronRight size={20} />
              </button>
              <span className={styles.sliderCounter}>
                {current + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Thumbnail row */}
        {images.length > 1 && (
          <div className={styles.sliderThumbs}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
              >
                <img src={src} alt={`Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — tampilkan full size saat diklik */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button className={styles.lightboxClose} aria-label="Tutup">
            <X size={22} />
          </button>
          <img
            src={images[current]}
            alt={`Foto bangunan ${current + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`}
                style={{ position: 'fixed', left: 16 }}
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className={`${styles.sliderBtn} ${styles.sliderBtnRight}`}
                style={{ position: 'fixed', right: 16 }}
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}