import type { ReactNode } from "react";
import { cn } from "@/lib/format";

type Tone = "default" | "muted" | "invalid" | "key";

const toneClass: Record<Tone, string> = {
  default: "bg-surface border-line",
  muted: "bg-surface-2 border-line",
  invalid: "bg-surface border-danger-600/40",
  key: "bg-surface border-teal-700/35",
};

export function Card({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  icon,
  aside,
}: {
  title: string;
  icon?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-teal-50 text-teal-700">
            {icon}
          </span>
        ) : null}
        <h3 className="text-[17px] font-semibold text-ink-900">{title}</h3>
      </div>
      {aside}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}
