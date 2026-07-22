import { Masjid } from "@/lib/types";
// import { KondisiMasjid, KategoriMasjid } from "@/lib/validation";

export function mapMasjidToForm(masjid: Masjid) {
  return {
    // Informasi umum
    nama: masjid.nama ?? "",
    alamat: masjid.alamat ?? "",

    idProvinsi: masjid.idProvinsi ?? "",
    idKota: masjid.idKota ?? "",
    idKecamatan: masjid.idKecamatan ?? "",
    idDesa: masjid.idDesa ?? "",

    latitude: masjid.latitude?.toString() ?? "",
    longitude: masjid.longitude?.toString() ?? "",

    // kondisi: masjid.kondisi ?? "",
    kategori: masjid.kategori ?? "",

    // Fisik bangunan
    kapasitas: masjid.kapasitas?.toString() ?? "",
    tahunDibangun: masjid.tahunDibangun?.toString() ?? "",
    budgetAwal: masjid.budgetAwal?.toString() ?? "",

    luasSekarang: masjid.luasSekarang ?? "",
    materialUtama: masjid.materialUtama ?? "",
    statusPerluasan: masjid.statusPerluasan ?? "",
    riwayatRenovasi: masjid.riwayatRenovasi ?? "",
    targetPerluasan: masjid.targetPerluasan ?? "",

    // Legalitas & kerusakan
    statusTanah: masjid.statusTanah ?? "",
    statusListrik: masjid.statusListrik ?? "",
    waktuKerusakan: masjid.waktuKerusakan ?? "",
    alasan: masjid.alasan ?? "",
    detail: masjid.detail ?? "",
    dampakKerusakan: masjid.dampakKerusakan ?? "",
    hambatanAktivitas: masjid.hambatanAktivitas ?? "",
    kondisiHujan: masjid.kondisiHujan ?? "",
    riwayatRoboh: masjid.riwayatRoboh ?? "",
    usahaPerbaikan: masjid.usahaPerbaikan ?? "",
    riwayatMenerimaBantuan: masjid.riwayatMenerimaBantuan ?? "",

    // Data masyarakat
    kkMuslim: masjid.kkMuslim?.toString() ?? "",
    jumlahJamaah: masjid.jumlahJamaah ?? "",
    avgProfesiJamaah: masjid.avgProfesiJamaah ?? "",
    avgGajiJamaah: masjid.avgGajiJamaah ?? "",
    usahaJamaah: masjid.usahaJamaah ?? "",

    // Akses & lingkungan
    jarakKeKota: masjid.jarakKeKota ?? "",
    waktuTempuhKeKota: masjid.waktuTempuhKeKota ?? "",
    kondisiAksesKota: masjid.kondisiAksesKota ?? "",
    kondisiAksesDesa: masjid.kondisiAksesDesa ?? "",
    jenisKendaraan: masjid.jenisKendaraan ?? "",
    hambatanAkses: masjid.hambatanAkses ?? "",
    gantiNama: masjid.gantiNama ?? "",
    masjidTerdekat: masjid.masjidTerdekat ?? "",
    aksesMasjidTerdekat: masjid.aksesMasjidTerdekat ?? "",
    jarakKeMasjidTerdekat: masjid.jarakKeMasjidTerdekat ?? "",
    alasanTidakPilihTerdekat: masjid.alasanTidakPilihTerdekat ?? "",

    // Aktivitas ibadah
    kelayakan: masjid.kelayakan ?? "",
    aktivitasMasjid: masjid.aktivitasMasjid ?? "",
    jamaahSubuh: masjid.jamaahSubuh ?? "",
    jumlahSantri: masjid.jumlahSantri ?? "",

    // PIC
    namaPic: masjid.namaPic ?? "",
    jabatanPic: masjid.jabatanPic ?? "",
    kontakPic: masjid.kontakPic ?? "",
    catatan: masjid.catatan ?? "",

    // Relawan
    namaRelawan: masjid.namaRelawan ?? "",
    noTelpRelawan: masjid.noTelpRelawan ?? "",
  };
}