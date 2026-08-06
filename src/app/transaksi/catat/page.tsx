"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { AMBANG_HARI } from "@/demo/data/transactions";
import { Button } from "@/components/ui/Button";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR } from "@/lib/format";

const kanalOpsi = ["Dine-in", "Takeaway", "Delivery"] as const;

export default function CatatTransaksi() {
  const router = useRouter();
  const {
    produk,
    transaksiHariIni,
    catatTransaksi,
    hariTercatat,
    tambahHari,
    tandaiSelesai,
  } = useDemoFlow();
  useAutoplay();

  const [produkId, setProdukId] = useState(produk[0]?.id ?? "");
  const [jumlah, setJumlah] = useState(1);
  const [kanal, setKanal] = useState<(typeof kanalOpsi)[number]>("Dine-in");
  const cariRef = useRef<HTMLSelectElement>(null);

  const dipilih = produk.find((p) => p.id === produkId);

  const totalHariIni = useMemo(
    () => transaksiHariIni.reduce((a, t) => a + t.jumlah * t.harga, 0),
    [transaksiHariIni],
  );

  function simpan() {
    if (!dipilih) return;
    catatTransaksi({ produkId, jumlah, harga: dipilih.harga });
    setJumlah(1);
    cariRef.current?.focus();
  }

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Catat Transaksi"
        sub="Pilih produk, masukkan jumlah, simpan. Target di bawah 10 detik per transaksi."
      />

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
                value={produkId}
                onChange={(e) => setProdukId(e.target.value)}
                className="w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[15px] text-ink-900"
              >
                {produk.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} — {formatIDR(p.harga)}
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
                  {formatIDR(dipilih?.harga ?? 0)}
                </p>
              </div>
            </div>

            <div>
              <span className="label-eyebrow mb-1.5 block">Kanal</span>
              <div className="flex flex-wrap gap-2">
                {kanalOpsi.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKanal(k)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                      kanal === k
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-line bg-surface text-ink-500 hover:bg-surface-2",
                    )}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-[14px] text-ink-500">
                Total:{" "}
                <span className="tnum font-bold text-ink-900">
                  {formatIDR((dipilih?.harga ?? 0) * jumlah)}
                </span>
              </span>
              <Button onClick={simpan}>Simpan ⏎</Button>
            </div>
          </div>

          <p className="mt-4 text-[12.5px] text-ink-400">
            Punya struk kertas?{" "}
            <Link
              href="/transaksi/struk"
              className="font-semibold text-teal-700 underline underline-offset-2"
            >
              Foto struknya
            </Link>{" "}
            — hasil pembacaan tetap kamu koreksi sebelum disimpan.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[12px] border border-line bg-surface p-5">
            <div className="label-eyebrow mb-2">Tersimpan hari ini</div>
            <p className="tnum text-[26px] font-bold text-ink-900">
              {transaksiHariIni.length}
            </p>
            <p className="tnum text-[14px] text-ink-500">
              {formatIDR(totalHariIni)}
            </p>

            {transaksiHariIni.length ? (
              <ul className="mt-4 max-h-[200px] space-y-1.5 overflow-y-auto border-t border-line pt-3">
                {transaksiHariIni.map((t, i) => {
                  const p = produk.find((x) => x.id === t.produkId);
                  return (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-2 text-[13px]"
                    >
                      <span className="truncate text-ink-700">
                        {t.jumlah}× {p?.nama}
                      </span>
                      <span className="tnum shrink-0 text-ink-500">
                        {formatIDR(t.jumlah * t.harga)}
                      </span>
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

          <div className="rounded-[12px] border border-line bg-surface-2 p-5">
            <div className="label-eyebrow mb-2">Progres data</div>
            <p className="text-[13.5px] leading-relaxed text-ink-700">
              {hariTercatat} dari {AMBANG_HARI} hari tercatat.
            </p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{
                  width: `${Math.min(100, (hariTercatat / AMBANG_HARI) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[12.5px] text-ink-400">
              Analitik terbuka setelah {AMBANG_HARI} hari. Sebelum itu tren
              tidak ditampilkan karena datanya belum cukup.
            </p>
            {hariTercatat < AMBANG_HARI ? (
              <Button
                variant="secondary"
                onClick={tambahHari}
                className="mt-3 w-full text-[13px]"
              >
                Simulasikan hari berikutnya (demo)
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => {
            tandaiSelesai("catat");
            router.push("/transaksi/analitik");
          }}
        >
          Buka Analitik
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
