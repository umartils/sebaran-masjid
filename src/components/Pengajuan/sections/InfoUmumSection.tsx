"use client";

import { Info, MapPinnedIcon } from "lucide-react";
import type { Region } from "@/lib/types";
import RegionSelect from "../RegionSelect";

interface InfoUmumSectionProps {
  form: {
    nama: string;
    alamat: string;
    latitude: string;
    longitude: string;
    idProvinsi: string;
    idKota: string;
    idKecamatan: string;
    idDesa: string;
    tahunDibangun: string;
    budgetAwal: string;
  };

  regions: {
    provinces: Region[];
    regencies: Region[];
    districts: Region[];
    villages: Region[];
  };

  coordinateInput: string;
  loadingPosition: boolean;

  setField: (
    name:
      | "nama"
      | "alamat"
      | "latitude"
      | "longitude"
      | "idProvinsi"
      | "idKota"
      | "idKecamatan"
      | "idDesa"
      | "tahunDibangun"
      | "budgetAwal",
    value: string
  ) => void;

  setCoordinateInput: (value: string) => void;

  parseCoordinates: (
    value: string
  ) => {
    latitude: string;
    longitude: string;
  };

  onLocatePosition: () => void;
}

export default function InfoUmumSection({
  form,
  regions,
  coordinateInput,
  loadingPosition,
  setField,
  setCoordinateInput,
  parseCoordinates,
  onLocatePosition,
}: InfoUmumSectionProps) {
  return (
    <>
      <h2 className="section-title">
        <Info size={22} /> 1. Info Umum
      </h2>

      <div className="form-grid">
        <label className="field span-2">
          <span className="label">
            Nama Masjid / Musholla*
          </span>

          <input
            className="control"
            required
            value={form.nama}
            onChange={(e) =>
              setField("nama", e.target.value)
            }
            placeholder="Contoh: Masjid Al Ikhlas"
          />
        </label>

        <label className="field span-2">
          <span className="label">
            Alamat Lengkap*
          </span>

          <textarea
            className="control"
            required
            value={form.alamat}
            onChange={(e) =>
              setField("alamat", e.target.value)
            }
            placeholder="Jalan, RT/RW, Patokan..."
          />
        </label>

        <label className="field span-2">
          <span className="label">
            Titik Koordinat Lokasi*
          </span>

          <span className="coordinate-row">
            <input
              className="control"
              required
              value={coordinateInput}
              onChange={(e) => {
                const value = e.target.value;

                const coords =
                  parseCoordinates(value);

                setCoordinateInput(value);

                setField(
                  "latitude",
                  coords.latitude
                );

                setField(
                  "longitude",
                  coords.longitude
                );
              }}
              placeholder="Contoh: -7.214, 107.821 atau paste link Google Maps"
            />

            <button
              className="secondary-button"
              type="button"
              onClick={onLocatePosition}
            >
              <MapPinnedIcon
                size={18}
                className="button-icon"
              />

              {loadingPosition
                ? "Melacak..."
                : "Lacak Posisi"}
            </button>
          </span>

          <p className="help">
            Wajib diisi agar masjid bisa
            ditayangkan di Peta Sebaran.
          </p>
        </label>

        <RegionSelect
          label="Provinsi*"
          value={form.idProvinsi}
          regions={regions.provinces}
          onChange={(value) =>
            setField("idProvinsi", value)
          }
        />

        <RegionSelect
          label="Kabupaten/Kota*"
          value={form.idKota}
          regions={regions.regencies}
          disabled={!form.idProvinsi}
          onChange={(value) =>
            setField("idKota", value)
          }
        />

        <RegionSelect
          label="Kecamatan"
          value={form.idKecamatan}
          regions={regions.districts}
          disabled={!form.idKota}
          onChange={(value) =>
            setField("idKecamatan", value)
          }
        />

        <RegionSelect
          label="Desa/Kelurahan"
          value={form.idDesa}
          regions={regions.villages}
          disabled={!form.idKecamatan}
          onChange={(value) =>
            setField("idDesa", value)
          }
        />

        <label className="field">
          <span className="label">
            Tahun Berdiri*
          </span>

          <input
            className="control"
            required
            inputMode="numeric"
            value={form.tahunDibangun}
            onChange={(e) =>
              setField(
                "tahunDibangun",
                e.target.value
              )
            }
            placeholder="Contoh: 1990"
          />
        </label>

        <label className="field">
          <span className="label">
            Biaya Pembangunan Awal (Rp)
          </span>

          <input
            className="control"
            inputMode="numeric"
            value={form.budgetAwal}
            onChange={(e) =>
              setField(
                "budgetAwal",
                e.target.value
              )
            }
            placeholder="Contoh: 50000000"
          />
        </label>
      </div>
    </>
  );
}