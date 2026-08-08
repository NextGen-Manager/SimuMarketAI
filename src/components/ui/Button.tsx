"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-teal-700 text-white border-teal-700 hover:bg-teal-600 hover:border-teal-600",
  secondary:
    "bg-surface text-ink-900 border-line hover:bg-surface-2",
  ghost:
    "bg-transparent text-ink-500 border-transparent hover:text-ink-900 hover:bg-surface-2",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45";

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={cn(base, variantClass[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, variantClass[variant], className)}>
      {children}
    </Link>
  );
}
