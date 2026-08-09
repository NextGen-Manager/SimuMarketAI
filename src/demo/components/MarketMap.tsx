"use client";

import dynamic from "next/dynamic";

type MarketMapProps = {
  radius: number;
  onLocationMove: () => void;
};

const LeafletMarketMap = dynamic(
  () =>
    import("@/demo/components/LeafletMarketMap").then(
      (module) => module.LeafletMarketMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid h-[320px] w-full place-items-center rounded-[10px] border border-line bg-surface-2"
        aria-live="polite"
      >
        <div className="text-center">
          <span className="mx-auto block h-2 w-28 animate-pulse rounded-full bg-line" aria-hidden />
          <p className="mt-3 text-[12px] font-semibold text-ink-400">
            Memuat peta OpenStreetMap…
          </p>
        </div>
      </div>
    ),
  },
);

export function MarketMap({ radius, onLocationMove }: MarketMapProps) {
  return (
    <LeafletMarketMap radius={radius} onLocationMove={onLocationMove} />
  );
}
