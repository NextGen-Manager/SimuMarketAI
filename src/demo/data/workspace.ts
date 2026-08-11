export const workspaceSource = {
  label: "Fixture demo workspace-v1",
  observedAt: "9 Agustus 2026, 08.00 WIB",
  confidence: "Data seed terverifikasi untuk demo",
} as const;

export type BusinessProduct = {
  id: string;
  name: string;
  category: string;
  sellingPriceIdr: number;
  costIdr: number | null;
  marginPercent: number | null;
  status: "Aktif" | "Nonaktif";
};

export type BusinessCatalog = {
  id: string;
  name: string;
  area: string;
  products: BusinessProduct[];
};

export const businessAnalyticsSeed = {
  period: "3–9 Agustus 2026",
  composite: {
    revenueIdr: 28_740_000,
    transactions: 1_086,
    averageTicketIdr: 26_464,
    activeBusinesses: 2,
    revenueChangePercent: 12,
  },
  businesses: [
    {
      id: "kopi-senja",
      name: "Kopi Senja",
      area: "Tebet, Jakarta Selatan",
      revenueIdr: 18_460_000,
      transactions: 742,
      averageTicketIdr: 24_879,
      revenueChangePercent: 16,
      topProduct: "Es Kopi Susu Gula Aren",
      topProductSharePercent: 54,
      busiestWindow: "12.00–13.00",
      daysRecorded: 21,
      dailyRevenue: [
        { label: "Sen", valueIdr: 2_180_000, heightPercent: 58 },
        { label: "Sel", valueIdr: 2_420_000, heightPercent: 64 },
        { label: "Rab", valueIdr: 2_310_000, heightPercent: 61 },
        { label: "Kam", valueIdr: 2_670_000, heightPercent: 71 },
        { label: "Jum", valueIdr: 3_080_000, heightPercent: 82 },
        { label: "Sab", valueIdr: 3_760_000, heightPercent: 100 },
        { label: "Min", valueIdr: 2_040_000, heightPercent: 54 },
      ],
      products: [
        { name: "Es Kopi Susu Gula Aren", revenueIdr: 9_968_400, sharePercent: 54, unitsSold: 188, rank: "Terlaris" },
        { name: "Americano", revenueIdr: 3_507_400, sharePercent: 19, unitsSold: 96, rank: "Normal" },
        { name: "Manual Brew V60", revenueIdr: 2_584_400, sharePercent: 14, unitsSold: 61, rank: "Normal" },
        { name: "Brownies Fudge", revenueIdr: 553_800, sharePercent: 3, unitsSold: 9, rank: "Terendah" },
      ],
      hourlySales: [
        { label: "08", transactions: 18, heightPercent: 29 },
        { label: "10", transactions: 31, heightPercent: 50 },
        { label: "12", transactions: 62, heightPercent: 100 },
        { label: "14", transactions: 38, heightPercent: 61 },
        { label: "16", transactions: 29, heightPercent: 47 },
        { label: "18", transactions: 46, heightPercent: 74 },
        { label: "20", transactions: 21, heightPercent: 34 },
      ],
      insights: [
        { title: "Penjualan terkonsentrasi saat makan siang", body: "Pukul 12.00–13.00 menjadi jendela transaksi terpadat.", action: "Siapkan stok dan kru sebelum pukul 11.30.", evidence: "62 transaksi · agregat per jam · 3–9 Agustus 2026" },
        { title: "Brownies Fudge perlu dievaluasi", body: "Produk tetap memiliki marjin positif, tetapi volumenya paling rendah.", action: "Uji bundling sebelum mengurangi produk dari katalog.", evidence: "9 porsi · marjin 51% · 7 hari" },
      ],
      recommendations: [
        { title: "Kurangi ketergantungan pada satu menu", body: "Dorong Americano dan Manual Brew melalui penempatan menu agar pendapatan tidak bergantung pada satu produk.", evidence: "54% pendapatan berasal dari Es Kopi Susu Gula Aren · 7 hari" },
      ],
    },
    {
      id: "dapur-rasa",
      name: "Dapur Rasa",
      area: "Beji, Depok",
      revenueIdr: 10_280_000,
      transactions: 344,
      averageTicketIdr: 29_884,
      revenueChangePercent: 6,
      topProduct: "Nasi Ayam Sambal Matah",
      topProductSharePercent: 41,
      busiestWindow: "11.00–13.00",
      daysRecorded: 14,
      dailyRevenue: [
        { label: "Sen", valueIdr: 1_210_000, heightPercent: 61 },
        { label: "Sel", valueIdr: 1_390_000, heightPercent: 70 },
        { label: "Rab", valueIdr: 1_280_000, heightPercent: 64 },
        { label: "Kam", valueIdr: 1_510_000, heightPercent: 76 },
        { label: "Jum", valueIdr: 1_740_000, heightPercent: 87 },
        { label: "Sab", valueIdr: 1_990_000, heightPercent: 100 },
        { label: "Min", valueIdr: 1_160_000, heightPercent: 58 },
      ],
      products: [
        { name: "Nasi Ayam Sambal Matah", revenueIdr: 4_214_800, sharePercent: 41, unitsSold: 132, rank: "Terlaris" },
        { name: "Rice Bowl Rendang", revenueIdr: 2_878_400, sharePercent: 28, unitsSold: 82, rank: "Normal" },
        { name: "Es Teh Lemon", revenueIdr: 1_644_800, sharePercent: 16, unitsSold: 137, rank: "Normal" },
        { name: "Puding Gula Aren", revenueIdr: 493_000, sharePercent: 5, unitsSold: 29, rank: "Terendah" },
      ],
      hourlySales: [
        { label: "08", transactions: 9, heightPercent: 24 },
        { label: "10", transactions: 21, heightPercent: 55 },
        { label: "12", transactions: 38, heightPercent: 100 },
        { label: "14", transactions: 25, heightPercent: 66 },
        { label: "16", transactions: 14, heightPercent: 37 },
        { label: "18", transactions: 27, heightPercent: 71 },
        { label: "20", transactions: 11, heightPercent: 29 },
      ],
      insights: [
        { title: "Permintaan tertinggi terjadi saat makan siang", body: "Jendela pukul 11.00–13.00 menyumbang aktivitas terbesar.", action: "Siapkan bahan utama sebelum layanan makan siang dimulai.", evidence: "38 transaksi pada pukul 12.00 · agregat per jam · 3–9 Agustus 2026" },
        { title: "Puding Gula Aren berada di peringkat terbawah", body: "Volume produk lebih rendah daripada menu lain pada periode yang sama.", action: "Uji penempatan dekat kasir selama satu minggu berikutnya.", evidence: "29 porsi · agregat produk · 7 hari" },
      ],
      recommendations: [
        { title: "Pertahankan fokus pada menu makan siang", body: "Kapasitas persiapan lebih penting daripada menambah variasi menu pada jam puncak.", evidence: "Jendela teramai 11.00–13.00 · 14 hari data terkonfirmasi" },
      ],
    },
  ],
  source: workspaceSource,
} as const;

