import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function MetricTile({
  label,
  value,
  note,
  undefinedReason,
  undefinedLabel = "Tidak terdefinisi",
}: {
  label: string;
  value: string;
  note?: string;
  /** Kalau terisi, angka tidak terdefinisi dan alasannya wajib tampil. */
  undefinedReason?: string;
  /**
   * Hasil hitungan yang mustahil ditulis "Tidak terdefinisi"; data yang belum
   * pernah diambil ditulis "Tidak tersedia". Keduanya bukan hal yang sama.
   */
  undefinedLabel?: string;
}) {
  return (
    <div className="rounded-[12px] border border-line bg-surface px-4 py-3.5">
      <div className="label-eyebrow mb-1.5">{label}</div>
      {undefinedReason ? (
        <>
          <p className="text-[17px] font-semibold text-ink-500">
            {undefinedLabel}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-warn-600">
            {undefinedReason}
          </p>
        </>
      ) : (
        <>
          <p className="tnum text-[22px] font-bold text-ink-900">{value}</p>
          {note ? (
            <p className="mt-0.5 text-[12px] text-ink-400">{note}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

export function MeterBar({
  label,
  value,
  valueLabel,
  tone = "teal",
}: {
  label: string;
  value: number;
  valueLabel: string;
  tone?: "teal" | "amber";
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-medium text-ink-700">{label}</span>
        <span
          className={cn(
            "tnum text-[13px] font-semibold",
            tone === "amber" ? "text-amber-600" : "text-teal-700",
          )}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className="h-[6px] w-full overflow-hidden rounded-full bg-surface-2"
        role="img"
        aria-label={`${label}: ${valueLabel}`}
      >
        <div
          className={cn(
            "h-full rounded-full",
            tone === "amber" ? "bg-amber-600" : "bg-teal-700",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Callout({
  tone = "warn",
  children,
}: {
  tone?: "warn" | "info" | "danger" | "neutral";
  children: ReactNode;
}) {
  const toneClass = {
    warn: "border-l-warn-600 bg-warn-50/50 text-ink-700",
    info: "border-l-info-600 bg-info-50/50 text-ink-700",
    danger: "border-l-danger-600 bg-danger-50/50 text-ink-700",
    neutral: "border-l-ink-400 bg-surface-2 text-ink-700",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-[8px] border border-line border-l-[3px] px-4 py-3 text-[13.5px] leading-relaxed",
        toneClass,
      )}
    >
      {children}
    </div>
  );
}
