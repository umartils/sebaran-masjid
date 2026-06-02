import { NextRequest, NextResponse } from 'next/server';
import { getTrackingMasjidById } from '@/lib/tracking';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tracking = await getTrackingMasjidById(params.id);
  if (!tracking) return new NextResponse('Not found', { status: 404 });

  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');

  if (!logId) {
    return new NextResponse('logId diperlukan', { status: 400 });
  }

  const log = tracking.logs.find((l) => l.id === logId);
  if (!log) return new NextResponse('Log not found', { status: 404 });

  const wilayah = [
    tracking.masjid.namaDesa,
    tracking.masjid.namaKecamatan,
    tracking.masjid.namaKota,
    tracking.masjid.namaProvinsi,
  ].filter(Boolean).join(', ');

  const tanggal = new Date(log.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const images = (log.imgUrls ?? []).slice(0, 3);

  const imageGridCols =
    images.length === 1
      ? '1fr'
      : images.length === 2
      ? '1fr 1fr'
      : '1fr 1fr 1fr';

  const imgHeight = images.length === 1 ? '260px' : '180px';

  const imagesHtml =
    images.length > 0
      ? `<div class="img-grid" style="grid-template-columns: ${imageGridCols};">
          ${images
            .map(
              (url, i) => `
            <div class="img-wrap">
              <img src="${url}" alt="Dokumentasi ${i + 1}" />
              <span class="img-caption">Dokumentasi ${i + 1}</span>
            </div>`
            )
            .join('')}
        </div>`
      : `<div class="no-img">Tidak ada dokumentasi foto</div>`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laporan Mingguan — ${tracking.masjid.nama}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: sans-serif;
    }

    @media screen {
      html { background: #e5e7eb; }
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 2rem auto;
        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        border-radius: 4px;
        overflow: hidden;
      }
      .print-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #F59E0B;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(245,158,11,0.4);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .print-btn:hover { background: #D97706; }
    }

    @media print {
      html, body { background: #fff !important; }
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        box-shadow: none;
        border-radius: 0;
      }
      .print-btn { display: none !important; }

      /* ✅ Paksa semua elemen cetak warna aslinya */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .header {
        background: linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* ✅ Paksa warna teks tetap putih di header */
      .header,
      .header * {
        color: white !important;
      }

      /* ✅ Progress bar tetap berwarna */
      .progress-bar-fill {
        background: #F59E0B !important;
      }

      /* ✅ Info cards tetap berwarna */
      .info-card.amber {
        background: #FFFBEB !important;
        border-color: #FDE68A !important;
      }

      .info-card.orange {
        background: #FFF7ED !important;
        border-color: #FDBA74 !important;
      }

      /* ✅ Dot tetap amber */
      .dot {
        background: #F59E0B !important;
      }

      body {
        font-size: 12px !important;
        -webkit-font-smoothing: antialiased;
      }

      /* ✅ Pastikan gambar tidak overflow */
      .img-wrap img {
        max-width: 100% !important;
      }

      /* ✅ Pastikan circle persentase tetap bulat */
      .pct-circle {
        border: 3px solid #F59E0B !important;
        background: rgba(255,255,255,0.12) !important;
      }

      @page {
        size: A4;
        margin: 0;
      }
    }

    /* ── Page wrapper ── */
    .page {
      width: 210mm;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%);
      padding: 28px 36px 22px;
      color: #fff;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E");
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
    }

    .doc-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .doc-label::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 2px;
      background: #F59E0B;
      border-radius: 2px;
    }

    .masjid-name {
      font-size: 21px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 6px;
    }

    .masjid-address {
      font-size: 11px;
      color: rgba(255,255,255,0.72);
      line-height: 1.55;
    }

    .pct-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: 3px solid #F59E0B;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-left: 16px;
    }

    .pct-number {
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      line-height: 1;
    }

    .pct-unit {
      font-size: 10px;
      color: rgba(255,255,255,0.7);
      font-weight: 600;
    }

    .header-date {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      text-align: right;
      margin-top: 6px;
    }

    .progress-wrap { margin-top: 18px; position: relative; }

    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: #F59E0B;
      border-radius: 999px;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }

    .progress-labels span {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
    }

    /* ── Body ── */
    .body {
      padding: 24px 36px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* ── Info Cards ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .info-card {
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 13px 15px;
      background: #F8FAFC;
    }

    .info-card.full {
      grid-column: 1 / -1;
    }

    .info-card.amber {
      background: #FFFBEB;
      border-color: #FDE68A;
    }

    .info-card.orange {
      background: #FFF7ED;
      border-color: #FDBA74;
    }

    .info-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #94A3B8;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #F59E0B;
      flex-shrink: 0;
    }

    .info-value {
      font-size: 13px;
      font-weight: 600;
      color: #0F172A;
      line-height: 1.55;
    }

    /* ── Divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #94A3B8;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #E2E8F0;
    }

    /* ── Images ── */
    .img-grid {
      display: grid;
      gap: 10px;
    }

    .img-wrap {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .img-wrap img {
      width: 100%;
      height: ${imgHeight};
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
    }

    .img-caption {
      font-size: 10px;
      color: #94A3B8;
      text-align: center;
      font-weight: 500;
    }

    .no-img {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px dashed #E2E8F0;
      border-radius: 10px;
      color: #CBD5E1;
      font-size: 12px;
    }

    /* ── Footer ── */
    .footer {
      padding: 12px 36px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .footer-logo {
      width: 22px;
      height: 22px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footer-name {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }

    .footer-right {
      font-size: 10px;
      color: #94A3B8;
      text-align: right;
      line-height: 1.5;
    }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">
    Cetak / Simpan PDF
  </button>

  <div class="page">

    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div>
          <p class="doc-label">Laporan Progres Mingguan</p>
          <h1 class="masjid-name">${tracking.masjid.nama}</h1>
          <p class="masjid-address">
            ${tracking.masjid.alamat}<br>
            ${wilayah}
          </p>
        </div>
        <div style="text-align: right; flex-shrink: 0; margin-left: 16px;">
          <div class="pct-circle">
            <span class="pct-number">${log.persentase}</span>
            <span class="pct-unit">%</span>
          </div>
          <p class="header-date">${tanggal}</p>
        </div>
      </div>

      <div class="progress-wrap">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${
            log.persentase
          }%;"></div>
        </div>
        <div class="progress-labels">
          <span>0%</span>
          <span>Progress Keseluruhan: ${log.persentase}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="body">

      <!-- Progres -->
      <div class="info-grid">
        <div class="info-card full amber">
          <p class="info-label"><span class="dot"></span>Progres yang Dilakukan</p>
          <p class="info-value">${log.progres ?? "Belum diisi"}</p>
        </div>

        ${
          log.nextProgres
            ? `<div class="info-card full orange">
                <p class="info-label"><span class="dot"></span>Rencana Progres Selanjutnya</p>
                <p class="info-value orange">${log.nextProgres}</p>
              </div>`
            : ""
        }

        <div class="info-card">
          <p class="info-label"><span class="dot"></span>Persentase Selesai</p>
          <p class="info-value">${log.persentase}%</p>
        </div>

        <div class="info-card">
          <p class="info-label"><span class="dot"></span>Tanggal Laporan</p>
          <p class="info-value">${tanggal}</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider">Dokumentasi Foto</div>

      <!-- Images -->
      ${imagesHtml}

    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="/assets/cropped-logo-masjid-nusantara.png" width="22" height="22">
        </div>
        <span class="footer-name">Se-iMaN - Sistem Informasi Masjid Nusantara</span>
      </div>
      <div class="footer-right">
        Dicetak: ${tanggalCetak}<br>
        Dokumen ini dibuat otomatis oleh sistem
      </div>
    </div>

  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 700);
    });
  </script>

</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}