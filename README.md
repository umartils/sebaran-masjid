# MasjidCare Map

Website Next.js untuk menampilkan persebaran bangunan masjid di peta, mencari titik berdasarkan data bangunan, dan menginput data bangunan dengan dropdown wilayah Indonesia.

## Fitur

- Peta Leaflet dengan titik lokasi dari data latitude dan longitude.
- Popup detail interaktif pada marker.
- Sidebar navigasi yang bisa disembunyikan dan otomatis collapsed di mobile.
- Search berdasarkan nama, alamat, wilayah, kondisi, material, dan status lahan.
- Form input data bangunan dengan dropdown provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan dari API eksternal.
- Tombol ambil titik koordinat otomatis dari geolocation browser.
- API Next.js untuk membaca dan menyimpan data ke PostgreSQL melalui Prisma.

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
- `/input` - Formulir pendataan bangunan.
- `/admin` - Ringkasan data bangunan.

## API Wilayah

Dropdown wilayah memakai API publik:

```text
https://www.emsifa.com/api-wilayah-indonesia/api
```

Fix error