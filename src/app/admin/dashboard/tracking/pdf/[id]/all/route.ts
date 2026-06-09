import { NextRequest, NextResponse } from "next/server";
import { getTrackingMasjidById } from "@/lib/tracking";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tracking = await getTrackingMasjidById(params.id);
  if (!tracking) return new NextResponse("Not found", { status: 404 });

  const wilayah = [
    tracking.masjid.namaDesa,
    tracking.masjid.namaKecamatan,
    tracking.masjid.namaKota,
    tracking.masjid.namaProvinsi,
  ]
    .filter(Boolean)
    .join(", ");

  const wilayahShort = [tracking.masjid.namaKota, tracking.masjid.namaProvinsi]
    .filter(Boolean)
    .join(", ");

  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Cover: ambil tanggal mulai & selesai dari log pertama & terakhir ──
  const sortedLogs = [...tracking.logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const firstLog = sortedLogs[0];
  const lastLog = sortedLogs[sortedLogs.length - 1];

  const tanggalMulai = firstLog
    ? new Date(firstLog.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) + ` (Minggu ke-1)`
    : "-";

  const tanggalSelesai = lastLog
    ? new Date(lastLog.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) + ` (Minggu ke-${sortedLogs.length})`
    : "-";

  // ── Render tiap log sebagai satu halaman ──
  function renderLogPage(
    log: (typeof sortedLogs)[0],
    index: number,
    isLast: boolean
  ): string {
    const tanggalLog = new Date(log.createdAt).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const images = (log.imgUrls ?? []).slice(0, 4);
    const count = images.length;

    let gridCols: string;
    let imgHeight: string;

    if (count === 1) {
      gridCols = "1fr";
      imgHeight = "300px";
    } else if (count === 2) {
      gridCols = "1fr 1fr";
      imgHeight = "250px";
    } else if (count === 3) {
      gridCols = "1fr 1fr";
      imgHeight = "200px";
    } else {
      gridCols = "1fr 1fr";
      imgHeight = "190px";
    }

    const imagesHtml =
      count > 0
        ? `<div class="img-grid" style="grid-template-columns: ${gridCols};">
            ${images
              .map(
                (url, i) => `
              <div class="img-wrap ${count === 3 && i === 2 ? "span-full" : ""}">
                <img src="${url}" alt="Dokumentasi ${i + 1}" style="height: ${imgHeight};" />
                <span class="img-caption">Dokumentasi ${i + 1}</span>
              </div>`
              )
              .join("")}
          </div>`
        : `<div class="no-img">Tidak ada dokumentasi foto</div>`;

    return `
    <div class="page log-page${isLast ? " last-page" : ""}">

      <!-- Header -->
      <div class="header">
        <div class="header-top">
          <div>
            <p class="doc-label">Laporan Progres — Minggu ke-${index + 1}</p>
            <h1 class="masjid-name">${tracking?.masjid.nama}</h1>
            <p class="masjid-address">
              ${tracking?.masjid.alamat}<br/>
              ${wilayahShort}
            </p>
          </div>
          <div style="text-align:right; flex-shrink:0; margin-left:16px;">
            <div class="pct-circle">
              <span class="pct-number">${log.persentase ?? 0}</span>
              <span class="pct-unit">%</span>
            </div>
            <p class="header-date">${tanggalLog}</p>
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width:${log.persentase ?? 0}%;"></div>
          </div>
          <div class="progress-labels">
            <span>0%</span>
            <span>Progress: ${log.persentase ?? 0}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="body">
        <div class="info-grid">
          <div class="info-card full amber">
            <p class="info-label"><span class="dot"></span>Progres yang Dilakukan</p>
            <p class="info-value">${log.progres ?? "Belum diisi"}</p>
          </div>
          ${
            log.nextProgres
              ? `<div class="info-card full orange">
              <p class="info-label"><span class="dot"></span>Rencana Progres Selanjutnya</p>
              <p class="info-value">${log.nextProgres}</p>
            </div>`
              : ""
          }
          <div class="info-card full amber">
            <p class="info-label"><span class="dot"></span>Waktu Progres</p>
            <p class="info-value">${log.waktuProgres ?? "Belum diisi"}</p>
          </div>
          <div class="info-card">
            <p class="info-label"><span class="dot"></span>Persentase Selesai</p>
            <p class="info-value">${log.persentase ?? 0}%</p>
          </div>
          <div class="info-card">
            <p class="info-label"><span class="dot"></span>Tanggal Laporan</p>
            <p class="info-value">${tanggalLog}</p>
          </div>
        </div>

        <div class="divider">Dokumentasi Foto</div>

        ${imagesHtml}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-brand">
          <img src="/assets/cropped-logo-masjid-nusantara.png" width="22" height="22" style="border-radius:5px;" />
          <span class="footer-name">Se-iMaN - Sistem Informasi Masjid Nusantara</span>
        </div>
        <div class="footer-right">
          Dicetak: ${tanggalCetak}<br/>
          Dokumen ini dibuat otomatis oleh sistem
        </div>
      </div>

    </div>`;
  }

  const logPages = sortedLogs
    .map((log, i) => renderLogPage(log, i, i === sortedLogs.length - 1))
    .join("\n");

  // ── Masjid illustration SVG (minimalist, matches image style) ──
  const masjidSvg = `
  <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="cover-illustration">
    <!-- Ground -->
    <rect x="10" y="168" width="300" height="6" rx="3" fill="#E5E7EB"/>
    <!-- Main building body -->
    <rect x="55" y="110" width="210" height="62" rx="4" fill="#EA580C"/>
    <!-- Side wings -->
    <rect x="20" y="125" width="55" height="47" rx="3" fill="#C2410C"/>
    <rect x="245" y="125" width="55" height="47" rx="3" fill="#C2410C"/>
    <!-- Wing roofs -->
    <polygon points="10,130 47,100 84,130" fill="#374151"/>
    <polygon points="236,130 273,100 310,130" fill="#374151"/>
    <!-- Main roof -->
    <polygon points="45,115 160,55 275,115" fill="#374151"/>
    <!-- Dome -->
    <ellipse cx="160" cy="55" rx="22" ry="14" fill="#4B5563"/>
    <!-- Minaret spire -->
    <line x1="160" y1="41" x2="160" y2="20" stroke="#9CA3AF" stroke-width="2"/>
    <polygon points="155,24 160,10 165,24" fill="#9CA3AF"/>
    <!-- Main door -->
    <rect x="136" y="130" width="48" height="42" rx="4" fill="#7C2D12"/>
    <path d="M136,148 Q160,138 184,148" fill="#92400E"/>
    <!-- Door handle -->
    <circle cx="155" cy="152" r="2.5" fill="#FCD34D"/>
    <circle cx="165" cy="152" r="2.5" fill="#FCD34D"/>
    <!-- Side windows -->
    <rect x="30" y="133" width="30" height="22" rx="3" fill="#FEF3C7"/>
    <path d="M30,144 Q45,138 60,144" fill="#FDE68A"/>
    <rect x="260" y="133" width="30" height="22" rx="3" fill="#FEF3C7"/>
    <path d="M260,144 Q275,138 290,144" fill="#FDE68A"/>
    <!-- Front windows -->
    <rect x="72" y="120" width="28" height="22" rx="3" fill="#FEF3C7"/>
    <path d="M72,131 Q86,125 100,131" fill="#FDE68A"/>
    <rect x="220" y="120" width="28" height="22" rx="3" fill="#FEF3C7"/>
    <path d="M220,131 Q234,125 248,131" fill="#FDE68A"/>
    <!-- Stars decoration -->
    <text x="148" y="87" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="middle">✦ ✦ ✦</text>
  </svg>`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/assets/cropped-logo-masjid-nusantara.png" />
  <title>Laporan Lengkap — ${tracking.masjid.nama}</title>
  <style>
    * {
      box-sizing: border-box; margin: 0; padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      color: #0F172A;
      background: #fff;
    }

    @media screen {
      html { background: #e5e7eb; }
      body { max-width: 210mm; margin: 0 auto; }
      .print-btn {
        position: fixed; top: 20px; right: 20px;
        background: #F59E0B; color: #fff;
        border: none; border-radius: 10px;
        padding: 10px 22px; font-size: 13px; font-weight: 700;
        cursor: pointer; z-index: 999;
        box-shadow: 0 4px 12px rgba(245,158,11,0.4);
      }
      .print-btn:hover { background: #D97706; }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 2rem auto;
        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
      }
    }

    @media print {
      html, body { background: #fff !important; }
      .print-btn { display: none !important; }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        box-shadow: none;
        border-radius: 0;
        page-break-after: always;
      }
      .last-page { page-break-after: avoid; }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .cover-header-bar { background: #F59E0B !important; }
      .cover-body { background: #F9FAFB !important; }
      .header {
        background: linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%) !important;
      }
      .progress-bar-fill { background: #F59E0B !important; }
      .pct-circle { border: 3px solid #F59E0B !important; }
      .info-card.amber { background: #FFFBEB !important; border-color: #FDE68A !important; }
      .info-card.orange { background: #FFF7ED !important; border-color: #FDBA74 !important; }
      .dot { background: #F59E0B !important; }
      @page { size: A4; margin: 0; }
    }

    /* ══════════════════════════════
       COVER PAGE
    ══════════════════════════════ */
    .cover-page {
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    .cover-header-bar {
      background: #F59E0B;
      height: 6px;
      width: 100%;
      flex-shrink: 0;
    }

    .cover-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 48px;
      gap: 0;
      background: #F9FAFB;
    }

    .cover-overline {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #F59E0B;
      text-align: center;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cover-overline::before,
    .cover-overline::after {
      content: '';
      display: inline-block;
      width: 32px;
      height: 2px;
      background: #F59E0B;
      border-radius: 2px;
    }

    .cover-title {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #F59E0B;
      text-align: center;
      margin-bottom: 28px;
    }

    .cover-illustration {
      width: 280px;
      height: auto;
      margin-bottom: 28px;
    }

    .cover-divider {
      width: 60px;
      height: 3px;
      background: #E5E7EB;
      border-radius: 2px;
      margin: 10px auto 24px;
    }

    .cover-meta-table {
      width: 100%;
      max-width: 420px;
      border-collapse: collapse;
    }
    .cover-meta-table tr { border-bottom: 1px solid #E5E7EB; }
    .cover-meta-table tr:last-child { border-bottom: none; }
    .cover-meta-table td {
      padding: 10px 4px;
      font-size: 11px;
      vertical-align: top;
      line-height: 1.5;
    }
    .cover-meta-table td:first-child {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94A3B8;
      white-space: nowrap;
      padding-right: 20px;
      width: 40%;
    }
    .cover-meta-table td:last-child {
      color: #0F172A;
      font-weight: 500;
    }

    .cover-progress-wrap {
      width: 100%;
      max-width: 420px;
      margin-top: 24px;
      padding: 16px 20px;
      background: #fff;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
    }
    .cover-progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 8px;
    }
    .cover-progress-label span:last-child {
      color: #F59E0B;
      font-size: 13px;
    }
    .cover-pb-bg {
      width: 100%; height: 8px;
      background: #F1F5F9;
      border-radius: 999px;
      overflow: hidden;
    }
    .cover-pb-fill {
      height: 100%;
      background: linear-gradient(90deg, #F59E0B, #FBBF24);
      border-radius: 999px;
    }
    .cover-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 12px;
    }
    .cover-stat {
      text-align: center;
    }
    .cover-stat-num {
      font-size: 20px;
      font-weight: 900;
      color: #0F172A;
    }
    .cover-stat-label {
      font-size: 9px;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 600;
      margin-top: 2px;
    }

    .cover-footer {
      padding: 16px 48px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      background: #fff;
    }
    .cover-footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cover-footer-name {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
    .cover-footer-right {
      font-size: 10px;
      color: #94A3B8;
      text-align: right;
      line-height: 1.5;
    }

    /* ══════════════════════════════
       LOG PAGES (reuse existing styles)
    ══════════════════════════════ */
    .log-page {
      display: flex;
      flex-direction: column;
    }

    .header {
      background: linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%);
      padding: 22px 32px 18px;
      color: #fff;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    .header::before {
      content: '';
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E");
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
    }
    .doc-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(255,255,255,0.65); margin-bottom: 5px;
      display: flex; align-items: center; gap: 6px;
    }
    .doc-label::before {
      content: ''; display: inline-block;
      width: 16px; height: 2px;
      background: #F59E0B; border-radius: 2px;
    }
    .masjid-name { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 4px; }
    .masjid-address { font-size: 10px; color: rgba(255,255,255,0.72); line-height: 1.5; }
    .pct-circle {
      width: 62px; height: 62px; border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: 3px solid #F59E0B;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      flex-shrink: 0; margin-left: 14px;
    }
    .pct-number { font-size: 18px; font-weight: 900; color: #fff; line-height: 1; }
    .pct-unit { font-size: 9px; color: rgba(255,255,255,0.7); font-weight: 600; }
    .header-date { font-size: 10px; color: rgba(255,255,255,0.6); text-align: right; margin-top: 4px; }
    .progress-wrap { margin-top: 12px; position: relative; }
    .progress-bar-bg {
      width: 100%; height: 7px;
      background: rgba(255,255,255,0.2);
      border-radius: 999px; overflow: hidden;
    }
    .progress-bar-fill { height: 100%; background: #F59E0B; border-radius: 999px; }
    .progress-labels { display: flex; justify-content: space-between; margin-top: 4px; }
    .progress-labels span { font-size: 9px; color: rgba(255,255,255,0.6); }

    .body {
      padding: 18px 32px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .info-card {
      border: 1px solid #E2E8F0;
      border-radius: 9px;
      padding: 10px 13px;
      background: #F8FAFC;
    }
    .info-card.full { grid-column: 1 / -1; }
    .info-card.amber { background: #FFFBEB; border-color: #FDE68A; }
    .info-card.orange { background: #FFF7ED; border-color: #FDBA74; }
    .info-label {
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.07em; text-transform: uppercase;
      color: #94A3B8; margin-bottom: 4px;
      display: flex; align-items: center; gap: 5px;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #F59E0B; flex-shrink: 0; }
    .info-value { font-size: 12px; font-weight: 600; color: #0F172A; line-height: 1.5; }

    .divider {
      display: flex; align-items: center; gap: 10px;
      color: #94A3B8; font-size: 9px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #E2E8F0; }

    .img-grid { display: grid; gap: 8px; flex: 1; }
    .img-wrap { display: flex; flex-direction: column; gap: 4px; }
    .img-wrap.span-full { grid-column: 1 / -1; }
    .img-wrap img {
      width: 100%;
      object-fit: cover;
      border-radius: 7px;
      border: 1px solid #E2E8F0;
      display: block;
    }
    .img-caption { font-size: 9px; color: #94A3B8; text-align: center; font-weight: 500; }
    .no-img {
      height: 70px; display: flex; align-items: center; justify-content: center;
      border: 1.5px dashed #E2E8F0; border-radius: 9px;
      color: #CBD5E1; font-size: 12px;
    }

    .footer {
      padding: 10px 32px;
      border-top: 1px solid #E2E8F0;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0;
    }
    .footer-brand { display: flex; align-items: center; gap: 7px; }
    .footer-name { font-size: 11px; font-weight: 700; color: #334155; }
    .footer-right { font-size: 10px; color: #94A3B8; text-align: right; line-height: 1.5; }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">Cetak / Simpan PDF</button>

  <!-- ══ COVER PAGE ══ -->
  <div class="page cover-page">
    <div class="cover-header-bar"></div>

    <div class="cover-body">
      <h1 class="cover-overline">Laporan Pembangunan</h1>

      ${masjidSvg}

      <div class="cover-divider"></div>

      <table class="cover-meta-table">
        <tr>
          <td>Project Name</td>
          <td>${tracking.masjid.nama}<br/><span style="font-size:10px;color:#64748B;">${wilayah}</span></td>
        </tr>
        <tr>
          <td>Project Start Date</td>
          <td>${tanggalMulai}</td>
        </tr>
        <tr>
          <td>Project Complete Goal</td>
          <td>${tanggalSelesai}</td>
        </tr>
        <tr>
          <td>Report Date</td>
          <td>${tanggalCetak}</td>
        </tr>
        <tr>
          <td>Project Progress</td>
          <td style="color: #F59E0B; font-weight: 800; font-size: 13px;">${tracking.persentase ?? 0}% (Minggu ke-${sortedLogs.length})</td>
        </tr>
      </table>

      <div class="cover-progress-wrap">
        <div class="cover-progress-label">
          <span>Progress Keseluruhan</span>
          <span>${tracking.persentase ?? 0}%</span>
        </div>
        <div class="cover-pb-bg">
          <div class="cover-pb-fill" style="width: ${tracking.persentase ?? 0}%;"></div>
        </div>
        <div class="cover-stats">
          <div class="cover-stat">
            <div class="cover-stat-num">${tracking.persentase ?? 0}%</div>
            <div class="cover-stat-label">Progress</div>
          </div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-footer-brand">
        <img src="/assets/cropped-logo-masjid-nusantara.png" width="22" height="22" style="border-radius:5px;" />
        <span class="cover-footer-name">Se-iMaN - Sistem Informasi Masjid Nusantara</span>
      </div>
      <div class="cover-footer-right">
        Dicetak: ${tanggalCetak}<br/>
        Dokumen ini dibuat otomatis oleh sistem
      </div>
    </div>
  </div>

  <!-- ══ LOG PAGES ══ -->
  ${logPages}

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 700);
    });
  </script>

</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}