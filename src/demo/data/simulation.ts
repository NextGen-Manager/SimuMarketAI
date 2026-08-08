export type Council = "market" | "persona" | "finance" | "report";

export type AksiJenis =
  | "comment"
  | "challenge"
  | "like"
  | "purchase"
  | "ringkasan"
  | "tool";

export type Aktivitas = {
  council: Council;
  jenis: AksiJenis;
  agent?: string;
  label?: string;
  round: number;
  klaim?: string;
  refs?: string;
  keberatan?: string;
  agents?: string[];
  target?: string;
  teks?: string;
};

export type Langkah = {
  ms: number;
  stage: string;
  persen: number;
  aktivitas?: Aktivitas;
};

export const stages = [
  "Mengumpulkan bukti lokal",
  "Menyusun konteks",
  "Panel persona berjalan",
  "Menghitung skenario finansial",
  "Menilai kelayakan",
  "Menyusun laporan",
  "Memvalidasi klaim",
] as const;

export const councilMeta: Record<
  Council,
  { nama: string; warna: string; bg: string }
> = {
  market: { nama: "Market Analyst", warna: "text-white", bg: "bg-teal-700" },
  persona: { nama: "Customer Persona", warna: "text-white", bg: "bg-ink-500" },
  finance: { nama: "Finance", warna: "text-white", bg: "bg-amber-600" },
  report: { nama: "Report", warna: "text-white", bg: "bg-info-600" },
};

export const langkah: Langkah[] = [
  { ms: 700, stage: "Mengumpulkan bukti lokal", persen: 8 },
  {
    ms: 900,
    stage: "Mengumpulkan bukti lokal",
    persen: 14,
    aktivitas: {
      council: "market",
      jenis: "tool",
      round: 0,
      teks: "osm-overpass · 18 POI kategori F&B pada radius 1,5 km",
    },
  },
  {
    ms: 800,
    stage: "Mengumpulkan bukti lokal",
    persen: 18,
    aktivitas: {
      council: "market",
      jenis: "tool",
      round: 0,
      teks: "bps-population · granularitas hanya sampai kecamatan",
    },
  },
  { ms: 700, stage: "Menyusun konteks", persen: 24 },
  {
    ms: 1000,
    stage: "Panel persona berjalan",
    persen: 30,
    aktivitas: {
      council: "market",
      jenis: "comment",
      agent: "market-scout-01",
      label: "Opportunity Scout",
      round: 0,
      klaim: "M-04",
      teks: "Belum ada kedai dengan area kerja khusus di radius 800 m. Celah untuk segmen pekerja lepas terbuka.",
    },
  },
  {
    ms: 1100,
    stage: "Panel persona berjalan",
    persen: 34,
    aktivitas: {
      council: "market",
      jenis: "challenge",
      agent: "market-skeptic-01",
      label: "Competition Skeptic",
      round: 1,
      refs: "M-04",
      teks: "Dua coworking di Tebet menyediakan kopi gratis untuk member. Substitusi tidak dihitung dalam klaim ini.",
    },
  },
  {
    ms: 1000,
    stage: "Panel persona berjalan",
    persen: 38,
    aktivitas: {
      council: "market",
      jenis: "challenge",
      agent: "market-auditor-01",
      label: "Evidence Auditor",
      round: 1,
      refs: "M-04",
      teks: "Coverage POI tidak diketahui untuk kategori kedai kecil. Confidence klaim diturunkan ke 0,55.",
    },
  },
  {
    ms: 900,
    stage: "Panel persona berjalan",
    persen: 43,
    aktivitas: {
      council: "persona",
      jenis: "comment",
      agent: "budget-01",
      label: "Mahasiswa hemat",
      round: 1,
      keberatan: "harga",
      teks: "Rp 25.000 di atas batas nyaman saya untuk kopi harian. Kalau ada promo mingguan, saya pertimbangkan.",
    },
  },
  {
    ms: 700,
    stage: "Panel persona berjalan",
    persen: 47,
    aktivitas: {
      council: "persona",
      jenis: "like",
      round: 1,
      agents: ["quality-03", "social-02", "conven-04"],
      target: "concept-a",
    },
  },
  {
    ms: 900,
    stage: "Panel persona berjalan",
    persen: 51,
    aktivitas: {
      council: "persona",
      jenis: "comment",
      agent: "quality-03",
      label: "Pencari rasa",
      round: 2,
      teks: "Kalau bijinya single origin dan barista bisa jelaskan asalnya, harga segitu masuk akal buat saya.",
    },
  },
  {
    ms: 800,
    stage: "Panel persona berjalan",
    persen: 55,
    aktivitas: {
      council: "persona",
      jenis: "purchase",
      agent: "conven-02",
      label: "Komuter terburu-buru",
      round: 2,
      target: "concept-a",
    },
  },
  {
    ms: 700,
    stage: "Panel persona berjalan",
    persen: 58,
    aktivitas: {
      council: "persona",
      jenis: "ringkasan",
      round: 2,
      teks: "4 dari 16 persona tidak merespons pada round ini.",
    },
  },
  {
    ms: 1000,
    stage: "Menghitung skenario finansial",
    persen: 66,
    aktivitas: {
      council: "finance",
      jenis: "tool",
      round: 3,
      teks: "finance-calculator · base · BEP bulan ke-4 · marjin kontribusi 62%",
    },
  },
  {
    ms: 900,
    stage: "Menghitung skenario finansial",
    persen: 71,
    aktivitas: {
      council: "finance",
      jenis: "challenge",
      agent: "finance-auditor-01",
      label: "Assumption Auditor",
      round: 3,
      refs: "F-02",
      teks: "Biaya operasional bulanan diisi manual pengguna, bukan dari kuotasi pemasok. Skenario optimis tidak dapat diverifikasi.",
    },
  },
  { ms: 900, stage: "Menilai kelayakan", persen: 79 },
  {
    ms: 1000,
    stage: "Menyusun laporan",
    persen: 87,
    aktivitas: {
      council: "report",
      jenis: "challenge",
      agent: "report-redteam-01",
      label: "Red-team Reviewer",
      round: 4,
      refs: "R-07",
      teks: "Draf menyebut 'permintaan tinggi' tanpa menunjuk artifact. Klaim ditolak sampai ada evidence ID.",
    },
  },
  { ms: 900, stage: "Memvalidasi klaim", persen: 95 },
  { ms: 600, stage: "Memvalidasi klaim", persen: 100 },
];

