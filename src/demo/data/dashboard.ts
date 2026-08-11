export type DashboardNavItem = {
  label: string;
  href: string;
  icon: "home" | "analysis" | "history" | "transaction" | "chart" | "product" | "education" | "report";
  badge?: string;
};

export const dashboardSeed = {
  meta: {
    source: "Fixture demo dashboard-v1",
    observedAt: "9 Agustus 2026, 08.00 WIB",
    confidence: "Data contoh",
  },
  user: {
    name: "Raka",
    initials: "RA",
  },
  businesses: [
    { id: "kopi-senja", name: "Kopi Senja", area: "Tebet, Jakarta Selatan" },
    { id: "dapur-rasa", name: "Dapur Rasa", area: "Depok, Jawa Barat" },
  ],
  navigation: [
    {
      label: "Utama",
      items: [{ label: "Beranda", href: "/demo/dashboard", icon: "home" }],
    },
    {
      label: "Analisis",
      items: [
        { label: "Market Analysis", href: "/demo/analisis/input", icon: "analysis", badge: "3" },
        { label: "Riwayat Analisis", href: "/demo/analisis/riwayat", icon: "history" },
      ],
    },
    {
      label: "Usaha",
      items: [
        { label: "Transaksi", href: "/demo/transaksi/catat", icon: "transaction", badge: "•" },
        { label: "Analitik", href: "/demo/transaksi/analitik", icon: "chart" },
        { label: "Produk", href: "/demo/transaksi/produk", icon: "product", badge: "5" },
      ],
    },
    {
      label: "Belajar",
      items: [
        { label: "Edukasi", href: "/demo/edukasi", icon: "education", badge: "3/4" },
        { label: "Laporan", href: "/demo/laporan", icon: "report" },
      ],
    },
  ] satisfies Array<{ label: string; items: DashboardNavItem[] }>,
  primaryState: {
    state: "multi_usaha_perlu_perhatian",
    title: "Satu dari dua usaha belum mencatat penjualan hari ini",
    description: "Kopi Senja sudah tercatat. Dapur Rasa masih membutuhkan pencatatan agar rangkaian data hariannya tetap lengkap.",
    recordedDays: "2 usaha terdaftar",
    remainingDays: "1 perlu perhatian",
    progressPercent: 50,
    reward: "Ringkasan ini menggabungkan status operasional seluruh usaha. Rincian tersedia di halaman Transaksi dan Analitik.",
  },
  today: {
    transactions: "37 transaksi",
    revenueIdr: 986_000,
    productsActive: "8 produk aktif",
  },
  cashierToday: [
    { businessId: "kopi-senja", transactions: "24 transaksi", revenueIdr: 612_000, lastEntry: "Es Kopi Susu Gula Aren · 08.14 WIB", shift: "Pagi · 07.00–15.00 WIB" },
    { businessId: "dapur-rasa", transactions: "13 transaksi", revenueIdr: 374_000, lastEntry: "Nasi Ayam Sambal Matah · 08.09 WIB", shift: "Pagi · 07.00–15.00 WIB" },
  ],
  plan: {
    progress: "1 dari 4 selesai",
    items: [
      { task: "Kopi Senja · Kumpulkan tiga kuotasi sewa", status: "Selesai", due: "3 Agu", done: true },
      { task: "Kopi Senja · Bandingkan pemasok gula aren", status: "Berikutnya", due: "10 Agu", done: false },
      { task: "Dapur Rasa · Evaluasi kapasitas makan siang", status: "Berikutnya", due: "12 Agu", done: false },
      { task: "Dapur Rasa · Uji menu pada 10 pelanggan", status: "Belum dimulai", due: "17 Agu", done: false },
    ],
  },
  latestInsight: {
    eyebrow: "Kopi Senja · Insight terbaru · 7 hari terakhir",
    title: "Es Kopi Susu menjadi penopang utama pendapatan",
    body: "Ketergantungan pada satu menu membuat penjualan lebih rentan saat bahan utama terganggu.",
    evidence: "54% pendapatan · agregat transaksi terkonfirmasi",
  },
  education: {
    progress: "3 dari 4 topik",
    progressPercent: 75,
    next: "Mengelola bahan baku dan pemasok",
  },
  analyses: [
    { id: "AN-003", name: "Kopi Senja", area: "Tebet", score: 66, interpretation: "Layak dengan mitigasi", date: "11 Agu 2026" },
    { id: "AN-002", name: "Kopi Senja", area: "Bekasi Selatan", score: 71, interpretation: "Layak dengan mitigasi", date: "2 Agu 2026" },
    { id: "AN-001", name: "Kopi Senja", area: "Depok", score: 54, interpretation: "Perlu validasi", date: "29 Jul 2026" },
  ],
  ruleVersion: "lrs-v0.2-unvalidated",
} as const;
