"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StepperNav } from "./StepperNav";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect width="24" height="24" rx="6" className="fill-teal-700" />
      <path
        d="M6 15.5 L10 10.5 L13.5 13.5 L18 7.5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { autoplay, reset } = useDemoFlow();
  useAutoplay();

  const diLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Mark />
          <span className="text-[16px] font-bold tracking-tight text-ink-900">
            SimuMarket AI
          </span>
        </Link>

        {!diLanding ? <StepperNav /> : null}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span
            className="rounded-full border border-amber-600/40 bg-amber-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-600"
            title="Seluruh data pada layar ini adalah contoh, bukan hasil analisis nyata."
          >
            MODE DEMO
          </span>
          {autoplay ? (
            <span className="hidden text-[12px] font-medium text-teal-700 sm:inline">
              memutar…
            </span>
          ) : null}
          {!diLanding ? (
            <button
              onClick={reset}
              className="hidden rounded-[8px] border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink-500 hover:bg-surface-2 hover:text-ink-900 sm:block"
            >
              Ulang
            </button>
          ) : null}
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-[12px] font-bold text-ink-500"
          >
            R
          </span>
        </div>
      </div>
    </header>
  );
}
