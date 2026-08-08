"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { strukDraft } from "@/demo/data/transactions";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR } from "@/lib/format";

const AMBANG_CONFIDENCE = 0.85;

function ConfidenceTag({ nilai }: { nilai: number }) {
  const rendah = nilai < AMBANG_CONFIDENCE;
  return (
    <span
      className={cn(
        "tnum inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-semibold",
        rendah
          ? "border-warn-600/35 bg-warn-50 text-warn-600"
          : "border-success-600/30 bg-success-50 text-success-600",
      )}
    >
      {rendah ? "ⓘ" : "✓"} {nilai.toFixed(2).replace(".", ",")}
    </span>
  );
}

export default function StrukPage() {
  const router = useRouter();
  const { produk, catatTransaksi, tandaiSelesai } = useDemoFlow();
  useAutoplay();

  const [items, setItems] = useState(strukDraft.items);
  const [disimpan, setDisimpan] = useState(false);

  const totalItem = items.reduce((a, i) => a + i.jumlah * i.harga, 0);
  const selisih = totalItem !== strukDraft.total.nilai;

  function ubahJumlah(i: number, j: number) {
    setItems((prev) =>
      prev.map((it, k) => (k === i ? { ...it, jumlah: Math.max(1, j) } : it)),
    );
  }

  function simpan() {
    items.forEach((it) =>
      catatTransaksi({ produkId: it.cocok, jumlah: it.jumlah, harga: it.harga }),
    );
    setDisimpan(true);
    tandaiSelesai("struk");
  }

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12">
      <PageHead
        judul="Periksa Hasil Pembacaan Struk"
        sub="Hasil pembacaan mesin selalu berupa draft. Periksa dan betulkan sebelum disimpan sebagai transaksi."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        {/* Foto struk */}
        <div className="rounded-[12px] border border-line bg-surface p-4">
          <div className="label-eyebrow mb-3">Foto struk</div>
          <div className="rounded-[8px] border border-line bg-surface-2 p-5 font-mono text-[11px] leading-[1.8] text-ink-500">
            <p className="text-center font-bold text-ink-700">KEDAI KOPI SENJA</p>
            <p className="text-center">Tebet, Jakarta Selatan</p>
            <p className="mt-2 border-t border-dashed border-line pt-2">
              05/08/2026 12:10
            </p>
            <p className="mt-2 border-t border-dashed border-line pt-2">
              ES KOPI SUSU GLA AREN
              <br />
              &nbsp;&nbsp;2 x 20.000 ......... 40.000
            </p>
            <p>
              AMERICANO
              <br />
              &nbsp;&nbsp;1 x 18.000 ......... 18.000
            </p>
            <p>
              CROISSANT BTR
              <br />
              &nbsp;&nbsp;1 x 22.000 ......... 22.000
            </p>
            <p className="mt-2 border-t border-dashed border-line pt-2 font-bold text-ink-700">
              TOTAL ................ 80.000
            </p>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-400">
            Gambar disimpan sebagai objek privat. Metadata lokasi dihapus dan
            gambar tidak pernah dikirim utuh ke penyedia AI.
          </p>
        </div>

        {/* Hasil ekstraksi */}
        <div className="rounded-[12px] border border-line bg-surface p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="label-eyebrow">Hasil ekstraksi</div>
            <span className="text-[12px] text-ink-400">
              field keyakinan rendah disorot
            </span>
          </div>

          <dl className="space-y-2.5 border-b border-line pb-4">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13.5px] text-ink-500">Merchant</dt>
              <dd className="flex items-center gap-2 text-[14px] text-ink-900">
                {strukDraft.merchant.nilai}
                <ConfidenceTag nilai={strukDraft.merchant.confidence} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13.5px] text-ink-500">Tanggal</dt>
              <dd className="flex items-center gap-2 text-[14px] text-ink-900">
                {strukDraft.tanggal.nilai}
                <ConfidenceTag nilai={strukDraft.tanggal.confidence} />
              </dd>
            </div>
          </dl>

          <div className="mt-4 space-y-3">
            {items.map((it, i) => {
              const p = produk.find((x) => x.id === it.cocok);
              const rendah = it.confidence < AMBANG_CONFIDENCE;
              return (
                <div
                  key={it.raw}
                  className={cn(
                    "rounded-[10px] border p-3",
                    rendah
                      ? "border-warn-600/35 bg-warn-50/40"
                      : "border-line bg-surface",
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="font-mono text-[11.5px] text-ink-400">
                      {it.raw}
                    </span>
                    <ConfidenceTag nilai={it.confidence} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={it.cocok}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x, k) =>
                            k === i ? { ...x, cocok: e.target.value } : x,
                          ),
                        )
                      }
                      aria-label={`Cocokkan ${it.raw} ke produk`}
                      className="min-w-0 flex-1 rounded-[7px] border border-line bg-surface px-2.5 py-1.5 text-[13.5px] text-ink-900"
                    >
                      {produk.map((p2) => (
                        <option key={p2.id} value={p2.id}>
                          {p2.nama}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => ubahJumlah(i, it.jumlah - 1)}
                        aria-label="Kurangi"
                        className="grid h-8 w-8 place-items-center rounded-[6px] border border-line text-ink-500 hover:bg-surface-2"
                      >
                        −
                      </button>
                      <span className="tnum w-6 text-center text-[14px] font-bold text-ink-900">
                        {it.jumlah}
                      </span>
                      <button
                        type="button"
                        onClick={() => ubahJumlah(i, it.jumlah + 1)}
                        aria-label="Tambah"
                        className="grid h-8 w-8 place-items-center rounded-[6px] border border-line text-ink-500 hover:bg-surface-2"
                      >
                        +
                      </button>
                    </div>
                    <span className="tnum text-[13.5px] text-ink-500">
                      × {formatIDR(it.harga)}
                    </span>
                    {p ? null : (
                      <span className="text-[12px] font-semibold text-danger-600">
                        belum cocok
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-[14px]">
              <span className="text-ink-500">
                Total tertulis di struk:{" "}
                <span className="tnum font-semibold text-ink-900">
                  {formatIDR(strukDraft.total.nilai)}
                </span>
              </span>
              <span className="text-ink-500">
                Total dari item:{" "}
                <span
                  className={cn(
                    "tnum font-semibold",
                    selisih ? "text-danger-600" : "text-success-600",
                  )}
                >
                  {formatIDR(totalItem)}
                </span>
              </span>
            </div>

            {selisih ? (
              <div className="mt-3">
                <Callout tone="danger">
                  Jumlah item tidak cocok dengan total pada struk. Perbaiki dulu,
                  atau konfirmasi secara eksplisit bahwa selisih ini disengaja.
                </Callout>
              </div>
            ) : null}
          </div>

          {disimpan ? (
            <div className="mt-4">
              <Callout tone="info">
                <strong className="font-semibold text-ink-900">
                  Tersimpan sebagai transaksi.
                </strong>{" "}
                Draft hasil pembacaan tidak pernah menjadi transaksi tanpa
                konfirmasi kamu.
              </Callout>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => router.push("/demo/transaksi/catat")}>
              Batal
            </Button>
            <Button onClick={simpan} disabled={disimpan}>
              {disimpan ? "Sudah disimpan" : "Simpan sebagai Transaksi"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="secondary" onClick={() => router.push("/demo/transaksi/analitik")}>
          Lanjut ke Analitik
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
