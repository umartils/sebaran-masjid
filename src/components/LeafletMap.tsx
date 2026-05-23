"use client";

import L, { map } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { use, useEffect, useMemo, useRef } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building } from "@/lib/types";

const markerIcon = L.divIcon({
  className: "",
  html: '<div class="marker-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

type MapMode = "renovasi" | "dibangun";

function MapFocus({
  building,
  shouldFocus,
}: {
  building?: Building;
  shouldFocus: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (building && shouldFocus) {
      const panelWidth = window.innerWidth > 900 ? 380 : 0;
      map.flyTo([building.latitude, building.longitude], 17, {
        duration: 0.8,
      });

      // map.once("moveend", () => {
      //   map.panBy([-panelWidth / 2, 0], { animate: true, duration: 0.3 });
      // });
    }
  }, [building, shouldFocus, map]);

  return null;
}

function MapReset({ trigger }: { trigger: number }) {
  const map = useMap();

  useEffect(() => {
    if (trigger > 0) {
      const panelWidth = window.innerWidth > 900 ? 380 : 0;
      map.flyTo([-2.5489, 118.0149], 5, { duration: 0.8 });

      map.once("moveend", () => {
        map.panBy([-panelWidth / 2, 0], { animate: true, duration: 0.3 });
      });
    }
  }, [trigger, map]);

  return null;
}

function BuildingMarker({
  building,
  selected,
  onSelect,
  mapMode,
}: {
  building: Building;
  selected: boolean;
  onSelect: (id: string) => void;
  mapMode?: MapMode;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (selected) {
      markerRef.current?.openPopup();
    }
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={[building.latitude, building.longitude]}
      icon={markerIcon}
      eventHandlers={{ click: () => onSelect(building.id) }}
    >
      <Popup className="building-popup" closeButton maxWidth={300} minWidth={0}>
        <div className="popup-card">
          <div className="popup-head">
            <h3>{building.name}</h3>
            <p>{building.address}</p>
          </div>
          <div className="popup-body">
            {mapMode === "renovasi" && (
              <div className="popup-row">
                <p>Status</p>
                <span className={`badge ${conditionTone(building.condition)}`}>
                  {conditionLabel(building.condition)}
                </span>
              </div>
            )}
            <div className="popup-row">
              <p>Kapasitas</p>
              <strong>
                {building.capacity ? `${building.capacity} Jamaah` : "-"}
              </strong>
            </div>
            <div className="popup-row">
              <p>Berdiri</p>
              <strong>{building.establishedYear ?? "-"}</strong>
            </div>
            <div className="popup-row">
              <p>Wilayah</p>
              <strong>{building.regencyName}</strong>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function LeafletMap({
  buildings,
  selected,
  onSelect,
  mapMode,
  shouldFocus,
  resetView,
}: {
  buildings: Building[];
  selected?: Building;
  onSelect: (id: string) => void;
  mapMode?: "renovasi" | "dibangun";
  shouldFocus?: boolean; // ← tambah
  resetView?: number;
}) {
  return (
    <MapContainer
      center={[-2.5489, 118.0149]} // ← selalu Indonesia, hapus logika selected
      zoom={5} // ← selalu zoom-out
      scrollWheelZoom
      zoomControl={false}
      className="leaflet-container"
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapFocus building={selected} shouldFocus={shouldFocus ?? false} /> ;
      <MapReset trigger={resetView ?? 0} />;{/* ← teruskan */}
      {buildings.map((building) => (
        <BuildingMarker
          key={building.id}
          building={building}
          selected={building.id === selected?.id}
          onSelect={onSelect}
          mapMode={mapMode}
        />
      ))}
    </MapContainer>
  );
}
