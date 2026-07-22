"use client";
import { Sun, ChevronDown } from "lucide-react";

interface AktivitasIbadahSectionProps {
    form: {
        kelayakan: string;
        jamaahSubuh: string;
        jumlahSantri: string;
        aktivitasMasjid: string;
    };
    setField: (
        name: "kelayakan" | "jamaahSubuh" | "jumlahSantri" | "aktivitasMasjid",
        value: string
    ) => void
}

export default function AktivitasIbadahSection({ form, setField }: AktivitasIbadahSectionProps) {
    return (
      <>
        <h2 className="section-title">
          <Sun size={22} /> 6. Aktivitas Ibadah
        </h2>
        <div className="form-grid">
          <label className="field">
            <span className="label">Kelayakan Shalat Jumat</span>
            <div className="select-wrapper">
              <select
                className="control"
                value={form.kelayakan}
                onChange={(e) => setField("kelayakan", e.target.value)}
              >
                <option value="">Pilih...</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
          </label>
          <label className="field">
            <span className="label">Rata-rata Jamaah Subuh</span>
            <input
              className="control"
              value={form.jamaahSubuh}
              onChange={(e) => setField("jamaahSubuh", e.target.value)}
              placeholder="Contoh: 20 orang"
            />
          </label>
          <label className="field">
            <span className="label">Jumlah Santri</span>
            <input
              className="control"
              value={form.jumlahSantri}
              onChange={(e) => setField("jumlahSantri", e.target.value)}
              placeholder="Contoh: 30 santri"
            />
          </label>
          <label className="field span-2">
            <span className="label">Aktivitas / Kegiatan Masjid</span>
            <textarea
              className="control"
              value={form.aktivitasMasjid}
              onChange={(e) => setField("aktivitasMasjid", e.target.value)}
              placeholder="Contoh: TPA, Pengajian rutin, Majelis taklim..."
            />
          </label>
        </div>
      </>
    );
}