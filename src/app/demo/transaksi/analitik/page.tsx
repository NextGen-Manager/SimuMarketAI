"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { AMBANG_HARI } from "@/demo/data/transactions";
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

function DailyRevenue({ business }: { business: BusinessAnalytics }) {
  return (
    <section aria-labelledby="daily-revenue" className="rounded-[14px] border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4"><div><h2 id="daily-revenue" className="text-[15px] font-bold text-ink-900">Tren pendapatan mingguan</h2><p className="mt-1 text-[11.5px] text-ink-400">{business.name} · {businessAnalyticsSeed.period}</p></div><span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold text-teal-700">{formatPersen(business.revenueChangePercent)} dari periode lalu</span></div>
      <div className="mt-7 flex h-[190px] items-end gap-2" aria-label="Grafik pendapatan harian">
        {business.dailyRevenue.map((day) => <div key={day.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="tnum text-[9.5px] font-semibold text-ink-500">{formatIDRShort(day.valueIdr).replace("Rp ", "")}</span><div className="w-full max-w-12 rounded-t-[5px] bg-teal-700" style={{ height: `${day.heightPercent}%` }} title={`${day.label}: ${formatIDR(day.valueIdr)}`} /><span className="text-[10.5px] font-semibold text-ink-400">{day.label}</span></div>)}
      </div>
      <div className="mt-4 border-t border-line pt-3"><SourceLine /></div>
    </section>
  );
}

function ProductRanking({ business }: { business: BusinessAnalytics }) {
  return (
    <section aria-labelledby="product-ranking" className="rounded-[14px] border border-line bg-surface p-5">
      <h2 id="product-ranking" className="text-[15px] font-bold text-ink-900">Peringkat produk</h2>
      <p className="mt-1 text-[11.5px] text-ink-400">Volume dan kontribusi pendapatan pada periode yang sama.</p>
      <ol className="mt-5 space-y-4">{business.products.map((product, index) => <li key={product.name}><div className="flex items-start gap-3"><span className="tnum grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-ink-500">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-semibold text-ink-700">{product.name}</span><span className="tnum text-[10.5px] font-bold text-ink-500">{product.unitsSold} porsi · {formatPersen(product.sharePercent)}</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-amber-600" style={{ width: `${product.sharePercent}%` }} /></div><div className="mt-1.5 flex items-center justify-between gap-2"><span className="tnum text-[10px] text-ink-400">{formatIDR(product.revenueIdr)}</span>{product.rank !== "Normal" ? <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", product.rank === "Terlaris" ? "bg-success-50 text-success-600" : "bg-amber-50 text-amber-600")}>{product.rank === "Terlaris" ? "↑ TERLARIS" : "↓ TERENDAH"}</span> : null}</div></div></div></li>)}</ol>
      <div className="mt-4 border-t border-line pt-3"><SourceLine /></div>
    </section>
  );
}

function HourlySales({ business }: { business: BusinessAnalytics }) {
  return (
    <section aria-labelledby="hourly-sales" className="rounded-[14px] border border-line bg-surface p-5">
      <h2 id="hourly-sales" className="text-[15px] font-bold text-ink-900">Sebaran transaksi per jam</h2>
      <p className="mt-1 text-[11.5px] text-ink-400">Agregat transaksi terkonfirmasi selama tujuh hari.</p>
      <div className="mt-6 flex h-[150px] items-end gap-2">{business.hourlySales.map((slot) => <div key={slot.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="tnum text-[9.5px] font-semibold text-ink-500">{slot.transactions}</span><div className={cn("w-full max-w-10 rounded-t-[4px]", slot.heightPercent === 100 ? "bg-amber-600" : "bg-ink-400/45")} style={{ height: `${slot.heightPercent}%` }} title={`${slot.label}.00 · ${slot.transactions} transaksi`} /><span className="tnum text-[10px] text-ink-400">{slot.label}</span></div>)}</div>
      <p className="mt-3 text-[11px] text-ink-500">Puncak teramati pada {business.busiestWindow}.</p>
      <div className="mt-3 border-t border-line pt-3"><SourceLine /></div>
    </section>
  );
}

function Recommendations({ business }: { business: BusinessAnalytics }) {
  return (
    <section aria-labelledby="recommendations" className="rounded-[14px] border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2"><h2 id="recommendations" className="text-[15px] font-bold text-ink-900">Rekomendasi operasional</h2><span className="rounded-full border border-info-600/30 bg-info-50 px-2 py-0.5 text-[9.5px] font-bold text-info-600">BERBASIS DATA TRANSAKSI</span></div>
      <p className="mt-2 text-[12px] leading-5 text-ink-500">Angka berasal dari agregat deterministic engine; AI hanya membantu menyusun narasi sarannya.</p>
      <div className="mt-4 space-y-3">{business.recommendations.map((item) => <article key={item.title} className="rounded-[10px] border border-line border-l-[3px] border-l-info-600 bg-surface-2 p-4"><h3 className="text-[13.5px] font-bold text-ink-900">{item.title}</h3><p className="mt-1.5 text-[12.5px] leading-5 text-ink-500">{item.body}</p><p className="mt-2 font-mono text-[10px] leading-4 text-ink-400">Dasar: {item.evidence}</p></article>)}</div>
      <div className="mt-4"><Callout tone="warn">Rekomendasi adalah alat bantu keputusan, bukan jaminan hasil. Periksa kondisi lapangan sebelum mengubah harga, stok, atau menu.</Callout></div>
    </section>
  );
}

function BusinessDetail({ business }: { business: BusinessAnalytics }) {
  return (
    <>
      <section aria-label={`Ringkasan ${business.name}`} className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Pendapatan" value={formatIDRShort(business.revenueIdr)} note={businessAnalyticsSeed.period} /><MetricCard label="Transaksi" value={business.transactions.toLocaleString("id-ID")} note="Transaksi terkonfirmasi" /><MetricCard label="Rata-rata transaksi" value={formatIDR(business.averageTicketIdr)} note="Agregat deterministic engine" /><MetricCard label="Jam teramai" value={business.busiestWindow} note={`${business.daysRecorded} hari tercatat`} /></section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><DailyRevenue business={business} /><ProductRanking business={business} /></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><HourlySales business={business} /><div className="space-y-3"><h2 className="text-[15px] font-bold text-ink-900">Insight otomatis</h2>{business.insights.map((item) => <article key={item.title} className="rounded-[12px] border border-line bg-surface p-4"><h3 className="text-[13.5px] font-bold text-ink-900">{item.title}</h3><p className="mt-1.5 text-[12.5px] leading-5 text-ink-500">{item.body}</p><p className="mt-2 rounded-[8px] bg-surface-2 px-3 py-2 text-[11.5px] font-semibold text-ink-700">{item.action}</p><p className="mt-2 text-[10px] text-ink-400">{item.evidence}</p></article>)}</div></div>
      <div className="mt-5"><Recommendations business={business} /></div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line bg-surface px-5 py-4"><div><p className="text-[12.5px] font-bold text-ink-900">Ringkasan mingguan {business.name}</p><p className="mt-1 text-[10.5px] text-ink-400">Dialog cetak browser dapat digunakan untuk menyimpan halaman sebagai PDF.</p></div><Button variant="secondary" onClick={() => window.print()}>Cetak / simpan PDF</Button></div>
    </>
  );
}

export default function AnalyticsPage() {
  const { activeBusinessId, setActiveBusinessId, journey, hariTercatat } = useDemoFlow();
  const [selectedId, setSelectedId] = useState<string>(journey === "B" ? activeBusinessId : "all");
  const previousBusinessId = useRef(activeBusinessId);
  const selectedBusiness = businessAnalyticsSeed.businesses.find((business) => business.id === selectedId);
  const composite = businessAnalyticsSeed.composite;

  useEffect(() => {
    if (previousBusinessId.current !== activeBusinessId) {
      previousBusinessId.current = activeBusinessId;
      setSelectedId(activeBusinessId);
    }
  }, [activeBusinessId]);

  if (journey === "B" && hariTercatat < AMBANG_HARI) {
    return <main className="mx-auto max-w-[720px] px-6 py-16"><div className="rounded-[14px] border border-line bg-surface p-7 text-center"><p className="label-eyebrow">Gate kualitas data</p><h1 className="mt-2 text-[25px] font-bold text-ink-900">Analitik belum terbuka</h1><p className="mx-auto mt-3 max-w-lg text-[13px] leading-6 text-ink-500">Baru {hariTercatat} dari {AMBANG_HARI} hari yang tercatat. Sistem tidak menampilkan tren sebelum data minimum terpenuhi.</p><Link href="/demo/transaksi/catat" className="mt-6 inline-flex h-10 items-center rounded-[9px] bg-teal-700 px-4 text-[12px] font-bold text-surface">Kembali ke Transaction Management</Link></div></main>;
  }

  function selectBusiness(id: string) {
    setActiveBusinessId(id);
    setSelectedId(id);
  }

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-teal-700">Usaha · Analitik</p><h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-ink-900">Analitik penjualan</h1><p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-500">Mulai dari komposit seluruh usaha, lalu buka ranking, tren, jam ramai, dan rekomendasi tiap usaha.</p></div><span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold text-ink-500">Periode {businessAnalyticsSeed.period}</span></div>
      <div role="tablist" aria-label="Cakupan analitik" className="mt-6 flex flex-wrap gap-2">
        {journey !== "B" ? <button type="button" role="tab" aria-selected={selectedId === "all"} onClick={() => setSelectedId("all")} className={cn("rounded-[9px] border px-3.5 py-2 text-[12px] font-bold", selectedId === "all" ? "border-teal-700 bg-teal-50 text-teal-700" : "border-line bg-surface text-ink-500 hover:bg-surface-2")}>Semua usaha</button> : null}
        {businessAnalyticsSeed.businesses.map((business) => <button key={business.id} type="button" role="tab" aria-selected={selectedId === business.id} onClick={() => selectBusiness(business.id)} className={cn("rounded-[9px] border px-3.5 py-2 text-left text-[12px] font-bold", selectedId === business.id ? "border-teal-700 bg-teal-50 text-teal-700" : "border-line bg-surface text-ink-500 hover:bg-surface-2")}><span className="block">{business.name}</span><span className="block text-[9.5px] font-medium opacity-70">{business.area}</span></button>)}
      </div>
      {selectedBusiness ? <BusinessDetail business={selectedBusiness} /> : <><section aria-label="Analitik gabungan" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Pendapatan gabungan" value={formatIDRShort(composite.revenueIdr)} note={businessAnalyticsSeed.period} /><MetricCard label="Transaksi gabungan" value={composite.transactions.toLocaleString("id-ID")} note="Dari dua usaha" /><MetricCard label="Rata-rata transaksi" value={formatIDR(composite.averageTicketIdr)} note="Agregat lintas usaha" /><MetricCard label="Jumlah usaha" value={String(composite.activeBusinesses)} note={`${formatPersen(composite.revenueChangePercent)} dari periode lalu`} /></section><section aria-labelledby="business-comparison" className="mt-5 overflow-hidden rounded-[14px] border border-line bg-surface"><div className="border-b border-line px-5 py-4"><h2 id="business-comparison" className="text-[15px] font-bold text-ink-900">Perbandingan usaha</h2><p className="mt-1 text-[11.5px] text-ink-400">Pilih satu baris untuk membuka analitik operasional lengkap.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400"><tr><th className="px-5 py-3">Usaha</th><th className="px-4 py-3">Pendapatan</th><th className="px-4 py-3">Transaksi</th><th className="px-4 py-3">Produk utama</th><th className="px-5 py-3 text-right">Rincian</th></tr></thead><tbody>{businessAnalyticsSeed.businesses.map((business) => <tr key={business.id} className="border-t border-line-soft text-[12px]"><td className="px-5 py-4"><p className="font-bold text-ink-900">{business.name}</p><p className="mt-0.5 text-[10.5px] text-ink-400">{business.area}</p></td><td className="tnum px-4 py-4 font-semibold text-ink-700">{formatIDR(business.revenueIdr)}</td><td className="tnum px-4 py-4 text-ink-500">{business.transactions.toLocaleString("id-ID")}</td><td className="px-4 py-4 text-ink-500">{business.topProduct} · {formatPersen(business.topProductSharePercent)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => selectBusiness(business.id)} className="font-bold text-teal-700">Buka →</button></td></tr>)}</tbody></table></div><div className="border-t border-line px-5 py-3"><SourceLine /></div></section></>}
    </main>
  );
}
