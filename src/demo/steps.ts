/** Sumber urutan tunggal untuk stepper, navigasi, dan autoplay. */
export const steps = [
  { id: "upload", label: "Upload Dokumen", short: "Upload", href: "/upload" },
  { id: "analisis", label: "Analisis AI", short: "Analisis", href: "/analisis" },
  { id: "review", label: "Review Bisnis", short: "Review", href: "/review" },
  { id: "pasar", label: "Setup Pasar", short: "Pasar", href: "/pasar" },
  { id: "simulasi", label: "Simulasi", short: "Simulasi", href: "/simulasi" },
  { id: "laporan", label: "Laporan", short: "Laporan", href: "/laporan" },
  { id: "diskusi", label: "Diskusi", short: "Diskusi", href: "/diskusi" },
] as const;

export type StepId = (typeof steps)[number]["id"];

export function stepIndex(id: StepId): number {
  return steps.findIndex((s) => s.id === id);
}

export function stepByPath(pathname: string) {
  return steps.find((s) => pathname.startsWith(s.href));
}
