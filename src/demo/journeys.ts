/** Dua journey dari proposal §5.11. */
export type JourneyId = "A" | "B";

export const journeys = {
  A: {
    id: "A" as const,
    nama: "Calon Pengusaha F&B",
    pertanyaan: "Layak tidak saya buka kedai di lokasi ini?",
    modul: "Market Analysis",
    ringkas: "4 agent berdeliberasi · Launch Readiness Score",
    langkah: [
      { label: "Isi lokasi, harga, modal", href: "/demo/analisis/input" },
      { label: "Selesaikan modul edukasi", href: "/demo/edukasi" },
      { label: "Konfirmasi input", href: "/demo/analisis/konfirmasi" },
      { label: "Empat agent berjalan", href: "/demo/analisis/proses" },
      { label: "Baca laporan", href: "/demo/laporan/RPT-2026-0087" },
    ],
    mulai: "/demo/analisis/input",
  },
  B: {
    id: "B" as const,
    nama: "Pemilik Usaha F&B",
    pertanyaan: "Produk mana yang jalan, mana yang tidak?",
    modul: "Transaction Management",
    ringkas: "Catat harian · analitik setelah 7 hari",
    langkah: [
      { label: "Daftarkan produk", href: "/demo/transaksi/produk" },
      { label: "Catat transaksi harian", href: "/demo/transaksi/catat" },
      { label: "Atau unggah foto struk", href: "/demo/transaksi/struk" },
      { label: "Buka analitik", href: "/demo/transaksi/analitik" },
    ],
    mulai: "/demo/transaksi/produk",
  },
} as const;

/** Rute Journey A, dipakai stepper dan autoplay. */
export const stepsA = [
  { id: "input", label: "Input", href: "/demo/analisis/input" },
  { id: "edukasi", label: "Edukasi", href: "/demo/edukasi" },
  { id: "konfirmasi", label: "Konfirmasi", href: "/demo/analisis/konfirmasi" },
  { id: "proses", label: "Simulasi", href: "/demo/analisis/proses" },
  { id: "laporan", label: "Laporan", href: "/demo/laporan/RPT-2026-0087" },
  { id: "diskusi", label: "Diskusi", href: "/demo/diskusi" },
] as const;

/** Rute Journey B. */
export const stepsB = [
  { id: "produk", label: "Produk", href: "/demo/transaksi/produk" },
  { id: "catat", label: "Catat", href: "/demo/transaksi/catat" },
  { id: "struk", label: "Struk", href: "/demo/transaksi/struk" },
  { id: "analitik", label: "Analitik", href: "/demo/transaksi/analitik" },
] as const;

export type StepId = (typeof stepsA)[number]["id"] | (typeof stepsB)[number]["id"];

export function stepsFor(j: JourneyId) {
  return j === "A" ? stepsA : stepsB;
}
