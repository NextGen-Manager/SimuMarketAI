"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type Scene = {
  id: string;
  /** Latar penuh layar; ditaruh di belakang isi dan diberi parallax. */
  latar: ReactNode;
  isi: ReactNode;
  /** Warna dasar di balik latar, dipakai saat gambar belum termuat. */
  dasar?: string;
};

/**
 * Tumpukan adegan penuh layar. Adegan yang keluar tetap diam sementara
 * adegan berikutnya naik dari bawah menutupinya, dengan tepi yang dipecah
 * mask bertekstur sehingga batasnya tidak lurus.
 *
 * Progres gulir dipetakan langsung ke transform, lalu di-snap ke adegan
 * terdekat, sehingga satu gerakan roda tidak melewati dua adegan.
 */
export function SceneStack({ scenes }: { scenes: Scene[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progres, setProgres] = useState(0);
  const [aktif, setAktif] = useState(0);
  const [siap, setSiap] = useState(false);
  const n = scenes.length;

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let batal = false;

    async function pasang() {
      const kurangiGerak = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (batal) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: kurangiGerak ? true : 0.85,
          snap: kurangiGerak
            ? undefined
            : {
                snapTo: 1 / (n - 1),
                duration: { min: 0.25, max: 0.55 },
                delay: 0.02,
                ease: "power2.inOut",
              },
          onUpdate: (self) => {
            setProgres(self.progress);
            setAktif(Math.round(self.progress * (n - 1)));
          },
        });
      }, wrapRef);

      setSiap(true);
    }

    pasang();
    return () => {
      batal = true;
      ctx?.revert();
    };
  }, [n]);

  const segmen = progres * (n - 1);

  return (
    <div ref={wrapRef} style={{ height: `${n * 100}vh` }}>
      <div className="fixed inset-0 overflow-hidden">
        {scenes.map((s, i) => {
          // Adegan i menutupi adegan i-1 selama segmen (i-1 → i).
          const lokal = Math.max(0, Math.min(1, segmen - (i - 1)));
          const y = i === 0 ? 0 : (1 - lokal) * 100;

          // Adegan yang sedang ditutupi bergerak sedikit ke atas: kedalaman.
          const keluar = Math.max(0, Math.min(1, segmen - i));
          const geserIsi = i === 0 ? -keluar * 7 : (1 - lokal) * 9 - keluar * 7;
          const geserLatar = i === 0 ? -keluar * 3 : (1 - lokal) * 4 - keluar * 3;

          const terlihat = Math.abs(segmen - i) < 1.35;

          return (
            <section
              key={s.id}
              aria-hidden={aktif !== i}
              className={cn(
                "absolute inset-0 will-change-transform",
                i > 0 && "scene-edge",
              )}
              style={{
                zIndex: i + 1,
                transform: `translate3d(0, ${y}%, 0)`,
                background: s.dasar ?? "var(--color-canvas)",
                visibility: terlihat ? "visible" : "hidden",
              }}
            >
              <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: `translate3d(0, ${geserLatar}%, 0)` }}
              >
                {s.latar}
              </div>
              <div
                className="relative flex h-full w-full items-center will-change-transform"
                style={{
                  transform: `translate3d(0, ${geserIsi}%, 0)`,
                  opacity: i === 0 ? 1 - keluar * 0.55 : 0.25 + lokal * 0.75,
                }}
              >
                {s.isi}
              </div>
            </section>
          );
        })}

        {/* Penunjuk adegan */}
        <div className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex">
          {scenes.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300",
                i === aktif
                  ? "h-5 w-1.5 bg-ink-900/70"
                  : "w-1.5 bg-ink-900/22",
              )}
            />
          ))}
        </div>

        {/* Petunjuk gulir, hilang setelah adegan pertama */}
        <div
          className="pointer-events-none fixed inset-x-0 bottom-7 z-50 flex justify-center transition-opacity duration-500"
          style={{ opacity: siap && segmen < 0.25 ? 1 : 0 }}
        >
          <span className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900/55">
              Gulir
            </span>
            <span aria-hidden className="scroll-cue text-[13px] text-ink-900/45">
              ↓
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
