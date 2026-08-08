import Link from "next/link";

/**
 * Titik awal aplikasi sebenarnya. Halaman ini sengaja kosong dan siap
 * ditimpa — seluruh demo berada di `/demo` dan tidak menyentuh rute ini.
 */
export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[720px] flex-col justify-center px-6 py-20">
      <p className="label-eyebrow mb-4">SimuMarket AI</p>
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink-900 text-balance">
        Frontend aplikasi belum dibangun.
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-500">
        Halaman ini adalah titik awal aplikasi sebenarnya. Silakan timpa{" "}
        <code className="rounded-[5px] bg-surface-2 px-1.5 py-0.5 font-mono text-[14px] text-ink-700">
          src/app/page.tsx
        </code>{" "}
        dan bangun rute baru di samping{" "}
        <code className="rounded-[5px] bg-surface-2 px-1.5 py-0.5 font-mono text-[14px] text-ink-700">
          src/app/
        </code>
        .
      </p>

      <div className="mt-8 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Yang sudah tersedia untuk dipakai ulang
        </h2>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-500">
          <li>
            <code className="font-mono text-[13px] text-ink-700">
              src/app/globals.css
            </code>{" "}
            — token warna, huruf, radius, dan aturan fokus.
          </li>
          <li>
            <code className="font-mono text-[13px] text-ink-700">
              src/components/ui/
            </code>{" "}
            — Button, Card, Field, Metric, StatusBadge, Gauge.
          </li>
          <li>
            <code className="font-mono text-[13px] text-ink-700">
              src/lib/format.ts
            </code>{" "}
            — format rupiah, persen, dan tanggal.
          </li>
        </ul>
        <p className="mt-3 text-[13px] text-ink-400">
          Seluruh isi demo terisolasi di{" "}
          <code className="font-mono text-[12.5px]">src/app/demo/</code> dan{" "}
          <code className="font-mono text-[12.5px]">src/demo/</code>. Menghapus
          kedua folder itu tidak merusak apa pun di sini.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink-900 transition-colors hover:bg-surface-2"
        >
          Lihat demo klik-melalui
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
