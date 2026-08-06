# Rencana Bangun Demo Klik-Melalui

Rencana kerja untuk membangun mock yang memperlihatkan seluruh alur aplikasi dari sisi pengguna, tanpa backend dan tanpa AI. Konsep dan aturan visual ada di `Docs/docs/13-ui-system-and-mock-plan.md`; dokumen ini adalah pemecahan kerjanya menjadi file dan urutan.

## Ruang lingkup

**Yang dibangun.** Layar S1–S7 dapat diklik berurutan, layar simulasi bergerak mengikuti skrip, laporan punya varian normal dan parsial, tombol Putar Otomatis menjalankan seluruh alur, ditambah layar transaksi dan review struk.

**Yang tidak dibangun.** Perhitungan apa pun, panggilan AI, validasi skema, autentikasi nyata, penyimpanan permanen.

Seluruh angka yang tampil adalah teks yang sudah ditulis lebih dulu. Plumbing data di sini boleh dibuang seluruhnya saat backend datang; yang bertahan adalah token dan komponen.

## Prasyarat

```bash
cd SimuMarketAI
npx create-next-app@latest . --typescript --tailwind --app --eslint
```

Menghasilkan Next.js 16 + React 19 + Tailwind v4, sesuai ADR-002. Tidak ada dependency tambahan yang wajib — tanpa state library, tanpa data-fetching library, tanpa pustaka animasi.

Font Plus Jakarta Sans dan Source Serif 4 dipasang lewat `next/font/google`.

## Struktur akhir

```text
src/
  app/
    layout.tsx              shell + header + DemoFlowProvider
    page.tsx                dashboard, titik masuk
    upload/page.tsx         S1
    analisis/page.tsx       S2
    review/page.tsx         S3
    pasar/page.tsx          S4
    simulasi/page.tsx       S5
    laporan/page.tsx        S6  (?hasil=parsial untuk varian)
    diskusi/page.tsx        S7
    transaksi/page.tsx      input manual + daftar
    transaksi/struk/page.tsx review OCR
  components/
    ui/                     primitif visual, dipakai ulang di produksi nanti
    layout/                 Header, StepperNav, DemoBadge
    simulasi/               FeedPanel, CouncilPanel, DistribusiPanel, AgentCard
    laporan/                ScoreBlock, ConfidenceBlock, EvidenceTable, PartialBanner
  demo/
    data/                   seluruh isi teks dan angka contoh
    DemoFlowProvider.tsx    langkah aktif, hasil edit, varian
    usePlayback.ts          pemutar skrip simulasi
    useAutoplay.ts          Putar Otomatis
    steps.ts               daftar urutan langkah + rute
  lib/
    format.ts               formatIDR, formatTanggal
```

`components/ui` adalah satu-satunya sumber primitif visual. Tidak ada feature yang membuat varian lokalnya sendiri.

---

## Tahap 1 — Fondasi visual

**Tujuan.** Token dan primitif siap sebelum satu layar pun dibuat, supaya tidak ada nilai warna lepas yang harus dirapikan belakangan.

**File.**

```text
src/app/globals.css        @theme berisi seluruh token
src/app/layout.tsx         font, lang="id", shell dasar
src/lib/format.ts          formatIDR, formatTanggal, formatPersen
src/components/ui/         Card, StatusBadge, MetricTile, MeterBar,
                           Button, FieldRow, EmptyState, ErrorState, Skeleton
```

`globals.css` menyalin token dari dokumen 13 apa adanya:

```css
@import "tailwindcss";

@theme {
  --color-ink-900:  #101413;
  --color-ink-700:  #2E3634;
  --color-ink-500:  #5C6663;
  --color-ink-400:  #8A9391;
  --color-line:     #E4E7E6;
  --color-canvas:   #F7F9F8;
  --color-teal-700: #0E5A63;
  --color-teal-50:  #E8F2F2;
  --color-amber-600:#D4610A;
  --color-amber-50: #FDF1E7;
  --color-success-600:#1B7A4B;
  --color-info-600:   #2A6BA8;
  --color-warn-600:   #B25D02;
  --color-danger-600: #B3261E;
}
```

**Selesai bila.** Satu halaman contoh menampilkan seluruh primitif dalam setiap state, dan tidak ada hex mentah di luar `globals.css`.

