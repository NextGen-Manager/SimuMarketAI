"use client";

import Link from "next/link";
import { useState } from "react";
import { analysisHistorySeed, workspaceSource } from "@/demo/data/workspace";
import { cn, formatPersen } from "@/lib/format";

export default function AnalysisHistoryPage() {
  const [selectedId, setSelectedId] = useState<string>(analysisHistorySeed[0].id);
  const selected = analysisHistorySeed.find((analysis) => analysis.id === selectedId) ?? analysisHistorySeed[0];

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-teal-700">Analisis · Riwayat</p><h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-ink-900">Riwayat analisis</h1><p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-500">Bandingkan beberapa simulasi lokasi dan buka ringkasan tiap run tanpa langsung dilempar ke satu laporan.</p></div><Link href="/demo/analisis/input" className="inline-flex h-10 items-center justify-center rounded-[9px] bg-teal-700 px-4 text-[12px] font-bold text-surface hover:bg-teal-600">Analisis baru</Link></div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section aria-labelledby="analysis-list" className="overflow-hidden rounded-[14px] border border-line bg-surface"><div className="border-b border-line px-5 py-4"><h2 id="analysis-list" className="text-[15px] font-bold text-ink-900">Semua analisis</h2><p className="mt-1 text-[11px] text-ink-400">Empat run terakhir · terbaru lebih dulu</p></div><div className="divide-y divide-line-soft">{analysisHistorySeed.map((analysis) => <button key={analysis.id} type="button" onClick={() => setSelectedId(analysis.id)} aria-pressed={selectedId === analysis.id} className={cn("block w-full px-5 py-4 text-left transition-colors", selectedId === analysis.id ? "bg-teal-50" : "hover:bg-surface-2")}><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className={cn("truncate text-[13px] font-bold", selectedId === analysis.id ? "text-teal-700" : "text-ink-900")}>{analysis.name}</p><p className="mt-1 text-[10.5px] text-ink-400">{analysis.createdAt}</p></div><span className={cn("shrink-0 rounded-full px-2 py-1 text-[9.5px] font-bold", analysis.status === "Parsial" ? "bg-amber-50 text-amber-600" : "bg-success-50 text-success-600")}>{analysis.status}</span></div><div className="mt-3 flex items-center justify-between"><span className="font-mono text-[9.5px] text-ink-400">{analysis.id}</span><span className="tnum text-[15px] font-bold text-ink-900">{analysis.score}<span className="text-[9.5px] font-medium text-ink-400">/100</span></span></div></button>)}</div></section>

        <section aria-labelledby="analysis-detail" className="self-start rounded-[14px] border border-line bg-surface p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[10px] text-ink-400">{selected.id}</p><h2 id="analysis-detail" className="mt-1 text-[19px] font-bold tracking-tight text-ink-900">{selected.name}</h2><p className="mt-1 text-[12px] text-ink-500">{selected.businessType} · {selected.area}</p></div><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", selected.status === "Parsial" ? "bg-amber-50 text-amber-600" : "bg-success-50 text-success-600")}>{selected.status}</span></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><article className="rounded-[10px] bg-surface-2 p-4"><p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink-400">Launch Readiness Score</p><p className="tnum mt-2 text-[26px] font-bold text-ink-900">{selected.score}<span className="text-[11px] font-medium text-ink-400">/100</span></p><p className="mt-1 text-[11px] font-semibold text-ink-500">{selected.interpretation}</p></article><article className="rounded-[10px] bg-surface-2 p-4"><p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink-400">Evidence confidence</p><p className="tnum mt-2 text-[26px] font-bold text-ink-900">{formatPersen(selected.confidencePercent)}</p><p className="mt-1 font-mono text-[9.5px] text-ink-400">{selected.ruleVersion}</p></article></div>
          <div className="mt-5 border-t border-line pt-5"><h3 className="text-[12px] font-bold text-ink-900">Ringkasan run</h3><p className="mt-2 text-[13px] leading-6 text-ink-500">{selected.summary}</p></div>
          {selected.status === "Parsial" ? <div className="mt-4 rounded-[9px] border border-amber-600/30 bg-amber-50 px-3.5 py-3 text-[11.5px] leading-5 text-amber-600">Run tetap berstatus parsial. Komponen yang gagal tidak diberi nilai bawaan.</div> : null}
          <div className="mt-6 flex flex-wrap gap-2"><Link href="/demo/laporan" className="inline-flex h-9 items-center rounded-[8px] bg-teal-700 px-3.5 text-[11.5px] font-bold text-surface">Lihat riwayat laporan</Link><Link href="/demo/analisis/input" className="inline-flex h-9 items-center rounded-[8px] border border-line px-3.5 text-[11.5px] font-bold text-ink-500 hover:bg-surface-2">Buat variasi</Link></div>
          <p className="mt-5 border-t border-line pt-3 text-[10px] leading-4 text-ink-400">{workspaceSource.label} · {workspaceSource.observedAt} · {workspaceSource.confidence}</p>
        </section>
      </div>
    </main>
  );
}
