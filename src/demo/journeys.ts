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
      { label: "Isi lokasi, harga, modal", href: "/analisis/input" },
      { label: "Selesaikan modul edukasi", href: "/edukasi" },
      { label: "Konfirmasi input", href: "/analisis/konfirmasi" },
      { label: "Empat agent berjalan", href: "/analisis/proses" },
      { label: "Baca laporan", href: "/laporan" },
    ],
    mulai: "/analisis/input",
  },
  B: {
    id: "B" as const,
    nama: "Pemilik Usaha F&B",
    pertanyaan: "Produk mana yang jalan, mana yang tidak?",
    modul: "Transaction Management",
    ringkas: "Catat harian · analitik setelah 7 hari",
    langkah: [
      { label: "Daftarkan produk", href: "/transaksi/produk" },
      { label: "Catat transaksi harian", href: "/transaksi/catat" },
      { label: "Atau unggah foto struk", href: "/transaksi/struk" },
      { label: "Buka analitik", href: "/transaksi/analitik" },
    ],
    mulai: "/transaksi/produk",
  },
} as const;

/** Rute Journey A, dipakai stepper dan autoplay. */
export const stepsA = [
  { id: "input", label: "Input", href: "/analisis/input" },
  { id: "edukasi", label: "Edukasi", href: "/edukasi" },
  { id: "konfirmasi", label: "Konfirmasi", href: "/analisis/konfirmasi" },
  { id: "proses", label: "Simulasi", href: "/analisis/proses" },
  { id: "laporan", label: "Laporan", href: "/laporan" },
  { id: "diskusi", label: "Diskusi", href: "/diskusi" },
] as const;

/** Rute Journey B. */
export const stepsB = [
  { id: "produk", label: "Produk", href: "/transaksi/produk" },
  { id: "catat", label: "Catat", href: "/transaksi/catat" },
  { id: "analitik", label: "Analitik", href: "/transaksi/analitik" },
] as const;

export type StepId = (typeof stepsA)[number]["id"] | (typeof stepsB)[number]["id"];

export function stepsFor(j: JourneyId) {
  return j === "A" ? stepsA : stepsB;
}
