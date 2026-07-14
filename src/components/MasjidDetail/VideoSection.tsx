// src/components/MasjidDetail/VideoSection.tsx
'use client';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';
import styles from './MasjidDetail.module.scss';

interface Props {
  videos: string[];
}

export default function VideoSection({ videos }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 4
    );
  };

  useEffect(() => {
    updateScrollState();
  }, [videos]);

  if (!videos || videos.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(`.${styles.videoCard}`) as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth + 12 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  return (
      <div className={styles.cardBody}>
        <div className={styles.videoSlider}>
          {videos.length > 1 && canScrollLeft && (
            <button
              className={`${styles.videoSliderBtn} ${styles.videoSliderBtnLeft}`}
              onClick={() => scrollByCard(-1)}
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div
            className={styles.videoTrack}
            ref={trackRef}
            onScroll={updateScrollState}
          >
            {videos.map((url, i) => (
              <div key={i} className={styles.videoCard}>
                <video
                  src={url}
                  controls
                  preload="metadata"
                  className={styles.videoPlayer}
                />
              </div>
            ))}
          </div> 

          {videos.length > 1 && canScrollRight && (
            <>
              <button
                className={`${styles.videoSliderBtn} ${styles.videoSliderBtnRight}`}
                onClick={() => scrollByCard(1)}
                aria-label="Berikutnya"
              >
                <ChevronRight size={18} />
              </button>

              {/* <span className={styles.sliderCounter}>
                {current + 1} / {images.length}
              </span> */}
            </>
            
          )}
        </div>
      </div>
  );
}