import { useState } from "react";
import styles from "./ChatWidget.module.scss";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

import { VideoGallery } from "./VideoGallery";
import { PhotoGallery } from "./PhotoGallery";

export function ToolResultRenderer({ result }: { result: any }) {
  if (!result) return null;

  // --- Hasil getFotoMasjid: { found, id, nama, imageUrl: string[] } ---
  // Dicek lebih dulu sebelum cek `result.masjid`, karena shape-nya beda
  // (imageUrl ada di root object, bukan nested di `masjid`).
  if ("imageUrl" in result && !result.masjid) {
    if (!result.found) {
      return (
        <p className={styles.notFoundText}>
          Masjid tidak ditemukan.
        </p>
      );
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

  if ("videoUrl" in result && !result.masjid) {
    // if (!result.found) {
    //   return (
    //     <p className={styles.notFoundText}> 
    //       Masjid tidak ditemukan.
    //     </p>
    //   );
    // }

    // if (!result.videoUrl || result.videoUrl.length === 0) {
    //   return (
    //     <p className={styles.notFoundText}>
    //       Masjid "{result.nama}" belum memiliki video.
    //     </p>
    //   );
    // }

    return <VideoGallery videoUrl={result.videoUrl} />
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


