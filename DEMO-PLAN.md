# Rencana Demo v2 — Dua Journey

Revisi rencana demo setelah dua journey pengguna ditetapkan. Dokumen ini menggantikan rencana v1 yang hanya mencakup satu alur.

Gaya visual, komponen, dan aturan warna tidak berubah — tetap mengikuti `Docs/docs/13-ui-system-and-mock-plan.md`. Panel debat council tetap menjadi inti demo.

Autentikasi dikesampingkan untuk sementara. Demo masuk langsung ke dashboard.

---

## Dua journey

| | Journey A | Journey B |
|---|---|---|
| Siapa | Calon pengusaha F&B | Pemilik usaha F&B yang sudah jalan |
| Pertanyaan | "Layak tidak saya buka di sini?" | "Produk mana yang jalan, mana yang tidak?" |
| Modul | Market Analysis | Transaction Management |
| Keluaran | Launch Readiness Report | Dashboard analitik + rekomendasi |
| Gerbang | Modul edukasi wajib selesai | Minimal 7 hari data |
| Status | ~70% sudah dibangun | belum dibangun sama sekali |

Keduanya bertemu di dashboard, dan Journey B pada akhirnya memberi makan Journey A — transaksi nyata menjadi bukti berkualitas tinggi untuk analisis berikutnya.

---

## Yang berubah dari yang sudah dibangun

Journey A yang ditetapkan **tidak dimulai dari unggah dokumen**, melainkan dari dashboard lalu form terstruktur. Ini perbedaan utama terhadap demo yang sudah ada.

| Layar sekarang | Nasib |
|---|---|
| `/` landing | tetap, tambah tombol masuk dashboard |
| `/upload` | **turun status** jadi jalur pintas opsional, bukan langkah wajib |
| `/analisis` (ekstraksi dokumen) | **hanya dipakai** kalau pengguna lewat jalur unggah |
| `/review` | **dipertahankan, dialihfungsikan** jadi konfirmasi sebelum run |
| `/pasar` | **dipecah** jadi tiga langkah form sesuai journey |
| `/simulasi` | tetap, tambah strip empat agent yang terlihat |
| `/laporan` | tetap, tambah aksi bandingkan lokasi |
| `/diskusi` | tetap (di luar journey inti, nilai tambah demo) |

### Kenapa `/upload` tidak dihapus

Journey A tidak menyebutnya, tetapi layar itu sudah jadi dan menawarkan jalan masuk yang jauh lebih cepat bagi orang yang sudah punya proposal. Menghapusnya membuang kerja tanpa alasan.

Solusinya: jadikan **pilihan kedua yang jelas**, bukan langkah pertama yang wajib. Di layar pemilihan lokasi ada tautan kecil "Punya proposal? Unggah untuk mengisi otomatis". Jalur itu bermuara ke layar konfirmasi yang sama.

Kalau kamu lebih suka demo yang benar-benar bersih satu jalur saja, bilang — menghapus dua rute itu pekerjaan lima menit.

---

## Peta layar baru

```text
/                         landing — satu tombol "Mulai Demo"
/demo                     pilih journey A atau B
/dashboard                tiga modul, yang relevan disorot

JOURNEY A — Market Analysis
/analisis/input           wizard 3 langkah: lokasi, harga, modal
/edukasi                  gerbang modul wajib
/analisis/konfirmasi      ringkasan input sebelum run   (bekas /review)
/analisis/proses          empat agent berjalan          (bekas /simulasi)
/laporan                  Launch Readiness Report
/laporan/bandingkan       bandingkan dua lokasi
/diskusi                  tanya agent

  jalur pintas opsional
/upload → /analisis/baca → /analisis/konfirmasi

JOURNEY B — Transaction Management
/transaksi                ringkasan + tombol catat
/transaksi/produk         daftar produk dan harga
/transaksi/catat          input transaksi harian
/transaksi/analitik       dashboard analitik (terkunci < 7 hari)
```

---

## Titik masuk

### `/` landing — **disederhanakan**

