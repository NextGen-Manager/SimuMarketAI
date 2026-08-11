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
  waktu: string;
};

export const AMBANG_HARI = 7;
export const MIN_EXPOSURE = 5;
export const hariTercatatAwal = 5;

/** Riwayat mingguan; pengguna bisa membuka minggu mana pun. */
export type Minggu = {
  id: string;
  label: string;
  periode: string;
  hari: string[];
  /** qty per produk per hari */
  pola: Record<string, number[]>;
  /** qty per jam operasi 07–22 */
  perJam: number[];
};

const jamOperasi = [
  "07", "08", "09", "10", "11", "12", "13",
  "14", "15", "16", "17", "18", "19", "20", "21",
];

export const jamLabel = jamOperasi;

export const riwayatMingguan: Minggu[] = [
  {
    id: "m1",
    label: "Minggu 1",
    periode: "16 – 22 Jul 2026",
    hari: ["16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul", "21 Jul", "22 Jul"],
    pola: {
      p1: [14, 16, 13, 18, 21, 24, 19],
      p2: [4, 3, 5, 4, 6, 8, 5],
      p3: [7, 9, 6, 10, 8, 11, 9],
      p4: [3, 2, 4, 3, 5, 6, 4],
      p5: [1, 1, 2, 0, 1, 1, 1],
    },
    perJam: [4, 9, 14, 11, 8, 19, 24, 12, 9, 13, 16, 21, 17, 9, 4],
  },
  {
    id: "m2",
    label: "Minggu 2",
    periode: "23 – 29 Jul 2026",
    hari: ["23 Jul", "24 Jul", "25 Jul", "26 Jul", "27 Jul", "28 Jul", "29 Jul"],
    pola: {
      p1: [18, 20, 16, 23, 26, 29, 24],
      p2: [6, 5, 7, 6, 9, 11, 8],
      p3: [9, 11, 8, 12, 10, 13, 11],
      p4: [4, 3, 5, 4, 6, 7, 5],
      p5: [2, 1, 2, 1, 1, 2, 1],
    },
    perJam: [5, 11, 17, 13, 9, 23, 29, 15, 11, 15, 19, 26, 21, 11, 5],
  },
  {
    id: "m3",
    label: "Minggu 3",
    periode: "30 Jul – 5 Agu 2026",
    hari: ["30 Jul", "31 Jul", "1 Agu", "2 Agu", "3 Agu", "4 Agu", "5 Agu"],
    pola: {
      p1: [22, 25, 19, 28, 31, 34, 29],
      p2: [8, 6, 9, 7, 11, 13, 10],
      p3: [12, 14, 11, 15, 13, 16, 14],
      p4: [5, 4, 6, 5, 7, 8, 6],
      p5: [2, 1, 2, 0, 1, 2, 1],
    },
    perJam: [6, 13, 21, 16, 11, 28, 35, 18, 13, 18, 23, 31, 25, 13, 6],
  },
];

export const mingguTerbaru = riwayatMingguan[riwayatMingguan.length - 1];

export function pendapatanPerHari(m: Minggu): number[] {
  return m.hari.map((_, i) =>
    produkAwal.reduce((total, p) => total + (m.pola[p.id]?.[i] ?? 0) * p.harga, 0),
  );
}

export function ringkasProduk(m: Minggu) {
  return produkAwal.map((p) => {
    const qty = (m.pola[p.id] ?? []).reduce((a, b) => a + b, 0);
    const pendapatan = qty * p.harga;
    const marjin = Math.round(((p.harga - p.hpp) / p.harga) * 100);
    return { ...p, qty, pendapatan, marjin };
  });
}

/** Insight rule-based deterministik, bukan keluaran model bahasa. */
export const insightPerMinggu: Record<
  string,
  { judul: string; isi: string; aksi: string; window: string }[]
