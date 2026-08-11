"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { usePlayback } from "@/demo/usePlayback";
import {
  ballot,
  langkah,
  langkahParsial,
  stages,
  councilMeta,
  type Langkah,
} from "@/demo/data/simulation";
import { AgentCard } from "@/demo/components/AgentCard";
import { AgentStrip } from "@/demo/components/AgentStrip";
import { useAutoplay } from "@/demo/useAutoplay";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { cn } from "@/lib/format";

type Tampilan = "feed" | "council" | "distribusi";

export default function Simulasi() {
  const router = useRouter();
  const { tandaiSelesai, varian, setVarian } = useDemoFlow();
  const skrip = varian === "parsial" ? langkahParsial : langkah;

  const { aktivitas, stageAktif, persen, selesai, elapsed } = usePlayback(skrip);
  const [tampilan, setTampilan] = useState<Tampilan>("feed");
  const [ikutiTerbaru, setIkutiTerbaru] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);
  const pernahSelesai = useRef(false);

  useEffect(() => {
    tandaiSelesai("proses");
  }, [tandaiSelesai]);

  // Feed default saat berjalan, Council default setelah selesai.
  useEffect(() => {
    if (selesai && !pernahSelesai.current) {
      pernahSelesai.current = true;
      setTampilan("council");
      tandaiSelesai("laporan");
    }
  }, [selesai, tandaiSelesai]);

  // Auto-scroll berhenti begitu pengguna menggulir ke atas.
  useEffect(() => {
    const el = feedRef.current;
    if (!el || !ikutiTerbaru) return;
    el.scrollTop = el.scrollHeight;
  }, [aktivitas.length, ikutiTerbaru]);

  function onScroll() {
    const el = feedRef.current;
    if (!el) return;
    const diBawah = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setIkutiTerbaru(diBawah);
  }

  const stageIdx = stages.indexOf(
    (stageAktif ?? stages[0]) as (typeof stages)[number],
  );

  const gagal = varian === "parsial" && selesai;
  useAutoplay(selesai);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Panel stage */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[12px] border border-line bg-surface p-5">
            <div className="label-eyebrow mb-3">Tahap</div>
            <ol className="space-y-1.5">
              {stages.map((s, i) => {
                const done = i < stageIdx || selesai;
                const now = i === stageIdx && !selesai;
                const gagalDiSini =
                  gagal && s === "Panel persona berjalan";
                return (
                  <li key={s} className="flex items-start gap-2.5 text-[13px]">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] font-bold",
                        gagalDiSini
                          ? "border-warn-600 bg-warn-600 text-white"
                          : done
                            ? "border-success-600 bg-success-600 text-white"
                            : now
                              ? "border-teal-700 bg-teal-700 text-white"
                              : "border-line text-ink-400",
                      )}
                    >
                      {gagalDiSini ? "!" : done ? "✓" : now ? "•" : ""}
                    </span>
                    <span
                      className={cn(
                        "leading-snug",
                        gagalDiSini
                          ? "font-medium text-warn-600"
                          : now
                            ? "font-semibold text-ink-900"
                            : done
                              ? "text-ink-500"
                              : "text-ink-400",
                      )}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 border-t border-line pt-4">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="label-eyebrow">Progres</span>
                <span className="tnum text-[13px] font-bold text-ink-900">
                  {persen}%
                </span>
              </div>
              <div
                className="h-[6px] overflow-hidden rounded-full bg-surface-2"
                role="progressbar"
                aria-valuenow={persen}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-teal-700 transition-[width] duration-300"
                  style={{ width: `${persen}%` }}
                />
              </div>
              <p className="mt-3 text-[12px] text-ink-400">
                Cohort 16 persona · 4 round
              </p>
              <p className="font-mono text-[11px] text-ink-400">
                8ff7d369…868d0a
              </p>
            </div>

            {/* Kontrol demo varian */}
            <div className="mt-5 border-t border-line pt-4">
              <div className="label-eyebrow mb-2">Varian demo</div>
              <div className="flex gap-1.5">
                {(["normal", "parsial"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVarian(v)}
                    className={cn(
                      "flex-1 rounded-[7px] border px-2 py-1.5 text-[12px] font-semibold capitalize transition-colors",
                      varian === v
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-line bg-surface text-ink-500 hover:bg-surface-2",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-ink-400">
                Varian parsial memperlihatkan perilaku saat penyedia AI gagal.
              </p>
            </div>
          </div>
        </aside>

        {/* Ruang simulasi */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[22px] font-bold tracking-tight text-ink-900">
              {selesai ? "Simulasi selesai" : (stageAktif ?? "Menyiapkan run")}
            </h1>
            <div
              role="tablist"
              aria-label="Tampilan simulasi"
              className="flex gap-1 rounded-[9px] border border-line bg-surface p-1"
            >
              {(
                [
                  ["feed", "Feed"],
                  ["council", "Council"],
                  ["distribusi", "Distribusi"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tampilan === id}
                  onClick={() => setTampilan(id)}
                  className={cn(
                    "rounded-[6px] px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    tampilan === id
                      ? "bg-teal-700 text-white"
                      : "text-ink-500 hover:bg-surface-2 hover:text-ink-900",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Strip empat agent sesuai proposal §7.3 */}
          <div className="mb-4">
            <AgentStrip
              aktivitas={aktivitas}
              selesai={selesai}
              gagal={gagal ? "persona" : null}
            />
          </div>

          {gagal ? (
            <div className="mb-4">
              <Callout tone="warn">
                <strong className="font-semibold text-ink-900">
                  Simulasi persona tidak selesai.
                </strong>{" "}
                Penyedia AI tidak merespons dalam batas waktu. Analisis pasar,
                finansial, dan skor tetap dihitung deterministik.
              </Callout>
            </div>
          ) : null}

          <div className="rounded-[12px] border border-line bg-canvas">
            {tampilan === "distribusi" ? (
              <DistribusiPanel selesai={selesai} gagal={gagal} />
            ) : (
              <div
                ref={feedRef}
                onScroll={onScroll}
                className="max-h-[560px] space-y-2.5 overflow-y-auto p-4"
                aria-live="polite"
              >
                {aktivitas.length === 0 ? (
                  <p className="py-16 text-center text-[13.5px] text-ink-400">
                    Menunggu aktivitas agent…
                  </p>
                ) : null}

                {tampilan === "feed"
                  ? aktivitas.map((l, i) => (
                      <AgentCard
                        key={i}
                        aktivitas={l.aktivitas!}
                        waktu={sampai(aktivitas, i)}
                      />
                    ))
                  : (
                      <CouncilPanel items={aktivitas} />
                    )}
              </div>
            )}
          </div>

          {!ikutiTerbaru && tampilan !== "distribusi" ? (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => {
                  setIkutiTerbaru(true);
                  const el = feedRef.current;
                  if (el) el.scrollTop = el.scrollHeight;
                }}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink-500 hover:text-ink-900"
              >
                ↓ Lompat ke terbaru
              </button>
            </div>
          ) : null}

          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-400">
            Semua kutipan adalah respons sintetis dari agent, bukan pelanggan
            nyata. Angka apa pun yang muncul berasal dari kalkulator
            deterministik, bukan dari model bahasa.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              disabled={!selesai}
              onClick={() => {
                tandaiSelesai("laporan");
                router.push(
                  varian === "parsial"
                    ? "/demo/laporan/RPT-2026-0087?hasil=parsial"
                    : "/demo/laporan/RPT-2026-0087",
                );
              }}
            >
              {selesai ? "Lihat Laporan" : "Menunggu simulasi…"}
              {selesai ? <span aria-hidden>→</span> : null}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function sampai(items: Langkah[], i: number) {
  return items.slice(0, i + 1).reduce((a, l) => a + l.ms, 0);
}

/** Thread argumentatif: tantangan bersarang di bawah klaim yang dirujuk. */
function CouncilPanel({ items }: { items: Langkah[] }) {
  const grup = useMemo(() => {
    const map = new Map<string, { induk?: Langkah; anak: Langkah[] }>();
    const lepas: Langkah[] = [];

    for (const l of items) {
      const a = l.aktivitas;
      if (!a) continue;
      if (a.klaim) {
        const g = map.get(a.klaim) ?? { anak: [] };
        g.induk = l;
        map.set(a.klaim, g);
      } else if (a.refs) {
        const g = map.get(a.refs) ?? { anak: [] };
        g.anak.push(l);
        map.set(a.refs, g);
      } else {
        lepas.push(l);
      }
    }
    return { map, lepas };
  }, [items]);

  return (
    <div className="space-y-3">
      {[...grup.map.entries()].map(([klaim, g]) => (
        <div key={klaim} className="rounded-[10px] border border-line bg-surface p-3">
          <div className="label-eyebrow mb-2">
            Klaim #{klaim} ·{" "}
            {g.induk?.aktivitas
              ? councilMeta[g.induk.aktivitas.council].nama
              : "Tidak tersedia"}
          </div>
          {g.induk ? (
            <AgentCard aktivitas={g.induk.aktivitas!} waktu={0} />
          ) : (
            <p className="px-1 text-[13px] italic text-ink-400">
              Klaim belum dipublikasikan pada tampilan ini.
            </p>
          )}
          {g.anak.length ? (
            <div className="mt-2.5 space-y-2 border-l border-line pl-4">
              {g.anak.map((c, i) => (
                <AgentCard key={i} aktivitas={c.aktivitas!} waktu={0} />
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {grup.lepas.length ? (
        <div className="rounded-[10px] border border-line bg-surface p-3">
          <div className="label-eyebrow mb-2">Aktivitas lain</div>
          <div className="space-y-2">
            {grup.lepas.map((l, i) => (
              <AgentCard key={i} aktivitas={l.aktivitas!} waktu={0} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DistribusiPanel({
  selesai,
  gagal,
}: {
  selesai: boolean;
  gagal: boolean;
}) {
  if (gagal) {
    return (
      <div className="p-8">
        <Callout tone="warn">
          Distribusi ballot tidak tersedia karena simulasi persona tidak selesai.
          Bagian ini tidak diberi nilai bawaan.
        </Callout>
      </div>
    );
  }

  if (!selesai) {
    return (
      <p className="p-16 text-center text-[13.5px] text-ink-400">
        Distribusi tersedia setelah seluruh round selesai.
      </p>
    );
  }

  const baris = [
    { label: "Baseline (round 0)", d: ballot.baseline },
    { label: "Final (setelah interaksi)", d: ballot.final },
  ];

  return (
    <div className="space-y-6 p-5">
      <div>
        <h3 className="mb-3 text-[15px] font-semibold text-ink-900">
          Posisi persona sebelum dan sesudah interaksi
        </h3>
        <div className="space-y-4">
          {baris.map((b) => {
            const total = b.d.minat + b.d.pertimbangkan + b.d.tolak;
            const seg = [
              { l: "Minat", v: b.d.minat, c: "bg-teal-700" },
              { l: "Pertimbangkan", v: b.d.pertimbangkan, c: "bg-ink-400" },
              { l: "Tolak", v: b.d.tolak, c: "bg-surface-2" },
            ];
            return (
              <div key={b.label}>
                <div className="mb-1.5 text-[13px] font-medium text-ink-700">
                  {b.label}
                </div>
                <div className="flex h-8 overflow-hidden rounded-[6px] border border-line">
                  {seg.map((s) => (
                    <div
                      key={s.l}
                      className={cn(
                        "grid place-items-center text-[11.5px] font-bold",
                        s.c,
                        s.c === "bg-surface-2" ? "text-ink-500" : "text-white",
                      )}
                      style={{ width: `${(s.v / total) * 100}%` }}
                      title={`${s.l}: ${s.v} persona`}
                    >
                      {s.v}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-ink-500">
          {[
            ["Minat", "bg-teal-700"],
            ["Pertimbangkan", "bg-ink-400"],
            ["Tolak", "bg-surface-2 border border-line"],
          ].map(([l, c]) => (
            <span key={l} className="flex items-center gap-1.5">
              <span aria-hidden className={cn("h-2.5 w-2.5 rounded-sm", c)} />
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <h3 className="mb-3 text-[15px] font-semibold text-ink-900">
          Keberatan yang paling sering muncul
        </h3>
        <ul className="space-y-2">
          {ballot.keberatan.map((k) => (
            <li key={k.label} className="flex items-center gap-3">
              <span className="w-[52%] shrink-0 text-[13.5px] text-ink-700">
                {k.label}
              </span>
              <span className="h-[6px] flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full rounded-full bg-amber-600"
                  style={{ width: `${(k.jumlah / 16) * 100}%` }}
                />
              </span>
              <span className="tnum w-8 shrink-0 text-right text-[13px] font-semibold text-ink-900">
                {k.jumlah}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-ink-400">
          Dari 16 persona sintetis. Bukan proporsi pelanggan nyata.
        </p>
      </div>
    </div>
  );
}
