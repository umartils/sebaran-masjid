"use client";

import { Save, Camera } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import { useSession } from "next-auth/react";

import { createId } from "@paralleldrive/cuid2";

// import initialForm from "./constants/initialForm";
import { parseCoordinates } from "./utils/coordinate";
import { useRegion } from "./hooks/useRegion";
import { useGeolocation } from "./hooks/useGeolocation";
import { useFormPengajuan } from "./hooks/useFormPengajuan";

// Import Section
import InfoUmumSection from "./sections/InfoUmumSection";
import FisikBangunanSection from "./sections/FisikBangunanSection";
import KondisiKerusakanSection from "./sections/KondisiKerusakanSection";
import DataMasyarakatSection from "./sections/DataMasyarakatSection";
import AksesLingunganSection from "./sections/AksesLingunganSection";
import AktivitasIbadahSection from "./sections/AktivitasIbadahSection";
import PicDokumenSection from "./sections/PicDokumenSection";

export function FormPengajuan() {
  const [masjidId] = useState(() => createId());
  const { data: session } = useSession();
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [buildingImageUrls, setBuildingImageUrls] = useState<string[]>([]);
  const userId = session?.user?.id ?? "";

  const { form, setField, resetForm } = useFormPengajuan({ session });

  const [status, setStatus] = useState("");
  const [coordinateInput, setCoordinateInput] = useState("");

  const { locatePosition, loadingPosition, locationError } = useGeolocation();
  const handleLocatePosition = async () => {
    const position = await locatePosition();

    if (!position) return;

    setField("latitude", position.latitude);
    setField("longitude", position.longitude);

    setCoordinateInput(`${position.latitude}, ${position.longitude}`);
  };

  const { regions, selectedNames, regionError } = useRegion(
    form.idProvinsi,
    form.idKota,
    form.idKecamatan,
    form.idDesa
  );

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Menyimpan data...");

    const payload = {
      id: masjidId,
      ...form,
      ...selectedNames,
      documentImgUrl: documentUrls,
      imageUrl: buildingImageUrls,
      // coerce numerics
      kapasitas: form.kapasitas ? Number(form.kapasitas) : undefined,
      tahunDibangun: form.tahunDibangun
        ? Number(form.tahunDibangun)
        : undefined,
      budgetAwal: form.budgetAwal ? Number(form.budgetAwal) : undefined,
      kkMuslim: form.kkMuslim ? Number(form.kkMuslim) : undefined,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      namaRelawan: form.namaRelawan,
      noTelpRelawan: form.noTelpRelawan,
      userId: form.userId,
    };

    const response = await fetch("/api/pengajuan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Data berhasil disimpan.");
      return;
    } else {
      setStatus("Gagal menyimpan data.");
      return;
    }
  }

  return (
    <form className="form-card" onSubmit={submitForm}>
      <header className="form-header">
        <h1>Formulir Pendataan Masjid</h1>
        <p>
          Masukkan data masjid yang membutuhkan bantuan renovasi atau
          pembangunan.
        </p>
      </header>

      {/* ── 1. Informasi Umum ── */}
      <InfoUmumSection
        form={form}
        regions={regions}
        coordinateInput={coordinateInput}
        loadingPosition={loadingPosition}
        setField={setField}
        setCoordinateInput={setCoordinateInput}
        parseCoordinates={parseCoordinates}
        onLocatePosition={handleLocatePosition}
      />

      {/* ── 2. Fisik & Bangunan ── */}
      <FisikBangunanSection form={form} setField={setField} />

      {/* ── 3. Legalitas & Kondisi Kerusakan ── */}
      <KondisiKerusakanSection form={form} setField={setField} />

      {/* ── 4. Data Masyarakat ── */}
      <DataMasyarakatSection form={form} setField={setField} />

      {/* ── 5. Akses & Lingkungan ── */}
      <AksesLingunganSection form={form} setField={setField} />

      {/* ── 6. Aktivitas Ibadah ── */}
      <AktivitasIbadahSection form={form} setField={setField} />

      {/* ── 7. PIC & Dokumen ── */}
      <PicDokumenSection form={form} setField={setField} />

      <h2 className="section-title">
        <Camera size={22} /> 8. Dokumentasi.
      </h2>
      <div className="form-grid">
        <ImageUploadField
          label="Foto Dokumen Kepemilikan Tanah"
          folder={`masjid/${masjidId}/dokumen`}
          maxFiles={5}
          onUrlsChange={setDocumentUrls}
        />
        <ImageUploadField
          label="Foto Bangunan"
          folder={`masjid/${masjidId}/bangunan`}
          maxFiles={5}
          onUrlsChange={setBuildingImageUrls}
        />
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Save size={18} /> Simpan Data
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}
    </form>
  );
}