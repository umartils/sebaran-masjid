"use client";

import { UserCircle } from "lucide-react";

interface PicDokumenSectionProps {
    form: {
        namaPic: string;
        jabatanPic: string;
        kontakPic: string;
        catatan: string;
    };
    setField: (
        name: "namaPic" | "jabatanPic" | "kontakPic" | "catatan",
        value: string
    ) => void;
}

export default function PicDokumenSection({ form, setField }: PicDokumenSectionProps) {
    return (
        <>
            <h2 className="section-title">
                <UserCircle size={22} /> 7. Narahubung
            </h2>
            <div className="form-grid">
                <label className="field">
                <span className="label">Nama PIC / Narahubung*</span>
                <input
                    className="control"
                    required
                    value={form.namaPic}
                    onChange={(e) => setField("namaPic", e.target.value)}
                    placeholder="Nama lengkap"
                />
                </label>
                <label className="field">
                <span className="label">Jabatan PIC</span>
                <input
                    className="control"
                    value={form.jabatanPic}
                    onChange={(e) => setField("jabatanPic", e.target.value)}
                    placeholder="Contoh: Ketua DKM"
                />
                </label>
                <label className="field span-2">
                <span className="label">Kontak PIC (WA/Telp)*</span>
                <input
                    className="control"
                    required
                    value={form.kontakPic}
                    onChange={(e) => setField("kontakPic", e.target.value)}
                    placeholder="Contoh: 08123456789"
                />
                </label>
                <label className="field span-2">
                <span className="label">Catatan Tambahan</span>
                <textarea
                    className="control"
                    value={form.catatan}
                    onChange={(e) => setField("catatan", e.target.value)}
                    placeholder="Kebutuhan utama, informasi tambahan, atau catatan verifikasi..."
                />
                </label>
            </div>
        </>
    )
}