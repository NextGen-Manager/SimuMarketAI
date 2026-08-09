import Link from "next/link";
import { dashboardSeed, type DashboardNavItem } from "@/demo/data/dashboard";
import { formatIDR } from "@/lib/format";

function BrandMark() {
  return (
    <span className="grid size-8 place-items-center rounded-[10px] bg-teal-700 text-surface" aria-hidden>
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path d="m5 15 4-4 3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavIcon({ icon }: { icon: DashboardNavItem["icon"] }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    analysis: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 12l2-2 2 2 3-4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    transaction: <><path d="M4 7h16M4 12h16M4 17h10" /><path d="m17 15 3 2-3 2" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    product: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /></>,
    education: <><path d="m3 6 9-3 9 3-9 3-9-3Z" /><path d="M6 8v6c3 2 9 2 12 0V8M21 6v7" /></>,
    report: <><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  } satisfies Record<DashboardNavItem["icon"], React.ReactNode>;

  return (
    <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[icon]}
    </svg>
  );
}

function SourceNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "text-[10.5px] leading-4 text-ink-400" : "text-[11px] leading-4 text-ink-400"}>
      {dashboardSeed.meta.source} · {dashboardSeed.meta.observedAt} · {dashboardSeed.meta.confidence}
    </p>
  );
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <BrandMark />
        <div>
          <p className="text-[15px] font-bold tracking-tight text-ink-900">SimuMarket AI</p>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-400">Decision support</p>
        </div>
      </div>

      <div className="border-b border-line p-3">
        <label htmlFor="business" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
          Usaha aktif
        </label>
        <div className="relative">
          <select id="business" defaultValue={dashboardSeed.businesses[0].id} className="h-12 w-full appearance-none rounded-[10px] border border-line bg-surface-2 px-3 pr-8 text-[12.5px] font-semibold text-ink-900">
            {dashboardSeed.businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.name} · {business.area}</option>
            ))}
          </select>
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="m6 8 4 4 4-4" />
          </svg>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-3 py-4">
        {dashboardSeed.navigation.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href === "/demo/dashboard";
                const badge = "badge" in item ? item.badge : undefined;
                return (
                  <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`group flex h-9 items-center gap-3 rounded-[8px] px-2.5 text-[12.5px] font-semibold transition-colors ${active ? "bg-teal-50 text-teal-700" : "text-ink-500 hover:bg-surface-2 hover:text-ink-900"}`}>
                    <NavIcon icon={item.icon} />
                    <span>{item.label}</span>
                    {badge ? <span className={`ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${badge === "•" ? "bg-amber-50 text-amber-600" : "bg-surface-2 text-ink-400 group-hover:bg-surface"}`}>{badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-[10px] px-2 py-2">
          <span className="grid size-8 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-surface">{dashboardSeed.user.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold text-ink-900">{dashboardSeed.user.name} Pratama</p>
            <p className="truncate text-[10.5px] text-ink-400">Akun demo pemilik</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const items = [
    dashboardSeed.navigation[0].items[0],
    dashboardSeed.navigation[1].items[0],
    dashboardSeed.navigation[2].items[0],
    dashboardSeed.navigation[2].items[1],
  ];

  return (
    <nav aria-label="Navigasi seluler" className="fixed inset-x-0 bottom-0 z-50 grid h-[68px] grid-cols-4 border-t border-line bg-surface/95 px-2 backdrop-blur lg:hidden">
      {items.map((item) => {
        const active = item.href === "/demo/dashboard";
        return (
          <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-teal-700" : "text-ink-400"}`}>
            <NavIcon icon={item.icon} />
            <span className="truncate">{item.label === "Market Analysis" ? "Analisis" : item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6 xl:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <BrandMark />
        <span className="hidden text-[14px] font-bold text-ink-900 sm:block">SimuMarket AI</span>
      </div>
      <label className="relative hidden max-w-[420px] flex-1 md:block">
        <span className="sr-only">Cari menu atau analisis</span>
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
        <input type="search" placeholder="Cari menu atau analisis..." className="h-9 w-full rounded-[9px] border border-line bg-surface-2 pl-9 pr-3 text-[12px] text-ink-700 placeholder:text-ink-400" />
      </label>
      <div className="ml-auto flex items-center gap-2">
        <span className="rounded-full border border-amber-600/30 bg-amber-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-amber-600">MODE DEMO</span>
        <button type="button" aria-label="Bantuan" className="grid size-9 place-items-center rounded-[9px] border border-line text-ink-500 hover:bg-surface-2">
          <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 1 1 3.5 2c-.8.5-1.3 1-1.3 2M12 17h.01" /></svg>
        </button>
        <span className="grid size-9 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-surface">{dashboardSeed.user.initials}</span>
      </div>
    </header>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-canvas pb-[68px] lg:pb-0 lg:pl-[248px]">
      <Sidebar />
      <div className="min-w-0">
        <Topbar />
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">Beranda usaha</p>
              <h1 className="text-[24px] font-bold tracking-[-0.025em] text-ink-900 sm:text-[28px]">Selamat pagi, {dashboardSeed.user.name}</h1>
              <p className="mt-1 text-[13px] text-ink-500">Berikut hal terpenting untuk Kopi Senja hari ini.</p>
            </div>
            <Link href="/demo/transaksi/catat" className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-teal-700 px-4 text-[12.5px] font-bold text-surface transition-colors hover:bg-teal-600">
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M10 3v14M3 10h14" /></svg>
              Catat penjualan
            </Link>
          </div>

          <section aria-labelledby="today-title" className="overflow-hidden rounded-[14px] border border-line bg-surface">
            <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
              <div className="p-5 sm:p-6 xl:p-7">
                <div className="mb-5 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-600" aria-hidden />
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Perlu perhatian hari ini</span>
                </div>
                <h2 id="today-title" className="max-w-[620px] text-[21px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[24px]">{dashboardSeed.primaryState.title}</h2>
                <p className="mt-2 max-w-[600px] text-[13.5px] leading-6 text-ink-500">{dashboardSeed.primaryState.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href="/demo/transaksi/catat" className="inline-flex h-10 items-center justify-center rounded-[9px] bg-teal-700 px-4 text-[12.5px] font-bold text-surface hover:bg-teal-600">Catat sekarang</Link>
                  <span className="text-[11.5px] font-semibold text-ink-400">Kurang dari 10 detik</span>
                </div>
              </div>
              <div className="border-t border-line bg-surface-2 p-5 sm:p-6 lg:border-l lg:border-t-0 xl:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Menuju analitik</p>
                    <p className="mt-2 text-[19px] font-bold text-ink-900 tnum">{dashboardSeed.primaryState.recordedDays}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10.5px] font-bold text-amber-600">{dashboardSeed.primaryState.remainingDays}</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progres data menuju analitik" aria-valuenow={dashboardSeed.primaryState.progressPercent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-teal-700" style={{ width: `${dashboardSeed.primaryState.progressPercent}%` }} />
                </div>
                <p className="mt-4 text-[12px] leading-5 text-ink-500">{dashboardSeed.primaryState.reward}</p>
                <div className="mt-4 border-t border-line pt-3"><SourceNote compact /></div>
              </div>
            </div>
          </section>

          <section aria-label="Ringkasan hari ini" className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Transaksi hari ini", value: dashboardSeed.today.transactions, note: "Belum ada pencatatan" },
              { label: "Pendapatan hari ini", value: formatIDR(dashboardSeed.today.revenueIdr), note: "Transaksi terkonfirmasi" },
              { label: "Katalog aktif", value: dashboardSeed.today.productsActive, note: "Siap dipilih saat mencatat" },
            ].map((metric) => (
              <article key={metric.label} className="rounded-[12px] border border-line bg-surface p-4">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-400">{metric.label}</p>
                <p className="mt-2 text-[20px] font-bold text-ink-900 tnum">{metric.value}</p>
                <p className="mt-1 text-[11px] text-ink-400">{metric.note}</p>
              </article>
            ))}
          </section>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
            <section aria-labelledby="plan-title" className="overflow-hidden rounded-[14px] border border-line bg-surface">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                <div>
                  <h2 id="plan-title" className="text-[15px] font-bold text-ink-900">Rencana 30 hari</h2>
                  <p className="mt-0.5 text-[11px] text-ink-400">Tindakan prioritas dari laporan terakhirmu</p>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold text-teal-700">{dashboardSeed.plan.progress}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[610px] border-collapse text-left">
                  <thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400">
                    <tr><th className="px-5 py-3 font-bold">Tindakan</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Target</th><th className="px-5 py-3 text-right font-bold">Buka</th></tr>
                  </thead>
                  <tbody>
                    {dashboardSeed.plan.items.map((item) => (
                      <tr key={item.task} className="border-t border-line-soft text-[12px]">
                        <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className={`grid size-5 shrink-0 place-items-center rounded-[6px] border ${item.done ? "border-success-600 bg-success-50 text-success-600" : "border-line bg-surface text-transparent"}`} aria-hidden>✓</span><span className={item.done ? "text-ink-400 line-through" : "font-semibold text-ink-700"}>{item.task}</span></div></td>
                        <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${item.done ? "bg-success-50 text-success-600" : item.status === "Berikutnya" ? "bg-amber-50 text-amber-600" : "bg-surface-2 text-ink-400"}`}>{item.status}</span></td>
                        <td className="px-4 py-3.5 text-ink-500 tnum">{item.due}</td>
                        <td className="px-5 py-3.5 text-right"><Link href="/demo/laporan" aria-label={`Buka tindakan ${item.task}`} className="font-bold text-teal-700">→</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-line px-5 py-3"><SourceNote compact /></div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <section aria-labelledby="insight-title" className="rounded-[14px] border border-line bg-surface p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-teal-700">{dashboardSeed.latestInsight.eyebrow}</p>
                <h2 id="insight-title" className="mt-3 text-[16px] font-bold leading-6 text-ink-900">{dashboardSeed.latestInsight.title}</h2>
                <p className="mt-2 text-[12px] leading-5 text-ink-500">{dashboardSeed.latestInsight.body}</p>
                <div className="mt-4 rounded-[9px] bg-surface-2 px-3 py-2 text-[10.5px] font-semibold text-ink-500">Dasar: {dashboardSeed.latestInsight.evidence}</div>
                <Link href="/demo/transaksi/analitik" className="mt-4 inline-flex text-[11.5px] font-bold text-teal-700">Lihat analitik <span className="ml-1" aria-hidden>→</span></Link>
              </section>

              <section aria-labelledby="education-title" className="rounded-[14px] border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-400">Edukasi</p><h2 id="education-title" className="mt-1.5 text-[16px] font-bold text-ink-900">{dashboardSeed.education.progress}</h2></div>
                  <span className="text-[18px] font-bold text-teal-700 tnum">{dashboardSeed.education.progressPercent}%</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progres edukasi" aria-valuenow={dashboardSeed.education.progressPercent} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-teal-700" style={{ width: `${dashboardSeed.education.progressPercent}%` }} /></div>
                <p className="mt-4 text-[11px] text-ink-400">Topik berikutnya</p>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-ink-700">{dashboardSeed.education.next}</p>
                <Link href="/demo/edukasi" className="mt-4 inline-flex text-[11.5px] font-bold text-teal-700">Lanjutkan belajar <span className="ml-1" aria-hidden>→</span></Link>
              </section>
            </div>
          </div>

          <section aria-labelledby="history-title" className="mt-4 overflow-hidden rounded-[14px] border border-line bg-surface">
            <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 id="history-title" className="text-[15px] font-bold text-ink-900">Analisis tersimpan</h2><p className="mt-0.5 text-[11px] text-ink-400">Bandingkan skenario lokasi secara sejajar</p></div>
              <div className="flex items-center gap-2"><span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-semibold text-ink-500">{dashboardSeed.ruleVersion}</span><Link href="/demo/laporan" className="text-[11.5px] font-bold text-teal-700">Lihat semua</Link></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400"><tr><th className="px-5 py-3 font-bold">Analisis</th><th className="px-4 py-3 font-bold">Area</th><th className="px-4 py-3 font-bold">Skor</th><th className="px-4 py-3 font-bold">Interpretasi</th><th className="px-5 py-3 font-bold">Dibuat</th></tr></thead>
                <tbody>{dashboardSeed.analyses.map((analysis) => <tr key={analysis.id} className="border-t border-line-soft text-[12px]"><td className="px-5 py-3.5"><p className="font-semibold text-ink-900">{analysis.name}</p><p className="mt-0.5 font-mono text-[9.5px] text-ink-400">{analysis.id}</p></td><td className="px-4 py-3.5 text-ink-500">{analysis.area}</td><td className="px-4 py-3.5"><span className="text-[16px] font-bold text-amber-600 tnum">{analysis.score}</span><span className="text-[10px] text-ink-400">/100</span></td><td className="px-4 py-3.5 text-ink-500">{analysis.interpretation}</td><td className="px-5 py-3.5 text-ink-400 tnum">{analysis.date}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="border-t border-line px-5 py-3"><SourceNote compact /></div>
          </section>

          <p className="mx-auto mt-5 max-w-3xl text-center text-[10.5px] leading-5 text-ink-400">Dashboard ini menggunakan data seed untuk evaluasi UI. Hasil SimuMarket AI adalah alat bantu keputusan, bukan jaminan keberhasilan usaha.</p>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
