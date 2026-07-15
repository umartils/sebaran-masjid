"use client";

import {
  Save,
  Pencil,
  Camera,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import VideoUploadField from "@/components/VideoUploadField/VideoUploadField";
import { useSession } from "next-auth/react";
import { Masjid } from "@/lib/types";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// import initialForm from "./constants/initialForm";
import { parseCoordinates } from "./utils/coordinate";
import { useRegion } from "./hooks/useRegion";
import { useGeolocation } from "./hooks/useGeolocation";
import { useFormPengajuan } from "./hooks/useFormPengajuan";
import { mapMasjidToForm } from "./utils/masjidToForm";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

// Import Section
import InfoUmumSection from "./sections/InfoUmumSection";
import FisikBangunanSection from "./sections/FisikBangunanSection";
import KondisiKerusakanSection from "./sections/KondisiKerusakanSection";
import DataMasyarakatSection from "./sections/DataMasyarakatSection";
import AksesLingunganSection from "./sections/AksesLingunganSection";
import AktivitasIbadahSection from "./sections/AktivitasIbadahSection";
import PicDokumenSection from "./sections/PicDokumenSection";

interface Props {
  masjid: Masjid;
  from: string;
}

export function FormEditPengajuan({ masjid, from }: Props) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [masjidId] = useState(masjid.id);
  const { data: session } = useSession();

  // console.log(returnTo);

  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [buildingImageUrls, setBuildingImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const { form, setField, resetForm, setForm } = useFormPengajuan({ session });

  const [coordinateInput, setCoordinateInput] = useState("");

  useEffect(() => {
    if (!masjid) return;

    setForm((prev) => ({
      ...prev,
      ...mapMasjidToForm(masjid),
    }));
    setCoordinateInput(`${masjid.latitude}, ${masjid.longitude}`);
    setDocumentUrls(masjid.documentImgUrl ?? []);
    setBuildingImageUrls(masjid.imageUrl ?? []);
    setVideoUrls(masjid.videoUrl ?? []);
  }, [masjid, setForm]);

  const [status, setStatus] = useState("");

  const { regions, selectedNames, regionError } = useRegion(
    form.idProvinsi,
    form.idKota,
    form.idKecamatan,
    form.idDesa
  );

  const { locatePosition, loadingPosition, locationError } = useGeolocation();
  const handleLocatePosition = async () => {
    const position = await locatePosition();

    if (!position) return;

    setField("latitude", position.latitude);
    setField("longitude", position.longitude);

    setCoordinateInput(`${position.latitude}, ${position.longitude}`);
  };

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Menyimpan data...");

    const payload = {
      id: masjidId,
      ...form,
      ...selectedNames,
      namaProvinsi: selectedNames.namaProvinsi?.trim() || masjid.namaProvinsi,

      namaKota: selectedNames.namaKota?.trim() || masjid.namaKota,

      namaKecamatan:
        selectedNames.namaKecamatan?.trim() || masjid.namaKecamatan,

      namaDesa: selectedNames.namaDesa?.trim() || masjid.namaDesa,
      documentImgUrl: documentUrls,
      imageUrl: buildingImageUrls,
      videoUrl: videoUrls,
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
    };
    console.log(payload);
    const response = await fetch("/api/pengajuan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Data berhasil diupdate.");
      showToast("Data Pengajuan berhasil disimpan", "success");
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 1500);
    } else {
      setStatus("Gagal menyimpan data.");
      showToast("Gagal menyimpan data", "error");
    }
    // const data = await response.json().catch(() => ({}));
    // setStatus(data.message ?? "Data belum bisa disimpan.");
  }

  return (
    <form className="form-card" onSubmit={submitForm}>
      <Link className="button-back" href={from}>
        <ArrowLeft size={16} />
        Kembali
      </Link>
      <header className="form-header">
        <h1>Formulir Edit Data {masjid.nama}</h1>
        {/* <p>
          Masukkan data masjid yang membutuhkan bantuan renovasi atau
          pembangunan.
        </p> */}
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
          existingUrls={documentUrls}
        /> 
        <ImageUploadField
          label="Foto Bangunan"
          folder={`masjid/${masjidId}/bangunan`}
          maxFiles={5}
          onUrlsChange={setBuildingImageUrls}
          existingUrls={buildingImageUrls}
        /> 
        <VideoUploadField
          label="Video Bangunan Masjid"
          folder={`masjid/${masjidId}/video`}
          onUrlsChange={setVideoUrls}
          existingUrls={videoUrls}

           />
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Pencil size={18} /> Update Data
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}

      {toast.show && (
        <div
          className={`custom-toast ${
            toast.type === "success"
              ? "custom-toast--success"
              : "custom-toast--error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </form>
  );
}