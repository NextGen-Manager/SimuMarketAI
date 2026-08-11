"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal saat elemen masuk viewport. Memakai IntersectionObserver, tanpa
 * pustaka animasi. Halaman ini tidak butuh timeline, hanya pemicu.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  ambang = 0.25,
) {
  const ref = useRef<T>(null);
  const [terlihat, setTerlihat] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTerlihat(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerlihat(true);
          obs.disconnect();
        }
      },
      { threshold: ambang, rootMargin: "0px 0px -8% 0px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ambang]);

  return { ref, terlihat };
}

/** Fase yang sedang aktif, dipakai memindahkan grid persona. */
export function useFase<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function hitung() {
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 di awal bagian, 1 di akhir
      const maju = (vh - r.top) / (r.height + vh);
      setFase(Math.max(0, Math.min(1, maju)));
    }

    hitung();
    window.addEventListener("scroll", hitung, { passive: true });
    window.addEventListener("resize", hitung);
    return () => {
      window.removeEventListener("scroll", hitung);
      window.removeEventListener("resize", hitung);
    };
  }, []);

  return { ref, fase };
}

/** Menghitung angka naik saat masuk viewport. */
export function useCountUp(target: number, durasi = 1200) {
  const { ref, terlihat } = useReveal<HTMLDivElement>(0.5);
  const [nilai, setNilai] = useState(0);

  useEffect(() => {
    if (!terlihat) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setNilai(target);
      return;
    }

    let raf = 0;
    const mulai = performance.now();

    function langkah(t: number) {
      const p = Math.min(1, (t - mulai) / durasi);
      // ease-out cubic
      const e = 1 - Math.pow(1 - p, 3);
      setNilai(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(langkah);
    }

    raf = requestAnimationFrame(langkah);
    return () => cancelAnimationFrame(raf);
  }, [terlihat, target, durasi]);

  return { ref, nilai };
}
