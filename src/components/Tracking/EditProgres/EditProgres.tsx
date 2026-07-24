"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

// Local libraries
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import { TrackingMasjidLog } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { updateProgres } from "@/lib/api/progres";
import { executeRequest } from "@/lib/api/request";

interface Props {
  log: TrackingMasjidLog;
  from: string;
  masjid: any;
} 
export function EditProgresLog({
  //   trackingId,
  log,
  from,
  masjid
}: Props ) {
  // console.log(log.tracking.persentase);
  const router = useRouter();
  const logId = log.id;
  const trackingId = log.tracking.id;
  const persentaseTracking = log.tracking.persentase ?? 0;
  const persentaseLog = log.persentase ?? 0;

  const now = new Date();
  const currentTime = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
    now.getHours()
  ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  const [progres, setProgres] = useState("");
  const [nextProgres, setNextProgres] = useState("");
  const [persentase, setPersentase] = useState<number>(0);
  const [waktuProgres, setWaktuProgres] = useState("");
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { toast, showToast } = useToast();

  useEffect(() => {
    setProgres(log.progres ?? "");
    setNextProgres(log.nextProgres ?? "");
    setPersentase(log.persentase ?? 0);
    setWaktuProgres(log.waktuProgres ?? "");
    setImgUrls(log.imgUrls ?? []);
  },[log])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("Menyimpan data...");

    try {
      setLoading(true);

      const payload = {
        id: logId, 
        trackingId,
        progres,
        nextProgres,
        persentase,
        imgUrls,
        waktuProgres,
      }

      console.log(payload);

      const result = await executeRequest(
          updateProgres(payload),
          showToast
      );

      if (!result) {
        setStatus("Terjadi error")
        return;
      }

      setTimeout(() => {
        router.push(`/admin/dashboard/tracking/detail/${trackingId}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      setStatus("Gagal menambah progres");
    } finally {
      setLoading(false);
    }
  }; 

  return ( 
    <>
      <form className="form-card" onSubmit={handleSubmit}>
        <Link className="button-back" href={from}>
          <ArrowLeft size={16} />
          Kembali
        </Link>
        <header className="form-header">
          <h1>Edit Progres {masjid.nama}</h1>
        </header>
        <div className="form-grid">
          <label className="field span-2">
            <span className="label">Progres</span>
            <input
              className="control"
              value={progres}
              onChange={(e) => setProgres(e.target.value)}
              required
            />
          </label>

          <label className="field span-2">
            <span className="label">Next Progres</span>
            <input
              className="control"
              value={nextProgres}
              onChange={(e) => setNextProgres(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Persentase</span>
            <input
              className="control"
              type="number"
              value={persentase}
              onChange={(e) => setPersentase(Number(e.target.value))}
              min={0}
              max={100}
              required
            />
          </label>

          <label className="field">
            <span className="label">Waktu Progres</span>
            <input
              className="control"
              value={waktuProgres}
              onChange={(e) => setWaktuProgres(e.target.value)}
              placeholder="Minggu ke - ..."
              required
            />
          </label>
        </div>
        <br />

        {/* IMAGE UPLOAD FIELD */}
        <ImageUploadField
          label="Dokumentasi Progres"
          onUrlsChange={setImgUrls}
          folder={`masjid/${masjid.id}/progres/${currentTime}`}
          maxFiles={5}
          existingUrls={imgUrls}
        />

        {/* <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button> */}
        <div>
          <button className="primary-button" type="submit" disabled={loading}>
            <Save size={18} /> {loading ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
        {status && <p className="status-message">{status}</p>}
      </form>

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
    </>
  );
}