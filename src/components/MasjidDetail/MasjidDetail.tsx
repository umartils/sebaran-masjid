'use client';
import type { Masjid } from '@/lib/types';
import ImageSlider from './ImageSlider';
import DocumentGallery from './DocumentGallery';
import MasjidMap from './MasjidMap';
import styles from './MasjidDetail.module.scss';
import {
  Info,
  Building2,
  MapPin,
  Users,
  Sun,
  FileText,
  User,
  StickyNote,
  CheckCircle,
  Map,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

const KONDISI_LABEL: Record<
  string,
  { label: string; tone: "rusak" | "sedang" | "baik" }
> = {
  RUSAK_BERAT: { label: "Rusak Berat", tone: "rusak" },
  RUSAK_SEDANG: { label: "Rusak Sedang", tone: "sedang" },
  RUSAK_RINGAN: { label: "Rusak Ringan", tone: "sedang" },
  LAYAK: { label: "Layak", tone: "baik" },
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "⏳ Menunggu Verifikasi", cls: "pending" },
  VERIFIED: { label: "✓ Terverifikasi", cls: "verified" },
  REJECTED: { label: "✕ Ditolak", cls: "rejected" },
};

function formatRupiah(val?: string | null) {
  if (!val) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(val));
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className={styles.rowItem}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={`${styles.rowValue} ${!value ? styles.empty : ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}

interface Props {
  masjid: Masjid;
  from: String;
}
export default function MasjidDetail({ masjid, from }: Props) {
  const kondisi = KONDISI_LABEL[masjid.kondisi] ?? {
    label: masjid.kondisi,
    tone: "sedang",
  };
  const status = STATUS_LABEL[masjid.statusPengajuan] ?? {
    label: masjid.statusPengajuan,
    cls: "pending",
  };

  const wilayah = [
    masjid.namaDesa,
    masjid.namaKecamatan,
    masjid.namaKota,
    masjid.namaProvinsi,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.root}>
      <Link className="button-back" href={`${from}`}>
        <ArrowLeft size={20} />
        Kembali
      </Link>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>{masjid.nama}</h1>
        <p className={styles.heroAddress}>
          <MapPin size={14} /> {wilayah}
        </p>
        <span className={`${styles.statusBadge} ${styles[status.cls]}`}>
          {status.label}
        </span>
      </div>

      <div className={styles.layout}>
        {/* ── Kolom Kiri ── */}
        <div className={styles.mainCol}>
          {/* Foto Bangunan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Building2 size={18} />
              <h2>Foto Bangunan</h2>
            </div>
            {masjid.imageUrl.length > 0 ? (
              <ImageSlider images={masjid.imageUrl} />
            ) : (
              <div className={styles.emptySlider}>Belum ada foto bangunan</div>
            )}
          </div>

          {/* Hasil Validasi Survei */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CheckCircle size={18} />
              <h2>Hasil Validasi Survei</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.kondisiGrid}>
                <div
                  className={`${styles.kondisiCard} ${styles[kondisi.tone]}`}
                >
                  <label>Kondisi Bangunan</label>
                  <strong>{kondisi.label}</strong>
                </div>
                <div className={`${styles.kondisiCard} ${styles.baik}`}>
                  <label>Status Tanah</label>
                  <strong>{masjid.statusTanah || "-"}</strong>
                </div>
              </div>
              <div className={styles.rowList}>
                <Row label="Waktu Kerusakan" value={masjid.waktuKerusakan} />
                <Row label="Alasan Mendesak" value={masjid.alasan} />
                <Row label="Dampak Kerusakan" value={masjid.dampakKerusakan} />
                <Row
                  label="Hambatan Aktivitas"
                  value={masjid.hambatanAktivitas}
                />
                <Row label="Kondisi saat Hujan" value={masjid.kondisiHujan} />
                <Row label="Riwayat Roboh" value={masjid.riwayatRoboh} />
                <Row label="Usaha Perbaikan" value={masjid.usahaPerbaikan} />
                <Row
                  label="Riwayat Menerima Bantuan"
                  value={masjid.riwayatMenerimaBantuan}
                />
              </div>
            </div>
          </div>

          {/* Fisik & Legalitas */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Building2 size={18} />
              <h2>Fisik & Legalitas Bangunan</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.rowList}>
                <Row label="Luas Bangunan" value={masjid.luasSekarang} />
                <Row label="Material Utama" value={masjid.materialUtama} />
                <Row label="Status Perluasan" value={masjid.statusPerluasan} />
                <Row label="Target Perluasan" value={masjid.targetPerluasan} />
                <Row label="Riwayat Renovasi" value={masjid.riwayatRenovasi} />
                <Row label="Jaringan Listrik" value={masjid.statusListrik} />
              </div>
            </div>
          </div>

          {/* Akses & Lingkungan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Map size={18} />
              <h2>Akses & Kondisi Lingkungan</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.rowList}>
                <Row label="Jarak ke Kota" value={masjid.jarakKeKota} />
                <Row
                  label="Waktu Tempuh ke Kota"
                  value={masjid.waktuTempuhKeKota}
                />
                <Row
                  label="Kondisi Akses Kota"
                  value={masjid.kondisiAksesKota}
                />
                <Row
                  label="Kondisi Akses Desa"
                  value={masjid.kondisiAksesDesa}
                />
                <Row label="Jenis Kendaraan" value={masjid.jenisKendaraan} />
                <Row label="Hambatan Akses" value={masjid.hambatanAkses} />
                <Row label="Kesediaan Ganti Nama" value={masjid.gantiNama} />
              </div>
            </div>
          </div>

          {/* Peta Lokasi */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <MapPin size={18} />
              <h2>Lokasi Masjid</h2>
            </div>
            <MasjidMap
              latitude={masjid.latitude}
              longitude={masjid.longitude}
              name={masjid.nama}
              address={masjid.alamat}
            />
          </div>

          {/* Dokumen */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FileText size={18} />
              <h2>Dokumen Kepemilikan Tanah</h2>
            </div>
            <div className={styles.cardBody}>
              {masjid.documentImgUrl.length > 0 ? (
                <DocumentGallery images={masjid.documentImgUrl} />
              ) : (
                <p className={styles.emptyText}>Belum ada foto dokumen</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className={styles.sideCol}>
          {/* Identitas Utama */}
          <div className={styles.cardAmber}>
            <h3>
              <Info size={16} /> Identitas Utama
            </h3>
            <div className={styles.rowList}>
              <Row label="Tahun Berdiri" value={masjid.tahunDibangun} />
              <Row
                label="Kapasitas Max"
                value={masjid.kapasitas ? `${masjid.kapasitas} Jamaah` : null}
              />
              <Row
                label="Budget Awal"
                value={formatRupiah(masjid.budgetAwal?.toString())}
              />
              <Row
                label="Koordinat"
                value={`${masjid.latitude.toFixed(
                  4
                )}, ${masjid.longitude.toFixed(4)}`}
              />
            </div>
          </div>

          {/* Data Masyarakat */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Users size={18} />
              <h2>Data Masyarakat</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.rowList}>
                <Row
                  label="KK Muslim"
                  value={masjid.kkMuslim ? `${masjid.kkMuslim} KK` : null}
                />
                <Row label="Jumlah Jamaah" value={masjid.jumlahJamaah} />
                <Row
                  label="Profesi Mayoritas"
                  value={masjid.avgProfesiJamaah}
                />
                <Row label="Rata-rata Gaji" value={masjid.avgGajiJamaah} />
                <Row label="Usaha Jamaah" value={masjid.usahaJamaah} />
              </div>
            </div>
          </div>

          {/* Aktivitas Ibadah */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Sun size={18} />
              <h2>Aktivitas Ibadah</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.rowList}>
                <Row label="Kelayakan Jumat" value={masjid.kelayakan} />
                <Row label="Jamaah Subuh" value={masjid.jamaahSubuh} />
                <Row label="Jumlah Santri" value={masjid.jumlahSantri} />
                <Row label="Masjid Terdekat" value={masjid.masjidTerdekat} />
                <Row label="Aktivitas Masjid" value={masjid.aktivitasMasjid} />
              </div>
            </div>
          </div>

          {/* PIC */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <User size={18} />
              <h2>Narahubung (PIC)</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.rowList}>
                <Row label="Nama" value={masjid.namaPic} />
                <Row label="Jabatan" value={masjid.jabatanPic} />
                <Row label="Kontak" value={masjid.kontakPic} />
              </div>
            </div>
          </div>

          {/* Relawan */}
          {(masjid.namaRelawan || masjid.noTelpRelawan) && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <UserCheck size={18} />
                <h2>Relawan Pendamping</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.rowList}>
                  <Row label="Nama Relawan" value={masjid.namaRelawan} />
                  <Row label="Kontak Relawan" value={masjid.noTelpRelawan} />
                  {masjid.editedBy && (
                    <Row label="Disetujui Oleh" value={masjid.editedBy} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Catatan */}
          {masjid.catatan && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <StickyNote size={18} />
                <h2>Catatan</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.catatanText}>{masjid.catatan}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}