Satu tombol utama: **Mulai Demo**. Penjelasan produk dipangkas seperlunya. Autoplay tidak lagi dipicu dari sini karena kini ada dua journey yang bisa diputar.

### `/demo` — pilih journey · **baru**

Dua kartu besar berdampingan. Layar ini yang membuat klaim "dua jenis pengguna" terlihat, bukan hanya tersirat.

```text
┌────────────────────────────┐  ┌────────────────────────────┐
│ JOURNEY A                  │  │ JOURNEY B                  │
│ Calon pengusaha F&B        │  │ Pemilik usaha F&B          │
│                            │  │                            │
│ "Layak tidak saya buka     │  │ "Produk mana yang jalan,   │
│  kedai di lokasi ini?"     │  │  mana yang tidak?"         │
│                            │  │                            │
│ Market Analysis            │  │ Transaction Management     │
│ 4 agent · skor kelayakan   │  │ catat harian · analitik    │
│                            │  │                            │
│ [ Jalankan ] [ ▶ Otomatis ]│  │ [ Jalankan ] [ ▶ Otomatis ]│
└────────────────────────────┘  └────────────────────────────┘
```

Tiap kartu punya dua tombol: jalankan manual, atau putar otomatis. Autoplay per journey, bukan satu skrip panjang untuk keduanya.

### `/dashboard` — tiga modul · **baru**

Tetap ada meski sudah ada layar pemilih, karena kedua journey yang ditetapkan memuat langkah "Open Dashboard" dan F-02 mensyaratkan dashboard aktivitas. Modul yang relevan dengan journey terpilih disorot; dua lainnya tetap terlihat dan bisa diklik.

Titik masuk. Tiga kartu besar:

| Modul | Isi kartu | Aksi |
|---|---|---|
| Market Analysis | "Uji kelayakan sebelum buka" + skor terakhir kalau ada | Mulai analisis |
| Transaction Management | "Catat penjualan, lihat produk terlaris" + hari tercatat | Buka transaksi |
| Edukasi | "Modul singkat sebelum analisis" + progres | Lanjut belajar |

Kartu Edukasi menampilkan status gerbang secara jujur: bila modul wajib belum selesai, kartu Market Analysis menyebut itu sejak dashboard, bukan mengejutkan pengguna di tengah alur.

### Jenis usaha — **dihapus, keputusan final**

Pemilihan kategori usaha (restoran, warung, kafe, gerobak, katering, cloud kitchen) dikeluarkan sepenuhnya. Produk ini memang khusus F&B, sehingga kategori tidak dipakai demo untuk apa pun.

Dua konsekuensi yang dicatat agar tidak terlupa saat menulis laporan akhir:

- **F-03** berbunyi "memilih jenis usaha F&B dan lokasi" — bagian "jenis usaha" tidak terpenuhi di demo, hanya bagian lokasi.
- **F-08** berbunyi konten edukasi "disesuaikan dengan jenis usaha". Tanpa input jenis usaha, modul edukasi menampilkan empat topik umum F&B yang sama untuk semua pengguna, bukan kurasi per kategori.

Keduanya bukan bug, melainkan penyempitan scope yang disengaja. Sebut apa adanya di laporan; jangan diklaim terpenuhi.

### `/analisis/input` — lokasi, harga, modal · **baru**

Proposal §6.2 dan §7.2 menyebut **satu layar input** bergaya wizard, bukan tiga layar terpisah: "formulir input minimal dengan pilihan jenis usaha F&B, lokasi, rentang harga produk, dan estimasi modal — desain wizard step-by-step agar tidak membebani pengguna".

Rencana mengikuti itu. Satu rute, tiga langkah di dalamnya, dengan progres terlihat:

```text
┌ Analisis Pasar ────────────── langkah 1 dari 3 ────┐
│  ●───────○───────○                                 │
│  Lokasi   Harga   Modal                            │
│                                                     │
│  Wilayah   [ Jakarta Selatan ▾ ]                   │
│  Kecamatan [ Tebet            ▾ ]                  │
│  Radius    ( 1 km )( 1,5 km )( 3 km )              │
│                                                     │
│  ┌ Bukti pada radius ini ──────────────────────┐   │
│  │ 18 kompetitor · OSM · 3 hari lalu           │   │
│  │ Traffic pejalan kaki: tidak tersedia        │   │
│  └─────────────────────────────────────────────┘   │
│                                    [ Lanjut → ]    │
└────────────────────────────────────────────────────┘
```

