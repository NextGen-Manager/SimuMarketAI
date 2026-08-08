/** Empat topik inti dari proposal §6.4, masing-masing ≤5 menit baca. */
export type Modul = {
  id: string;
  judul: string;
  menit: number;
  wajib: boolean;
  ringkas: string;
  isi: string[];
  kuis: { tanya: string; opsi: string[]; benar: number }[];
};

export const modul: Modul[] = [
  {
    id: "perizinan",
    judul: "Perizinan dan Legalitas",
    menit: 5,
    wajib: true,
    ringkas: "NIB, PIRT, sertifikasi halal, dan izin lokasi untuk usaha F&B.",
    isi: [
      "Setiap usaha F&B memerlukan Nomor Induk Berusaha (NIB) yang diterbitkan melalui sistem OSS. NIB adalah identitas berusaha dan menjadi syarat untuk perizinan lain.",
      "Untuk produk pangan olahan yang dikemas dan tahan lebih dari tujuh hari, diperlukan izin PIRT dari dinas kesehatan setempat. Makanan siap saji yang langsung dikonsumsi umumnya tidak memerlukan PIRT, tetapi tetap terikat aturan higiene.",
      "Sertifikasi halal kini berada di bawah BPJPH, bukan lagi hanya MUI. Prosesnya melibatkan lembaga pemeriksa halal, dan kewajibannya bertahap sesuai jenis produk.",
      "Izin lokasi bergantung pada zonasi wilayah. Gerobak di trotoar dan kedai di ruko punya persyaratan berbeda. Periksa ke kelurahan sebelum menandatangani kontrak sewa.",
    ],
    kuis: [
      {
        tanya: "Apa syarat dasar yang harus dimiliki setiap usaha F&B?",
        opsi: ["Sertifikat halal", "NIB melalui OSS", "Izin ekspor"],
        benar: 1,
      },
      {
        tanya: "Kapan PIRT diperlukan?",
        opsi: [
          "Untuk semua usaha makanan",
          "Untuk pangan olahan kemasan yang tahan lebih dari 7 hari",
          "Hanya untuk restoran besar",
        ],
        benar: 1,
      },
    ],
  },
  {
    id: "harga",
    judul: "Strategi Penetapan Harga",
    menit: 4,
    wajib: true,
    ringkas: "Food cost ratio, cara menghitung HPP, dan posisi harga terhadap kompetitor.",
    isi: [
      "Harga pokok penjualan (HPP) adalah seluruh biaya bahan yang melekat pada satu porsi. Hitung per bahan, bukan ditaksir dari total belanja bulanan.",
      "Food cost ratio adalah HPP dibagi harga jual. Untuk F&B, rentang 30–35% umum dipakai sebagai acuan awal, meski setiap model usaha berbeda.",
      "Marjin kontribusi adalah harga jual dikurangi biaya variabel per unit. Angka inilah yang menutup biaya tetap. Bila marjin kontribusi nol atau negatif, menambah volume justru memperbesar kerugian.",
      "Memposisikan harga jauh di bawah kompetitor tanpa keunggulan biaya adalah cara tercepat kehabisan modal kerja. Bandingkan harga dengan produk yang benar-benar sebanding, bukan dengan rata-rata pasar yang kabur.",
    ],
    kuis: [
      {
        tanya: "Apa yang terjadi bila marjin kontribusi negatif dan volume dinaikkan?",
        opsi: [
          "Keuntungan naik",
          "Kerugian membesar",
          "Titik impas tercapai lebih cepat",
        ],
        benar: 1,
      },
    ],
  },
  {
    id: "bahan-baku",
    judul: "Manajemen Bahan Baku",
    menit: 4,
    wajib: false,
    ringkas: "FIFO, menghindari food waste, negosiasi pemasok, dan catatan stok sederhana.",
    isi: [
      "Prinsip FIFO (first in, first out) berarti bahan yang datang lebih dulu dipakai lebih dulu. Tanpa ini, bahan lama tertimbun di belakang dan terbuang.",
      "Food waste adalah kebocoran marjin yang paling sering tidak terlihat, karena tidak muncul di catatan penjualan. Catat bahan yang terbuang, minimal jumlah kasarnya.",
      "Pemasok tunggal berisiko. Satu pemasok yang telat mengirim bisa menghentikan penjualan produk andalan. Siapkan opsi kedua sebelum dibutuhkan.",
      "Catatan stok tidak perlu rumit. Hitung stok bahan utama seminggu sekali di jam yang sama, dan bandingkan dengan penjualan.",
    ],
    kuis: [
      {
        tanya: "Kenapa food waste sering luput dari perhatian?",
        opsi: [
          "Karena jumlahnya selalu kecil",
          "Karena tidak muncul di catatan penjualan",
          "Karena sudah termasuk pajak",
        ],
        benar: 1,
      },
    ],
  },
  {
    id: "pelanggan",
    judul: "Akuisisi Pelanggan Awal",
    menit: 3,
    wajib: false,
    ringkas: "Google Maps listing, media sosial, word-of-mouth, dan loyalty sederhana.",
    isi: [
      "Mendaftarkan usaha di Google Maps adalah langkah termurah dengan dampak terbesar untuk usaha yang mengandalkan pejalan kaki dan pencarian lokal.",
      "Media sosial bekerja paling baik bila konsisten, bukan bila mewah. Dua unggahan seminggu yang rutin lebih berguna daripada satu video mahal sekali sebulan.",
      "Promo pembukaan menarik pelanggan, tetapi promo yang terlalu dalam menarik pemburu diskon yang tidak kembali. Batasi kuota dan durasinya.",
      "Program loyalti bisa sesederhana kartu stempel. Yang penting mudah dipahami dan tidak menyulitkan kasir.",
    ],
    kuis: [
      {
        tanya: "Apa risiko promo pembukaan yang terlalu dalam?",
        opsi: [
          "Menarik pelanggan yang tidak kembali",
          "Melanggar peraturan",
          "Menaikkan HPP",
        ],
        benar: 0,
      },
    ],
  },
];

export const modulWajib = modul.filter((m) => m.wajib).map((m) => m.id);
