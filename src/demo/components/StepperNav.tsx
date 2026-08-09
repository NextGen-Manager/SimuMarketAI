"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { stepsFor } from "@/demo/journeys";
import { cn } from "@/lib/format";

/**
 * Stepper adalah navigasi, bukan dekorasi: tahap yang sudah dilewati
 * dapat diklik, tahap di depan dinonaktifkan.
 */
export function StepperNav() {
  const pathname = usePathname();
  const { journey, langkahSelesai } = useDemoFlow();

  if (!journey) return null;
  const steps = stepsFor(journey);
  const aktifIdx = steps.findIndex((step) => {
    const paths = "paths" in step ? step.paths : [step.href];
    return paths.some((path) => pathname === path);
  });
  if (aktifIdx === -1) return null;

  return (
    <nav aria-label="Tahap" className="min-w-0">
      <ol className="flex items-center gap-0.5 overflow-x-auto">
        {steps.map((s, i) => {
          const aktif = i === aktifIdx;
          const terbuka = i <= aktifIdx || langkahSelesai.has(s.id);
          const konten = (
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors",
                aktif
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : terbuka
                    ? "font-medium text-ink-500 hover:bg-surface-2 hover:text-ink-900"
                    : "text-ink-400/60",
              )}
            >
              {aktif ? (
                <span
                  aria-hidden
                  className="mr-1.5 inline-grid h-4 w-4 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white"
                >
                  {i + 1}
                </span>
              ) : null}
              {s.label}
            </span>
          );

          return (
            <li key={s.id} className="flex items-center">
              {terbuka && !aktif ? (
                <Link href={s.href}>{konten}</Link>
              ) : (
                <span aria-current={aktif ? "step" : undefined}>{konten}</span>
              )}
              {i < steps.length - 1 ? (
                <span aria-hidden className="px-0.5 text-[12px] text-ink-400/50">
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
