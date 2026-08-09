"use client";

import { useCallback, useState } from "react";
import { MarketMap } from "@/demo/components/MarketMap";
import {
  demoMarketMap,
  demoRadiusOptions,
  isDemoRadius,
} from "@/demo/data/market-map";
import { cn } from "@/lib/format";

type MapPickerProps = {
  radius: number;
  onRadiusChange: (radius: number) => void;
  alamat: string;
  onAlamatChange: (address: string) => void;
};

function formatRadius(radius: number): string {
  return radius === 1500 ? "1,5 km" : `${radius / 1000} km`;
}

export function MapPicker({
  radius,
  onRadiusChange,
  alamat,
  onAlamatChange,
}: MapPickerProps) {
  const [locationMoved, setLocationMoved] = useState(false);
  const competitorCount = isDemoRadius(radius)
    ? demoMarketMap.competitorCountByRadius[radius]
    : 0;
  const markLocationMoved = useCallback(() => setLocationMoved(true), []);

  return (
    <div>
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
            onChange={(event) => onAlamatChange(event.target.value)}
            aria-label="Cari alamat"
            placeholder="Cari alamat atau tempat…"
            className="w-full rounded-[8px] border border-line bg-surface py-2.5 pl-9 pr-3 text-[14.5px] text-ink-900"
          />
        </div>
      </div>

      <MarketMap radius={radius} onLocationMove={markLocationMoved} />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="label-eyebrow">Radius</span>
        {demoRadiusOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onRadiusChange(option)}
            className={cn(
              "tnum rounded-[8px] border px-3 py-1.5 text-[13px] font-semibold transition-colors",
              radius === option
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-line bg-surface text-ink-500 hover:bg-surface-2",
            )}
          >
            {formatRadius(option)}
          </button>
        ))}
        {locationMoved ? (
          <span className="ml-auto text-[13px] font-semibold text-teal-700">
            Lokasi usaha diperbarui
          </span>
        ) : (
          <span className="tnum ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-600">
            {competitorCount} kompetitor dalam radius
            <span className="group relative inline-flex">
              <button
                type="button"
                aria-label="Lihat sumber jumlah kompetitor"
                className="grid size-5 place-items-center rounded-full border border-line bg-surface text-[10px] font-bold text-ink-400 hover:text-teal-700"
              >
                i
              </button>
              <span className="pointer-events-none absolute bottom-7 right-0 z-20 hidden w-64 rounded-[8px] border border-line bg-surface px-3 py-2 text-left text-[10.5px] font-normal leading-4 text-ink-500 shadow-sm group-focus-within:block group-hover:block">
                Sumber: seed demo · diperbarui {demoMarketMap.source.observedAt} ·
                keyakinan: contoh
              </span>
            </span>
          </span>
        )}
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-ink-400">
        Sumber peta:{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-teal-700 underline underline-offset-2"
        >
          OpenStreetMap contributors
        </a>
        .
      </p>
    </div>
  );
}
