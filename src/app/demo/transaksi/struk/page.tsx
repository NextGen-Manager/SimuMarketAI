"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { businessReceiptSeeds, workspaceSource } from "@/demo/data/workspace";
import { cn, formatIDR } from "@/lib/format";

const LOW_CONFIDENCE_PERCENT = 85;

type ReceiptItem = {
  raw: string;
  productId: string;
  quantity: number;
  unitPriceIdr: number;
  confidencePercent: number;
};

function ConfidenceTag({ value }: { value: number }) {
  const low = value < LOW_CONFIDENCE_PERCENT;
  return (
    <span
      className={cn(
        "tnum inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-bold",
        low
          ? "border-amber-600/35 bg-amber-50 text-amber-600"
          : "border-success-600/30 bg-success-50 text-success-600",
      )}
    >
      {low ? "ⓘ" : "✓"} {value}%
    </span>
  );
}

export default function ReceiptPage() {
  const router = useRouter();
  const {
    activeBusinessId,
    setActiveBusinessId,
    businessCatalogs,
    demoRole,
    catatTransaksi,
    tandaiSelesai,
  } = useDemoFlow();
  const business =
    businessCatalogs.find((item) => item.id === activeBusinessId) ??
    businessCatalogs[0];
  const receipt =
    activeBusinessId === "dapur-rasa"
      ? businessReceiptSeeds["dapur-rasa"]
      : businessReceiptSeeds["kopi-senja"];
  const [items, setItems] = useState<ReceiptItem[]>(() =>
    receipt.items.map((item) => ({ ...item })),
  );
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setItems(receipt.items.map((item) => ({ ...item })));
      setSaved(false);
      setEdited(false);
    }, 0);
    return () => clearTimeout(resetTimer);
  }, [receipt]);

  function updateQuantity(index: number, quantity: number) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
    setEdited(true);
  }

  function saveReceipt() {
    items.forEach((item) => {
      catatTransaksi({
        businessId: business.id,
        produkId: item.productId,
        jumlah: item.quantity,
        harga: item.unitPriceIdr,
      });
    });
    tandaiSelesai("input");
    setSaved(true);
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6 py-10">
      <PageHead
        judul="Transaction Management"
        sub="Unggah struk adalah metode input alternatif. Hasil OCR selalu menjadi draft dan wajib diperiksa sebelum disimpan."
      />

      {demoRole === "owner" ? <div role="tablist" aria-label="Pilih usaha untuk struk" className="mb-4 flex flex-wrap gap-2">
        {businessCatalogs.map((catalog) => (
          <button
            key={catalog.id}
            type="button"
            role="tab"
            aria-selected={business.id === catalog.id}
            onClick={() => setActiveBusinessId(catalog.id)}
            className={cn(
              "rounded-[9px] border px-4 py-2.5 text-left",
              business.id === catalog.id
                ? "border-teal-700 bg-teal-50"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            <span className="block text-[12.5px] font-bold text-ink-900">{catalog.name}</span>
            <span className="mt-0.5 block text-[10.5px] text-ink-400">{catalog.area}</span>
          </button>
        ))}
      </div> : <div className="mb-4 rounded-[10px] border border-line bg-surface-2 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-400">Toko penugasan</p><p className="mt-1 text-[13px] font-bold text-ink-900">{business.name} · {business.area}</p></div>}

      <div role="tablist" aria-label="Metode input transaksi" className="mb-5 flex gap-2">
        <Link role="tab" aria-selected="false" href="/demo/transaksi/catat" className="rounded-[9px] border border-line bg-surface px-3.5 py-2 text-[12px] font-bold text-ink-500 hover:bg-surface-2">
          Input manual
        </Link>
        <span role="tab" aria-selected="true" className="rounded-[9px] border border-teal-700 bg-teal-50 px-3.5 py-2 text-[12px] font-bold text-teal-700">
          Unggah struk
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[14px] border border-line bg-surface p-5">
          <p className="label-eyebrow">Pratinjau struk</p>
          <div className="mt-4 rounded-[9px] border border-dashed border-line bg-surface-2 p-5 font-mono text-[11px] leading-7 text-ink-500">
            <p className="text-center font-bold text-ink-900">{receipt.merchant.toUpperCase()}</p>
            <p className="text-center">{business.area}</p>
            <p className="mt-3 border-t border-dashed border-line pt-2">{receipt.date}</p>
            {receipt.items.map((item) => (
              <p key={item.raw} className="mt-2">{item.raw}<br />{item.quantity} × {formatIDR(item.unitPriceIdr)}</p>
            ))}
            <p className="mt-3 border-t border-dashed border-line pt-2 font-bold text-ink-900">
              TOTAL {formatIDR(receipt.totalIdr)}
            </p>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-ink-400">
            Gambar adalah fixture demo. Pada produk nyata, file disimpan privat dan tidak menjadi transaksi sebelum dikonfirmasi.
          </p>
        </section>

        <section className="rounded-[14px] border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label-eyebrow">Draft hasil OCR</p>
              <h2 className="mt-1 text-[16px] font-bold text-ink-900">Periksa kecocokan produk</h2>
            </div>
            <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-ink-500">Belum tersimpan</span>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <article key={`${item.raw}-${index}`} className={cn("rounded-[10px] border p-3", item.confidencePercent < LOW_CONFIDENCE_PERCENT ? "border-amber-600/30 bg-amber-50/40" : "border-line")}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[10.5px] text-ink-400">{item.raw}</p>
                  <ConfidenceTag value={item.confidencePercent} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <select
                    value={item.productId}
                    onChange={(event) => {
                      const product = business.products.find((candidate) => candidate.id === event.target.value);
                      setItems((current) => current.map((candidate, itemIndex) => itemIndex === index ? { ...candidate, productId: event.target.value, unitPriceIdr: product?.sellingPriceIdr ?? candidate.unitPriceIdr } : candidate));
                      setEdited(true);
                    }}
                    aria-label={`Cocokkan ${item.raw} ke produk`}
                    className="min-w-0 flex-1 rounded-[7px] border border-line bg-surface px-2.5 py-2 text-[12.5px] text-ink-900"
                  >
                    {business.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                  <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)} aria-label="Kurangi jumlah" className="grid h-9 w-9 place-items-center rounded-[7px] border border-line text-ink-500">−</button>
                  <span className="tnum w-5 text-center text-[13px] font-bold text-ink-900">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)} aria-label="Tambah jumlah" className="grid h-9 w-9 place-items-center rounded-[7px] border border-line text-ink-500">+</button>
                  <span className="tnum text-[12px] text-ink-500">{formatIDR(item.unitPriceIdr)} / item</span>
                </div>
              </article>
            ))}
          </div>

          {edited ? (
            <div className="mt-4"><Callout tone="warn">Draft berubah. Total akhir akan direkonsiliasi deterministic engine saat transaksi disimpan.</Callout></div>
          ) : null}
          {saved ? (
            <div className="mt-4"><Callout tone="info"><strong className="font-semibold text-ink-900">Transaksi tersimpan.</strong> Draft OCR telah dikonfirmasi untuk {business.name}.</Callout></div>
          ) : null}

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => router.push("/demo/transaksi/catat")}>Kembali ke input manual</Button>
            <Button onClick={saveReceipt} disabled={saved}>{saved ? "Sudah disimpan" : "Simpan transaksi"}</Button>
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[10px] text-ink-400">
            {workspaceSource.label} · {workspaceSource.observedAt} · {workspaceSource.confidence}
          </p>
        </section>
      </div>
    </main>
  );
}
