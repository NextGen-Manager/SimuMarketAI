"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { laporan } from "@/demo/data/report";
import { Button } from "@/components/ui/Button";
import { Callout, MeterBar, MetricTile } from "@/components/ui/Metric";
import { ScoreGauge, interpretasiSkor } from "@/components/ui/Gauge";
import { useAutoplay } from "@/demo/useAutoplay";
import { cn, formatIDR, formatIDRShort } from "@/lib/format";

function Bagian({
  no,
  judul,
  children,
  catatan,
}: {
  no: string;
  judul: string;
  children: React.ReactNode;
  catatan?: string;
}) {
  return (
    <section className="border-t border-line py-8">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-[12px] font-semibold text-ink-400">
          {no}
        </span>
        <h2 className="text-[20px] font-semibold tracking-tight text-ink-900">
          {judul}
        </h2>
      </div>
      {catatan ? (
        <p className="mb-4 text-[12.5px] text-ink-400">{catatan}</p>
      ) : null}
      {children}
    </section>
  );
}

export default function Laporan() {
  const router = useRouter();
  const { tandaiSelesai, varian, setVarian } = useDemoFlow();
  const parsial = varian === "parsial";
  useAutoplay();

  useEffect(() => {
    tandaiSelesai("laporan");
  }, [tandaiSelesai]);

  /**
   * Varian dibaca dari context, bukan useSearchParams — pemakaian hook itu
   * membuat Next melewatkan prerender seluruh halaman sehingga laporan
   * sempat berkedip kosong. URL `?hasil=parsial` tetap didukung lewat efek ini.
   */
  useEffect(() => {
    const dariUrl = new URLSearchParams(window.location.search).get("hasil");
    if (dariUrl === "parsial") setVarian("parsial");
  }, [setVarian]);

  const r = laporan;

  return (
    <div className="mx-auto max-w-[820px] px-6 py-12">
      {/* Header laporan */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-[5px] bg-ink-900 px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-white">
            PREDICTION REPORT
          </span>
          <span className="font-mono text-[12px] text-ink-400">{r.id}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2 text-[13px]">
            Unduh PDF
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-2 text-[13px]"
            onClick={() => router.push("/analisis/input")}
          >
            Buat Variasi
          </Button>
        </div>
      </div>

      <h1 className="font-serif text-[38px] font-bold leading-[1.12] tracking-[-0.01em] text-ink-900 text-balance">
        {r.judul}
      </h1>
      <p className="mt-4 font-serif text-[17px] italic leading-relaxed text-ink-500">
        {r.intro}
      </p>

      {parsial ? (
        <div className="mt-6">
          <Callout tone="warn">
            <strong className="font-semibold text-ink-900">
              Laporan parsial.
            </strong>{" "}
            Simulasi persona tidak tersedia pada run ini (batas waktu penyedia
            AI). Analisis pasar, finansial, dan skor tetap dihitung
            deterministik. Dimensi <em>Potensi Permintaan</em> (bobot 25%) tidak
            dapat dinilai dan tidak diberi nilai bawaan.
            <span className="mt-2 block">
              <button className="rounded-[7px] border border-warn-600/40 bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-warn-600 hover:bg-warn-50">
                Ulangi tahap simulasi
              </button>
            </span>
          </Callout>
        </div>
      ) : null}

      {/* 01 Skor — gauge sesuai proposal §7.4 */}
      <Bagian no="01" judul="Launch Readiness Score">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-8">
          <ScoreGauge
            nilai={r.skor.nilai}
            interpretasi={interpretasiSkor(r.skor.nilai)}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] leading-relaxed text-ink-500">
              Rentang interpretasi mengikuti aturan skor: 80–100 sangat layak,
              65–79 layak dengan mitigasi, 50–64 perlu evaluasi ulang, di bawah
              50 tidak disarankan.
            </p>
            <p className="mt-3 font-mono text-[11.5px] text-ink-400">
              {r.skor.ruleVersion} · {r.skor.catatanVersi}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {r.skor.dimensi.map((d) => {
            const takDinilai = parsial && d.nama === "Potensi Permintaan";
            return (
              <div key={d.nama}>
                {takDinilai ? (
                  <div className="flex items-baseline justify-between rounded-[8px] border border-warn-600/25 bg-warn-50/50 px-3 py-2">
                    <span className="text-[13px] font-medium text-ink-700">
                      {d.nama}{" "}
                      <span className="text-ink-400">· bobot {d.bobot}%</span>
                    </span>
                    <span className="text-[12.5px] font-semibold text-warn-600">
                      Tidak dapat dinilai
                    </span>
                  </div>
                ) : (
                  <MeterBar
                    label={`${d.nama} · bobot ${d.bobot}%`}
                    value={d.nilai}
                    valueLabel={String(d.nilai)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Bagian>

      {/* 02 Evidence Confidence — wajib, tidak boleh collapsed */}
      <Bagian
        no="02"
        judul="Evidence Confidence"
        catatan="Skor dan tingkat keyakinan berdiri sendiri; confidence tidak menaikkan atau menurunkan skor secara diam-diam."
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-baseline gap-2">
            <span className="tnum text-[32px] font-bold text-ink-900">
              {r.confidence.nilai.toLocaleString("id-ID")}
            </span>
            <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[12.5px] font-semibold text-ink-500">
              {r.confidence.label}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="label-eyebrow mb-2">Belum tersedia</div>
          <ul className="space-y-1.5">
            {r.confidence.missing.map((m) => (
              <li key={m} className="flex items-start gap-2 text-[13.5px] text-ink-500">
                <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </Bagian>

      {/* 03 Ringkasan */}
      <Bagian no="03" judul="Ringkasan Eksekutif">
        <div className="space-y-3">
          {r.ringkasan.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink-700">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-5 rounded-[10px] border border-line bg-surface-2 p-4">
          <div className="label-eyebrow mb-3">Parameter yang dipahami AI</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {r.parameter.map((p) => (
              <div key={p.label} className="flex items-baseline gap-2 text-[13.5px]">
                <span aria-hidden className="text-success-600">✓</span>
                <span className="text-ink-400">{p.label}:</span>
                <span className="font-medium text-ink-900">{p.nilai}</span>
              </div>
            ))}
          </div>
        </div>
      </Bagian>

      {/* 04 Pasar */}
      <Bagian no="04" judul="Analisis Pasar & Kompetitor">
        <div className="space-y-4">
          <MeterBar
            label="Saturasi Pasar"
            value={r.pasar.saturasi.nilai}
            valueLabel={r.pasar.saturasi.label}
            tone="amber"
          />
          <MeterBar
            label="Daya Saing Harga"
            value={r.pasar.dayaSaing.nilai}
            valueLabel={r.pasar.dayaSaing.label}
          />
        </div>
        <div className="mt-4">
          <Callout tone="neutral">{r.pasar.catatan}</Callout>
        </div>
      </Bagian>

      {/* 05 Finansial */}
      <Bagian no="05" judul="Proyeksi Finansial">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Estimasi Pendapatan Bln 1"
            value={formatIDRShort(r.finansial.pendapatanBulan1)}
          />
          <MetricTile
            label="Titik Impas (BEP)"
            value={`Bulan ke-${r.finansial.bepBulan}`}
            note="skenario base"
          />
          <MetricTile
            label="Marjin Kotor"
            value={`${r.finansial.marjinKotor}%`}
            note={`ideal >${r.finansial.marjinIdeal}%`}
          />
        </div>

        <div className="mt-4 overflow-x-auto rounded-[10px] border border-line">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="bg-surface-2">
                <th className="label-eyebrow px-4 py-2.5 text-left">Skenario</th>
                <th className="label-eyebrow px-4 py-2.5 text-right">Volume/hari</th>
                <th className="label-eyebrow px-4 py-2.5 text-right">Pendapatan/bln</th>
                <th className="label-eyebrow px-4 py-2.5 text-right">BEP</th>
              </tr>
            </thead>
            <tbody>
              {r.finansial.skenario.map((s) => (
                <tr key={s.nama} className="border-t border-line-soft bg-surface">
                  <td className="px-4 py-2.5 font-medium text-ink-900">{s.nama}</td>
                  <td className="tnum px-4 py-2.5 text-right text-ink-700">
                    {s.volume} cup
                  </td>
                  <td className="tnum px-4 py-2.5 text-right text-ink-700">
                    {formatIDR(s.pendapatan)}
                  </td>
                  <td className="tnum px-4 py-2.5 text-right text-ink-700">
                    Bln {s.bep}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-400">
          <span className="font-semibold text-ink-500">Termasuk:</span>{" "}
          {r.finansial.disertakan}.{" "}
          <span className="font-semibold text-ink-500">Tidak termasuk:</span>{" "}
          {r.finansial.tidakDisertakan}.
        </p>

        <div className="mt-4">
          <Callout tone="warn">{r.finansial.peringatan}</Callout>
        </div>
      </Bagian>

      {/* 06 Risiko */}
      <Bagian no="06" judul="Peta Risiko">
        <div className="space-y-3">
          {r.risiko.map((x) => (
            <div key={x.judul} className="border-l-[3px] border-l-danger-600 pl-4">
              <h3 className="text-[15px] font-semibold text-ink-900">{x.judul}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-500">
                {x.isi}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-[6px] border border-line bg-surface-2 px-2.5 py-1 text-[12.5px] text-ink-700">
                  Mitigasi: {x.mitigasi}
                </span>
                <span className="font-mono text-[11px] text-ink-400">
                  #{x.artifact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Bagian>

      {/* 07 Rekomendasi */}
      <Bagian no="07" judul="Rekomendasi Prioritas (Rencana 30 Hari)">
        <ul className="space-y-2.5">
          {r.rekomendasi.map((x) => (
            <li
              key={x.judul}
              className="flex gap-3 rounded-[10px] border border-line bg-surface px-4 py-3"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
                aria-label={x.judul}
              />
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-ink-900">
                  {x.judul}
                </p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-500">
                  {x.isi}
                </p>
                <span className="mt-1 inline-block font-mono text-[11px] text-ink-400">
                  #{x.artifact}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Bagian>

      {/* 08 Bukti — wajib, tidak boleh collapsed */}
      <Bagian no="08" judul="Bukti & Keterbatasan">
        <div className="overflow-x-auto rounded-[10px] border border-line">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-2">
                <th className="label-eyebrow px-4 py-2.5 text-left">Metrik</th>
                <th className="label-eyebrow px-4 py-2.5 text-left">Nilai</th>
                <th className="label-eyebrow px-4 py-2.5 text-left">Sumber</th>
                <th className="label-eyebrow px-4 py-2.5 text-left">Diambil</th>
                <th className="label-eyebrow px-4 py-2.5 text-right">Keyakinan</th>
              </tr>
            </thead>
            <tbody>
              {r.bukti.map((b) => (
                <tr key={b.metrik} className="border-t border-line-soft bg-surface">
                  <td className="px-4 py-2.5 font-medium text-ink-900">
                    {b.metrik}
                  </td>
                  <td className="tnum px-4 py-2.5 text-ink-700">{b.nilai}</td>
                  <td className="px-4 py-2.5 text-ink-500">{b.sumber}</td>
                  <td className="px-4 py-2.5 text-ink-500">{b.diambil}</td>
                  <td className="tnum px-4 py-2.5 text-right text-ink-700">
                    {b.confidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <div className="label-eyebrow mb-2">Keterbatasan</div>
          <ul className="space-y-1.5">
            {r.keterbatasan.map((k) => (
              <li key={k} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-500">
                <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                {k}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            "mt-5 rounded-[10px] border border-line bg-surface-2 px-4 py-3.5",
            "text-[13.5px] leading-relaxed text-ink-700",
          )}
        >
          <strong className="font-semibold text-ink-900">Disclaimer.</strong>{" "}
          {r.disclaimer}
        </div>
      </Bagian>

      <div className="flex justify-end gap-3 border-t border-line pt-8">
        <Button
          onClick={() => {
            tandaiSelesai("diskusi");
            router.push("/diskusi");
          }}
        >
          Tanya AI tentang Hasil Ini
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
