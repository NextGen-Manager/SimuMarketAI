"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDemoFlow } from "./DemoFlowProvider";
import type { StepId } from "./steps";

type Adegan = { step: StepId; rute: string; tahanMs: number };

/** Total sekitar 78 detik pada kecepatan normal. */
export const adegan: Adegan[] = [
  { step: "upload", rute: "/upload", tahanMs: 3500 },
  { step: "analisis", rute: "/analisis", tahanMs: 6500 },
  { step: "review", rute: "/review", tahanMs: 13000 },
  { step: "pasar", rute: "/pasar", tahanMs: 6500 },
  { step: "simulasi", rute: "/simulasi", tahanMs: 20000 },
  { step: "laporan", rute: "/laporan", tahanMs: 17000 },
  { step: "diskusi", rute: "/diskusi", tahanMs: 11000 },
];

export const totalDetik = Math.round(
  adegan.reduce((a, s) => a + s.tahanMs, 0) / 1000,
);

/**
 * Memajukan rute satu per satu. Klik di mana pun menghentikan autoplay
 * supaya presenter bisa mengambil alih saat juri bertanya.
 */
export function useAutoplay() {
  const { autoplay, setAutoplay, capai } = useDemoFlow();
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoplay) return;

    const i = adegan.findIndex((a) => pathname.startsWith(a.rute));
    if (i === -1) return;

    capai(adegan[i].step);

    const berikut = adegan[i + 1];
    timer.current = setTimeout(() => {
      if (berikut) {
        capai(berikut.step);
        router.push(berikut.rute);
      } else {
        setAutoplay(false);
      }
    }, adegan[i].tahanMs);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [autoplay, pathname, router, setAutoplay, capai]);

  // Interaksi manual menghentikan autoplay.
  useEffect(() => {
    if (!autoplay) return;
    const stop = () => setAutoplay(false);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("keydown", stop);
    return () => {
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [autoplay, setAutoplay]);
}