export const businessProductsSeed: BusinessCatalog[] = [
  {
    id: "kopi-senja",
    name: "Kopi Senja",
    area: "Tebet, Jakarta Selatan",
    products: [
      { id: "KS-001", name: "Es Kopi Susu Gula Aren", category: "Minuman", sellingPriceIdr: 20_000, costIdr: 7_200, marginPercent: 64, status: "Aktif" },
      { id: "KS-002", name: "Manual Brew V60", category: "Minuman", sellingPriceIdr: 28_000, costIdr: 9_800, marginPercent: 65, status: "Aktif" },
      { id: "KS-003", name: "Americano", category: "Minuman", sellingPriceIdr: 18_000, costIdr: 5_400, marginPercent: 70, status: "Aktif" },
      { id: "KS-004", name: "Croissant Butter", category: "Pastry", sellingPriceIdr: 22_000, costIdr: 12_500, marginPercent: 43, status: "Aktif" },
      { id: "KS-005", name: "Brownies Fudge", category: "Pastry", sellingPriceIdr: 18_000, costIdr: 8_900, marginPercent: 51, status: "Aktif" },
    ],
  },
  {
    id: "dapur-rasa",
    name: "Dapur Rasa",
    area: "Beji, Depok",
    products: [
      { id: "DR-001", name: "Nasi Ayam Sambal Matah", category: "Makanan utama", sellingPriceIdr: 32_000, costIdr: 15_600, marginPercent: 51, status: "Aktif" },
      { id: "DR-002", name: "Rice Bowl Rendang", category: "Makanan utama", sellingPriceIdr: 35_000, costIdr: 18_200, marginPercent: 48, status: "Aktif" },
      { id: "DR-003", name: "Es Teh Lemon", category: "Minuman", sellingPriceIdr: 12_000, costIdr: 4_100, marginPercent: 66, status: "Aktif" },
      { id: "DR-004", name: "Puding Gula Aren", category: "Pencuci mulut", sellingPriceIdr: 16_000, costIdr: 7_800, marginPercent: 51, status: "Nonaktif" },
    ],
  },
];

export const businessReceiptSeeds = {
  "kopi-senja": {
    merchant: "Kedai Kopi Senja",
    date: "5 Agustus 2026, 12.10 WIB",
    totalIdr: 80_000,
    items: [
      { raw: "ES KOPI SUSU GLA AREN", productId: "KS-001", quantity: 2, unitPriceIdr: 20_000, confidencePercent: 76 },
      { raw: "AMERICANO", productId: "KS-003", quantity: 1, unitPriceIdr: 18_000, confidencePercent: 93 },
      { raw: "CROISSANT BTR", productId: "KS-004", quantity: 1, unitPriceIdr: 22_000, confidencePercent: 68 },
    ],
  },
  "dapur-rasa": {
    merchant: "Dapur Rasa",
    date: "7 Agustus 2026, 12.24 WIB",
    totalIdr: 111_000,
    items: [
      { raw: "NASI AYM SMBL MTH", productId: "DR-001", quantity: 2, unitPriceIdr: 32_000, confidencePercent: 72 },
      { raw: "RICE BOWL RNDG", productId: "DR-002", quantity: 1, unitPriceIdr: 35_000, confidencePercent: 86 },
      { raw: "ES TEH LEMON", productId: "DR-003", quantity: 1, unitPriceIdr: 12_000, confidencePercent: 91 },
    ],
  },
} as const;

