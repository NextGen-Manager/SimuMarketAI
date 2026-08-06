"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { PageHead } from "@/components/layout/PageHead";
import { cn } from "@/lib/format";

const subTahap = [
  { label: "Membaca dokumen", ms: 900 },
  { label: "Memecah konten", ms: 800 },
  { label: "Mengekstrak entitas usaha", ms: 1100 },
  { label: "Memetakan ke skema", ms: 900 },
  { label: "Menilai kelengkapan data", ms: 1000 },
];

export default function Analisis() {
  const router = useRouter();
  const { tandaiSelesai } = useDemoFlow();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    tandaiSelesai("baca");
  }, [tandaiSelesai]);

  useEffect(() => {
    if (idx >= subTahap.length) {
      const t = setTimeout(() => {
        tandaiSelesai("konfirmasi");
        router.push("/analisis/konfirmasi");
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), subTahap[idx].ms);
    return () => clearTimeout(t);
  }, [idx, router, tandaiSelesai]);

  const persen = Math.round((idx / subTahap.length) * 100);

  return (
    <div className="mx-auto max-w-[680px] px-6 py-20">
      <PageHead
        judul="Membaca dokumenmu"
        sub="Hasilnya akan ditampilkan untuk kamu periksa sebelum simulasi dijalankan."
        tengah
      />

      <div
        className="mb-8 h-[6px] w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={persen}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-teal-700 transition-[width] duration-500 ease-out"
          style={{ width: `${persen}%` }}
        />
      </div>

      <ol className="space-y-1" aria-live="polite">
        {subTahap.map((s, i) => {
          const selesai = i < idx;
          const aktif = i === idx;
          return (
            <li
              key={s.label}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[14.5px] transition-colors",
                aktif && "bg-teal-50",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                  selesai
                    ? "border-success-600 bg-success-600 text-white"
                    : aktif
                      ? "border-teal-700 text-teal-700"
                      : "border-line text-ink-400",
                )}
              >
                {selesai ? "✓" : i + 1}
              </span>
              <span
                className={cn(
                  selesai
                    ? "text-ink-500"
                    : aktif
                      ? "font-semibold text-teal-700"
                      : "text-ink-400",
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
