# Se - IMaN (Sistem Informasi Masjid Nusantara)

Website Next.js untuk menampilkan persebaran masjid yang dibangun oleh Yayasan Masjid Nusantara di peta, mencari titik berdasarkan data bangunan, dan menginput data bangunan dengan dropdown wilayah Indonesia.

## Fitur

- Peta Leaflet dengan titik lokasi dari data latitude dan longitude.
- Popup detail interaktif pada marker.
- Sidebar navigasi yang bisa disembunyikan dan otomatis collapsed di mobile.
- Search berdasarkan nama, alamat, wilayah, kondisi, material, dan status lahan.
- Form input data pengajuan pembangunan masjid dengan dropdown provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan dari API eksternal.
- Tombol ambil titik koordinat otomatis dari geolocation browser.
- API Next.js untuk membaca dan menyimpan data ke PostgreSQL melalui Prisma.
- Approval sistem untuk menyetujui pengajuan pembangunan masjid.
- Progress Tracking untuk memantau perkembangan pembangunan masjid yang telah disetujui.
- Download progres report baik untuk setiap progres maupun keseluruhan progres pada setiap masjid yang sedang dibangun.

## Menjalankan Proyek

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Atur `DATABASE_URL` di `.env` agar sesuai dengan koneksi PostgreSQL lokal. Jika `DATABASE_URL` belum tersedia, halaman peta tetap memakai data contoh, tetapi submit form belum disimpan ke database.

## Halaman

- `/` - Peta sebaran dan pencarian bangunan.
- `/input/pengajuan` - Formulir pengajuan pembangunan masjid.
- `/admin/dashboard/masjid` - Daftar data pengajuan masjid.
- `/admin/dashboard/progres` - Daftar data masjid yang dalam proses pembangunan.
- `/admin/dashboard/tracking/detail/` - Detail progres pembangunan masjid.
- `/admin/dashboard/tracking/tambah/` - Form tambah progres pembangunan.

## API Wilayah

Dropdown wilayah memakai API publik:

```text
https://www.emsifa.com/api-wilayah-indonesia/api
```