**Ukuran.** Sedang. Ini tahap yang paling menentukan kualitas akhir — jangan diburu.

---

## Tahap 2 — Shell dan navigasi

**Tujuan.** Kerangka yang membuat seluruh layar terasa satu aplikasi.

**File.**

```text
src/components/layout/Header.tsx
src/components/layout/StepperNav.tsx
src/components/layout/DemoBadge.tsx
src/demo/steps.ts
src/demo/DemoFlowProvider.tsx
```

`steps.ts` adalah sumber urutan tunggal:

```ts
export const steps = [
  { id: 'upload',   label: 'Upload Dokumen', href: '/upload'   },
  { id: 'analisis', label: 'Analisis AI',    href: '/analisis' },
  { id: 'review',   label: 'Review Bisnis',  href: '/review'   },
  { id: 'pasar',    label: 'Setup Pasar',    href: '/pasar'    },
  { id: 'simulasi', label: 'Simulasi',       href: '/simulasi' },
  { id: 'laporan',  label: 'Laporan',        href: '/laporan'  },
  { id: 'diskusi',  label: 'Diskusi',        href: '/diskusi'  },
] as const;
```

`DemoFlowProvider` menyimpan tiga hal saja: langkah terjauh yang sudah dicapai, hasil edit pengguna di layar Review, dan varian hasil (`normal` atau `parsial`). Tidak lebih.

**Aturan stepper.** Langkah yang sudah dilewati dapat diklik untuk kembali. Langkah di depan langkah aktif dinonaktifkan. Ini mencegah demo melompat ke laporan sebelum simulasi terlihat berjalan.

**Selesai bila.** Bisa berpindah antar tujuh langkah, stepper menandai posisi dengan benar, badge `MODE DEMO` tampil.

**Ukuran.** Kecil.

---

## Tahap 3 — S3 Review Bisnis

Dikerjakan lebih dulu daripada S1 dan S2 karena layar ini yang paling banyak komponennya dan paling sering dilihat saat demo.

**File.**

```text
src/app/review/page.tsx
src/demo/data/profile.ts
```

`profile.ts` berisi lima kartu beserta status tiap field:

```ts
export const profil = {
  ringkasanUsaha: {
    status: 'terdeteksi',
    namaIde: 'Kopi Kenangan Senja',
    jenisBisnis: 'F&B – Kedai Kopi Spesialti',
    deskripsi: 'Kedai kopi berkonsep modern minimalis…',
    usp: 'Menggunakan 100% biji kopi petani lokal…',
  },
  targetPelanggan: {
    status: 'perlu-dikonfirmasi',
    segmen: 'Mahasiswa & Pekerja Lepas',
    lokasi: 'Bandung Selatan (radius 5 km)',
    kebiasaan: 'Mencari tempat dengan WiFi cepat…',
  },
  produkHarga: { status: 'terdeteksi', items: [ /* 3 produk */ ] },
  asumsiFinansial: {
    status: 'perlu-dilengkapi',
    modalAwal: 150_000_000,
    biayaOperasional: null,          // sengaja kosong
    targetHarian: '50 – 70 cup',
  },
  kompetitor: { status: 'terdeteksi', sumber: 'OpenStreetMap',
                diambil: '3 hari lalu', items: [ /* 2 kompetitor */ ] },
};
```

**Yang harus terasa nyata.** Edit inline benar-benar mengubah nilai yang tampil dan menaikkan status field menjadi terkonfirmasi. Ini interaksi yang paling sering dicoba juri.

**Jangan lupa.** Blok "Kesiapan data" di bawah kartu, yang menerjemahkan `biayaOperasional: null` menjadi kalimat konsekuensi. Blok ini yang membedakan demo jujur dari demo yang menyembunyikan lubang data.

**Selesai bila.** Lima kartu tampil dengan tiga jenis badge, edit inline bekerja, blok kesiapan data muncul, tombol lanjut aktif.

**Ukuran.** Besar.

---

## Tahap 4 — S5 Simulasi

Layar dengan nilai demo tertinggi. Kerjakan setelah Review supaya komponen kartu sudah ada.

**File.**

