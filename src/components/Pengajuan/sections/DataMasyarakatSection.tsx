"use client";
import { Users } from "lucide-react";

interface DataMasyarakatSectionProps {
    form: {
        kkMuslim: string;
        jumlahJamaah: string;
        avgProfesiJamaah: string;
        avgGajiJamaah: string;
    }

    setField: (name: "kkMuslim" | "jumlahJamaah" | "avgProfesiJamaah" | "avgGajiJamaah", value: string) => void
}

export default function DataMasyarakatSection({form, setField}: DataMasyarakatSectionProps) {
    return (
        <>
            <h2 className="section-title">
                <Users size={22} /> 4. Data Masyarakat
            </h2>
            <div className="form-grid">
                <label className="field">
                <span className="label">Jumlah KK Muslim</span>
                <input
                    className="control"
                    inputMode="numeric"
                    value={form.kkMuslim}
                    onChange={(e) => setField("kkMuslim", e.target.value)}
                    placeholder="Contoh: 150"
                />
                </label>
                <label className="field">
                <span className="label">Jumlah Jamaah Aktif</span>
                <input
                    className="control"
                    value={form.jumlahJamaah}
                    onChange={(e) => setField("jumlahJamaah", e.target.value)}
                    placeholder="Contoh: 80 orang"
                />
                </label>
                <label className="field">
                <span className="label">Profesi Mayoritas Jamaah</span>
                <input
                    className="control"
                    value={form.avgProfesiJamaah}
                    onChange={(e) => setField("avgProfesiJamaah", e.target.value)}
                    placeholder="Contoh: Petani, Buruh"
                />
                </label>
                <label className="field">
                <span className="label">Rata-rata Gaji Jamaah</span>
                <input
                    className="control"
                    value={form.avgGajiJamaah}
                    onChange={(e) => setField("avgGajiJamaah", e.target.value)}
                    placeholder="Contoh: Rp 2.000.000/bulan"
                />
                </label>
            </div>
        </>
    )
}