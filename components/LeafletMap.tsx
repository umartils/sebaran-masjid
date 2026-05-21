"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import { conditionLabel, conditionTone } from "@/lib/format";
import type { Building } from "@/lib/types";

const mapClass = "h-screen min-h-[620px] w-full max-md:min-h-screen";
const badgeClass =
  "inline-flex min-h-5 items-center rounded-full px-[15px] py-1.5 text-[10px] font-medium max-md:min-h-[22px] max-md:justify-self-end max-md:px-[9px] max-md:py-0 max-md:text-[11px]";
const popupClass =
  "[&_.leaflet-popup-content-wrapper]:overflow-hidden [&_.leaflet-popup-content-wrapper]:rounded-[10px] [&_.leaflet-popup-content-wrapper]:p-0 max-md:[&_.leaflet-popup-content-wrapper]:shadow-[0_12px_32px_rgba(15,23,42,0.18)] [&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-content]:!w-auto [&_.leaflet-popup-close-button]:right-2 [&_.leaflet-popup-close-button]:top-2 [&_.leaflet-popup-close-button]:text-white/[0.9] max-md:[&_.leaflet-popup-close-button]:right-1 max-md:[&_.leaflet-popup-close-button]:top-1 max-md:[&_.leaflet-popup-close-button]:h-[26px] max-md:[&_.leaflet-popup-close-button]:w-[26px] max-md:[&_.leaflet-popup-close-button]:text-white/[0.92] max-md:[&_.leaflet-popup-tip-container]:h-3.5";
const popupRowClass =
  "flex min-h-[30px] items-center justify-between gap-2.5 border-b border-dashed border-line py-1 text-xs last:border-b-0 max-md:grid max-md:min-h-8 max-md:grid-cols-[74px_minmax(0,1fr)] max-md:py-1.5 max-md:[&:nth-child(n+3)]:hidden";

const markerIcon = L.divIcon({
  className: "",
  html: '<div class="h-[18px] w-[18px] rounded-full border-4 border-white bg-brand shadow-[0_6px_16px_rgba(17,24,39,0.3)]"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

function MapFocus({ building }: { building?: Building }) {
  const map = useMap();

  useEffect(() => {
    if (building) {
      const desktopOffset = window.innerWidth > 900 ? 0.045 : 0;
      map.flyTo(
        [building.latitude, building.longitude - desktopOffset],
        Math.max(map.getZoom(), 10),
        { duration: 0.8 }
      );
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
      <Popup className={popupClass} closeButton maxWidth={300} minWidth={0}>
        <div className="w-[250px] overflow-hidden rounded-[10px] bg-white max-md:w-[min(240px,calc(100vw-88px))]">
          <div className="bg-brand px-[18px] pb-[5px] pt-5 text-white max-md:px-3.5 max-md:pb-[5px] max-md:pt-[18px]">
            <h3 className="mb-[3px] mt-0 text-[21px] leading-[1.18] max-md:text-lg">{building.name}</h3>
            <p className="m-0 text-xs">{building.address}</p>
          </div>
          <div className="px-[15px] pb-4 pt-3 max-md:px-[18px] max-md:pb-[5px] max-md:pt-2">
            <div className={popupRowClass}>
              <p className="m-0">Status</p>
              <span className={`${badgeClass} ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
            </div>
            <div className={popupRowClass}>
              <p className="m-0">Kapasitas</p>
              <strong className="max-w-[150px] text-right max-md:max-w-none max-md:justify-self-end max-md:text-[13px]">{building.capacity ? `${building.capacity} Jamaah` : "-"}</strong>
            </div>
            <div className={popupRowClass}>
              <p className="m-0">Berdiri</p>
              <strong className="max-w-[150px] text-right max-md:max-w-none max-md:justify-self-end max-md:text-[13px]">{building.establishedYear ?? "-"}</strong>
            </div>
            <div className={popupRowClass}>
              <p className="m-0">Wilayah</p>
              <strong className="max-w-[150px] text-right max-md:max-w-none max-md:justify-self-end max-md:text-[13px]">{building.regencyName}</strong>
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
    <MapContainer center={center} zoom={selected ? 12 : 5} scrollWheelZoom zoomControl={false} className={mapClass}>
      <ZoomControl position="bottomright" />
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
