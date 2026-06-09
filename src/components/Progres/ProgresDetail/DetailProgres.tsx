'use client';

import Link from 'next/link';
import {
  Plus,
  FileDown,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import type { TrackingMasjidDetail } from "@/lib/types";
import styles from "./DetailProgres.module.scss";

interface Props {
  tracking: TrackingMasjidDetail;
  from?: string;
}

export function DetailProgres({ tracking, from }: Props) {
  const wilayah = [tracking.masjid.namaKota, tracking.masjid.namaProvinsi]
    .filter(Boolean)
    .join(", ");

  function handleDownloadPDF() {
    window.open(`/admin/dashboard/tracking/pdf/${tracking.id}`, "_blank");
  }

  function handleDownloadAllPDF() {
    window.open(`/admin/dashboard/tracking/pdf/${tracking.id}/all`, "_blank");
  }

  return (
    <div className={styles.container}>
      {/* ── Header Card ── */}
      <Link className="button-back" href={`${from}`}>
        <ArrowLeft size={16} />
        Kembali
      </Link>
      <div className={styles.summaryCard}>
        <h2>{tracking.masjid.nama}</h2>
        <p className={styles.address}>{tracking.masjid.alamat}</p>
        <p className={styles.city}>{wilayah}</p>

        <div className={styles.progressSection}>
          <div className={styles.progressMeta}>
            <span className={styles.progressStatus}>{tracking.status}</span>
            <span className={styles.progressPct}>{tracking.persentase}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${tracking.persentase}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <Link
          href={`/admin/dashboard/tracking/tambah/${tracking.id}`}
          className={styles.addBtn}
        >
          <Plus size={15} />
          Tambah Progres
        </Link>

        <button className={styles.pdfBtn} onClick={handleDownloadAllPDF}>
          <FileDown size={15} />
          Download PDF
        </button>
      </div>

      {/* ── Logs ── */}
      <div className={styles.logsSection}>
        <h3 className={styles.logsSectionTitle}>
          <ClipboardList size={17} />
          Riwayat Progres
        </h3>

        {tracking.logs.length === 0 ? (
          <div className={styles.emptyState}>
            <ClipboardList size={32} strokeWidth={1.2} />
            Belum ada riwayat progres. Tambahkan progres pertama.
          </div>
        ) : (
          <div className={styles.timeline}>
            {tracking.logs.map((log, idx) => (
              <div key={log.id} className={styles.timelineItem}>
                {/* Garis vertikal */}
                {idx < tracking.logs.length - 1 && (
                  <div className={styles.timelineLine} />
                )}

                {/* Dot */}
                <div className={styles.timelineDot}>{log.persentase}%</div>

                {/* Card */}
                <div className={styles.logCard}>
                  <div className={styles.logHeader}>
                    <span className={styles.badge}>
                      {log.persentase}% Selesai
                    </span>
                    <div className={styles.logHeaderRight}>
                      <span className={styles.logDate}>
                        {new Date(log.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        className={styles.pdfBtnSm}
                        onClick={() =>
                          window.open(
                            `/admin/dashboard/tracking/pdf/${tracking.id}?logId=${log.id}`,
                            "_blank"
                          )
                        }
                        title="Download PDF progres ini"
                      >
                        <FileDown size={13} />
                        PDF
                      </button>
                      <Link
                        className={styles.editBtnSm}
                        href={`/admin/dashboard/tracking/edit/${log.id}?from=/admin/dashboard/tracking/detail/${tracking.id}`}
                        title="Edit progres ini"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>
                    </div>
                  </div>

                  <h4 className={styles.logTitle}>
                    {log.progres ?? "Progres belum diisi"}
                  </h4>

                  {log.nextProgres && (
                    <p className={styles.logNext}>
                      <ArrowRight
                        size={14}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span>
                        <strong>Tahap Selanjutnya:</strong> {log.nextProgres}
                      </span>
                    </p>
                  )}

                  {log.imgUrls.length > 0 && (
                    <div className={styles.gallery}>
                      {log.imgUrls.map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt={log.progres ?? "Dokumentasi"}
                          onClick={() => window.open(url, "_blank")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}