"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { SceneReveal } from "./SceneReveal";

const modules = [
  {
    no: "01",
    title: "Analisis Pasar",
    description: "Nilai lokasi, harga, dan kesiapan sebelum mulai.",
  },
  {
    no: "02",
    title: "Edukasi Bisnis",
    description: "Pahami dasar bisnis untuk membaca hasil dengan kritis.",
  },
  {
    no: "03",
    title: "Insight Penjualan",
    description: "Ubah transaksi harian menjadi langkah berikutnya.",
  },
] as const;

export function ModuleFlow({ aktif }: { aktif: boolean }) {
  const [fokus, setFokus] = useState(-1);

  useEffect(() => {
    if (!aktif) {
      setFokus(-1);
      return;
    }

    setFokus(0);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setFokus((sebelumnya) => (sebelumnya + 1) % modules.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [aktif]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-line sm:block"
      >
        <span
          className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-700 transition-[left,opacity] duration-500 ease-out motion-reduce:transition-none"
          style={{
            left: fokus < 0 ? "0%" : `${((fokus + 0.5) / modules.length) * 100}%`,
            opacity: aktif ? 1 : 0,
          }}
        />
      </div>

      <div className="relative z-10 grid gap-3 sm:grid-cols-3">
        {modules.map((module, index) => (
          <SceneReveal
            key={module.no}
            aktif={aktif}
            delay={index * 140}
            className="h-full"
          >
            <article
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-[18px] border bg-surface p-5 transition-[border-color,background-color,transform] duration-500 ease-out motion-reduce:transition-none",
                fokus === index
                  ? "-translate-y-1 border-teal-700/45 bg-teal-50"
                  : "border-line",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-1 origin-left bg-teal-700 transition-transform duration-500 ease-out motion-reduce:transition-none",
                  fokus === index ? "scale-x-100" : "scale-x-0",
                )}
              />
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border font-mono text-[12px] font-bold transition-colors duration-500 motion-reduce:transition-none",
                    fokus === index
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-line bg-surface-2 text-teal-700",
                  )}
                >
                  {module.no}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-2 w-2 rounded-full transition-transform duration-500 motion-reduce:transition-none",
                    fokus === index
                      ? "scale-150 bg-teal-700"
                      : "bg-ink-900/15",
                  )}
                />
              </div>

              <h3 className="mt-6 text-[17px] font-semibold text-ink-900">
                {module.title}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-500">
                {module.description}
              </p>

              <div className="mt-6 flex items-center gap-2 border-t border-line-soft pt-3">
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-500 motion-reduce:transition-none",
                    fokus === index ? "bg-teal-700" : "bg-line",
                  )}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
                  {fokus === index ? "Sedang dipahami" : "Bagian alur"}
                </span>
              </div>
            </article>
          </SceneReveal>
        ))}
      </div>
    </div>
  );
}
