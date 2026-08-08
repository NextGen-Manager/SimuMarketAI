"use client";

import Link from "next/link";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { AMBANG_HARI } from "@/demo/data/transactions";
import { PageHead } from "@/components/layout/PageHead";
import { formatIDR } from "@/lib/format";

export default function TransaksiRingkasan() {
  const { produk, transaksiHariIni, hariTercatat } = useDemoFlow();

  const total = transaksiHariIni.reduce((a, t) => a + t.jumlah * t.harga, 0);
  const terbuka = hariTercatat >= AMBANG_HARI;

  const pintasan = [
    {
      href: "/demo/transaksi/catat",
      judul: "Catat Transaksi",
      isi: "Pilih produk, masukkan jumlah, simpan.",
    },
    {
      href: "/demo/transaksi/struk",
      judul: "Foto Struk",
      isi: "Baca struk kertas, koreksi hasilnya, lalu simpan.",
    },
    {
      href: "/demo/transaksi/produk",
      judul: "Daftar Produk",
      isi: `${produk.length} produk terdaftar.`,
    },
    {
      href: "/demo/transaksi/analitik",
      judul: "Analitik",
      isi: terbuka
        ? "Peringkat produk, tren, dan insight."
        : `Terkunci — ${hariTercatat}/${AMBANG_HARI} hari data.`,
    },
  ];

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Transaction Management"
        sub="Catat penjualan harian, lalu baca apa yang datanya katakan."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Transaksi hari ini</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {transaksiHariIni.length}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Pendapatan hari ini</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {formatIDR(total)}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Hari tercatat</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {hariTercatat} / {AMBANG_HARI}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {pintasan.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-[12px] border border-line bg-surface p-5 transition-colors hover:border-ink-400/40"
          >
            <h2 className="text-[16px] font-semibold text-ink-900">{p.judul}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">
              {p.isi}
            </p>
            <span className="mt-3 inline-block text-[13.5px] font-semibold text-teal-700">
              Buka <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
