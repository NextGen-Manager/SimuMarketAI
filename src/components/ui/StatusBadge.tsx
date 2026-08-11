import { cn } from "@/lib/format";

export type FieldStatus =
  | "terdeteksi"
  | "perlu-dikonfirmasi"
  | "perlu-dilengkapi"
  | "tidak-tersedia";

const config: Record<
  FieldStatus,
  { label: string; className: string; icon: string }
> = {
  terdeteksi: {
    label: "Terdeteksi",
    className: "bg-success-50 text-success-600 border-success-600/25",
    icon: "✓",
  },
  "perlu-dikonfirmasi": {
    label: "Perlu dikonfirmasi",
    className: "bg-info-50 text-info-600 border-info-600/25",
    icon: "i",
  },
  "perlu-dilengkapi": {
    label: "Perlu dilengkapi",
    className: "bg-danger-50 text-danger-600 border-danger-600/25",
    icon: "!",
  },
  "tidak-tersedia": {
    label: "Tidak tersedia",
    className: "bg-warn-50 text-warn-600 border-warn-600/25",
    icon: "!",
  },
};

/**
 * Warna tidak pernah menjadi satu-satunya pembawa makna:
 * setiap badge membawa ikon dan teks.
 */
export function StatusBadge({
  status,
  label,
}: {
  status: FieldStatus;
  label?: string;
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold",
        c.className,
      )}
    >
      <span aria-hidden className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[9px] leading-none">
        {c.icon}
      </span>
      {label ?? c.label}
    </span>
  );
}
