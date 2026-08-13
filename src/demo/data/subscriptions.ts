export type SubscriptionPlanId = "free" | "premium" | "institutional";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  audience: string;
  description: string;
  priceIdr: number | null;
  priceLabel: string;
  billingLabel: string;
  actionLabel: string;
  featured: boolean;
  features: readonly string[];
};

export const subscriptionSeed = {
  meta: {
    source: "Rancangan model bisnis SimuMarket AI",
    observedAt: "13 Agustus 2026",
    confidence: "Harga usulan untuk validasi",
  },
  plans: [
    {
      id: "free",
      name: "Free",
      audience: "Mulai dan kenali usahamu",
      description:
        "Untuk pemilik usaha yang ingin mulai belajar dan membangun kebiasaan mencatat.",
      priceIdr: 0,
      priceLabel: "Gratis",
      billingLabel: "selamanya",
      actionLabel: "Pilih Free",
      featured: false,
      features: [
        "Edukasi bisnis dasar",
        "Setup usaha dan katalog produk",
        "Pencatatan transaksi harian",
        "Insight operasional terbatas",
      ],
    },
    {
      id: "premium",
      name: "Plus",
      audience: "Analisis lengkap untuk berkembang",
      description:
        "Untuk pemilik yang membutuhkan analisis pasar dan evaluasi usaha secara rutin.",
      priceIdr: 49_000,
      priceLabel: "Rp49.000",
      billingLabel: "per bulan",
      actionLabel: "Pilih Plus",
      featured: true,
      features: [
        "Full Market Analysis",
        "Estimasi BEP dan rincian skor",
        "Perbandingan skenario",
        "Insight mingguan lengkap",
        "Ekspor laporan PDF",
      ],
    },
    {
      id: "institutional",
      name: "Enterprise",
      audience: "Pendampingan UMKM dalam skala besar",
      description:
        "Untuk pemerintah, kampus, inkubator, dan program CSR yang mendampingi banyak usaha.",
      priceIdr: null,
      priceLabel: "Kustom",
      billingLabel: "sesuai kebutuhan",
      actionLabel: "Hubungi Tim",
      featured: false,
      features: [
        "Akses banyak akun UMKM",
        "Pengelolaan kelompok binaan",
        "Ringkasan penggunaan program",
        "Dukungan implementasi",
      ],
    },
  ] satisfies readonly SubscriptionPlan[],
} as const;
