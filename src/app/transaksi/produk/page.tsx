"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { Button } from "@/components/ui/Button";
import { PageHead } from "@/components/layout/PageHead";
import { formatIDR, formatPersen } from "@/lib/format";

export default function ProdukPage() {
  const router = useRouter();
  const { produk, tambahProduk, tandaiSelesai } = useDemoFlow();
  useAutoplay();

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [hpp, setHpp] = useState("");

  function simpan() {
    const h = Number(harga.replace(/\D/g, ""));
    const c = Number(hpp.replace(/\D/g, ""));
    if (!nama.trim() || !h) return;
    tambahProduk({
      id: `p${Date.now()}`,
      nama: nama.trim(),
      harga: h,
      hpp: c,
      kategori: "Lainnya",
      aktif: true,
    });
    setNama("");
    setHarga("");
    setHpp("");
  }

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Daftar Produk"
        sub="Daftarkan menu yang dijual beserta harga dan modal bahannya. Daftar ini dipakai saat mencatat transaksi."
      />

      <div className="overflow-x-auto rounded-[12px] border border-line">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-surface-2">
              <th className="label-eyebrow px-4 py-3 text-left">Produk</th>
              <th className="label-eyebrow px-4 py-3 text-left">Kategori</th>
              <th className="label-eyebrow px-4 py-3 text-right">Harga Jual</th>
              <th className="label-eyebrow px-4 py-3 text-right">HPP</th>
              <th className="label-eyebrow px-4 py-3 text-right">Marjin</th>
            </tr>
          </thead>
          <tbody>
            {produk.map((p) => {
              const marjin = p.harga > 0 ? ((p.harga - p.hpp) / p.harga) * 100 : 0;
              return (
                <tr key={p.id} className="border-t border-line-soft bg-surface">
                  <td className="px-4 py-3 font-medium text-ink-900">{p.nama}</td>
                  <td className="px-4 py-3 text-ink-500">{p.kategori}</td>
                  <td className="tnum px-4 py-3 text-right text-ink-900">
                    {formatIDR(p.harga)}
                  </td>
                  <td className="tnum px-4 py-3 text-right text-ink-500">
                    {formatIDR(p.hpp)}
                  </td>
                  <td className="tnum px-4 py-3 text-right font-semibold text-ink-900">
                    {formatPersen(marjin)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="mb-3 text-[15px] font-semibold text-ink-900">
          Tambah produk
        </h2>
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama produk"
            aria-label="Nama produk"
            className="rounded-[8px] border border-line px-3 py-2.5 text-[14px] text-ink-900"
          />
          <input
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            placeholder="Harga jual"
            aria-label="Harga jual"
            className="tnum rounded-[8px] border border-line px-3 py-2.5 text-[14px] text-ink-900"
          />
          <input
            value={hpp}
            onChange={(e) => setHpp(e.target.value)}
            placeholder="HPP"
            aria-label="HPP"
            onKeyDown={(e) => e.key === "Enter" && simpan()}
            className="tnum rounded-[8px] border border-line px-3 py-2.5 text-[14px] text-ink-900"
          />
          <Button onClick={simpan}>Tambah</Button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => {
            tandaiSelesai("produk");
            router.push("/transaksi/catat");
          }}
        >
          Lanjut Catat Transaksi
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
