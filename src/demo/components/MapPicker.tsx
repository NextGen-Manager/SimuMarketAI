"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/format";

export type Kompetitor = { x: number; y: number; nama: string; jarak: string };

const kompetitorContoh: Kompetitor[] = [
  { x: 34, y: 38, nama: "Kopi Janji Manis", jarak: "180 m" },
  { x: 62, y: 30, nama: "Cafe Ruang Bersama", jarak: "340 m" },
  { x: 46, y: 62, nama: "Warung Kopi Tebet", jarak: "410 m" },
  { x: 72, y: 58, nama: "Kedai Sudut", jarak: "520 m" },
  { x: 22, y: 66, nama: "Kopi Pagi", jarak: "610 m" },
  { x: 80, y: 44, nama: "Brew Corner", jarak: "700 m" },
];

/**
 * Peta tiruan. Demo tidak memanggil Google Maps atau penyedia peta mana pun —
 * tidak ada API key, dan pemakaian Places untuk data kompetitor masih menunggu
 * review lisensi (lihat Docs 05). Perilakunya sengaja dibuat menyerupai peta
 * sungguhan supaya komponen ini bisa ditukar tanpa mengubah layar.
 */
export function MapPicker({
  radius,
  onRadiusChange,
  alamat,
  onAlamatChange,
}: {
  radius: number;
  onRadiusChange: (r: number) => void;
  alamat: string;
  onAlamatChange: (a: string) => void;
}) {
  const [pin, setPin] = useState({ x: 50, y: 46 });
  const [geser, setGeser] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const radiusPx = { 1000: 17, 1500: 25, 3000: 40 }[radius] ?? 25;

  function pindahkan(clientX: number, clientY: number) {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(6, Math.min(94, ((clientX - r.left) / r.width) * 100));
    const y = Math.max(6, Math.min(94, ((clientY - r.top) / r.height) * 100));
    setPin({ x, y });
  }

  const dalamRadius = kompetitorContoh.filter((k) => {
    const dx = k.x - pin.x;
    const dy = k.y - pin.y;
    return Math.sqrt(dx * dx + dy * dy) <= radiusPx;
  });

  return (
    <div>
      {/* Pencarian alamat */}
      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          >
            ⌕
          </span>
          <input
            value={alamat}
            onChange={(e) => onAlamatChange(e.target.value)}
            aria-label="Cari alamat"
            placeholder="Cari alamat atau tempat…"
            className="w-full rounded-[8px] border border-line bg-surface py-2.5 pl-9 pr-3 text-[14.5px] text-ink-900"
          />
        </div>
      </div>

      {/* Kanvas peta */}
      <div
        ref={areaRef}
        onPointerDown={(e) => {
          setGeser(true);
          pindahkan(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => geser && pindahkan(e.clientX, e.clientY)}
        onPointerUp={() => setGeser(false)}
        onPointerLeave={() => setGeser(false)}
        className="relative h-[320px] w-full cursor-crosshair touch-none overflow-hidden rounded-[10px] border border-line bg-surface-2 select-none"
      >
        {/* Jalan tiruan */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <rect width="100" height="100" fill="var(--color-surface-2)" />
          {[18, 46, 74].map((y) => (
            <rect key={`h${y}`} x="0" y={y} width="100" height="2.4" fill="var(--color-surface)" />
          ))}
          {[26, 54, 82].map((x) => (
            <rect key={`v${x}`} x={x} y="0" width="2.4" height="100" fill="var(--color-surface)" />
          ))}
          <rect x="0" y="60" width="100" height="4" fill="var(--color-surface)" opacity="0.7" transform="rotate(-14 50 60)" />
          {[
            [8, 24, 14, 16],
            [64, 6, 20, 9],
            [30, 78, 18, 14],
            [84, 66, 12, 20],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="var(--color-line)" opacity="0.55" />
          ))}
        </svg>

        {/* Radius */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full border-2 border-teal-700/45 bg-teal-700/10"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            width: `${radiusPx * 2}%`,
            height: `${radiusPx * 2}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Kompetitor */}
        {kompetitorContoh.map((k) => {
          const dx = k.x - pin.x;
          const dy = k.y - pin.y;
          const masuk = Math.sqrt(dx * dx + dy * dy) <= radiusPx;
          return (
            <div
              key={k.nama}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${k.x}%`, top: `${k.y}%` }}
            >
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full border-2 border-surface",
                  masuk ? "bg-amber-600" : "bg-ink-400/60",
                )}
              />
              <span className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-900 shadow-sm group-hover:block">
                {k.nama} · {k.jarak}
              </span>
            </div>
          );
        })}

        {/* Pin lokasi */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden>
            <path
              d="M13 33C13 33 24 20.5 24 13A11 11 0 1 0 2 13c0 7.5 11 20 11 20z"
              fill="var(--color-teal-700)"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="13" cy="13" r="4" fill="white" />
          </svg>
        </div>

        <p className="pointer-events-none absolute bottom-2 left-2 rounded-[6px] bg-surface/90 px-2 py-1 text-[11px] font-medium text-ink-500">
          Klik atau geser untuk memindahkan titik usaha
        </p>
      </div>

      {/* Radius + hasil */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="label-eyebrow">Radius</span>
        {[1000, 1500, 3000].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRadiusChange(r)}
            className={cn(
              "tnum rounded-[8px] border px-3 py-1.5 text-[13px] font-semibold transition-colors",
              radius === r
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-line bg-surface text-ink-500 hover:bg-surface-2",
            )}
          >
            {r / 1000} km
          </button>
        ))}
        <span className="tnum ml-auto text-[13px] font-semibold text-amber-600">
          {dalamRadius.length} kompetitor dalam radius
        </span>
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-ink-400">
        Peta pada demo ini adalah tiruan dan tidak memanggil layanan peta mana
        pun. Pada produk sebenarnya, sumber kompetitor mengikuti keputusan
        lisensi data yang tercatat di dokumen evidence.
      </p>
    </div>
  );
}
