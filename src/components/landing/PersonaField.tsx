"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";

type Arke = "budget" | "convenience" | "quality" | "social";

type Persona = {
  id: string;
  arke: Arke;
  /** posisi acak-tetap saat berkumpul */
  x: number;
  y: number;
  /** keputusan akhir, menentukan kolom saat fase hasil */
  putusan: 0 | 1 | 2;
};

const arkeWarna: Record<Arke, string> = {
  budget: "bg-ink-500 text-white",
  convenience: "bg-teal-700 text-white",
  quality: "bg-amber-600 text-white",
  social: "bg-info-600 text-white",
};

const arkeLabel: Record<Arke, string> = {
  budget: "hemat",
  convenience: "praktis",
  quality: "rasa",
  social: "sosial",
};

/** 16 persona adalah ukuran cohort yang dipakai protokol simulasi. */
export const kohort: Persona[] = [
  { id: "bd-01", arke: "budget", x: 8, y: 18, putusan: 2 },
  { id: "bd-02", arke: "budget", x: 26, y: 62, putusan: 1 },
  { id: "bd-03", arke: "budget", x: 47, y: 12, putusan: 2 },
  { id: "bd-04", arke: "budget", x: 71, y: 70, putusan: 1 },
  { id: "cv-01", arke: "convenience", x: 15, y: 44, putusan: 0 },
  { id: "cv-02", arke: "convenience", x: 38, y: 78, putusan: 0 },
  { id: "cv-03", arke: "convenience", x: 60, y: 34, putusan: 0 },
  { id: "cv-04", arke: "convenience", x: 86, y: 20, putusan: 1 },
  { id: "ql-01", arke: "quality", x: 32, y: 28, putusan: 0 },
  { id: "ql-02", arke: "quality", x: 54, y: 58, putusan: 0 },
  { id: "ql-03", arke: "quality", x: 78, y: 46, putusan: 1 },
  { id: "ql-04", arke: "quality", x: 92, y: 66, putusan: 0 },
  { id: "sc-01", arke: "social", x: 5, y: 76, putusan: 1 },
  { id: "sc-02", arke: "social", x: 44, y: 44, putusan: 0 },
  { id: "sc-03", arke: "social", x: 66, y: 14, putusan: 2 },
  { id: "sc-04", arke: "social", x: 88, y: 88, putusan: 1 },
];

const kolomLabel = ["Minat", "Pertimbangkan", "Tolak"];

/**
 * Kohort persona sebagai visual utama. Tiga fase:
 * 0 berkumpul acak, 1 berdebat (bergetar halus), 2 terbelah jadi distribusi.
 * Ini bukan ilustrasi hiasan. Bentuknya persis yang dijalankan produk.
 */
export function PersonaField({
  fase,
  padat = false,
}: {
  fase: 0 | 1 | 2;
  padat?: boolean;
}) {
  const perKolom: Record<number, Persona[]> = { 0: [], 1: [], 2: [] };
  kohort.forEach((p) => perKolom[p.putusan].push(p));

  return (
    <div
      className={cn(
        "relative w-full",
        padat ? "h-[280px] sm:h-[320px]" : "h-[360px] sm:h-[420px]",
      )}
    >
      {kohort.map((p, i) => {
        let x = p.x;
        let y = p.y;

        if (fase === 2) {
          const kolom = p.putusan;
          const dalam = perKolom[kolom].indexOf(p);
          const total = perKolom[kolom].length;
          // Jarak antarkartu menyesuaikan isi kolom, supaya kolom terpanjang
          // tetap muat. Jarak tetap membuat kolom 7 kartu meluber ke atas.
          const spasi = total > 1 ? Math.min(11, 52 / (total - 1)) : 0;
          x = 17 + kolom * 33;
          y = 40 + (dalam - (total - 1) / 2) * spasi;
        }

        return (
          <div
            key={p.id}
            className="absolute transition-all duration-[900ms] ease-out motion-reduce:transition-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              transitionDelay: `${(i % 8) * 45}ms`,
            }}
          >
            <div className="group relative">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-[10px] font-mono text-[10px] font-bold tracking-tight shadow-sm sm:h-10 sm:w-10 sm:text-[11px]",
                  arkeWarna[p.arke],
                  fase === 1 && "animate-pulse",
                )}
              >
                {p.id.slice(0, 2).toUpperCase()}
              </span>
              <span className="pointer-events-none absolute left-full top-1/2 ml-1.5 hidden -translate-y-1/2 whitespace-nowrap rounded-[5px] border border-white/15 bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white/85 group-hover:block">
                {p.id} · {arkeLabel[p.arke]}
              </span>
            </div>
          </div>
        );
      })}

      {/* Label kolom hanya muncul pada fase distribusi */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex transition-opacity duration-700",
          fase === 2 ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={fase !== 2}
      >
        {kolomLabel.map((l, i) => (
          <div key={l} className="flex-1 text-center">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.11em] text-white/45">
              {l}
            </span>
            <span className="tnum mt-0.5 block text-[15px] font-bold text-white/85">
              {perKolom[i].length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Versi yang bergerak sendiri. Begitu adegannya aktif, kohort berkumpul,
 * berdebat, lalu terbelah jadi distribusi tanpa perlu disentuh pengguna.
 * Kembali ke awal saat adegan ditinggalkan, jadi selalu utuh saat dibuka lagi.
 */
export function PersonaFieldAuto({
  aktif,
  padat,
}: {
  aktif: boolean;
  padat?: boolean;
}) {
  const [fase, setFase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (!aktif) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const reducedMotionTimer = setTimeout(() => setFase(2), 0);
      return () => clearTimeout(reducedMotionTimer);
    }
    const a = setTimeout(() => setFase(1), 900);
    const b = setTimeout(() => setFase(2), 2400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [aktif]);

  return <PersonaField fase={aktif ? fase : 0} padat={padat} />;
}
