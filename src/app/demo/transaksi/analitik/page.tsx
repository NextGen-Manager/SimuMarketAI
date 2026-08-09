"use client";

import { useEffect, useRef, useState } from "react";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { businessAnalyticsSeed } from "@/demo/data/workspace";
import { cn, formatIDR, formatIDRShort, formatPersen } from "@/lib/format";

type BusinessAnalytics = (typeof businessAnalyticsSeed.businesses)[number];

function SourceLine() {
  const source = businessAnalyticsSeed.source;
  return <p className="text-[10.5px] leading-4 text-ink-400">{source.label} · {source.observedAt} · {source.confidence}</p>;
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="rounded-[12px] border border-line bg-surface p-4"><p className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-400">{label}</p><p className="tnum mt-2 text-[22px] font-bold tracking-tight text-ink-900">{value}</p><p className="mt-1 text-[11px] text-ink-400">{note}</p></article>;
}

function BusinessDetail({ business }: { business: BusinessAnalytics }) {
  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <section aria-labelledby="daily-revenue" className="rounded-[14px] border border-line bg-surface p-5">
        <div className="flex items-start justify-between gap-4"><div><h2 id="daily-revenue" className="text-[15px] font-bold text-ink-900">Pendapatan harian</h2><p className="mt-1 text-[11.5px] text-ink-400">{business.name} · {businessAnalyticsSeed.period}</p></div><span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold text-teal-700">{formatPersen(business.revenueChangePercent)} dari periode lalu</span></div>
        <div className="mt-7 flex h-[190px] items-end gap-2" aria-label="Grafik pendapatan harian">
          {business.dailyRevenue.map((day) => <div key={day.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="tnum text-[9.5px] font-semibold text-ink-500">{formatIDRShort(day.valueIdr).replace("Rp ", "")}</span><div className="w-full max-w-12 rounded-t-[5px] bg-teal-700" style={{ height: `${day.heightPercent}%` }} title={`${day.label}: ${formatIDR(day.valueIdr)}`} /><span className="text-[10.5px] font-semibold text-ink-400">{day.label}</span></div>)}
        </div>
        <div className="mt-4 border-t border-line pt-3"><SourceLine /></div>
      </section>

      <section aria-labelledby="product-contribution" className="rounded-[14px] border border-line bg-surface p-5">
        <h2 id="product-contribution" className="text-[15px] font-bold text-ink-900">Kontribusi produk</h2><p className="mt-1 text-[11.5px] text-ink-400">Bagian pendapatan per produk</p>
        <ul className="mt-5 space-y-4">{business.products.map((product) => <li key={product.name}><div className="mb-1.5 flex items-baseline justify-between gap-3"><span className="truncate text-[12px] font-semibold text-ink-700">{product.name}</span><span className="tnum shrink-0 text-[11px] font-bold text-ink-500">{formatPersen(product.sharePercent)}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-amber-600" style={{ width: `${product.sharePercent}%` }} /></div><p className="tnum mt-1 text-[10px] text-ink-400">{formatIDR(product.revenueIdr)}</p></li>)}</ul>
      </section>
    </div>
  );
}

export default function AnalyticsPage() {
  const { activeBusinessId, setActiveBusinessId } = useDemoFlow();
  const [selectedId, setSelectedId] = useState<string>("all");
  const previousBusinessId = useRef(activeBusinessId);
  const selectedBusiness = businessAnalyticsSeed.businesses.find((business) => business.id === selectedId);
  const composite = businessAnalyticsSeed.composite;

  useEffect(() => {
    if (previousBusinessId.current !== activeBusinessId) {
      previousBusinessId.current = activeBusinessId;
      setSelectedId(activeBusinessId);
    }
  }, [activeBusinessId]);

  function selectBusiness(id: string) {
    setActiveBusinessId(id);
    setSelectedId(id);
  }

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-teal-700">Usaha · Analitik</p><h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-ink-900">Analitik penjualan</h1><p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-500">Lihat performa gabungan seluruh usaha, lalu buka rincian masing-masing usaha tanpa keluar dari halaman ini.</p></div><span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold text-ink-500">Periode {businessAnalyticsSeed.period}</span></div>

      <div role="tablist" aria-label="Cakupan analitik" className="mt-6 flex flex-wrap gap-2">
        <button type="button" role="tab" aria-selected={selectedId === "all"} onClick={() => setSelectedId("all")} className={cn("rounded-[9px] border px-3.5 py-2 text-[12px] font-bold", selectedId === "all" ? "border-teal-700 bg-teal-50 text-teal-700" : "border-line bg-surface text-ink-500 hover:bg-surface-2")}>Semua usaha</button>
        {businessAnalyticsSeed.businesses.map((business) => <button key={business.id} type="button" role="tab" aria-selected={selectedId === business.id} onClick={() => selectBusiness(business.id)} className={cn("rounded-[9px] border px-3.5 py-2 text-left text-[12px] font-bold", selectedId === business.id ? "border-teal-700 bg-teal-50 text-teal-700" : "border-line bg-surface text-ink-500 hover:bg-surface-2")}><span className="block">{business.name}</span><span className="block text-[9.5px] font-medium opacity-70">{business.area}</span></button>)}
      </div>

      {selectedBusiness ? (
        <>
          <section aria-label={`Ringkasan ${selectedBusiness.name}`} className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Pendapatan" value={formatIDRShort(selectedBusiness.revenueIdr)} note={businessAnalyticsSeed.period} /><MetricCard label="Transaksi" value={selectedBusiness.transactions.toLocaleString("id-ID")} note="Transaksi terkonfirmasi" /><MetricCard label="Rata-rata transaksi" value={formatIDR(selectedBusiness.averageTicketIdr)} note="Agregat deterministic engine" /><MetricCard label="Jam teramai" value={selectedBusiness.busiestWindow} note={`${selectedBusiness.daysRecorded} hari tercatat`} /></section>
          <BusinessDetail business={selectedBusiness} />
        </>
      ) : (
        <>
          <section aria-label="Analitik gabungan" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Pendapatan gabungan" value={formatIDRShort(composite.revenueIdr)} note={businessAnalyticsSeed.period} /><MetricCard label="Transaksi gabungan" value={composite.transactions.toLocaleString("id-ID")} note="Dari dua usaha" /><MetricCard label="Rata-rata transaksi" value={formatIDR(composite.averageTicketIdr)} note="Agregat lintas usaha" /><MetricCard label="Usaha aktif" value={String(composite.activeBusinesses)} note={`${formatPersen(composite.revenueChangePercent)} dari periode lalu`} /></section>
          <section aria-labelledby="business-comparison" className="mt-5 overflow-hidden rounded-[14px] border border-line bg-surface"><div className="border-b border-line px-5 py-4"><h2 id="business-comparison" className="text-[15px] font-bold text-ink-900">Perbandingan usaha</h2><p className="mt-1 text-[11.5px] text-ink-400">Pilih satu baris untuk membuka rincian analitiknya.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400"><tr><th className="px-5 py-3">Usaha</th><th className="px-4 py-3">Pendapatan</th><th className="px-4 py-3">Transaksi</th><th className="px-4 py-3">Produk utama</th><th className="px-5 py-3 text-right">Rincian</th></tr></thead><tbody>{businessAnalyticsSeed.businesses.map((business) => <tr key={business.id} className="border-t border-line-soft text-[12px]"><td className="px-5 py-4"><p className="font-bold text-ink-900">{business.name}</p><p className="mt-0.5 text-[10.5px] text-ink-400">{business.area}</p></td><td className="tnum px-4 py-4 font-semibold text-ink-700">{formatIDR(business.revenueIdr)}</td><td className="tnum px-4 py-4 text-ink-500">{business.transactions.toLocaleString("id-ID")}</td><td className="px-4 py-4 text-ink-500">{business.topProduct} · {formatPersen(business.topProductSharePercent)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => selectBusiness(business.id)} className="font-bold text-teal-700">Buka →</button></td></tr>)}</tbody></table></div><div className="border-t border-line px-5 py-3"><SourceLine /></div></section>
        </>
      )}
    </main>
  );
}
