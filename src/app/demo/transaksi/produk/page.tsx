"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { workspaceSource } from "@/demo/data/workspace";
import { cn, formatIDR, formatPersen } from "@/lib/format";

function parseRupiah(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export default function ProductsPage() {
  const router = useRouter();
  const {
    activeBusinessId,
    setActiveBusinessId,
    businessCatalogs,
    addBusinessProduct,
    tandaiSelesai,
  } = useDemoFlow();
  const business =
    businessCatalogs.find((item) => item.id === activeBusinessId) ??
    businessCatalogs[0];
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Minuman");
  const [sellingPrice, setSellingPrice] = useState("");
  const [saved, setSaved] = useState(false);

  function addProduct() {
    const sellingPriceIdr = parseRupiah(sellingPrice);
    if (!name.trim() || sellingPriceIdr <= 0) return;

    addBusinessProduct(business.id, {
      id: `${business.id.toUpperCase()}-${String(business.products.length + 1).padStart(3, "0")}`,
      name: name.trim(),
      category,
      sellingPriceIdr,
      costIdr: null,
      marginPercent: null,
      status: "Aktif",
    });
    setName("");
    setSellingPrice("");
    setSaved(true);
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 xl:px-8 xl:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-teal-700">
            Usaha · Produk
          </p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-ink-900">
            Siapkan katalog produk
          </h1>
          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-500">
            Produk dan harga dipisahkan per usaha agar setiap transaksi masuk ke
            katalog yang benar.
          </p>
        </div>
        <Button
          onClick={() => {
            tandaiSelesai("produk");
            router.push("/demo/transaksi/catat");
          }}
        >
          Lanjut ke transaksi <span aria-hidden>→</span>
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="Pilih usaha untuk katalog produk"
        className="mt-6 flex flex-wrap gap-2"
      >
        {businessCatalogs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={business.id === item.id}
            onClick={() => {
              setActiveBusinessId(item.id);
              setSaved(false);
            }}
            className={cn(
              "rounded-[9px] border px-4 py-2.5 text-left",
              business.id === item.id
                ? "border-teal-700 bg-teal-50"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "block text-[12.5px] font-bold",
                business.id === item.id ? "text-teal-700" : "text-ink-900",
              )}
            >
              {item.name}
            </span>
            <span className="mt-0.5 block text-[10.5px] text-ink-400">
              {item.area}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_330px]">
        <section
          aria-labelledby="catalog-title"
          className="overflow-hidden rounded-[14px] border border-line bg-surface"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 id="catalog-title" className="text-[15px] font-bold text-ink-900">
                Produk {business.name}
              </h2>
              <p className="mt-1 text-[11px] text-ink-400">{business.area}</p>
            </div>
            <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-ink-500">
              {business.products.length} produk
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-surface-2 text-[10px] uppercase tracking-[0.1em] text-ink-400">
                <tr>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-right">Harga jual</th>
                  <th className="px-4 py-3 text-right">HPP</th>
                  <th className="px-4 py-3 text-right">Marjin</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {business.products.map((product) => (
                  <tr key={product.id} className="border-t border-line-soft text-[12px]">
                    <td className="px-5 py-4">
                      <p className="font-bold text-ink-900">{product.name}</p>
                      <p className="mt-0.5 font-mono text-[9.5px] text-ink-400">
                        {product.id}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-ink-500">{product.category}</td>
                    <td className="tnum px-4 py-4 text-right font-semibold text-ink-700">
                      {formatIDR(product.sellingPriceIdr)}
                    </td>
                    <td className="tnum px-4 py-4 text-right text-ink-500">
                      {product.costIdr === null ? "Belum diisi" : formatIDR(product.costIdr)}
                    </td>
                    <td className="tnum px-4 py-4 text-right font-semibold text-ink-700">
                      {product.marginPercent === null
                        ? "Belum tersedia"
                        : formatPersen(product.marginPercent)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex rounded-full bg-success-50 px-2 py-1 text-[10px] font-bold text-success-600">
                        ✓ {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-[10.5px] text-ink-400">
            {workspaceSource.label} · {workspaceSource.observedAt} · {workspaceSource.confidence}
          </p>
        </section>

        <aside className="self-start rounded-[14px] border border-line bg-surface p-5">
          <h2 className="text-[15px] font-bold text-ink-900">Tambah produk</h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-400">
            Produk baru langsung tersedia pada input transaksi {business.name}.
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-[11px] font-bold text-ink-500">
              Nama produk
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setSaved(false);
                }}
                className="mt-1.5 w-full rounded-[8px] border border-line px-3 py-2.5 text-[13px] font-normal text-ink-900"
                placeholder="Contoh: Matcha Latte"
              />
            </label>
            <label className="block text-[11px] font-bold text-ink-500">
              Kategori
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1.5 w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[13px] font-normal text-ink-900"
              >
                <option>Minuman</option>
                <option>Makanan utama</option>
                <option>Pastry</option>
                <option>Pencuci mulut</option>
              </select>
            </label>
            <label className="block text-[11px] font-bold text-ink-500">
              Harga jual
              <input
                value={sellingPrice}
                inputMode="numeric"
                onChange={(event) => {
                  setSellingPrice(event.target.value);
                  setSaved(false);
                }}
                onKeyDown={(event) => event.key === "Enter" && addProduct()}
                className="tnum mt-1.5 w-full rounded-[8px] border border-line px-3 py-2.5 text-[13px] font-normal text-ink-900"
                placeholder="Contoh: 24000"
              />
            </label>
          </div>
          {saved ? (
            <p role="status" className="mt-3 rounded-[8px] bg-success-50 px-3 py-2 text-[11px] font-semibold text-success-600">
              ✓ Produk ditambahkan ke {business.name}.
            </p>
          ) : null}
          <Button onClick={addProduct} className="mt-4 w-full">
            Tambahkan produk
          </Button>
          <p className="mt-3 text-[10px] leading-4 text-ink-400">
            HPP dan marjin tidak diperkirakan di browser. Nilainya baru tampil setelah tersedia dari deterministic engine.
          </p>
        </aside>
      </div>
    </main>
  );
}