Langkah 2 harga (rentang harga produk, HPP), langkah 3 modal (modal awal, biaya operasional bulanan, volume harian min–base–maks).

Pratinjau kualitas bukti muncul begitu lokasi dipilih, sebelum pengguna menghabiskan waktu mengisi sisanya.

Di bawah langkah 1 ada tautan kecil jalur unggah dokumen.

Field yang kosong tetap kosong dan memicu blok kesiapan data — mekanisme ini sudah ada di `/review` dan tinggal dipindah.

### `/edukasi` — gerbang · **baru**

Muncul hanya bila modul wajib belum selesai. Empat topik dari proposal §6.4, masing-masing ≤5 menit baca:

| Topik | Isi ringkas |
|---|---|
| Perizinan dan Legalitas | NIB, PIRT, sertifikasi halal, izin lokasi |
| Strategi Penetapan Harga | food cost ratio, cara menghitung HPP, posisi harga terhadap kompetitor |
| Manajemen Bahan Baku | FIFO, menghindari food waste, negosiasi pemasok, catatan stok |
| Akuisisi Pelanggan Awal | Google Maps listing, media sosial, word-of-mouth, loyalty sederhana |

Karena jenis usaha dihapus dari alur, keempat topik tampil sama untuk semua pengguna — bukan kurasi per kategori seperti bunyi F-08.

Ini satu-satunya gerbang keras di seluruh produk. Tombol lanjut benar-benar terkunci, bukan sekadar peringatan.

Untuk demo: tiga modul pendek, masing-masing satu layar teks + tiga soal pilihan ganda. Ada tombol "Tandai selesai (demo)" agar presentasi tidak macet.

### `/analisis/konfirmasi` — sebelum run · **alih fungsi dari `/review`**

Layar `/review` yang sudah jadi tetap dipakai, hanya berganti peran: dari "periksa hasil baca AI" menjadi "periksa input sebelum simulasi jalan". Kartu, badge status, edit inline, dan blok kesiapan data semuanya tetap berlaku.

Kalau pengguna datang dari jalur unggah, statusnya berisi hasil ekstraksi. Kalau datang dari form, statusnya berisi apa yang ia isi sendiri.

### `/analisis/proses` — empat agent · **`/simulasi` + tambahan**

Layar ini sudah kuat. Satu hal yang kurang: journey menyebut **empat agent** secara eksplisit, tetapi tampilan sekarang menonjolkan tahap pipeline, bukan keempat agent sebagai aktor.

Tambahan yang diusulkan — strip empat agent di atas panel:

