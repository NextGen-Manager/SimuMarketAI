"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type Scene = {
  id: string;
  /** Lapis terjauh bergerak paling lambat. */
  latar: ReactNode;
  /** Lapis hias di atas latar bergerak lebih cepat. */
  hias?: ReactNode;
  /** Boleh berupa fungsi agar isinya tahu kapan adegannya aktif. */
  isi: ReactNode | ((aktif: boolean) => ReactNode);
  dasar?: string;
};

const DURASI = 1.15;
/** Jarak gulir yang harus dikumpulkan sebelum adegan berpindah. Sengaja
 *  besar supaya perpindahan terasa disengaja, bukan tersenggol. */
const AMBANG_RODA = 340;
/** Akumulasi direset kalau menggulir berhenti selama ini. */
const LUPA = 220;
const JEDA = 420;

/**
 * Rangkaian adegan penuh layar bergaya potongan film.
 *
 * Roda dan sentuhan hanya MEMICU perpindahan; posisinya tidak diikat ke
 * jarak gulir. Itu perbedaan pokoknya: selama transform diikat ke posisi
 * gulir, gerakannya akan selalu terasa seperti menggulir karena memang
 * itulah yang terjadi. Di sini satu gerakan memulai satu timeline berdurasi
 * tetap, dan timeline itu berjalan sendiri sampai selesai.
 *
 * Dokumen tidak menggulir sama sekali; adegan ditumpuk dan digerakkan GSAP.
 */
