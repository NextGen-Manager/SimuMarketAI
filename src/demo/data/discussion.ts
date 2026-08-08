export type Spesialis = "pemasaran" | "finansial" | "risiko";

export const spesialisMeta: Record<
  Spesialis,
  { nama: string; council: string }
> = {
  pemasaran: { nama: "Pakar Pemasaran", council: "market_analyst" },
  finansial: { nama: "Ahli Finansial", council: "finance" },
  risiko: { nama: "Analis Risiko", council: "report" },
};

export type Jawaban = {
  spesialis: Spesialis;
  tanya: string;
  paragraf: string[];
  /** Angka hanya boleh tampil bila ada atribusi tool call. */
  toolCall?: string;
  aksi?: string[];
};

export const diskusi: Jawaban[] = [
  {
    spesialis: "finansial",
    tanya:
      "Bagaimana jika saya memberikan promo 'Beli 1 Gratis 1' di minggu pertama? Apakah margin saya tetap aman?",
    paragraf: [
      "Memberikan promo 'Beli 1 Gratis 1' akan menurunkan marjin kotor Anda secara signifikan di minggu pertama menjadi sekitar 15%.",
      "Namun strategi ini bisa mempercepat akuisisi pelanggan secara drastis dalam jangka pendek. Saya merekomendasikan untuk membatasi kuota harian agar arus kas tetap terjaga dan tidak mengganggu modal kerja operasional Anda.",
    ],
    toolCall: "finance-calculator · call #FC-118",
    aksi: ["Lihat Simulasi Arus Kas", "Jalankan sebagai Variasi"],
  },
  {
    spesialis: "finansial",
    tanya: "Berapa lama modal saya kembali kalau volume hanya 40 cup per hari?",
    paragraf: [
      "Pada skenario konservatif dengan volume 40 cup per hari, titik impas bergeser ke bulan ke-7 dan payback period menjadi sekitar 19 bulan.",
      "Perlu dicatat bahwa biaya operasional bulanan yang Anda isi belum diverifikasi dengan kuotasi pemasok, sehingga angka ini sensitif terhadap koreksi biaya sewa.",
    ],
    toolCall: "finance-calculator · call #FC-124",
    aksi: ["Jalankan sebagai Variasi"],
  },
  {
    spesialis: "pemasaran",
    tanya: "Segmen mana yang paling cocok untuk saya dorong lebih dulu?",
    paragraf: [
      "Dari cohort sintetis, segmen pekerja lepas menunjukkan minat tertinggi karena kebutuhan area kerja yang belum dipenuhi kompetitor di radius 800 meter.",
      "Segmen mahasiswa hemat memberikan keberatan harga paling sering. Mendorong segmen ini lebih dulu berisiko membentuk persepsi 'mahal' sebelum diferensiasi Anda dikenal.",
      "Ini adalah respons sintetis dari panel agent, bukan hasil survei pelanggan nyata.",
    ],
    aksi: ["Lihat Distribusi Ballot"],
  },
  {
    spesialis: "risiko",
    tanya: "Apa risiko terbesar yang harus saya tangani lebih dulu?",
    paragraf: [
      "Risiko dengan dampak tertinggi adalah biaya operasional yang belum terverifikasi, karena ia memengaruhi seluruh proyeksi finansial sekaligus menahan tingkat keyakinan bukti di angka sedang.",
      "Risiko stockout bahan baku berdampak besar tetapi mudah dimitigasi dengan menyiapkan pemasok kedua sebelum H-7.",
    ],
    aksi: ["Lihat Peta Risiko"],
  },
];

export const jawabanUmum: Jawaban = {
  spesialis: "pemasaran",
  tanya: "",
  paragraf: [
    "Ini adalah mode demo dengan jawaban yang sudah ditulis sebelumnya, sehingga pertanyaan bebas belum dapat dijawab.",
    "Silakan pilih salah satu pertanyaan yang disarankan untuk melihat bagaimana agent menjawab beserta atribusi sumber angkanya.",
  ],
};

export const diskusiSebelumnya = [
  "Optimalisasi biaya sewa",
  "Strategi branding digital",
];
