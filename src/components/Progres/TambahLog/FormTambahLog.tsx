"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

// Local libraries
import ImageUploadField from "@/components/ImageUploadField/ImageUploadField";
import { TrackingMasjidDetail } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

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
  const persentaseTracking = tracking.persentase ?? 0;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (persentase < persentaseTracking) {
      // setStatus(`Persentase tidak boleh kurang dari ${persentaseTracking}%`);
      showToast(
        `Persentase tidak boleh kurang dari ${persentaseTracking}%`,
        "error"
      );
      return;
    }
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
          waktuProgres,
        }),
      });

      if (!res.ok) throw new Error();

      // setStatus("Progres berhasil ditambahkan");

      showToast("Progres berhasil ditambahkan", "success");
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
          folder={`masjid/${masjidId}/progres/${currentTime}`}
        />

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