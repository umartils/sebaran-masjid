'use client';

import { useState } from "react";
import { set } from "zod/v4";

interface LocationResult {
    latitude: string;
    longitude: string;
}

export function useGeolocation() {
    const [loadingPosition, setLoadingPosition] = useState(false);
    const [coordinateInput, setCoordinateInput] = useState("");
    const [locationError, setLocationError] = useState("");

    async function locatePosition(): Promise<LocationResult | null> {
        if (!navigator.geolocation) {
            setLocationError("Browser tidak mendukung fitur lokasi.");
            return null;
        }
        setLoadingPosition(true);
        setLocationError("");
         return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingPosition(false);

          resolve({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        () => {
          setLoadingPosition(false);
          setLocationError("Izin lokasi ditolak.");

          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
        }
      );
    });
  }

  return {
    locatePosition,
    loadingPosition,
    locationError,
  };
    
}