/** Ekor alternatif untuk varian parsial: simulasi gagal di tengah. */
export const langkahParsial: Langkah[] = [
  ...langkah.slice(0, 8),
  {
    ms: 1400,
    stage: "Panel persona berjalan",
    persen: 47,
    aktivitas: {
      council: "persona",
      jenis: "ringkasan",
      round: 1,
      teks: "Penyedia AI tidak merespons dalam batas waktu. Simulasi persona dihentikan.",
    },
  },
  {
    ms: 1000,
    stage: "Menghitung skenario finansial",
    persen: 62,
    aktivitas: {
      council: "finance",
      jenis: "tool",
      round: 3,
      teks: "finance-calculator · base · BEP bulan ke-4 · marjin kontribusi 62%",
    },
  },
  { ms: 900, stage: "Menilai kelayakan", persen: 78 },
  { ms: 900, stage: "Menyusun laporan", persen: 90 },
  { ms: 700, stage: "Memvalidasi klaim", persen: 100 },
];

export const ballot = {
  baseline: { minat: 5, pertimbangkan: 7, tolak: 4 },
  final: { minat: 7, pertimbangkan: 6, tolak: 3 },
  keberatan: [
    { label: "Harga di atas batas nyaman", jumlah: 6 },
    { label: "Porsi/ukuran tidak jelas", jumlah: 3 },
    { label: "Lokasi kurang terjangkau", jumlah: 2 },
    { label: "Sudah punya langganan", jumlah: 2 },
  ],
};
