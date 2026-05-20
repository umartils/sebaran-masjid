"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building } from "@/lib/types";

const markerIcon = L.divIcon({
  className: "",
  html: '<div class="marker-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

function MapFocus({ building }: { building?: Building }) {
  const map = useMap();

  useEffect(() => {
    if (building) {
      const desktopOffset = window.innerWidth > 900 ? 0.045 : 0;
      map.flyTo([building.latitude, building.longitude - desktopOffset], Math.max(map.getZoom(), 13), { duration: 0.8 });
    }
  }, [building, map]);

  return null;
}

function BuildingMarker({
  building,
  selected,
  onSelect
}: {
  building: Building;
  selected: boolean;
  onSelect: (id: string) => void;
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
            <div className="popup-row">
              <p>Status</p>
              <span className={`badge ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
            </div>
            <div className="popup-row">
              <p>Kapasitas</p>
              <strong>{building.capacity ? `${building.capacity} Jamaah` : "-"}</strong>
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
  onSelect
}: {
  buildings: Building[];
  selected?: Building;
  onSelect: (id: string) => void;
}) {
  const center = useMemo<[number, number]>(() => {
    if (selected) return [selected.latitude, selected.longitude - 0.045];
    return [-2.5489, 118.0149];
  }, [selected]);

  return (
    <MapContainer center={center} zoom={selected ? 12 : 5} scrollWheelZoom className="leaflet-container">
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapFocus building={selected} />
      {buildings.map((building) => (
        <BuildingMarker
          key={building.id}
          building={building}
          selected={building.id === selected?.id}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}
