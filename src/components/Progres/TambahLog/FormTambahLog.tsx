"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import { Save } from "lucide-react";
import { TrackingMasjidDetail } from "@/lib/types";
import { set } from "zod/v4";
import { time } from "console";

export function FormTambahLog({
  //   trackingId,
  tracking,
}: {
  //   trackingId: string;
  tracking: TrackingMasjidDetail;
}) {
  const router = useRouter();
  const trackingId = tracking.id;
  const masjidId = tracking.masjidId;

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
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Menyimpan data...");

    try {
      setLoading(true);

      const res = await fetch("/api/progres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingId,
          progres,
          nextProgres,
          persentase,
          imgUrls,
        }),
      });

      if (!res.ok) throw new Error();

      setStatus("Progres berhasil ditambahkan");

      //   router.push(`/admin/dashboard/tracking/detail/${trackingId}`);
      //   router.refresh();
    } catch (err) {
      //   alert("Gagal menambah progres");
      setStatus("Gagal menambah progres");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <header className="form-header">
        <h1>Tambah Progres</h1>
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
            value={nextProgres}
            onChange={(e) => setNextProgres(e.target.value)}
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
        folder={`masjid/${masjidId}/progres/${currentTime}`}
      />

      {/* <button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </button> */}
      <div>
        <button className="primary-button" type="submit" disabled={loading}>
          <Save size={18} /> {loading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>
    </form>
  );
}