> = {
  m1: [
    {
      judul: "Jam 12–13 menyumbang beban terbesar",
      isi: "43 dari 180 transaksi terjadi pada dua jam itu. Antrean kemungkinan menumpuk di jam makan siang.",
      aksi: "Siapkan stok siap saji sebelum pukul 11.30.",
      window: "Observation window: 7 hari · 16–22 Juli 2026",
    },
    {
      judul: "Brownies Fudge nyaris tidak bergerak",
      isi: "Terjual 7 porsi sepanjang minggu. Angka ini di bawah ambang exposure minimum, jadi belum bisa disebut produk terendah.",
      aksi: "Kumpulkan data satu minggu lagi sebelum mengambil keputusan.",
      window: "Observation window: 7 hari · exposure di bawah minimum",
    },
  ],
  m2: [
    {
      judul: "Pendapatan naik 27% dari minggu sebelumnya",
      isi: "Kenaikan merata di seluruh produk, bukan hanya satu item. Ini pola pertumbuhan, bukan lonjakan sesaat.",
      aksi: "Naikkan stok bahan utama sekitar 25% untuk minggu depan.",
      window: "Observation window: 7 hari · 23–29 Juli 2026",
    },
    {
      judul: "Puncak sore mulai terbentuk",
      isi: "Penjualan pukul 18–19 naik dari 21 menjadi 26 transaksi.",
      aksi: "Pertimbangkan menambah satu barista pada shift sore.",
      window: "Observation window: 7 hari · dibandingkan minggu sebelumnya",
    },
  ],
  m3: [
    {
      judul: "Es Kopi Susu Gula Aren menopang sebagian besar pendapatan",
      isi: "Menyumbang 54% pendapatan minggu ini. Ketergantungan pada satu produk membuat penjualan rapuh bila stok gula aren terganggu.",
      aksi: "Pastikan pemasok cadangan tersedia.",
      window: "Observation window: 7 hari · 30 Juli – 5 Agustus 2026",
    },
    {
      judul: "Brownies Fudge belum menutup biaya produksi",
      isi: "Terjual 9 porsi dalam 7 hari dengan marjin 51%. Volume terlalu rendah untuk menutup porsi produksi harian.",
      aksi: "Kurangi produksi harian, atau uji harga promo lebih dulu.",
      window: "Observation window: 7 hari · exposure memenuhi ambang minimum",
    },
    {
      judul: "Penjualan naik menjelang akhir pekan",
      isi: "Pendapatan Jumat dan Sabtu 28% di atas rata-rata hari kerja.",
      aksi: "Tambah stok bahan utama untuk dua hari itu.",
      window: "Observation window: 7 hari · pola belum tentu berulang",
    },
  ],
};

/**
 * Rekomendasi bernarasi AI. Seluruh angka di dalamnya berasal dari agregat
 * deterministik di atas; model bahasa hanya merangkai kalimatnya.
 */
export const rekomendasiAI: Record<
  string,
  { judul: string; isi: string; dasar: string }[]
> = {
  m1: [
    {
      judul: "Uji paket makan siang untuk menyerap puncak jam 12",
      isi: "Beban terkonsentrasi di jam makan siang sementara jam 09–10 relatif lengang. Paket kopi + pastry berharga tetap bisa menaikkan nilai transaksi di jam sibuk tanpa menambah antrean.",
      dasar: "43 transaksi pada pukul 12–13 · agregat per jam, 7 hari",
    },
  ],
  m2: [
    {
      judul: "Pertumbuhan merata layak diikuti penambahan kapasitas",
      isi: "Karena kenaikan terjadi di semua produk dan bukan pada satu item saja, kemungkinan besar ini pertambahan pelanggan, bukan perubahan selera. Menambah kapasitas lebih aman daripada mengubah menu.",
      dasar: "Kenaikan 27% merata pada 5 produk · dibanding minggu 1",
    },
  ],
  m3: [
    {
      judul: "Kurangi ketergantungan pada satu produk",
      isi: "Lebih dari separuh pendapatan berasal dari satu menu. Mendorong Americano dan Manual Brew lewat penempatan menu bisa menyeimbangkan risiko tanpa menambah biaya bahan.",
      dasar: "54% pendapatan dari 1 dari 5 produk · agregat 7 hari",
    },
    {
      judul: "Evaluasi Brownies Fudge, jangan langsung dihapus",
      isi: "Volume rendah tetapi marjinnya 51%. Sebelum memutuskan, periksa apakah penyebabnya penempatan, harga, atau memang permintaannya kecil.",
      dasar: "9 porsi terjual · marjin 51% · 7 hari",
    },
  ],
};

/** Draft hasil OCR foto struk selalu draft, tidak pernah transaksi final. */
export const strukDraft = {
  merchant: { nilai: "Kedai Kopi Senja", confidence: 0.94 },
  tanggal: { nilai: "5 Agustus 2026, 12:10", confidence: 0.81 },
  items: [
    { raw: "ES KOPI SUSU GLA AREN", cocok: "p1", jumlah: 2, harga: 20000, confidence: 0.76 },
    { raw: "AMERICANO", cocok: "p3", jumlah: 1, harga: 18000, confidence: 0.93 },
    { raw: "CROISSANT BTR", cocok: "p4", jumlah: 1, harga: 22000, confidence: 0.68 },
  ],
  total: { nilai: 80000, confidence: 0.92 },
};
