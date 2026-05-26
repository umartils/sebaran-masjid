'use client';
import { useEffect } from 'react';
import styles from './MasjidDetail.module.scss';

interface Props {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export default function MasjidMap({ latitude, longitude, name, address }: Props) {
  useEffect(() => {
    // Import Leaflet hanya di client
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as string),
    ]).then(([L]) => {
      const lf = L.default;

      // Fix icon Leaflet default
      delete (lf.Icon.Default.prototype as any)._getIconUrl;
      lf.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const container = document.getElementById('building-map');
      if (!container) return;

      // Hapus instance lama jika ada (HMR)
      if ((container as any)._leaflet_id) {
        (lf as any).DomEvent.off(container);
        container.innerHTML = '';
        delete (container as any)._leaflet_id;
      }

      const map = lf.map(container).setView([latitude, longitude], 16);

      lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(map);

      lf.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<strong>${name}</strong><br/>${address}`)
        .openPopup();
    });

    return () => {
      const container = document.getElementById('building-map');
      if (container) container.innerHTML = '';
    };
  }, [latitude, longitude, name, address]);

  return <div id="building-map" className={styles.map} />;
}