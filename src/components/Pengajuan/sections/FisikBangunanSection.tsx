"use client";

import { Landmark } from "lucide-react";

interface FisikBangunanSectionProps {
    form: {
        luasSekarang: string;
        kapasitas: string;
        materialUtama: string;
        statusPerluasan: string;
        riwayatRenovasi: string;
        targetPerluasan: string;
    };

    setField: (
        name: 
            | "luasSekarang"
            | "kapasitas"
            | "materialUtama"
            | "statusPerluasan"
            | "riwayatRenovasi"
            | "targetPerluasan",
        value: string
    ) => void;
}

export default function FisikBangunanSection({ form, setField }: FisikBangunanSectionProps) {
    return (
        <>
            <h2 className="section-title">
                <Landmark size={22} /> 2. Detail Fisik & Bangunan
            </h2>
            <div className="form-grid">
                <label className="field">
                <span className="label">Luas Bangunan Saat Ini*</span>
                <input
                    className="control"
                    required
                    value={form.luasSekarang}
                    onChange={(e) => setField("luasSekarang", e.target.value)}
                    placeholder="Contoh: 10 x 10 meter"
                />
                </label>
                <label className="field">
                <span className="label">Kapasitas Jamaah (orang)*</span>
                <input
                    className="control"
                    required
                    inputMode="decimal"
                    value={form.kapasitas}
                    onChange={(e) => setField("kapasitas", e.target.value)}
                    placeholder="Contoh: 100"
                />
                </label>
                <label className="field span-2">
                <span className="label">Material Bangunan Utama*</span>
                <input
                    className="control"
                    required
                    value={form.materialUtama}
                    onChange={(e) => setField("materialUtama", e.target.value)}
                    placeholder="Contoh: Bata merah, Kayu, Bambu, dll"
                />
                </label>
                <label className="field span-2">
                <span className="label">Status Perluasan</span>
                <textarea
                    className="control"
                    value={form.statusPerluasan}
                    onChange={(e) => setField("statusPerluasan", e.target.value)}
                    placeholder="Contoh: Ya, diperluas menjadi 15x10 meter"
                />
                </label>
                <label className="field span-2">
                <span className="label">Riwayat Renovasi</span>
                <textarea
                    className="control"
                    value={form.riwayatRenovasi}
                    onChange={(e) => setField("riwayatRenovasi", e.target.value)}
                    placeholder="Contoh: 2 kali (Perbaikan atap dan penambahan tempat wudhu)"
                />
                </label>
                <label className="field span-2">
                <span className="label">Target Perluasan</span>
                <input
                    className="control"
                    value={form.targetPerluasan}
                    onChange={(e) => setField("targetPerluasan", e.target.value)}
                    placeholder="Contoh: Rencana menjadi 20x15 meter"
                />
                </label>
            </div>
        </>
    )
}