# SimuMarketAI Frontend

Frontend web untuk **SimuMarketAI**, decision-support toolkit bagi calon dan pelaku UMKM F&B di Jabodetabek.

## Status

Repository ini baru diinisialisasi. Belum ada source code aplikasi. Kontrak produk, arsitektur, dan API sedang didefinisikan terlebih dahulu di repository [Docs](https://github.com/NextGen-Manager/Docs).

## Tanggung jawab repository

- Landing page, autentikasi, dan dashboard pengguna.
- Modul edukasi bisnis F&B dan progress pengguna.
- Wizard Market Analysis serta live status proses agent.
- Market Analysis Report dan perbandingan skenario.
- Input transaksi manual, batch, dan melalui foto struk, termasuk review hasil OCR sebelum disimpan.
- Transaction Analytics Dashboard.
- Export/download laporan yang dihasilkan backend.
- UI berbahasa Indonesia, responsif, dan memenuhi aksesibilitas dasar WCAG 2.1.

## Stack target

- Next.js 16 (Active LTS)
- React 19
- TypeScript, `strict: true`
- Tailwind CSS v4

Proposal awal menyebut Next.js 14. Versi itu mencapai end of life pada 26 Oktober 2025 dan tidak lagi menerima patch keamanan, sehingga baseline dinaikkan ke 16 melalui [ADR-002](https://github.com/NextGen-Manager/Docs/blob/main/docs/adr/ADR-002-frontend-framework-version.md).

Next.js tidak memiliki jalur LTS terpisah: setiap major aktif selama ia terbaru, lalu berstatus maintenance sampai dua tahun sejak rilisnya. Versi 16 terbit Oktober 2025, jadi dukungannya berjalan sampai sekitar Oktober 2027 — melewati masa kompetisi.

Ketika Next.js 17 terbit, **jangan langsung naik**. Versi 16 tetap menerima patch keamanan. Kenaikan major berikutnya memerlukan ADR baru.

## Batas arsitektur

Frontend tidak menghitung skor, BEP, atau metrik finansial. Semua perhitungan otoritatif dilakukan backend. Frontend hanya memvalidasi bentuk input, menampilkan status job, dan merender output beserta provenance, confidence, serta disclaimer DSS.

## Rencana struktur

```text
src/
  app/             # route dan layout Next.js
  components/      # komponen UI reusable
  features/        # auth, education, market-analysis, transactions
  lib/             # API client, validation, formatting
  types/           # DTO hasil generate dari OpenAPI
tests/
```

## Dokumen acuan

- [Arsitektur sistem](https://github.com/NextGen-Manager/Docs/blob/main/docs/02-system-architecture.md)
- [Kontrak API](https://github.com/NextGen-Manager/Docs/blob/main/docs/06-api-contract.md)
- [Roadmap MVP](https://github.com/NextGen-Manager/Docs/blob/main/docs/09-mvp-roadmap.md)

## Menjalankan aplikasi

Belum tersedia. Instruksi instalasi, environment variables, testing, dan build wajib ditambahkan ketika scaffold frontend dibuat.