```text
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ⬢ Market     │ ⬢ Customer   │ ⬢ Finance    │ ⬢ Report     │
│   Analyst    │   Persona    │              │              │
│ ● aktif      │ ○ menunggu   │ ○ menunggu   │ ○ menunggu   │
│ 3 aksi       │ —            │ —            │ —            │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

Tiap kartu menyala saat council-nya bekerja dan menghitung jumlah aksinya. Ini membuat klaim "empat agent" terlihat dalam dua detik, tanpa membaca feed.

Tiga tampilan Feed / Council / Distribusi tetap seperti sekarang — bagian itu memang inti demo dan tidak diubah.

Durasi skrip disesuaikan ke sekitar 35–45 detik agar cocok dengan rentang 30–60 detik di journey.

### `/laporan` — sudah jadi

Tambahan kecil: aksi "Bandingkan Lokasi Lain" di samping Unduh PDF dan Buat Variasi.

### `/laporan/bandingkan` — **baru**

Dua run berdampingan, satu variabel berbeda. Menampilkan selisih **beserta variabilitas antar-run**, dan menyatakan "tidak dapat disimpulkan" bila selisih lebih kecil dari variabilitas. Ini pemenuhan F-14 sekaligus momen kejujuran yang kuat saat demo.

---

## Journey B — detail per layar

Seluruhnya baru. Nilai demonya: memperlihatkan produk tidak berhenti di analisis sekali jalan, tapi menutup lingkaran dengan data nyata.

### `/transaksi` — ringkasan

Kartu metrik hari ini (transaksi, pendapatan), tombol besar **Catat Transaksi**, dan indikator progres data:

```text
Data tercatat: 5 dari 7 hari
▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  Analitik terbuka setelah 7 hari
```

Indikator ini penting: ia menjelaskan kenapa analitik terkunci, alih-alih menampilkan grafik kosong atau tren palsu dari data dua hari.

### `/transaksi/produk` — daftar produk

Tabel produk: nama, harga jual, HPP, kategori. Bisa tambah, ubah, nonaktifkan. Layar pertama yang dilihat pengguna baru — ada empty state yang mengarahkan membuat produk pertama.

### `/transaksi/catat` — input harian

Layar tercepat di aplikasi. Target di bawah 10 detik per transaksi:

```text
┌────────────────────────────────────────────────────────┐
│  Produk   [ Es Kopi Susu ▾ ]  ← chip pencarian         │
│  Jumlah   [ − ] 2 [ + ]                                │
│  Harga    Rp 18.000  (dari master, bisa ditimpa)       │
│  Kanal    ( Dine-in )( Takeaway )( Delivery )          │
│                                    [ Simpan ⏎ ]        │
└────────────────────────────────────────────────────────┘
   Tersimpan hari ini: 14 transaksi · Rp 486.000
```

Enter menyimpan dan mengosongkan form tanpa memindahkan fokus.

**Foto struk sebagai opsi input kedua.** Proposal §5.11 menyebut pencatatan harian "bisa input langsung atau lewat foto struk", dan §5.2 mencatat foto struk memang cara pelaku UMKM mencatat hari ini. Jadi ini alat pelacakan, bukan modul tersendiri.

Perlakuannya di demo: tombol kamera kecil di samping form, membuka layar koreksi yang sederhana — foto di kiri, hasil ekstraksi di kanan, field ber-confidence rendah disorot, pengguna membetulkan lalu simpan. Tidak dijadikan bintang utama, tetapi ada, karena tanpanya klaim "lebih mudah dari buku tulis" jadi lemah.

Catatan ketelitian: tabel kebutuhan fungsional di proposal **tidak memuat F-10A**. F-10 hanya menyebut "mencatat transaksi harian (nama produk, jumlah terjual, harga per item)", dan §6.2 menyebut "opsi batch input", bukan foto. F-10A muncul sebagai elaborasi di repo `Docs`, bukan komitmen proposal. Karena itu foto struk diperlakukan sebagai nilai tambah, bukan requirement Must yang wajib lengkap.

Input batch ditunda.

### `/transaksi/analitik` — dashboard

Terkunci sampai 7 hari data. Setelah terbuka:

- pendapatan harian (bar sederhana, bukan grafik berat);
- produk terlaris dan terendah, **dengan minimum exposure** — produk yang baru ada 2 hari tidak masuk daftar terendah, dan alasannya dinyatakan;
- tren sederhana dengan observation window disebut eksplisit;
- kartu rekomendasi rule-based.

Contoh rekomendasi yang boleh muncul:

> **Pastry & Snacks belum menutup biaya**
> Terjual 9 porsi dalam 7 hari dengan marjin 22%. Pertimbangkan menaikkan harga atau mengurangi porsi produksi harian.
> *Observation window: 7 hari · sejak 30 Juli 2026*

Yang **tidak boleh** muncul: "hapus produk ini" hanya berdasarkan volume rendah.

---

## Berkas data yang perlu ditambah

```text
src/demo/data/
  dashboard.ts        ringkasan tiga modul
  locations.ts        hierarchy Jabodetabek + pratinjau bukti per area
  education.ts        tiga modul + soal kuis
  compare.ts          dua run untuk layar bandingkan
  products.ts         daftar produk Journey B
  transactions.ts     30 hari transaksi contoh
  insights.ts         rekomendasi rule-based
