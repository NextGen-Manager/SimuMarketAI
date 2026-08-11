"use client";

import { useEffect, useRef, useState } from "react";
import type { Langkah } from "./data/simulation";

/**
 * Pemutar skrip simulasi. Satu timer per langkah, memakai `ms` masing-masing.
 * Tidak ada perhitungan apa pun di sini, hanya memajukan indeks.
 */
export function usePlayback(skrip: Langkah[], jalan = true) {
  const [indeks, setIndeks] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIndeks(0);
  }, [skrip]);

  useEffect(() => {
    if (!jalan) return;
    if (indeks >= skrip.length) return;

    timer.current = setTimeout(() => {
      setIndeks((i) => i + 1);
    }, skrip[indeks].ms);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [indeks, jalan, skrip]);

  const terlihat = skrip.slice(0, indeks);
  const terakhir = terlihat[terlihat.length - 1];
  const selesai = indeks >= skrip.length;

  const elapsed = terlihat.reduce((a, l) => a + l.ms, 0);

  return {
    terlihat,
    aktivitas: terlihat.filter((l) => l.aktivitas),
    stageAktif: terakhir?.stage ?? null,
    persen: selesai ? 100 : (terakhir?.persen ?? 0),
    selesai,
    elapsed,
    ulang: () => setIndeks(0),
  };
}
