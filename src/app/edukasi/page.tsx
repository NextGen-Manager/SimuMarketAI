"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { modul, type Modul } from "@/demo/data/education";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { cn } from "@/lib/format";

export default function Edukasi() {
  const router = useRouter();
  const { modulSelesai, selesaikanModul, gerbangTerbuka, tandaiSelesai } =
    useDemoFlow();
  useAutoplay();

  const [buka, setBuka] = useState<Modul | null>(null);

  if (buka) {
    return <BacaModul m={buka} tutup={() => setBuka(null)} />;
  }

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Edukasi Bisnis F&B"
        sub="Dua topik wajib diselesaikan sebelum Market Analysis dapat dijalankan. Dua lainnya opsional tapi berguna."
      />

      {!gerbangTerbuka ? (
        <div className="mb-6">
          <Callout tone="warn">
            <strong className="font-semibold text-ink-900">
              Market Analysis masih terkunci.
            </strong>{" "}
            Ini gerbang keras, bukan peringatan — tombol lanjut baru aktif
            setelah kedua topik wajib selesai. Tujuannya agar kamu bisa
            mengkritisi hasil AI, bukan sekadar menerimanya.
          </Callout>
        </div>
      ) : null}

      <ul className="space-y-3">
        {modul.map((m) => {
          const selesai = modulSelesai.has(m.id);
          return (
            <li
              key={m.id}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-[12px] border bg-surface px-5 py-4",
                selesai ? "border-success-600/30" : "border-line",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-[9px] text-[13px] font-bold",
                  selesai
                    ? "bg-success-600 text-white"
                    : "bg-surface-2 text-ink-400",
                )}
              >
                {selesai ? "✓" : m.menit}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[15.5px] font-semibold text-ink-900">
                    {m.judul}
                  </h2>
                  {m.wajib ? (
                    <span className="rounded-full border border-danger-600/30 bg-danger-50 px-2 py-0.5 text-[11px] font-bold text-danger-600">
                      WAJIB
                    </span>
                  ) : (
                    <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-400">
                      opsional
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
                  {m.ringkas}
                </p>
                <p className="mt-1 text-[12px] text-ink-400">
                  {m.menit} menit baca
                </p>
              </div>
              <Button
                variant={selesai ? "secondary" : "primary"}
                onClick={() => setBuka(m)}
                className="shrink-0"
              >
                {selesai ? "Baca ulang" : "Buka"}
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => modul.forEach((m) => selesaikanModul(m.id))}
        >
          Tandai semua selesai (demo)
        </Button>
        <Button
          disabled={!gerbangTerbuka}
          onClick={() => {
            tandaiSelesai("edukasi");
            router.push("/analisis/konfirmasi");
          }}
        >
          {gerbangTerbuka
            ? "Lanjut ke Konfirmasi"
            : "Selesaikan topik wajib dulu"}
          {gerbangTerbuka ? <span aria-hidden>→</span> : null}
        </Button>
      </div>
    </div>
  );
}

function BacaModul({ m, tutup }: { m: Modul; tutup: () => void }) {
  const { selesaikanModul } = useDemoFlow();
  const [jawab, setJawab] = useState<Record<number, number>>({});
  const [dikirim, setDikirim] = useState(false);

  const semuaBenar = m.kuis.every((k, i) => jawab[i] === k.benar);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <button
        type="button"
        onClick={tutup}
        className="mb-6 text-[13.5px] font-semibold text-ink-500 hover:text-ink-900"
      >
        ← Kembali ke daftar topik
      </button>

      <h1 className="text-[28px] font-bold tracking-tight text-ink-900 text-balance">
        {m.judul}
      </h1>
      <p className="mt-2 text-[13px] text-ink-400">{m.menit} menit baca</p>

      <div className="mt-7 space-y-4">
        {m.isi.map((p, i) => (
          <p key={i} className="text-[15.5px] leading-[1.75] text-ink-700">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-10 rounded-[12px] border border-line bg-surface p-5">
        <h2 className="text-[16px] font-semibold text-ink-900">
          Cek pemahaman
        </h2>
        <div className="mt-4 space-y-5">
          {m.kuis.map((k, i) => (
            <fieldset key={i}>
              <legend className="mb-2 text-[14.5px] font-medium text-ink-900">
                {k.tanya}
              </legend>
              <div className="space-y-1.5">
                {k.opsi.map((o, j) => {
                  const dipilih = jawab[i] === j;
                  const benar = dikirim && j === k.benar;
                  const salah = dikirim && dipilih && j !== k.benar;
                  return (
                    <label
                      key={j}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2 text-[14px]",
                        benar
                          ? "border-success-600/40 bg-success-50"
                          : salah
                            ? "border-danger-600/40 bg-danger-50"
                            : dipilih
                              ? "border-teal-700/40 bg-teal-50"
                              : "border-line hover:bg-surface-2",
                      )}
                    >
                      <input
                        type="radio"
                        name={`k${i}`}
                        checked={dipilih}
                        onChange={() => setJawab((s) => ({ ...s, [i]: j }))}
                        className="accent-teal-700"
                      />
                      <span className="text-ink-700">{o}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              setDikirim(true);
              if (m.kuis.every((k, i) => jawab[i] === k.benar)) {
                selesaikanModul(m.id);
              }
            }}
          >
            Periksa Jawaban
          </Button>
          {dikirim ? (
            semuaBenar ? (
              <span className="text-[13.5px] font-semibold text-success-600">
                ✓ Topik ditandai selesai
              </span>
            ) : (
              <span className="text-[13.5px] font-semibold text-danger-600">
                Masih ada yang keliru — periksa lagi
              </span>
            )
          ) : null}
        </div>
      </div>

      {dikirim && semuaBenar ? (
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={tutup}>
            Kembali ke daftar topik
          </Button>
        </div>
      ) : null}
    </div>
  );
}
