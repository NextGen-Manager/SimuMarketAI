# SimuMarketAI Frontend

Frontend web SimuMarket AI, platform pendukung keputusan untuk calon pengusaha dan pemilik UMKM F&B di Jabodetabek.

**[Cara menjalankan](#cara-menjalankan)** · [Tech stack](#tech-stack) · [Struktur repository](#struktur-repository) · [Quality checks](#quality-checks) · [Dokumentasi teknis](https://github.com/NextGen-Manager/Docs)

## Tentang repository

Repository ini menangani seluruh pengalaman pengguna SimuMarket AI:

- autentikasi dan ruang kerja berbasis peran pemilik serta kasir;
- edukasi bisnis F&B dan education gate;
- input Market Analysis, progres simulasi, riwayat, dan laporan;
- pengelolaan usaha, produk, transaksi, serta analitik operasional;
- review foto struk sebelum transaksi disimpan;
- export laporan melalui artifact backend;
- interactive demo berbasis data seed pada rute `/demo`.

Frontend tidak menghitung skor, BEP, marjin, total transaksi, atau metrik otoritatif lain. Nilai tersebut berasal dari backend dan hanya divalidasi bentuknya, diformat, lalu ditampilkan bersama provenance, confidence, warning, serta disclaimer.

## Cara menjalankan

Prasyarat:

- Node.js 22 LTS;
- npm;
- backend SimuMarket AI bila ingin memakai alur aplikasi nyata.

```bash
git clone https://github.com/NextGen-Manager/SimuMarketAI.git
cd SimuMarketAI
npm ci
```

Salin konfigurasi lokal:

```bash
cp .env.example .env.local
```

Pada PowerShell gunakan:

```powershell
Copy-Item .env.example .env.local
```

Nilai bawaan mengarahkan proxy server-side ke backend lokal:

```dotenv
BACKEND_URL=http://localhost:8000
```

Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000`. Interactive demo tersedia di `http://localhost:3000/demo`.

Untuk memeriksa production build:

```bash
npm run build
npm run start
```

## Tech stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16, App Router |
| UI runtime | React 19 |
| Bahasa | TypeScript dengan strict mode |
| Styling | Tailwind CSS 4 |
| Validasi kontrak | Zod 4 |
| Peta | Leaflet dan OpenStreetMap |
| Animasi | GSAP dengan dukungan reduced motion |
| Unit/component test | Vitest dan Testing Library |
| Browser test | Playwright, Chromium, Firefox, WebKit |
| Accessibility audit | axe-core melalui Playwright |

Kenaikan major framework harus melalui ADR. Keputusan penggunaan Next.js 16 tercatat pada [ADR-002](https://github.com/NextGen-Manager/Docs/blob/main/docs/adr/ADR-002-frontend-framework-version.md).

## Struktur repository

```text
src/
  app/             route, layout, proxy backend, dan demo
  components/      primitive UI, layout, dan landing page
  features/        auth, analysis, education, business, transaction, analytics
  lib/             API client, kontrak Zod, formatter, dan access policy
  demo/            komponen serta data seed interactive demo
tests/              unit dan component tests
e2e/                browser, accessibility, RBAC, analysis, dan receipt flows
```

Kontrak response API berada di `src/lib/contracts`. Komponen tidak mendefinisikan ulang DTO dan tidak menghitung ulang nilai yang dikirim backend.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm audit --omit=dev
```

Playwright menjalankan browser matrix Chromium, Firefox, dan WebKit. CI juga memeriksa WCAG 2.1 A/AA secara otomatis pada halaman publik utama.

## Branch dan deployment

- `dev` adalah branch integrasi pengembangan.
- `main` menyimpan baseline stabil dan menjalankan CI, tetapi tidak menjalankan workflow production frontend.
- `demo` adalah satu-satunya branch yang memicu workflow production Vercel di repository ini.

Jika Vercel Git Integration diaktifkan langsung dari dashboard Vercel, atur **Production Branch** ke `demo` agar konsisten dengan workflow repository.

## Dokumentasi

- [Dokumentasi SimuMarket AI](https://github.com/NextGen-Manager/Docs)
- [Arsitektur sistem](https://github.com/NextGen-Manager/Docs/blob/main/docs/02-system-architecture.md)
- [Kontrak API](https://github.com/NextGen-Manager/Docs/blob/main/docs/06-api-contract.md)
- [Alur aplikasi](https://github.com/NextGen-Manager/Docs/blob/main/docs/12-application-workflow.md)
- [Sistem UI](https://github.com/NextGen-Manager/Docs/blob/main/docs/13-ui-system-and-mock-plan.md)
