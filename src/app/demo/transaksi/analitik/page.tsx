"use client";

import { useState } from "react";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import {
  AMBANG_HARI,
  MIN_EXPOSURE,
  insightPerMinggu,
  jamLabel,
  pendapatanPerHari,
  rekomendasiAI,
  ringkasProduk,
  riwayatMingguan,
} from "@/demo/data/transactions";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR, formatIDRShort } from "@/lib/format";

export default function Analitik() {
  const { hariTercatat, tambahHari } = useDemoFlow();
  useAutoplay();

  const [mingguId, setMingguId] = useState(
    riwayatMingguan[riwayatMingguan.length - 1].id,
  );
  const minggu = riwayatMingguan.find((m) => m.id === mingguId)!;
  const idx = riwayatMingguan.findIndex((m) => m.id === mingguId);
  const sebelumnya = idx > 0 ? riwayatMingguan[idx - 1] : null;

  if (hariTercatat < AMBANG_HARI) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <PageHead
          judul="Analitik belum terbuka"
          sub="Sistem menolak menampilkan tren dari data yang belum cukup. Tujuh hari adalah ambang minimum agar pola harian tidak salah dibaca."
          tengah
        />
        <div className="rounded-[12px] border border-line bg-surface p-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="label-eyebrow">Data tercatat</span>
            <span className="tnum text-[14px] font-bold text-ink-900">
              {hariTercatat} / {AMBANG_HARI} hari
            </span>
          </div>
          <div className="h-[10px] overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-teal-700 transition-[width] duration-500"
              style={{ width: `${(hariTercatat / AMBANG_HARI) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-500">
            Kurang {AMBANG_HARI - hariTercatat} hari lagi. Selama menunggu, yang
            ditampilkan adalah progres pengumpulan data — bukan tren yang
            dipaksakan dari data dua hari.
          </p>
          <Button onClick={tambahHari} className="mt-5">
            Simulasikan hari berikutnya (demo)
          </Button>
        </div>
      </div>
    );
  }

  const pendapatan = pendapatanPerHari(minggu);
  const maksHari = Math.max(...pendapatan);
  const total = pendapatan.reduce((a, b) => a + b, 0);
  const totalSebelum = sebelumnya
    ? pendapatanPerHari(sebelumnya).reduce((a, b) => a + b, 0)
    : null;
  const delta =
    totalSebelum !== null
      ? Math.round(((total - totalSebelum) / totalSebelum) * 100)
      : null;

  const produkRingkas = ringkasProduk(minggu).sort((a, b) => b.qty - a.qty);
  const layakDinilai = produkRingkas.filter((p) => p.qty >= MIN_EXPOSURE);
  const belumCukup = produkRingkas.filter((p) => p.qty < MIN_EXPOSURE);
  const terlaris = layakDinilai[0];
  const terendah = layakDinilai[layakDinilai.length - 1];

  const maksJam = Math.max(...minggu.perJam);
  const jamPuncak = minggu.perJam.indexOf(maksJam);

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12">
      <PageHead
        judul="Analitik Penjualan"
        sub="Pilih minggu untuk melihat rinciannya. Seluruh angka berasal dari transaksi yang sudah kamu konfirmasi."
      />

      {/* Riwayat mingguan */}
      <div
        role="tablist"
        aria-label="Riwayat mingguan"
        className="mb-5 flex flex-wrap gap-2"
      >
        {riwayatMingguan.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === mingguId}
            onClick={() => setMingguId(m.id)}
            className={cn(
              "rounded-[10px] border px-4 py-2.5 text-left transition-colors",
              m.id === mingguId
                ? "border-teal-700 bg-teal-50"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "block text-[13.5px] font-semibold",
                m.id === mingguId ? "text-teal-700" : "text-ink-900",
              )}
            >
              {m.label}
            </span>
            <span className="block text-[11.5px] text-ink-400">{m.periode}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Pendapatan minggu ini</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {formatIDRShort(total)}
          </p>
          {delta !== null ? (
            <p
              className={cn(
                "tnum mt-0.5 text-[12.5px] font-semibold",
                delta >= 0 ? "text-success-600" : "text-danger-600",
              )}
            >
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% dibanding{" "}
              {sebelumnya?.label}
            </p>
          ) : (
            <p className="mt-0.5 text-[12.5px] text-ink-400">
              minggu pertama, belum ada pembanding
            </p>
          )}
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Rata-rata per hari</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {formatIDRShort(Math.round(total / 7))}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Jam paling ramai</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {jamLabel[jamPuncak]}.00
          </p>
          <p className="tnum mt-0.5 text-[12.5px] text-ink-400">
            {maksJam} transaksi
          </p>
        </div>
      </div>

      {/* Pendapatan harian */}
      <div className="mt-5 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="mb-4 text-[16px] font-semibold text-ink-900">
          Pendapatan harian · {minggu.periode}
        </h2>
        <div className="flex items-end gap-2" style={{ height: 150 }}>
          {pendapatan.map((v, i) => (
            <div key={minggu.hari[i]} className="flex flex-1 flex-col items-center gap-2">
              <span className="tnum text-[11px] font-semibold text-ink-500">
                {Math.round(v / 1000)}rb
              </span>
              <div
                className="w-full rounded-t-[4px] bg-teal-700"
                style={{ height: `${(v / maksHari) * 100}px` }}
                title={`${minggu.hari[i]}: ${formatIDR(v)}`}
              />
              <span className="text-[11px] text-ink-400">{minggu.hari[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sebaran per jam */}
      <div className="mt-5 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="text-[16px] font-semibold text-ink-900">
          Sebaran penjualan per jam
        </h2>
        <p className="mt-1 mb-4 text-[13px] text-ink-500">
          Total transaksi sepanjang minggu, dikelompokkan menurut jam operasi.
        </p>
        <div className="flex items-end gap-1" style={{ height: 120 }}>
          {minggu.perJam.map((v, i) => {
            const puncak = v === maksJam;
            return (
              <div key={jamLabel[i]} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-full rounded-t-[3px]",
                    puncak ? "bg-amber-600" : "bg-ink-400/45",
                  )}
                  style={{ height: `${(v / maksJam) * 88}px` }}
                  title={`${jamLabel[i]}.00 — ${v} transaksi`}
                />
                <span
                  className={cn(
                    "tnum text-[10px]",
                    puncak ? "font-bold text-amber-600" : "text-ink-400",
                  )}
                >
                  {jamLabel[i]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[12.5px] text-ink-400">
          Puncak pada pukul {jamLabel[jamPuncak]}.00 dengan {maksJam} transaksi.
          Jam dengan batang abu-abu tipis adalah jam paling lengang — ruang untuk
          promo terarah.
        </p>
      </div>

      {/* Peringkat produk + insight */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[12px] border border-line bg-surface p-5">
          <h2 className="mb-4 text-[16px] font-semibold text-ink-900">
            Peringkat produk
          </h2>
          <ul className="space-y-2.5">
            {layakDinilai.map((p) => (
              <li key={p.id}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[13.5px]">
                  <span className="truncate font-medium text-ink-900">
                    {p.nama}
                    {p.id === terlaris?.id ? (
                      <span className="ml-2 rounded-full bg-success-50 px-2 py-0.5 text-[10.5px] font-bold text-success-600">
                        TERLARIS
                      </span>
                    ) : null}
                    {p.id === terendah?.id ? (
                      <span className="ml-2 rounded-full bg-warn-50 px-2 py-0.5 text-[10.5px] font-bold text-warn-600">
                        TERENDAH
                      </span>
                    ) : null}
                  </span>
                  <span className="tnum shrink-0 text-ink-500">
                    {p.qty} porsi · {formatIDRShort(p.pendapatan)}
                  </span>
                </div>
                <div className="h-[6px] overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      p.id === terlaris?.id ? "bg-teal-700" : "bg-ink-400",
                    )}
                    style={{ width: `${(p.qty / (terlaris?.qty ?? 1)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {belumCukup.length ? (
            <div className="mt-4 rounded-[8px] border border-line bg-surface-2 px-3 py-2.5">
              <p className="text-[12.5px] leading-relaxed text-ink-500">
                <span className="font-semibold text-ink-900">
                  Tidak dimasukkan ke peringkat:
                </span>{" "}
                {belumCukup.map((p) => p.nama).join(", ")}. Terjual di bawah{" "}
                {MIN_EXPOSURE} porsi pada periode ini, jadi belum cukup untuk
                dinilai terlaris maupun terendah.
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold text-ink-900">
            Insight otomatis
          </h2>
          {(insightPerMinggu[minggu.id] ?? []).map((x) => (
            <div
              key={x.judul}
              className="rounded-[12px] border border-line bg-surface p-4"
            >
              <h3 className="text-[14.5px] font-semibold text-ink-900">
                {x.judul}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">
                {x.isi}
              </p>
              <p className="mt-2 rounded-[7px] bg-surface-2 px-2.5 py-1.5 text-[13px] text-ink-700">
                {x.aksi}
              </p>
              <p className="mt-2 text-[11.5px] text-ink-400">{x.window}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rekomendasi AI */}
      <div className="mt-5 rounded-[12px] border border-line bg-surface p-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-semibold text-ink-900">
            Rekomendasi AI
          </h2>
          <span className="rounded-full border border-info-600/30 bg-info-50 px-2.5 py-0.5 text-[11px] font-bold text-info-600">
            BERBASIS DATA TRANSAKSIMU
          </span>
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-ink-500">
          Angka yang dirujuk berasal dari agregat transaksi di atas; AI hanya
          menyusun saran dari angka tersebut.
        </p>

        <div className="space-y-3">
          {(rekomendasiAI[minggu.id] ?? []).map((x) => (
            <div
              key={x.judul}
              className="rounded-[10px] border border-line border-l-[3px] border-l-info-600 bg-surface-2 p-4"
            >
              <h3 className="text-[14.5px] font-semibold text-ink-900">
                {x.judul}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-700">
                {x.isi}
              </p>
              <p className="mt-2 font-mono text-[11.5px] text-ink-500">
                dasar: {x.dasar}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            <strong className="font-semibold text-ink-900">
              Rekomendasi AI bisa saja keliru.
            </strong>{" "}
            Saran di atas dibuat dari pola tujuh hari dan tidak mengetahui
            kondisi lapanganmu — cuaca, renovasi jalan, pesaing baru, atau
            perubahan pemasok. Periksa dengan pengalamanmu sendiri sebelum
            mengambil keputusan, terutama yang menyangkut harga dan stok.
          </Callout>
        </div>
      </div>

      <div className="mt-5">
        <Callout tone="neutral">
          Tidak ada rekomendasi menghapus produk hanya karena volumenya rendah.
          Marjin, ketersediaan, dan umur produk perlu dipertimbangkan lebih dulu.
        </Callout>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button variant="secondary">Unduh Ringkasan PDF</Button>
      </div>
    </div>
  );
}