export const analysisHistorySeed = [
  {
    id: "AN-003",
    name: "Kopi Senja, Tebet",
    area: "Tebet, Jakarta Selatan",
    businessType: "Kedai kopi spesialti",
    score: 66,
    interpretation: "Layak dengan mitigasi",
    status: "Selesai",
    createdAt: "11 Agustus 2026, 09.30 WIB",
    confidencePercent: 72,
    ruleVersion: "lrs-v0.2-unvalidated",
    summary: "Lokasi memiliki permintaan yang cukup, dengan risiko utama pada biaya sewa dan ketergantungan pemasok.",
    reportId: "RPT-2026-0087",
  },
  {
    id: "AN-002",
    name: "Kopi Senja, Bekasi Selatan",
    area: "Pekayon, Bekasi Selatan",
    businessType: "Kedai kopi spesialti",
    score: 71,
    interpretation: "Layak dengan mitigasi",
    status: "Selesai",
    createdAt: "2 Agustus 2026, 10.18 WIB",
    confidencePercent: 69,
    ruleVersion: "lrs-v0.1-unvalidated",
    summary: "Daya saing harga lebih baik, tetapi traffic pejalan kaki membutuhkan validasi lapangan tambahan.",
    reportId: "RPT-2026-0082",
  },
  {
    id: "AN-001",
    name: "Kopi Senja, Depok",
    area: "Margonda, Depok",
    businessType: "Kedai kopi spesialti",
    score: 54,
    interpretation: "Perlu validasi",
    status: "Parsial",
    createdAt: "29 Juli 2026, 09.05 WIB",
    confidencePercent: 48,
    ruleVersion: "lrs-v0.1-unvalidated",
    summary: "Komponen persona tidak tersedia. Hasil pasar dan finansial tetap tersimpan tanpa nilai bawaan untuk komponen yang gagal.",
    reportId: "RPT-2026-0074",
  },
  {
    id: "AN-000",
    name: "Dapur Rasa, Beji",
    area: "Beji, Depok",
    businessType: "Warung makan",
    score: 63,
    interpretation: "Perlu evaluasi ulang",
    status: "Selesai",
    createdAt: "24 Juli 2026, 13.27 WIB",
    confidencePercent: 66,
    ruleVersion: "lrs-v0.1-unvalidated",
    summary: "Potensi makan siang cukup kuat, namun kapasitas dapur menjadi batas utama skenario dasar.",
    reportId: "RPT-2026-0069",
  },
] as const;

export const reportHistorySeed = [
  {
    id: "RPT-2026-0087",
    analysisId: "AN-003",
    title: "Kelayakan Kopi Senja di Tebet",
    business: "Kopi Senja",
    area: "Tebet, Jakarta Selatan",
    createdAt: "11 Agustus 2026, 09.34 WIB",
    status: "Lengkap",
    score: 66,
    confidencePercent: 72,
    summary: "Layak dengan mitigasi biaya sewa dan pemasok bahan utama.",
    hasFullReport: true,
  },
  {
    id: "RPT-2026-0082",
    analysisId: "AN-002",
    title: "Kelayakan Kopi Senja di Bekasi Selatan",
    business: "Kopi Senja",
    area: "Pekayon, Bekasi Selatan",
    createdAt: "2 Agustus 2026, 10.22 WIB",
    status: "Lengkap",
    score: 71,
    confidencePercent: 69,
    summary: "Harga bersaing, dengan kebutuhan validasi traffic pada jam operasi utama.",
    hasFullReport: false,
  },
  {
    id: "RPT-2026-0074",
    analysisId: "AN-001",
    title: "Kelayakan Kopi Senja di Depok",
    business: "Kopi Senja",
    area: "Margonda, Depok",
    createdAt: "29 Juli 2026, 09.12 WIB",
    status: "Parsial",
    score: 54,
    confidencePercent: 48,
    summary: "Simulasi persona tidak tersedia; bagian lain tetap dapat diperiksa.",
    hasFullReport: false,
  },
  {
    id: "RPT-2026-0069",
    analysisId: "AN-000",
    title: "Kelayakan Dapur Rasa di Beji",
    business: "Dapur Rasa",
    area: "Beji, Depok",
    createdAt: "24 Juli 2026, 13.31 WIB",
    status: "Lengkap",
    score: 63,
    confidencePercent: 66,
    summary: "Permintaan makan siang menjanjikan, tetapi kapasitas perlu ditambah bertahap.",
    hasFullReport: false,
  },
] as const;
