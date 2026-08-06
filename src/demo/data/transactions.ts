export type Produk = {
  id: string;
  nama: string;
  harga: number;
  hpp: number;
  kategori: string;
  aktif: boolean;
};

export const produkAwal: Produk[] = [
  { id: "p1", nama: "Es Kopi Susu Gula Aren", harga: 20000, hpp: 7200, kategori: "Minuman", aktif: true },
  { id: "p2", nama: "Manual Brew V60", harga: 28000, hpp: 9800, kategori: "Minuman", aktif: true },
  { id: "p3", nama: "Americano", harga: 18000, hpp: 5400, kategori: "Minuman", aktif: true },
  { id: "p4", nama: "Croissant Butter", harga: 22000, hpp: 12500, kategori: "Pastry", aktif: true },
  { id: "p5", nama: "Brownies Fudge", harga: 18000, hpp: 8900, kategori: "Pastry", aktif: true },
];

export type Transaksi = {
  id: string;
  produkId: string;
  jumlah: number;
  harga: number;
  kanal: "Dine-in" | "Takeaway" | "Delivery";
  waktu: string;
};

/** Tujuh hari data agar gerbang analitik bisa dibuka saat demo. */
const pola: Record<string, number[]> = {
  p1: [22, 25, 19, 28, 31, 34, 29],
  p2: [8, 6, 9, 7, 11, 13, 10],
  p3: [12, 14, 11, 15, 13, 16, 14],
  p4: [5, 4, 6, 5, 7, 8, 6],
  p5: [2, 1, 2, 0, 1, 2, 1],
};

export const hariLabel = [
  "30 Jul",
  "31 Jul",
  "1 Agu",
  "2 Agu",
  "3 Agu",
  "4 Agu",
  "5 Agu",
];

export function pendapatanPerHari(): number[] {
  return hariLabel.map((_, i) =>
    produkAwal.reduce((total, p) => total + (pola[p.id]?.[i] ?? 0) * p.harga, 0),
  );
}

export function ringkasProduk() {
  return produkAwal.map((p) => {
    const qty = (pola[p.id] ?? []).reduce((a, b) => a + b, 0);
    const pendapatan = qty * p.harga;
    const marjin = Math.round(((p.harga - p.hpp) / p.harga) * 100);
    return { ...p, qty, pendapatan, marjin };
  });
}

/** Hari data yang sudah tercatat. Gerbang analitik terbuka di 7. */
export const hariTercatatAwal = 5;
export const AMBANG_HARI = 7;

/** Minimum exposure sebelum produk boleh masuk daftar terendah. */
export const MIN_EXPOSURE = 5;

export const insight = [
  {
    judul: "Es Kopi Susu Gula Aren menopang sebagian besar pendapatan",
    isi: "Menyumbang 54% pendapatan tujuh hari terakhir. Ketergantungan pada satu produk membuat penjualan rapuh bila stok gula aren terganggu.",
    aksi: "Pastikan pemasok cadangan tersedia.",
    window: "Observation window: 7 hari · sejak 30 Juli 2026",
  },
  {
    judul: "Brownies Fudge belum menutup biaya",
    isi: "Terjual 9 porsi dalam 7 hari dengan marjin 51%. Volume terlalu rendah untuk menutup porsi produksi harian.",
    aksi: "Pertimbangkan mengurangi produksi harian atau menguji harga promo.",
    window: "Observation window: 7 hari · exposure memenuhi ambang minimum",
  },
  {
    judul: "Penjualan naik menjelang akhir pekan",
    isi: "Pendapatan Jumat dan Sabtu 28% di atas rata-rata hari kerja.",
    aksi: "Tambah stok bahan utama untuk dua hari itu.",
    window: "Observation window: 7 hari · pola belum tentu berulang",
  },
];

/** Draft hasil OCR foto struk — selalu draft, tidak pernah transaksi final. */
export const strukDraft = {
  merchant: { nilai: "Kedai Kopi Senja", confidence: 0.94 },
  tanggal: { nilai: "5 Agustus 2026, 12:10", confidence: 0.81 },
  items: [
    {
      raw: "ES KOPI SUSU GLA AREN",
      cocok: "p1",
      jumlah: 2,
      harga: 20000,
      confidence: 0.76,
    },
    {
      raw: "AMERICANO",
      cocok: "p3",
      jumlah: 1,
      harga: 18000,
      confidence: 0.93,
    },
    {
      raw: "CROISSANT BTR",
      cocok: "p4",
      jumlah: 1,
      harga: 22000,
      confidence: 0.68,
    },
  ],
  total: { nilai: 80000, confidence: 0.92 },
};
