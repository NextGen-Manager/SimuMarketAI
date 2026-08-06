"use client";

import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import {
  AMBANG_HARI,
  MIN_EXPOSURE,
  hariLabel,
  insight,
  pendapatanPerHari,
  ringkasProduk,
} from "@/demo/data/transactions";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR, formatIDRShort, formatPersen } from "@/lib/format";

export default function Analitik() {
  const { hariTercatat, tambahHari } = useDemoFlow();
  useAutoplay();

  const terkunci = hariTercatat < AMBANG_HARI;

  if (terkunci) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <PageHead
          judul="Analitik belum terbuka"
          sub="Sistem menolak menampilkan tren dari data yang belum cukup. Ini bukan pembatasan artifisial — tujuh hari adalah ambang minimum agar pola harian tidak salah dibaca."
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
            ditampilkan adalah progres pengumpulan data — bukan grafik kosong
            atau tren yang dipaksakan dari data dua hari.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={tambahHari}>
              Simulasikan hari berikutnya (demo)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pendapatan = pendapatanPerHari();
  const maks = Math.max(...pendapatan);
  const total = pendapatan.reduce((a, b) => a + b, 0);
  const produkRingkas = ringkasProduk().sort((a, b) => b.qty - a.qty);

  const layakDinilai = produkRingkas.filter((p) => p.qty >= MIN_EXPOSURE);
  const belumCukup = produkRingkas.filter((p) => p.qty < MIN_EXPOSURE);
  const terlaris = layakDinilai[0];
  const terendah = layakDinilai[layakDinilai.length - 1];

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12">
      <PageHead
        judul="Analitik Penjualan"
        sub="Observation window: 7 hari, sejak 30 Juli 2026. Seluruh angka berasal dari transaksi yang sudah kamu konfirmasi."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Pendapatan 7 hari</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {formatIDRShort(total)}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Rata-rata per hari</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {formatIDRShort(Math.round(total / 7))}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-surface px-5 py-4">
          <div className="label-eyebrow mb-1.5">Hari tercatat</div>
          <p className="tnum text-[24px] font-bold text-ink-900">
            {hariTercatat} hari
          </p>
        </div>
      </div>

      {/* Pendapatan harian */}
      <div className="mt-5 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="mb-4 text-[16px] font-semibold text-ink-900">
          Pendapatan harian
        </h2>
        <div className="flex items-end gap-2" style={{ height: 160 }}>
          {pendapatan.map((v, i) => (
            <div key={hariLabel[i]} className="flex flex-1 flex-col items-center gap-2">
              <span className="tnum text-[11px] font-semibold text-ink-500">
                {Math.round(v / 1000)}rb
              </span>
              <div
                className="w-full rounded-t-[4px] bg-teal-700"
                style={{ height: `${(v / maks) * 110}px` }}
                title={`${hariLabel[i]}: ${formatIDR(v)}`}
              />
              <span className="text-[11px] text-ink-400">{hariLabel[i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12.5px] text-ink-400">
          Tujuh titik data belum cukup untuk menyimpulkan tren musiman. Pola ini
          menggambarkan minggu ini saja.
        </p>
      </div>

      {/* Peringkat produk */}
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
                    style={{
                      width: `${(p.qty / (terlaris?.qty ?? 1)) * 100}%`,
                    }}
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
                {MIN_EXPOSURE} porsi dalam periode ini, jadi belum cukup untuk
                dinilai terlaris maupun terendah.
              </p>
            </div>
          ) : null}
        </div>

        {/* Insight */}
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold text-ink-900">
            Insight otomatis
          </h2>
          {insight.map((x) => (
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

      <div className="mt-5">
        <Callout tone="neutral">
          Insight di atas berbasis aturan deterministik atas transaksi yang kamu
          konfirmasi — bukan hasil model bahasa. Tidak ada rekomendasi
          menghapus produk hanya karena volumenya rendah; margin, ketersediaan,
          dan umur produk perlu dipertimbangkan lebih dulu.
        </Callout>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button variant="secondary">Unduh Ringkasan PDF</Button>
      </div>
    </div>
  );
}
