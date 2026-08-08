"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDemoFlow } from "./DemoFlowProvider";
import type { JourneyId } from "./journeys";

type Adegan = { rute: string; tahanMs: number; tungguSelesai?: boolean };

/**
 * Durasi tidak dibatasi. Layar yang punya proses sendiri (simulasi) memakai
 * `tungguSelesai` — autoplay menunggu sinyal selesai, bukan timer tetap.
 */
export const adeganA: Adegan[] = [
  { rute: "/demo/dashboard", tahanMs: 3000 },
  { rute: "/demo/analisis/input", tahanMs: 11000 },
  { rute: "/demo/edukasi", tahanMs: 9000 },
  { rute: "/demo/analisis/konfirmasi", tahanMs: 11000 },
  { rute: "/demo/analisis/proses", tahanMs: 0, tungguSelesai: true },
  { rute: "/demo/laporan", tahanMs: 18000 },
  { rute: "/demo/diskusi", tahanMs: 12000 },
];

export const adeganB: Adegan[] = [
  { rute: "/demo/dashboard", tahanMs: 3000 },
  { rute: "/demo/transaksi/produk", tahanMs: 8000 },
  { rute: "/demo/transaksi/catat", tahanMs: 9000 },
  { rute: "/demo/transaksi/struk", tahanMs: 11000 },
  { rute: "/demo/transaksi/analitik", tahanMs: 16000 },
];

export function adeganFor(j: JourneyId) {
  return j === "A" ? adeganA : adeganB;
}

/**
 * Memajukan rute satu per satu. Interaksi manual menghentikan autoplay
 * supaya presenter bisa mengambil alih saat juri bertanya.
 */
export function useAutoplay(prosesSelesai?: boolean) {
  const { autoplay, setAutoplay, journey } = useDemoFlow();
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoplay || !journey) return;

    const adegan = adeganFor(journey);
    const i = adegan.findIndex((a) => pathname === a.rute);
    if (i === -1) return;

    const kini = adegan[i];
    const berikut = adegan[i + 1];

    // Layar berproses: tunggu sinyal selesai, lalu beri jeda baca singkat.
    if (kini.tungguSelesai && !prosesSelesai) return;

    const jeda = kini.tungguSelesai ? 2500 : kini.tahanMs;

    timer.current = setTimeout(() => {
      if (berikut) router.push(berikut.rute);
      else setAutoplay(false);
    }, jeda);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [autoplay, journey, pathname, prosesSelesai, router, setAutoplay]);

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
