"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { steps } from "@/demo/steps";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { cn } from "@/lib/format";

/**
 * Stepper adalah navigasi, bukan dekorasi: tahap yang sudah dilewati
 * dapat diklik, tahap di depan tahap aktif dinonaktifkan.
 */
export function StepperNav() {
  const pathname = usePathname();
  const { maxStep } = useDemoFlow();
  const aktifIdx = steps.findIndex((s) => pathname.startsWith(s.href));

  return (
    <nav aria-label="Tahap analisis" className="min-w-0">
      <ol className="flex items-center gap-1 overflow-x-auto">
        {steps.map((s, i) => {
          const aktif = i === aktifIdx;
          const terbuka = i <= maxStep;
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
              {s.short}
            </span>
          );

          return (
            <li key={s.id} className="flex items-center">
              {terbuka && !aktif ? (
                <Link href={s.href} aria-current={undefined}>
                  {konten}
                </Link>
              ) : (
                <span aria-current={aktif ? "step" : undefined} aria-disabled={!terbuka}>
                  {konten}
                </span>
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