```text
src/app/simulasi/page.tsx
src/components/simulasi/FeedPanel.tsx
src/components/simulasi/CouncilPanel.tsx
src/components/simulasi/DistribusiPanel.tsx
src/components/simulasi/AgentCard.tsx
src/components/simulasi/StageList.tsx
src/demo/data/simulation.ts
src/demo/usePlayback.ts
```

`usePlayback` sederhana saja: indeks berjalan maju melalui `langkah[]`, satu `setTimeout` per langkah memakai `ms` masing-masing, mengembalikan `{ langkahTerlihat, stageAktif, persen, selesai }`. Bisa dijeda dan diulang.

Bentuk `simulation.ts` dan aturan render per jenis action sudah ditetapkan di dokumen 13 — ikuti tabelnya. Ringkasnya:

| `action` | Bentuk |
|---|---|
| `comment` | kartu penuh dengan kutipan |
| `challenge` | kartu dengan garis kiri, label menantang `#ID` |
| `like` | satu baris gabungan beberapa agent |
| `purchase` | satu baris beraksen amber |
| `ringkasan` | baris abu-abu akhir round |
| `tool` | kartu sistem bergaya mono |

**Tiga tampilan.** Feed default selama berjalan, Council default setelah selesai, Distribusi menampilkan baseline versus final.

**Yang sering terlewat.** Auto-scroll harus berhenti ketika pengguna menggulir ke atas, dan disclaimer respons sintetis melekat di bawah panel.

**Selesai bila.** Skrip berjalan sampai selesai, tiga tampilan dapat ditukar, thread `challenge` bersarang di bawah klaim yang dirujuk.

**Ukuran.** Besar.

---

## Tahap 5 — S6 Laporan

**File.**

```text
src/app/laporan/page.tsx
src/components/laporan/ScoreBlock.tsx
src/components/laporan/ConfidenceBlock.tsx
src/components/laporan/EvidenceTable.tsx
src/components/laporan/PartialBanner.tsx
src/demo/data/report.ts
```

Delapan bagian bernomor dengan urutan tetap. Bagian 02 Evidence Confidence dan 08 Bukti & Keterbatasan **tidak boleh collapsed secara default** — keduanya pemenuhan F-16.

Varian parsial dibaca dari query param:

```tsx
const parsial = useSearchParams().get('hasil') === 'parsial';
```

Saat parsial: banner di atas, bagian simulasi berubah menjadi status tidak tersedia tetapi tetap ada di daftar isi, dimensi Potensi Permintaan ditandai tidak dapat dinilai beserta bobotnya.

**Selesai bila.** Kedua varian tampil benar, disclaimer melekat, angka finansial dapat dibuka sumbernya.

**Ukuran.** Besar.

---

## Tahap 6 — S7 Diskusi

**File.**

```text
src/app/diskusi/page.tsx
src/demo/data/discussion.ts
```

Pertanyaan dan jawaban sudah ditulis berpasangan. Pengguna memilih dari beberapa pertanyaan yang disarankan; mengetik bebas menampilkan jawaban umum yang jujur menyatakan ini mode demo.

```ts
export const diskusi = [
  {
    spesialis: 'finansial',
    tanya: 'Bagaimana jika saya memberi promo Beli 1 Gratis 1 di minggu pertama?',
    jawab: 'Margin kotor minggu pertama turun ke sekitar 15%…',
    toolCall: 'finance-calculator · call #FC-118',
    aksi: ['Lihat Simulasi Arus Kas', 'Jalankan sebagai Variasi'],
  },
];
```

Atribusi tool call wajib tampil pada jawaban yang memuat angka — ini pengganti badge "verified" yang diputuskan sebelumnya.

**Selesai bila.** Tiga tab spesialis berfungsi, jawaban muncul dengan jeda pendek supaya terasa hidup, atribusi tool call tampil.

**Ukuran.** Sedang.

---

## Tahap 7 — S1, S2, S4 dan Loop 2

Layar yang lebih ringan, dikerjakan setelah tiga layar besar selesai.

