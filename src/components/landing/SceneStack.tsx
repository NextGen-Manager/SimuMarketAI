"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type Scene = {
  id: string;
  /** Lapis terjauh — bergerak paling lambat. */
  latar: ReactNode;
  /** Lapis hias di atas latar — bergerak lebih cepat dari latar. */
  hias?: ReactNode;
  isi: ReactNode;
  dasar?: string;
};

/**
 * Rangkaian adegan penuh layar.
 *
 * Adegan aktif dipin ke viewport oleh ScrollTrigger; adegan berikutnya
 * berada di atasnya dengan translateY(100%) dan digulung naik ke 0% oleh
 * timeline GSAP yang di-scrub. Keduanya hidup bersamaan selama transisi —
 * dokumen tidak digeser ke atas untuk membuat efek ini.
 *
 * Seluruh transform ditulis GSAP langsung ke DOM, bukan lewat state React,
 * supaya tidak ada render ulang saat menggulir.
 */
export function SceneStack({ scenes }: { scenes: Scene[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const latarRefs = useRef<(HTMLElement | null)[]>([]);
  const hiasRefs = useRef<(HTMLElement | null)[]>([]);
  const isiRefs = useRef<(HTMLElement | null)[]>([]);
  const titikRefs = useRef<(HTMLElement | null)[]>([]);
  const petunjukRef = useRef<HTMLDivElement>(null);

  const [statis, setStatis] = useState(false);
  const n = scenes.length;

  useEffect(() => {
    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (kurangiGerak) {
      setStatis(true);
      return;
    }

    let mati = false;
    let bersihkan: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (mati) return;

      gsap.registerPlugin(ScrollTrigger);

      // Lenis hanya untuk kehalusan roda/sentuh; ScrollTrigger tetap
      // pemilik posisi gulir, jadi keduanya harus dijalankan satu ticker.
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (waktu: number) => lenis.raf(waktu * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        const adegan = sceneRefs.current;
        const latar = latarRefs.current;
        const hias = hiasRefs.current;
        const isi = isiRefs.current;

        // Posisi awal: adegan pertama terpasang, sisanya menunggu di bawah.
        adegan.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { yPercent: i === 0 ? 0 : 100 });
        });
        isi.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { yPercent: i === 0 ? 0 : 22, opacity: i === 0 ? 1 : 0 });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            pin: viewportRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / (n - 1),
              duration: { min: 0.22, max: 0.6 },
              delay: 0.02,
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              const aktif = Math.round(self.progress * (n - 1));
              titikRefs.current.forEach((t, i) => {
                if (!t) return;
                t.dataset.aktif = i === aktif ? "1" : "0";
              });
              if (petunjukRef.current) {
                petunjukRef.current.style.opacity =
                  self.progress < 0.04 ? "1" : "0";
              }
            },
          },
        });

        for (let i = 1; i < n; i++) {
          const t = i - 1;

          // Adegan masuk digulung naik menutupi adegan sebelumnya.
          tl.to(adegan[i], { yPercent: 0 }, t);

          // Parallax masuk: latar paling lambat, hias lebih cepat.
          tl.fromTo(latar[i], { yPercent: 12 }, { yPercent: 0 }, t);
          if (hias[i]) tl.fromTo(hias[i], { yPercent: 26 }, { yPercent: 0 }, t);
          tl.to(isi[i], { yPercent: 0, opacity: 1, ease: "power2.out" }, t);

          // Adegan keluar tetap hampir diam — hanya sedikit hanyut ke atas.
          tl.to(latar[i - 1], { yPercent: -5 }, t);
          if (hias[i - 1]) tl.to(hias[i - 1], { yPercent: -11 }, t);
          tl.to(isi[i - 1], { yPercent: -9, opacity: 0.28 }, t);

          // Tepi tinta bergeser selama transisi, jadi batasnya berubah
          // bentuk alih-alih berupa garis tetap yang ikut naik.
          tl.fromTo(
            adegan[i],
            { "--edge-x": "0px" },
            { "--edge-x": "-160px" },
            t,
          );
        }
      }, rootRef);

      bersihkan = () => {
        ctx.revert();
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    })();

    return () => {
      mati = true;
      bersihkan?.();
    };
  }, [n]);

  // Tanpa animasi: adegan jadi bagian dokumen biasa, ditumpuk vertikal.
  if (statis) {
    return (
      <div>
        {scenes.map((s) => (
          <section
            key={s.id}
            className="relative min-h-screen overflow-hidden"
            style={{ background: s.dasar ?? "var(--color-canvas)" }}
          >
            <div className="absolute inset-0">{s.latar}</div>
            {s.hias ? (
              <div className="pointer-events-none absolute inset-0">
                {s.hias}
              </div>
            ) : null}
            <div className="relative flex min-h-screen w-full items-center py-20">
              {s.isi}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} style={{ height: `${n * 100}vh` }}>
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {scenes.map((s, i) => (
          <section
            key={s.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className={cn(
              "absolute inset-0 overflow-hidden will-change-transform",
              i > 0 && "scene-edge",
            )}
            style={{
              zIndex: i + 1,
              background: s.dasar ?? "var(--color-canvas)",
            }}
          >
            <div
              ref={(el) => {
                latarRefs.current[i] = el;
              }}
              className="absolute inset-[-8%] will-change-transform"
            >
              {s.latar}
            </div>

            {s.hias ? (
              <div
                ref={(el) => {
                  hiasRefs.current[i] = el;
                }}
                className="pointer-events-none absolute inset-[-6%] will-change-transform"
              >
                {s.hias}
              </div>
            ) : null}

            <div
              ref={(el) => {
                isiRefs.current[i] = el;
              }}
              className="relative flex h-full w-full items-center will-change-transform"
            >
              {s.isi}
            </div>
          </section>
        ))}

        <div className="pointer-events-none absolute right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex">
          {scenes.map((s, i) => (
            <span
              key={s.id}
              ref={(el) => {
                titikRefs.current[i] = el;
              }}
              data-aktif={i === 0 ? "1" : "0"}
              className="titik-adegan"
            />
          ))}
        </div>

        <div
          ref={petunjukRef}
          className="pointer-events-none absolute inset-x-0 bottom-7 z-50 flex justify-center transition-opacity duration-500"
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
