import { cn } from "@/lib/format";
import { SceneReveal } from "./SceneReveal";

const stats = [
  {
    value: "4,85 juta",
    label: "usaha makanan dan minuman di Indonesia",
    source: "BPS · 2023 · rujukan sekunder",
    context: "Skala nasional",
    featured: true,
  },
  {
    value: "23%",
    label: "UMKM F&B memakai perangkat digital untuk analisis pasar",
    source: "BCG & Telkom · 2022 · rujukan sekunder",
    context: "Analisis pasar",
    featured: false,
  },
  {
    value: "70%",
    label: "UMKM masih mengalami kesulitan mencatat transaksi",
    source: "ANTARA · 2025 · rujukan sekunder",
    context: "Pencatatan transaksi",
    featured: false,
  },
] as const;

export function LandingStats({ aktif }: { aktif: boolean }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <SceneReveal
          key={stat.value}
          aktif={aktif}
          delay={index * 120}
          className={cn("h-full", stat.featured && "sm:col-span-2")}
        >
          <div
            className={cn(
              "group relative flex h-full min-h-[170px] flex-col justify-between overflow-hidden rounded-[18px] border p-5 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              stat.featured
                ? "border-ink-900 bg-ink-900 text-white sm:min-h-[184px] sm:p-6"
                : "border-line bg-surface text-ink-900",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={cn(
                  "font-mono text-[10.5px] font-bold uppercase tracking-[0.13em]",
                  stat.featured ? "text-teal-500" : "text-ink-400",
                )}
              >
                {stat.context}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150",
                  stat.featured ? "bg-teal-500" : "bg-ink-900/20",
                )}
              />
            </div>

            <div className="mt-8">
              <dt
                className={cn(
                  "tnum font-serif font-bold leading-none",
                  stat.featured ? "text-[46px] sm:text-[56px]" : "text-[34px]",
                )}
              >
                {stat.value}
              </dt>
              <dd
                className={cn(
                  "mt-3 max-w-[28ch] text-[14px] leading-relaxed",
                  stat.featured ? "text-white/65" : "text-ink-500",
                )}
              >
                {stat.label}
              </dd>
            </div>

            <span
              className={cn(
                "mt-6 block font-mono text-[10.5px]",
                stat.featured ? "text-white/35" : "text-ink-400",
              )}
            >
              {stat.source}
            </span>
          </div>
        </SceneReveal>
      ))}
    </dl>
  );
}
