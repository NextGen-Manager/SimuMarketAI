export const laporan = {
  id: "report_888bc26a43a1",
  judul: "Hasil Simulasi Peluncuran Produk",
  intro:
    "Laporan kesiapan peluncuran berdasarkan parameter pasar saat ini dan data historis performa produk serupa. Skor menunjukkan produk memiliki peluang pasar yang baik, namun terdapat risiko operasional dan finansial yang perlu dimitigasi sebelum peluncuran penuh.",

  skor: {
    nilai: 66,
    interpretasi: "Layak dengan mitigasi",
    ruleVersion: "lrs-v0.2-unvalidated",
    catatanVersi: "Bobot belum divalidasi ahli",
    dimensi: [
      { nama: "Saturasi Pasar", bobot: 20, nilai: 62 },
      { nama: "Potensi Permintaan", bobot: 25, nilai: 71 },
      { nama: "Posisi Harga", bobot: 15, nilai: 74 },
      { nama: "Kesiapan Operasional", bobot: 40, nilai: 63 },
    ],
  },

  confidence: {
    nilai: 0.58,
    label: "Sedang",
    missing: [
      "Observasi traffic pejalan kaki",
      "Sampel harga pembanding (n < 5)",
      "Konfirmasi biaya sewa aktual",
    ],
  },

  ringkasan: [
    "Berdasarkan simulasi dengan target audiens pekerja lepas dan mahasiswa di Tebet, konsep kedai kopi dengan area kerja menunjukkan daya tarik awal yang baik dengan tingkat konversi minat sebesar 44% dari cohort sintetis. Namun marjin kotor berada di bawah standar industri karena tingginya biaya bahan baku premium.",
    "Kapasitas produksi harian perlu ditingkatkan sekitar 20% untuk memenuhi estimasi permintaan di minggu pertama agar terhindar dari kehabisan stok yang dapat merusak momentum peluncuran.",
  ],

  parameter: [
    { label: "Produk", nilai: "Kedai Kopi Spesialti" },
    { label: "Harga Jual", nilai: "Rp 25.000 / cup" },
    { label: "Target Pasar", nilai: "Pekerja lepas & mahasiswa" },
    { label: "Modal Awal", nilai: "Rp 150.000.000" },
  ],

  pasar: {
    saturasi: { nilai: 75, label: "Tinggi (75%)" },
    dayaSaing: { nilai: 60, label: "Kompetitif (60%)" },
    catatan:
      "Kompetitor utama mendominasi layanan pesan antar. Perlu fokus pada promosi bundling di aplikasi ojek online dan diferensiasi area kerja.",
  },

  finansial: {
    pendapatanBulan1: 18_500_000,
    bepBulan: 4,
    marjinKotor: 35,
    marjinIdeal: 45,
    peringatan:
      "Marjin kotor diproyeksikan hanya 35% (ideal >45%). Evaluasi kembali pemasok kemasan untuk menekan HPP.",
    skenario: [
      { nama: "Konservatif", volume: 40, pendapatan: 26_000_000, bep: 7 },
      { nama: "Base", volume: 60, pendapatan: 39_000_000, bep: 4 },
      { nama: "Optimis", volume: 75, pendapatan: 48_750_000, bep: 3 },
    ],
    disertakan: "Sewa, gaji barista, bahan baku, listrik, kemasan",
    tidakDisertakan: "Pajak, depresiasi, gaji pemilik, fee platform, spoilage",
  },

  risiko: [
    {
      judul: "Risiko Stockout Bahan Baku",
      isi: "Lonjakan pesanan di minggu awal berpotensi menghabiskan stok gula aren premium dari pemasok tunggal.",
      mitigasi: "Siapkan pemasok cadangan sebelum H-7.",
      artifact: "art-f-03",
    },
    {
      judul: "Penolakan Harga (Price Rejection)",
      isi: "Sebagian segmen target menganggap Rp 25.000 terlalu mahal tanpa promo pengenalan.",
      mitigasi: "Buat program 'Beli 1 Gratis 1' terbatas 3 hari pertama.",
      artifact: "art-p-11",
    },
    {
      judul: "Biaya Operasional Belum Terverifikasi",
      isi: "Biaya operasional bulanan diisi manual dan belum dikonfirmasi dengan kuotasi pemasok atau kontrak sewa.",
      mitigasi: "Kumpulkan tiga kuotasi sebelum menetapkan skenario optimis.",
      artifact: "art-f-08",
    },
  ],

  rekomendasi: [
    {
      judul: "Negosiasi ulang harga kemasan",
      isi: "Turunkan biaya kemasan minimal 10% untuk memperbaiki marjin kotor sebelum peluncuran.",
      artifact: "art-f-03",
    },
    {
      judul: "Siapkan materi promo pembukaan",
      isi: "Desain dan jadwalkan postingan media sosial untuk program diskon pengenalan.",
      artifact: "art-p-11",
    },
    {
      judul: "Hubungi pemasok bahan baku cadangan",
      isi: "Pastikan ada opsi kedua untuk pengadaan gula aren jika permintaan melonjak.",
      artifact: "art-f-03",
    },
  ],

  bukti: [
    {
      metrik: "Jumlah kompetitor",
      nilai: "18 tempat",
      sumber: "OpenStreetMap",
      diambil: "3 Agu 2026",
      confidence: "0,55",
    },
    {
      metrik: "Populasi kecamatan",
      nilai: "94.200 jiwa",
      sumber: "BPS",
      diambil: "1 Agu 2026",
      confidence: "0,80",
    },
    {
      metrik: "Harga pembanding",
      nilai: "Rp 22.000 median",
      sumber: "Observasi manual (n=4)",
      diambil: "2 Agu 2026",
      confidence: "0,35",
    },
    {
      metrik: "Sinyal persona sintetis",
      nilai: "44% minat",
      sumber: "Simulasi OASIS",
      diambil: "6 Agu 2026",
      confidence: "0,40",
    },
  ],

  keterbatasan: [
    "Sinyal persona adalah respons sintetis, bukan hasil survei pelanggan nyata, dan belum dikalibrasi terhadap wawancara manusia.",
    "Sampel harga pembanding hanya 4 observasi, di bawah ambang kecukupan sampel.",
    "Bobot skor berstatus hipotesis dan belum ditinjau ahli.",
    "Data traffic pejalan kaki tidak tersedia sehingga dikeluarkan dari perhitungan.",
  ],

  disclaimer:
    "Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha. Verifikasi lapangan tetap diperlukan sebelum mengambil keputusan investasi.",
};
