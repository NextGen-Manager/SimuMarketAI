"use client";

import { useEffect, useRef, useState } from "react";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import {
  diskusi,
  diskusiSebelumnya,
  jawabanUmum,
  spesialisMeta,
  type Jawaban,
  type Spesialis,
} from "@/demo/data/discussion";
import { laporan } from "@/demo/data/report";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/format";

type Giliran = { peran: "anda" | "agent"; tanya?: string; jawab?: Jawaban };

export default function Diskusi() {
  const { tandaiSelesai } = useDemoFlow();
  const [spesialis, setSpesialis] = useState<Spesialis>("finansial");
  const [riwayat, setRiwayat] = useState<Giliran[]>([]);
  const [menunggu, setMenunggu] = useState(false);
  const [teks, setTeks] = useState("");
  const akhirRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tandaiSelesai("diskusi");
  }, [tandaiSelesai]);

  useEffect(() => {
    akhirRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [riwayat.length, menunggu]);

  const saran = diskusi.filter((d) => d.spesialis === spesialis);

  function tanyakan(j: Jawaban, pertanyaan: string) {
    setRiwayat((r) => [...r, { peran: "anda", tanya: pertanyaan }]);
    setMenunggu(true);
    setTeks("");
    setTimeout(() => {
      setRiwayat((r) => [...r, { peran: "agent", jawab: j }]);
      setMenunggu(false);
    }, 1100);
  }

  function kirimBebas() {
    if (!teks.trim()) return;
    tanyakan({ ...jawabanUmum, spesialis }, teks.trim());
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Konteks run */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[12px] border border-line bg-surface p-5">
            <h2 className="text-[16px] font-bold text-ink-900">
              Kopi Kenangan Senja
            </h2>
            <p className="text-[13px] text-ink-400">Market Launch Scenario</p>

            <div className="mt-4">
              <div className="label-eyebrow mb-1.5">Skor Kelayakan</div>
              <div className="flex items-center gap-3">
                <span className="h-[6px] flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span
                    className="block h-full rounded-full bg-teal-700"
                    style={{ width: `${laporan.skor.nilai}%` }}
                  />
                </span>
                <span className="tnum text-[14px] font-bold text-ink-900">
                  {laporan.skor.nilai}/100
                </span>
              </div>
            </div>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-ink-400">Target Pasar</dt>
                <dd className="font-medium text-ink-900">Pekerja lepas</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-ink-400">Harga Produk</dt>
                <dd className="tnum font-medium text-ink-900">Rp 25.000</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-ink-400">Keyakinan Bukti</dt>
                <dd className="tnum font-medium text-ink-900">0,58 Sedang</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-[10px] border border-line bg-success-50/40 p-3.5">
              <div className="mb-1 text-[12.5px] font-bold text-success-600">
                Insight Utama
              </div>
              <p className="text-[13px] leading-relaxed text-ink-700">
                Potensi pertumbuhan tinggi di bulan ke-3, namun waspadai arus kas
                operasional di bulan pertama.
              </p>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <div className="label-eyebrow mb-2">Diskusi Sebelumnya</div>
              <ul className="space-y-1.5">
                {diskusiSebelumnya.map((d) => (
                  <li key={d} className="text-[13px] text-ink-500">
                    · {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Percakapan */}
        <section className="min-w-0">
          <div className="rounded-[12px] border border-line bg-surface">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <h1 className="text-[18px] font-bold text-ink-900">
                  Tanya AI tentang Peluncuranmu
                </h1>
                <p className="mt-1 max-w-[36rem] text-[13.5px] leading-relaxed text-ink-500">
                  Pilih spesialis untuk mendapatkan saran yang lebih mendalam.
                  Setiap angka dalam jawaban berasal dari kalkulator
                  deterministik, bukan dari model bahasa.
                </p>
              </div>
              <div
                role="tablist"
                aria-label="Pilih spesialis"
                className="flex flex-wrap gap-1.5"
              >
                {(Object.keys(spesialisMeta) as Spesialis[]).map((s) => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={spesialis === s}
                    onClick={() => setSpesialis(s)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                      spesialis === s
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-line bg-surface text-ink-500 hover:bg-surface-2 hover:text-ink-900",
                    )}
                  >
                    {spesialisMeta[s].nama}
                  </button>
                ))}
              </div>
            </div>

            {/* Riwayat */}
            <div className="max-h-[440px] space-y-4 overflow-y-auto p-5">
              {riwayat.length === 0 && !menunggu ? (
                <p className="py-10 text-center text-[13.5px] text-ink-400">
                  Pilih salah satu pertanyaan di bawah untuk memulai.
                </p>
              ) : null}

              {riwayat.map((g, i) =>
                g.peran === "anda" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-[12px] rounded-br-[4px] bg-teal-700 px-4 py-3">
                      <div className="mb-1 text-[10.5px] font-bold tracking-wider text-white/70">
                        ANDA
                      </div>
                      <p className="text-[14px] leading-relaxed text-white">
                        {g.tanya}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-amber-600 text-[11px] font-bold text-white"
                    >
                      {g.jawab!.spesialis.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1 rounded-[12px] rounded-tl-[4px] border border-line bg-surface-2 px-4 py-3">
                      <div className="mb-2 flex flex-wrap items-baseline gap-2">
                        <span className="text-[14px] font-bold text-ink-900">
                          {spesialisMeta[g.jawab!.spesialis].nama}
                        </span>
                        <span className="font-mono text-[11px] text-ink-400">
                          council {spesialisMeta[g.jawab!.spesialis].council}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {g.jawab!.paragraf.map((p, k) => (
                          <p
                            key={k}
                            className="text-[14px] leading-relaxed text-ink-700"
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Atribusi tool call; angka tanpa ini tidak dirender */}
                      {g.jawab!.toolCall ? (
                        <p className="mt-3 border-t border-line pt-2.5 font-mono text-[11.5px] text-ink-500">
                          <span className="text-teal-700">⌘</span> dihitung oleh{" "}
                          {g.jawab!.toolCall}
                        </p>
                      ) : null}

                      {g.jawab!.aksi?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {g.jawab!.aksi.map((a) => (
                            <button
                              key={a}
                              className="rounded-[7px] border border-line bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-50"
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ),
              )}

              {menunggu ? (
                <div className="flex gap-3">
                  <span
                    aria-hidden
                    className="h-8 w-8 shrink-0 rounded-[8px] bg-surface-2"
                  />
                  <p className="pt-2 text-[13.5px] text-ink-400" aria-live="polite">
                    Menyusun jawaban…
                  </p>
                </div>
              ) : null}
              <div ref={akhirRef} />
            </div>

            {/* Saran pertanyaan */}
            <div className="border-t border-line p-5">
              <div className="label-eyebrow mb-2.5">Pertanyaan yang disarankan</div>
              <div className="flex flex-wrap gap-2">
                {saran.map((s) => (
                  <button
                    key={s.tanya}
                    onClick={() => tanyakan(s, s.tanya)}
                    className="rounded-[9px] border border-line bg-surface px-3 py-2 text-left text-[13px] leading-snug text-ink-700 hover:border-teal-700/40 hover:bg-teal-50"
                  >
                    {s.tanya}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={teks}
                  onChange={(e) => setTeks(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") kirimBebas();
                  }}
                  placeholder="Tanyakan hal lain tentang risiko atau strategi…"
                  aria-label="Pertanyaan baru"
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-400"
                />
                <Button onClick={kirimBebas} className="px-4">
                  Kirim
                </Button>
              </div>

              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-400">
                AI dapat memberikan hasil berbeda tergantung asumsi yang Anda
                berikan. Jawaban di sini adalah data contoh untuk keperluan demo.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
