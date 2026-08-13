"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { businessAnalyticsSeed, workspaceSource } from "@/demo/data/workspace";
import { AMBANG_HARI } from "@/demo/data/transactions";
import { Button } from "@/components/ui/Button";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR } from "@/lib/format";

export default function CatatTransaksi() {
  const router = useRouter();
  const {
    activeBusinessId,
    setActiveBusinessId,
    businessCatalogs,
    journey,
    demoRole,
    hariTercatat,
    tambahHari,
    transaksiHariIni,
    catatTransaksi,
    tandaiSelesai,
  } = useDemoFlow();

  const business = businessCatalogs.find((item) => item.id === activeBusinessId) ?? businessCatalogs[0];
  const analytics = businessAnalyticsSeed.businesses.find((item) => item.id === business.id) ?? businessAnalyticsSeed.businesses[0];
  const recordedDays = journey === "B" ? hariTercatat : analytics.daysRecorded;
  const [produkId, setProdukId] = useState<string>(business.products[0]?.id ?? "");
  const [jumlah, setJumlah] = useState(1);
  const cariRef = useRef<HTMLSelectElement>(null);

  const validProdukId = business.products.some((product) => product.id === produkId)
    ? produkId
    : (business.products[0]?.id ?? "");
  const dipilih = business.products.find((product) => product.id === validProdukId);
  const scopedTransactions = transaksiHariIni.filter((transaction) => transaction.businessId === business.id);

  function simpan() {
    if (!dipilih) return;
    catatTransaksi({ businessId: business.id, produkId: validProdukId, jumlah, harga: dipilih.sellingPriceIdr });
    tandaiSelesai("input");
    setJumlah(1);
    cariRef.current?.focus();
  }

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Transaction Management"
        sub="Catat penjualan secara manual atau melalui struk, lalu pantau progres data untuk usaha yang dipilih."
      />

      {demoRole === "owner" ? <div role="tablist" aria-label="Pilih usaha untuk transaksi" className="mb-5 flex flex-wrap gap-2">
        {businessCatalogs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={business.id === item.id}
            onClick={() => {
              setActiveBusinessId(item.id);
              setProdukId(item.products[0]?.id ?? "");
              setJumlah(1);
            }}
            className={cn(
              "rounded-[9px] border px-4 py-2.5 text-left",
              business.id === item.id
                ? "border-teal-700 bg-teal-50"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            <span className={cn("block text-[12.5px] font-bold", business.id === item.id ? "text-teal-700" : "text-ink-900")}>{item.name}</span>
            <span className="mt-0.5 block text-[10.5px] text-ink-400">{item.area}</span>
          </button>
        ))}
      </div> : <div className="mb-5 rounded-[10px] border border-line bg-surface-2 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-400">Toko penugasan</p><p className="mt-1 text-[13px] font-bold text-ink-900">{business.name} · {business.area}</p></div>}

      <div role="tablist" aria-label="Metode input transaksi" className="mb-5 flex gap-2">
        <span role="tab" aria-selected="true" className="rounded-[9px] border border-teal-700 bg-teal-50 px-3.5 py-2 text-[12px] font-bold text-teal-700">
          Input manual
        </span>
        <Link role="tab" aria-selected="false" href="/demo/transaksi/struk" className="rounded-[9px] border border-line bg-surface px-3.5 py-2 text-[12px] font-bold text-ink-500 hover:bg-surface-2">
          Unggah struk
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[12px] border border-line bg-surface p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="produk"
                className="label-eyebrow mb-1.5 block"
              >
                Produk
              </label>
              <select
                id="produk"
                ref={cariRef}
                value={validProdukId}
                onChange={(e) => setProdukId(e.target.value)}
                className="w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[15px] text-ink-900"
              >
                {business.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}, {formatIDR(product.sellingPriceIdr)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="label-eyebrow mb-1.5 block">Jumlah</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                    aria-label="Kurangi jumlah"
                    className="grid h-11 w-11 place-items-center rounded-[8px] border border-line text-[18px] font-bold text-ink-500 hover:bg-surface-2"
                  >
                    −
                  </button>
                  <span className="tnum w-12 text-center text-[20px] font-bold text-ink-900">
                    {jumlah}
                  </span>
                  <button
                    type="button"
                    onClick={() => setJumlah((j) => j + 1)}
                    aria-label="Tambah jumlah"
                    className="grid h-11 w-11 place-items-center rounded-[8px] border border-line text-[18px] font-bold text-ink-500 hover:bg-surface-2"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="label-eyebrow mb-1.5 block">Harga satuan</span>
                <p className="tnum py-2.5 text-[17px] font-semibold text-ink-900">
                  {formatIDR(dipilih?.sellingPriceIdr ?? 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-line pt-4">
              <Button onClick={simpan}>Simpan ⏎</Button>
            </div>
          </div>

          <p className="mt-4 text-[12.5px] text-ink-400">
            Punya struk kertas?{" "}
            <Link
              href="/demo/transaksi/struk"
              className="font-semibold text-teal-700 underline underline-offset-2"
            >
              Foto struknya
            </Link>
            . Hasil pembacaan tetap kamu koreksi sebelum disimpan.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[12px] border border-line bg-surface p-5">
            <div className="label-eyebrow mb-2">Tersimpan hari ini</div>
            <p className="tnum text-[26px] font-bold text-ink-900">
              {scopedTransactions.length}
            </p>
            <p className="text-[12px] text-ink-400">transaksi terkonfirmasi</p>

            {scopedTransactions.length ? (
              <ul className="mt-4 max-h-[200px] space-y-1.5 overflow-y-auto border-t border-line pt-3">
                {scopedTransactions.map((transaction, index) => {
                  const product = business.products.find((item) => item.id === transaction.produkId);
                  return (
                    <li
                      key={`${transaction.produkId}-${index}`}
                      className="flex items-baseline justify-between gap-2 text-[13px]"
                    >
                      <span className="truncate text-ink-700">
                        {transaction.jumlah}× {product?.name}
                      </span>
                      <span className="tnum shrink-0 text-ink-500">{formatIDR(transaction.harga)} / item</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-[13px] text-ink-400">
                Belum ada transaksi tercatat hari ini.
              </p>
            )}
          </div>

          {demoRole === "owner" ? <div className="rounded-[12px] border border-line bg-surface-2 p-5">
            <div className="label-eyebrow mb-2">Progres data</div>
            <p className="text-[13.5px] leading-relaxed text-ink-700">
              {recordedDays} dari {AMBANG_HARI} hari minimum untuk {business.name}.
            </p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{
                  width: `${Math.min((recordedDays / AMBANG_HARI) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[12.5px] text-ink-400">
              {recordedDays >= AMBANG_HARI
                ? "Data sudah melewati ambang minimum dan siap dibaca."
                : `Masih perlu ${AMBANG_HARI - recordedDays} hari pencatatan sebelum tren ditampilkan.`}
            </p>
            <p className="mt-3 text-[10px] leading-4 text-ink-400">{workspaceSource.label} · {workspaceSource.observedAt} · {workspaceSource.confidence}</p>
          </div> : <div className="rounded-[12px] border border-line bg-surface-2 p-5"><div className="label-eyebrow mb-2">Batas akses kasir</div><p className="text-[13px] leading-5 text-ink-500">Kamu dapat memakai katalog dan harga jual untuk mencatat transaksi. Pengelolaan produk, HPP, marjin, dan analitik hanya tersedia untuk pemilik.</p></div>}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        {demoRole === "cashier" ? (
          <Button variant="secondary" onClick={() => router.push("/demo/dashboard")}>Kembali ke dashboard</Button>
        ) : journey === "B" && recordedDays < AMBANG_HARI ? (
          <Button variant="secondary" onClick={tambahHari}>
            Muat data hari berikutnya (demo)
          </Button>
        ) : (
          <Button onClick={() => router.push("/demo/transaksi/analitik")}>
            Buka analitik <span aria-hidden>→</span>
          </Button>
        )}
      </div>
    </div>
  );
}
