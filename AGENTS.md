# Frontend — Coding Rules

Aturan untuk repository frontend SimuMarket AI.

## Lima aturan yang berlaku di seluruh produk

SimuMarket AI terdiri dari tiga repository terpisah: [Docs](https://github.com/NextGen-Manager/Docs) sebagai sumber kebenaran, repository ini untuk frontend, dan [SimuMarketAI-BE](https://github.com/NextGen-Manager/SimuMarketAI-BE) untuk backend. Lima aturan berikut berlaku di ketiganya. Melanggarnya membatalkan klaim inti produk, bukan sekadar melanggar gaya.

1. **LLM tidak pernah menjadi sumber angka otoritatif.** Skor, BEP, marjin, payback, dan seluruh agregat dihitung kode deterministik. Agent boleh mengkritik angka, tidak boleh membuatnya.
2. **Setiap angka yang tampil punya provenance.** Nilai, satuan, sumber, waktu pengambilan, dan tingkat keyakinan.
3. **Kegagalan parsial tidak boleh disamarkan.** Status `partial` tetap `partial`. Komponen yang gagal tidak diberi nilai bawaan.
4. **Uang adalah integer rupiah.** Tidak ada `float` di jalur uang, di bahasa mana pun.
5. **Data pengguna tidak bocor ke prompt.** Nama pelanggan, nomor telepon, teks struk mentah, dan catatan bebas tidak pernah dikirim ke penyedia LLM.

Kalau sebuah tugas tampak menuntut pelanggaran salah satu di atas, berhenti dan tanyakan — jangan cari jalan pintas.

**Bahasa.** Teks yang dilihat pengguna Bahasa Indonesia, termasuk pesan error, label, dan teks kosong. Kode, nama variabel, nama file, dan commit message Bahasa Inggris. Komentar kode menjelaskan *kenapa*, bukan *apa*.

**Git.** Jangan commit atau push kecuali diminta. Jangan pernah commit `.env`, kunci API, dump database, trace OASIS, PDF milik pengguna, atau foto struk. Satu commit satu perubahan logis.

**Dokumen menang atas kode.** Kalau kode menyimpang dari `Docs`, yang salah adalah kode — kecuali ada ADR yang menyatakan sebaliknya.

## Batas repository ini

Frontend **tidak menghitung apa pun yang bersifat otoritatif**. Tidak menghitung skor, BEP, marjin, total, persentase progres, atau agregat transaksi.

Yang boleh dilakukan frontend:

- memvalidasi bentuk input sebelum dikirim;
- memformat angka yang sudah jadi;
- merender status, provenance, confidence, dan disclaimer;
- menghitung hal yang murni presentasional, misalnya lebar bar dari nilai yang sudah diberikan backend.

Kalau sebuah komponen mulai menjumlahkan uang, itu tanda kontrak API yang kurang — perbaiki kontraknya, jangan hitung di sini.

## Stack

| Hal | Pin |
|---|---|
| Node | 22 LTS |
| Next.js | 16.x, App Router |
| React | 19 |
| TypeScript | 5.x, `strict: true` |
| Tailwind | v4, konfigurasi CSS-first |
| Test | Vitest + Testing Library, Playwright untuk E2E |

Alasan pin dan sejarah perubahan dari Next 14 ada di `Docs/docs/14-tech-stack-decisions.md` dan `ADR-002`.

## Struktur

```text
src/
  app/                 route dan layout
  components/ui/       komponen dasar, satu-satunya sumber primitif visual
  features/            auth, education, analysis, transactions
  lib/
    contracts/         skema Zod, ditranskripsi dari kontrak API
    format/            formatter uang, tanggal, satuan
  demo/                data contoh dan pemutar alur mock
tests/
```

Aturan struktur:

- `features/` boleh mengimpor dari `components/ui` dan `lib`. Kebalikannya dilarang.
- Satu feature tidak mengimpor internal feature lain; kalau butuh, naikkan ke `lib` atau `components/ui`.
- `demo/` tidak boleh diimpor dari mana pun kecuali composition root dan test.

## TypeScript

- `strict: true`. Tidak ada `any`, tidak ada `@ts-ignore` tanpa komentar yang menjelaskan kenapa dan kapan bisa dihapus.
- Tipe data dari API berasal dari `lib/contracts`. Jangan mendefinisikan ulang bentuk DTO di dalam komponen.
- Gunakan `unknown` lalu parse, bukan `as` untuk data eksternal.
- Nama file komponen `PascalCase.tsx`, hook `useThing.ts`, util `kebab-case.ts`.

## Uang dan angka

```ts
// benar
formatIDR(18500)            // "Rp 18.500"

// salah — frontend tidak menjumlahkan uang
const total = items.reduce((a, i) => a + i.price * i.qty, 0);
```

- Uang datang sebagai integer rupiah dari API dan hanya diformat.
- Format lewat `Intl.NumberFormat('id-ID')`, dibungkus di `lib/format`. Jangan memanggil `Intl` langsung di komponen.
- Angka dalam tabel dan kartu metrik memakai `tabular-nums`.
- Angka yang tidak terdefinisi ditulis apa adanya, misalnya "tidak terdefinisi" untuk BEP saat marjin kontribusi nol atau negatif. Jangan menulis `-`, `∞`, atau `NaN`.

## Styling

- Warna, ukuran huruf, spasi, dan radius **hanya** dari token di `@theme`. Tidak ada hex mentah di komponen.
- Kartu dipisahkan oleh border hairline, bukan bayangan.
- Maksimum dua hue per layar di luar neutral.
- Warna semantik hanya untuk status, tidak pernah dekorasi.
- Warna tidak boleh menjadi satu-satunya pembawa makna; setiap badge status membawa ikon dan teks.

Detail lengkap ada di `Docs/docs/13-ui-system-and-mock-plan.md`. Kalau butuh token baru, tambahkan ke `@theme` dan catat di dokumen itu — jangan menulis nilai lepas.

## Lima state per layar

Setiap layar yang mengambil data wajib menangani kelimanya. Ini bagian dari definition of done, bukan tambahan.

| State | Ketentuan |
|---|---|
| Loading | skeleton yang menyerupai bentuk akhir, bukan spinner satu layar |
| Empty | menjelaskan apa yang akan muncul, plus satu aksi utama |
| Error | pesan aman berbahasa Indonesia, `correlation_id` dapat disalin, retry bila `retryable` |
| Unauthorized | arahkan login tanpa membuang draft yang sedang diisi |
| Partial | bagian gagal tetap tampil dengan penanda tidak tersedia — jangan dihapus dari daftar isi |

## Yang wajib ada dan tidak boleh dihapus

- Disclaimer DSS pada laporan di layar maupun di PDF.
- Bagian Evidence Confidence dan Bukti & Keterbatasan pada laporan, tidak collapsed secara default.
- Label "respons sintetis" pada setiap kutipan agent.
- Badge `MODE DEMO` saat mode demo aktif.

Kalau sebuah task meminta menghapus salah satunya demi tampilan lebih bersih, tolak dan jelaskan.

## Aksesibilitas

- Target WCAG 2.1 AA.
- Seluruh alur dapat diselesaikan dengan keyboard, termasuk edit inline dan review OCR.
- Fokus selalu terlihat; `outline: none` dilarang tanpa pengganti yang setara.
- `lang="id"` pada dokumen.
- Ikon dekoratif `aria-hidden`, ikon fungsional punya label.
- Perubahan tahap simulasi diumumkan lewat live region `polite`, kegagalan lewat `assertive`.
- Hormati `prefers-reduced-motion`.

## Mode demo

- Satu-satunya percabangan mock/nyata ada di composition root transport.
- Data contoh hanya di `src/demo/data/`.
- Mode demo mati secara default pada build produksi.
- Fixture dan panel demo tidak boleh ikut ter-bundle ke produksi.

## Perintah

```bash
npm run dev          # mode demo
npm run build        # produksi
npm run lint
npm run typecheck    # tsc --noEmit
npm run test
npm run test:e2e
```

Sebelum menyatakan sebuah task selesai, jalankan minimal `lint`, `typecheck`, dan `test`. Laporkan hasil apa adanya.

## Yang tidak boleh dilakukan

- Menyimpan token di `localStorage` bila cookie `HttpOnly` tersedia.
- Menampilkan stack trace, prompt, atau respons provider mentah ke pengguna.
- Membuat komponen UI varian lokal yang menduplikasi `components/ui`.
- Menambahkan pustaka chart berat untuk kebutuhan yang cukup dengan bar sederhana.
- Meng-upgrade major version dependency tanpa ADR.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