```

Yang sudah ada (`profile.ts`, `simulation.ts`, `report.ts`, `discussion.ts`) tetap dipakai.

---

## Urutan kerja usulan

| # | Pekerjaan | Ukuran | Kenapa urutannya begini |
|---|---|---|---|
| 1 | `/` disederhanakan + `/demo` pemilih + `/dashboard` | kecil | pintu masuk kedua journey, memblokir sisanya |
| 2 | Ubah `/pasar` → `/analisis/input` wizard 3 langkah | sedang | komponennya sudah ada, tinggal disusun ulang |
| 3 | Alih fungsi `/review` → `/analisis/konfirmasi` | kecil | sebagian besar hanya ganti rute dan judul |
| 4 | `/edukasi` gerbang | sedang | melengkapi Journey A jadi utuh |
| 5 | Strip empat agent di `/analisis/proses` | kecil | dampak demo besar, kerja sedikit |
| 6 | **Journey A utuh, bisa didemokan** | — | titik aman pertama |
| 7 | `/transaksi/produk` + `/transaksi/catat` | sedang | inti Journey B |
| 8 | `/transaksi/analitik` + kunci 7 hari | sedang | tempat cerita Journey B mendarat |
| 9 | `/transaksi` ringkasan | kecil | perekat |
| 10 | **Journey B utuh** | — | titik aman kedua |
| 11 | `/laporan/bandingkan` | sedang | F-14, nilai tambah |
| 12 | Autoplay dua journey | kecil | perbarui skrip adegan |

Langkah 6 dan 10 adalah dua titik di mana demo bisa dihentikan dan tetap utuh. Kalau waktu habis di tengah, berhenti di salah satunya — jangan berhenti di antara.

---

## Prioritas kalau waktu sempit

**Pertahankan:**

- panel Council — ini yang membuat "empat agent berdebat" terlihat nyata, dan bagian tersulit ditiru pesaing;
- varian laporan parsial — satu-satunya yang menunjukkan produk tetap berguna saat AI gagal;
- kunci 7 hari di Journey B — memperlihatkan sistem menolak menampilkan tren dari data yang belum cukup.

**Boleh dipotong:**

- `/laporan/bandingkan` — nilai tambah (F-14 Should Have), bukan inti journey;
- `/diskusi` — di luar kedua journey, meski sudah jadi;
- layar koreksi foto struk — bukan requirement proposal; kalau dipotong, form manual tetap memenuhi F-10;
- input batch — sudah ditunda.

---

## Sudah diputuskan

| Hal | Keputusan |
|---|---|
| Jenis usaha | **Dihapus.** Produk khusus F&B; kategori tidak dipakai demo. F-03 dan F-08 menyempit, dicatat apa adanya. |
| Layar input | **Satu wizard tiga langkah**, mengikuti proposal §6.2 dan §7.2, bukan tiga rute terpisah. |
| Foto struk | **Opsi input kedua** di layar pencatatan, bukan modul tersendiri. Bukan requirement proposal. |
| Titik masuk | Landing satu tombol → `/demo` pemilih journey → dashboard. |
| Jalur unggah dokumen | **Dipertahankan** sebagai pilihan kedua, tautan kecil di langkah 1 layar input. |
| Layar Diskusi | **Dipertahankan.** Atribusi tool call jadi bukti angka tidak dikarang LLM. |
| Visual skor | **Keduanya** — gauge di laporan sesuai proposal §7.4, angka besar di kartu dashboard. |
| Foto struk | **Dibangun**, versi sederhana: split view, koreksi, simpan. |
| Label skor | **Diperbaiki** ke rentang proposal §5.9: 68 → "Layak dengan mitigasi". |
| Durasi simulasi | **Tanpa batas.** Ini mock, bukan produk nyata — skrip boleh sepanjang yang dibutuhkan agar perdebatan council terlihat utuh. Autoplay menunggu simulasi selesai, bukan memakai timer tetap. |

Seluruh keputusan sudah diambil. Tidak ada yang menunggu.
