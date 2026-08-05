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

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

Versi tersebut mengikuti proposal awal dan akan dikunci setelah spike teknis. Jangan meng-upgrade major version tanpa ADR karena dapat memengaruhi jadwal kompetisi.

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
