import { cn } from "@/lib/format";
import { SceneReveal } from "./SceneReveal";

const journeys = [
  {
    label: "BARU MEMULAI",
    title: "Uji sebelum membuka",
    steps: ["Analisis", "Pelajari", "Putuskan"],
    accent: "text-teal-500",
    marker: "border-teal-500/50 bg-teal-500/10",
  },
  {
    label: "SUDAH BERJALAN",
    title: "Kembangkan dari penjualan",
    steps: ["Catat", "Baca", "Kembangkan"],
    accent: "text-amber-500",
    marker: "border-amber-500/50 bg-amber-500/10",
  },
] as const;

export function JourneyPaths({ aktif }: { aktif: boolean }) {
  return (
    <div className="space-y-3">
      {journeys.map((journey, journeyIndex) => (
        <SceneReveal
          key={journey.label}
          aktif={aktif}
          delay={journeyIndex * 160}
        >
          <article className="rounded-[14px] border border-white/10 bg-white/[0.05] p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p
                className={cn(
                  "font-mono text-[10.5px] font-bold tracking-[0.14em]",
                  journey.accent,
                )}
              >
                {journey.label}
              </p>
              <h3 className="text-[14px] font-semibold text-white/90">
                {journey.title}
              </h3>
            </div>

            <ol className="mt-4 grid grid-cols-3 gap-2">
              {journey.steps.map((step, index) => (
                <li key={step} className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold text-white/80",
                      journey.marker,
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate text-[12.5px] font-medium text-white/65">
                    {step}
                  </span>
                  {index < journey.steps.length - 1 ? (
                    <span aria-hidden className="ml-auto text-white/25">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        </SceneReveal>
      ))}
    </div>
  );
}