export function SceneStack({ scenes }: { scenes: Scene[] }) {
  const wadahRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const latarRefs = useRef<(HTMLElement | null)[]>([]);
  const hiasRefs = useRef<(HTMLElement | null)[]>([]);
  const isiRefs = useRef<(HTMLElement | null)[]>([]);

  const indeksRef = useRef(0);
  const sibukRef = useRef(false);
  const gsapRef = useRef<typeof import("gsap").gsap | null>(null);

  const [indeks, setIndeks] = useState(0);
  const [statis, setStatis] = useState(false);
  const n = scenes.length;

  /** Memainkan satu perpindahan adegan. */
  const pindah = useCallback(
    (tujuan: number) => {
      const gsap = gsapRef.current;
      const dari = indeksRef.current;
      if (!gsap || sibukRef.current) return;
      if (tujuan < 0 || tujuan > n - 1 || tujuan === dari) return;

      sibukRef.current = true;
      indeksRef.current = tujuan;
      setIndeks(tujuan);

      const maju = tujuan > dari;
      // Yang bergerak selalu adegan bernomor lebih besar: maju berarti ia
      // naik menutup, mundur berarti ia turun membuka kembali.
      const bergerak = maju ? tujuan : dari;
      const diam = maju ? dari : tujuan;

      const el = sceneRefs.current[bergerak];
      const elLatar = latarRefs.current[bergerak];
      const elHias = hiasRefs.current[bergerak];
      const elIsi = isiRefs.current[bergerak];
      const diamLatar = latarRefs.current[diam];
      const diamHias = hiasRefs.current[diam];
      const diamIsi = isiRefs.current[diam];

      const tl = gsap.timeline({
        defaults: { duration: DURASI, ease: "expo.inOut" },
        onComplete: () => {
          sibukRef.current = false;
          // Adegan yang tak terpakai disembunyikan supaya tidak ikut dilukis.
          sceneRefs.current.forEach((s, i) => {
            if (!s) return;
            s.style.visibility = i === indeksRef.current ? "visible" : "hidden";
          });
        },
      });

      gsap.set([sceneRefs.current[dari], sceneRefs.current[tujuan]], {
        visibility: "visible",
      });

      tl.fromTo(
        el,
        { yPercent: maju ? 100 : 0 },
        { yPercent: maju ? 0 : 100 },
        0,
      )
        .fromTo(
          el,
          { "--edge-y": maju ? "0vh" : "-52vh", "--edge-x": maju ? "0px" : "-140px" },
          { "--edge-y": maju ? "-52vh" : "0vh", "--edge-x": maju ? "-140px" : "0px" },
          0,
        )
        // Parallax masuk: latar paling lambat, hias lebih cepat.
        .fromTo(
          elLatar,
          { yPercent: maju ? 14 : 0 },
          { yPercent: maju ? 0 : 14 },
          0,
        )
        .fromTo(
          elIsi,
          { yPercent: maju ? 16 : 0, opacity: maju ? 0 : 1 },
          { yPercent: maju ? 0 : 16, opacity: maju ? 1 : 0, ease: "power2.out" },
          maju ? 0.22 : 0,
        )
        // Adegan yang ditutupi hanya hanyut sedikit untuk memberi kedalaman.
        .fromTo(
          diamLatar,
          { yPercent: maju ? 0 : -6 },
          { yPercent: maju ? -6 : 0 },
          0,
        )
        .fromTo(
          diamIsi,
          { yPercent: maju ? 0 : -10, opacity: maju ? 1 : 0.25 },
          { yPercent: maju ? -10 : 0, opacity: maju ? 0.25 : 1 },
          0,
        );

      if (elHias) {
        tl.fromTo(
          elHias,
          { yPercent: maju ? 28 : 0 },
          { yPercent: maju ? 0 : 28 },
          0,
        );
      }
      if (diamHias) {
        tl.fromTo(
          diamHias,
          { yPercent: maju ? 0 : -13 },
          { yPercent: maju ? -13 : 0 },
          0,
        );
      }
    },
    [n],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setStatis(true));
      return () => cancelAnimationFrame(frame);
    }

    let mati = false;
    let lepas: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (mati) return;
      gsapRef.current = gsap;

      // Posisi awal: adegan pertama terpasang, sisanya menunggu di bawah.
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { yPercent: i === 0 ? 0 : 100 });
        el.style.visibility = i === 0 ? "visible" : "hidden";
      });
      isiRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { yPercent: i === 0 ? 0 : 16, opacity: i === 0 ? 1 : 0 });
      });

      const asli = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      let akumulasi = 0;
      let terakhir = 0;
      let sentuhTerakhir = 0;

      function roda(e: WheelEvent) {
        e.preventDefault();
        const kini = performance.now();
        if (sibukRef.current) {
          akumulasi = 0;
          return;
        }
        if (kini - terakhir < JEDA) return;

        // Gulir yang terputus tidak boleh menumpuk sampai memicu pindah.
        if (kini - sentuhTerakhir > LUPA) akumulasi = 0;
        sentuhTerakhir = kini;

        // Arah berbalik: mulai hitung ulang, jangan saling meniadakan.
        if (akumulasi !== 0 && Math.sign(e.deltaY) !== Math.sign(akumulasi)) {
          akumulasi = 0;
        }

        akumulasi += e.deltaY;
        if (Math.abs(akumulasi) < AMBANG_RODA) return;
        const arah = akumulasi > 0 ? 1 : -1;
        akumulasi = 0;
        terakhir = kini;
        pindah(indeksRef.current + arah);
      }

      let mulaiY = 0;
      function sentuhMulai(e: TouchEvent) {
        mulaiY = e.touches[0].clientY;
      }
      function sentuhSelesai(e: TouchEvent) {
        if (sibukRef.current) return;
        const delta = mulaiY - e.changedTouches[0].clientY;
        if (Math.abs(delta) < 55) return;
        pindah(indeksRef.current + (delta > 0 ? 1 : -1));
      }

      function tombol(e: KeyboardEvent) {
        const turun = ["ArrowDown", "PageDown", " "].includes(e.key);
        const naik = ["ArrowUp", "PageUp"].includes(e.key);
        if (!turun && !naik && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        if (e.key === "Home") return pindah(0);
        if (e.key === "End") return pindah(n - 1);
        pindah(indeksRef.current + (turun ? 1 : -1));
      }

      window.addEventListener("wheel", roda, { passive: false });
      window.addEventListener("touchstart", sentuhMulai, { passive: true });
      window.addEventListener("touchend", sentuhSelesai, { passive: true });
      window.addEventListener("keydown", tombol);

      lepas = () => {
        document.body.style.overflow = asli;
        window.removeEventListener("wheel", roda);
        window.removeEventListener("touchstart", sentuhMulai);
        window.removeEventListener("touchend", sentuhSelesai);
        window.removeEventListener("keydown", tombol);
      };
    })();

    return () => {
      mati = true;
      lepas?.();
    };
  }, [n, pindah]);

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
              <div className="pointer-events-none absolute inset-0">{s.hias}</div>
            ) : null}
            <div className="relative flex min-h-screen w-full items-center py-20">
              {typeof s.isi === "function" ? s.isi(true) : s.isi}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={wadahRef} className="fixed inset-0 overflow-hidden">
      {scenes.map((s, i) => (
        <section
          key={s.id}
          ref={(el) => {
            sceneRefs.current[i] = el;
          }}
          aria-hidden={i !== indeks}
          className={cn("absolute inset-0 overflow-hidden", i > 0 && "scene-edge")}
          style={{
            zIndex: i + 1,
            background: s.dasar ?? "var(--color-canvas)",
            visibility: i === 0 ? "visible" : "hidden",
          }}
        >
          <div
            ref={(el) => {
              latarRefs.current[i] = el;
            }}
            className="absolute inset-[-9%]"
          >
            {s.latar}
          </div>

          {s.hias ? (
            <div
              ref={(el) => {
                hiasRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-[-7%]"
            >
              {s.hias}
            </div>
          ) : null}

          <div
            ref={(el) => {
              isiRefs.current[i] = el;
            }}
            className="relative flex h-full w-full items-center"
          >
            {typeof s.isi === "function" ? s.isi(i === indeks) : s.isi}
          </div>
        </section>
      ))}

      <nav
        aria-label="Adegan"
        className="absolute right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex"
      >
        {scenes.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Ke adegan ${i + 1}`}
            aria-current={i === indeks}
            onClick={() => pindah(i)}
            data-aktif={i === indeks ? "1" : "0"}
            className="titik-adegan"
          />
        ))}
      </nav>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-7 z-50 flex justify-center transition-opacity duration-500"
        style={{ opacity: indeks === 0 ? 1 : 0 }}
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
  );
}
