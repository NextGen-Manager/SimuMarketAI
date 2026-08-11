import type { FieldStatus } from "@/components/ui/StatusBadge";

export type Kompetitor = {
  nama: string;
  catatan: string;
  sumber: "evidence" | "user_reported";
};

export type Produk = {
  nama: string;
  varian: string;
  hargaMin: number;
  hargaMaks: number;
};

export const profilAwal = {
  ringkasanUsaha: {
    status: "terdeteksi" as FieldStatus,
    namaIde: "Kopi Kenangan Senja",
    jenisBisnis: "F&B, Kedai Kopi Spesialti",
    deskripsi:
      "Kedai kopi berkonsep modern minimalis yang menyajikan biji kopi lokal Nusantara dengan teknik seduh manual dan mesin espresso standar industri. Fokus pada pengalaman pelanggan dan suasana kerja yang nyaman.",
    usp: "Menggunakan 100% biji kopi petani lokal dengan sistem fair-trade, serta menawarkan kelas seduh kopi mingguan untuk pelanggan.",
  },
  targetPelanggan: {
    status: "perlu-dikonfirmasi" as FieldStatus,
    segmen: "Mahasiswa & Pekerja Lepas",
    lokasi: "Tebet, Jakarta Selatan (radius 1,5 km)",
    kebiasaan:
      "Mencari tempat dengan WiFi cepat, colokan banyak, dan harga kopi di bawah Rp 35.000.",
  },
  produkHarga: {
    status: "terdeteksi" as FieldStatus,
    items: [
      {
        nama: "Es Kopi Susu Gula Aren",
        varian: "Regular, Large",
        hargaMin: 18000,
        hargaMaks: 22000,
      },
      {
        nama: "Manual Brew V60",
        varian: "Gayo, Toraja, Bali",
        hargaMin: 25000,
        hargaMaks: 30000,
      },
      {
        nama: "Pastry & Snacks",
        varian: "Croissant, Brownies, Fries",
        hargaMin: 15000,
        hargaMaks: 25000,
      },
    ] as Produk[],
  },
  asumsiFinansial: {
    status: "perlu-dilengkapi" as FieldStatus,
    modalAwal: 150_000_000,
    /** Sengaja kosong untuk memicu blok kesiapan data dan menurunkan confidence. */
    biayaOperasionalBulanan: null as number | null,
    hppPerCup: 8_500,
    targetHarian: "50 – 70 cup",
  },
  kompetitor: {
    status: "terdeteksi" as FieldStatus,
    sumber: "OpenStreetMap",
    diambil: "3 hari lalu",
    items: [
      {
        nama: "Kopi Janji Manis",
        catatan: "Fokus pada harga murah (Rp 15rb). Tidak ada area kerja khusus.",
        sumber: "evidence",
      },
      {
        nama: "Cafe Ruang Bersama",
        catatan: "Fasilitas coworking lengkap, namun harga kopi premium (>Rp 35rb).",
        sumber: "evidence",
      },
    ] as Kompetitor[],
  },
};

export type Profil = typeof profilAwal;
