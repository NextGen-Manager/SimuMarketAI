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
    state: "usaha_berjalan_data_kurang",
    title: "Hari ini belum ada penjualan tercatat",
    description: "Catat transaksi pertamamu agar rangkaian data harian tetap lengkap.",
    recordedDays: "5 dari 7 hari",
    remainingDays: "Kurang 2 hari lagi",
    progressPercent: 71,
    reward: "Setelah cukup, kamu bisa melihat produk terlaris, jam paling ramai, dan tren pendapatan.",
  },
  today: {
    transactions: "0 transaksi",
    revenueIdr: 0,
    productsActive: "5 produk aktif",
  },
  plan: {
    progress: "2 dari 5 selesai",
    items: [
      { task: "Kumpulkan tiga kuotasi sewa", status: "Selesai", due: "3 Agu", done: true },
      { task: "Bandingkan pemasok gula aren cadangan", status: "Berikutnya", due: "10 Agu", done: false },
      { task: "Negosiasi harga kemasan", status: "Belum dimulai", due: "13 Agu", done: false },
      { task: "Uji menu pada 10 calon pelanggan", status: "Belum dimulai", due: "17 Agu", done: false },
    ],
  },
  latestInsight: {
    eyebrow: "Insight terbaru · 7 hari terakhir",
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
    { id: "AN-003", name: "Kopi Senja", area: "Tebet", score: 68, interpretation: "Layak dengan mitigasi", date: "6 Agu 2026" },
    { id: "AN-002", name: "Kopi Senja", area: "Bekasi Selatan", score: 71, interpretation: "Layak dengan mitigasi", date: "2 Agu 2026" },
    { id: "AN-001", name: "Kopi Senja", area: "Depok", score: 54, interpretation: "Perlu validasi", date: "29 Jul 2026" },
  ],
  ruleVersion: "lrs-v0.1-unvalidated",
} as const;