```text
src/app/upload/page.tsx      dropzone palsu + tombol "Pakai contoh"
src/app/analisis/page.tsx    sub-tahap berjalan ~6 detik lalu pindah otomatis
src/app/pasar/page.tsx       form terisi sebagian + pratinjau kualitas bukti
src/app/transaksi/page.tsx   input cepat + daftar + kartu insight
src/app/transaksi/struk/page.tsx  split view gambar dan hasil ekstraksi
src/demo/data/transactions.ts
```

Layar struk memakai satu gambar struk contoh di `public/`. Field dengan confidence rendah disorot dan mendapat fokus lebih awal.

**Selesai bila.** Seluruh tujuh langkah dapat dilalui berurutan tanpa jalan buntu, dan alur struk sampai tersimpan.

**Ukuran.** Sedang.

---

## Tahap 8 — Putar Otomatis

**File.**

```text
src/demo/useAutoplay.ts
src/components/layout/DemoControl.tsx
```

Cara kerja: satu daftar aksi berurutan berisi `{ rute, tahan_ms, aksi? }`. `aksi` opsional untuk hal seperti mengetik nilai di layar Review atau menekan lanjut.

```ts
export const autoplay = [
  { rute: '/upload',   tahanMs: 2500, aksi: 'unggah-contoh' },
  { rute: '/analisis', tahanMs: 5000 },
  { rute: '/review',   tahanMs: 9000, aksi: 'isi-biaya-operasional' },
  { rute: '/pasar',    tahanMs: 5000 },
  { rute: '/simulasi', tahanMs: 22000 },
  { rute: '/laporan',  tahanMs: 18000, aksi: 'gulir-perlahan' },
  { rute: '/diskusi',  tahanMs: 12000, aksi: 'tanya-promo' },
];
```

Target durasi total sekitar 75–80 detik. Sediakan tombol jeda dan lanjut; sekali klik di mana pun menghentikan autoplay supaya presenter bisa mengambil alih saat juri bertanya.

Hormati `prefers-reduced-motion` dengan menghilangkan animasi pengetikan.

**Selesai bila.** Satu klik menyelesaikan S1 sampai S7 tanpa intervensi, dan dapat dihentikan kapan saja.

**Ukuran.** Sedang.

---

## Urutan kerja

```text
1 Fondasi visual  ──►  2 Shell  ──►  3 Review  ──►  4 Simulasi
                                                        │
                          7 Layar ringan  ◄──  5 Laporan
                                 │                 │
                                 └──►  6 Diskusi ──┘
                                            │
                                            ▼
                                     8 Putar Otomatis
```

Tahap 1 dan 2 memblokir semuanya. Tahap 3, 4, 5 adalah tiga layar besar dan sebaiknya tidak dikerjakan paralel oleh orang berbeda sebelum primitif di tahap 1 stabil, karena akan menghasilkan tiga gaya kartu yang berbeda.

Tahap 8 dikerjakan terakhir karena butuh seluruh rute sudah ada.

## Selesai bila

- [ ] Tujuh langkah dapat dilalui dengan klik, maju dan mundur.
- [ ] Satu klik Putar Otomatis menyelesaikan alur dalam sekitar 80 detik.
- [ ] Varian laporan parsial dapat ditampilkan lewat `?hasil=parsial`.
- [ ] Laporan memuat Evidence Confidence, Bukti & Keterbatasan, dan disclaimer.
- [ ] Edit inline di layar Review benar-benar mengubah nilai.
- [ ] Panel simulasi merender enam jenis action dengan bentuk berbeda.
- [ ] Badge `MODE DEMO` tampil di seluruh layar.
- [ ] Seluruh alur dapat diselesaikan dengan keyboard.
- [ ] Berjalan hanya dengan `npm run dev`, tanpa backend.
- [ ] Tidak ada nilai warna lepas di luar `globals.css`.

## Catatan

Alur struk dan layar transaksi berada di tahap 7, artinya keduanya yang paling mungkin terpotong bila waktu habis. Kalau itu terjadi, potong layar transaksi manual lebih dulu dan pertahankan alur struk — alur struk yang memperlihatkan koreksi manusia atas hasil mesin, dan itu cerita yang lebih kuat.

Varian parsial di tahap 5 sebaiknya tidak dipotong meski waktu sempit. Ia bagian kecil dari pekerjaan tetapi satu-satunya yang memperlihatkan produk tetap berguna saat AI gagal.
