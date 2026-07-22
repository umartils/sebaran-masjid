import { useEffect, useMemo, useState } from "react";
import type { Region } from "@/lib/types";

const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

const emptyRegions: Region[] = [];

async function fetchRegions( path: string): Promise<Region[]> {
    const res = await fetch(`${API_BASE}/${path}`);

    if (!res.ok) throw new Error("Gagal mengambil data wilayah");
    return res.json();
}

export function useRegion(
    idProvinsi: string,
    idKota: string,
    idKecamatan: string,
    idDesa: string
) {
    const [regions, setRegions] = useState({
        provinces: emptyRegions,
        regencies: emptyRegions,
        districts: emptyRegions,
        villages: emptyRegions,
    })

    const [regionError, setRegionError] = useState("");
    useEffect(() => {
        fetchRegions("provinces.json")
          .then((provinces) => setRegions((c) => ({ ...c, provinces })))
          .catch(() => setRegionError("Data provinsi gagal dimuat."));
      }, []);
    
      useEffect(() => {
        if (!idProvinsi) return;
        fetchRegions(`regencies/${idProvinsi}.json`)
          .then((regencies) =>
            setRegions((c) => ({
              ...c,
              regencies,
              districts: emptyRegions,
              villages: emptyRegions,
            }))
          )
          .catch(() => setRegionError("Data kabupaten/kota gagal dimuat."));
      }, [idProvinsi]);
    
      useEffect(() => {
        if (!idKota) return;
        fetchRegions(`districts/${idKota}.json`)
          .then((districts) =>
            setRegions((c) => ({ ...c, districts, villages: emptyRegions }))
          )
          .catch(() => setRegionError("Data kecamatan gagal dimuat."));
      }, [idKota]);
    
      useEffect(() => {
        if (!idKecamatan) return;
        fetchRegions(`villages/${idKecamatan}.json`)
          .then((villages) => setRegions((c) => ({ ...c, villages })))
          .catch(() => setRegionError("Data desa gagal dimuat."));
      }, [idKecamatan]);

      const selectedNames = useMemo(
        () => ({
          namaProvinsi:
            regions.provinces.find((p) => p.id === idProvinsi)?.name ?? "",
          namaKota: regions.regencies.find((r) => r.id === idKota)?.name ?? "",
          namaKecamatan:
            regions.districts.find((d) => d.id === idKecamatan)?.name ?? "",
          namaDesa: regions.villages.find((v) => v.id === idDesa)?.name ?? "",
        }),
        [
          regions.provinces,
          regions.regencies,
          regions.districts,
          regions.villages,
          idProvinsi,
          idKota,
          idKecamatan,
          idDesa,
        ]
      );

      return {
        regions,
        selectedNames,
        regionError,
     };
}