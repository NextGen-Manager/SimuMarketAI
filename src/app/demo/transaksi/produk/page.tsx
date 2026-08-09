"use client";

import Link from "next/link";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { businessProductsSeed, workspaceSource } from "@/demo/data/workspace";
import { cn, formatIDR, formatPersen } from "@/lib/format";

export default function ProductsPage() {
  const { activeBusinessId, setActiveBusinessId } = useDemoFlow();
  const business = businessProductsSeed.find((item) => item.id === activeBusinessId) ?? businessProductsSeed[0];

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-teal-700">Usaha · Produk</p><h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-ink-900">Katalog produk per usaha</h1><p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-500">Harga, HPP, dan status produk dipisahkan berdasarkan usaha agar transaksi tidak memakai katalog yang salah.</p></div>
        <Link href="/demo/transaksi/catat" className="inline-flex h-10 items-center justify-center rounded-[9px] bg-teal-700 px-4 text-[12px] font-bold text-surface hover:bg-teal-600">Catat transaksi</Link>
      </div>

      <div role="tablist" aria-label="Pilih usaha untuk katalog produk" className="mt-6 flex flex-wrap gap-2">
        {businessProductsSeed.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeBusinessId === item.id} onClick={() => setActiveBusinessId(item.id)} className={cn("rounded-[9px] border px-4 py-2.5 text-left", activeBusinessId === item.id ? "border-teal-700 bg-teal-50" : "border-line bg-surface hover:bg-surface-2")}><span className={cn("block text-[12.5px] font-bold", activeBusinessId === item.id ? "text-teal-700" : "text-ink-900")}>{item.name}</span><span className="mt-0.5 block text-[10.5px] text-ink-400">{item.area}</span></button>)}
      </div>

      <section aria-labelledby="catalog-title" className="mt-5 overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 id="catalog-title" className="text-[15px] font-bold text-ink-900">Produk {business.name}</h2><p className="mt-1 text-[11px] text-ink-400">{business.area}</p></div><span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-ink-500">Katalog usaha aktif</span></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400"><tr><th className="px-5 py-3">Produk</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3 text-right">Harga jual</th><th className="px-4 py-3 text-right">HPP</th><th className="px-4 py-3 text-right">Marjin</th><th className="px-5 py-3 text-right">Status</th></tr></thead><tbody>{business.products.map((product) => <tr key={product.id} className="border-t border-line-soft text-[12px]"><td className="px-5 py-4"><p className="font-bold text-ink-900">{product.name}</p><p className="mt-0.5 font-mono text-[9.5px] text-ink-400">{product.id}</p></td><td className="px-4 py-4 text-ink-500">{product.category}</td><td className="tnum px-4 py-4 text-right font-semibold text-ink-700">{formatIDR(product.sellingPriceIdr)}</td><td className="tnum px-4 py-4 text-right text-ink-500">{formatIDR(product.costIdr)}</td><td className="tnum px-4 py-4 text-right font-semibold text-ink-700">{formatPersen(product.marginPercent)}</td><td className="px-5 py-4 text-right"><span className={cn("inline-flex rounded-full px-2 py-1 text-[10px] font-bold", product.status === "Aktif" ? "bg-success-50 text-success-600" : "bg-surface-2 text-ink-400")}>{product.status}</span></td></tr>)}</tbody></table></div>
        <div className="flex flex-col gap-2 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10.5px] text-ink-400">{workspaceSource.label} · {workspaceSource.observedAt} · {workspaceSource.confidence}</p><p className="text-[10.5px] font-semibold text-ink-500">Marjin sudah dihitung deterministic engine.</p></div>
      </section>
    </main>
  );
}
