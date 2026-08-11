import { councilMeta, type Council, type Langkah } from "@/demo/data/simulation";
import { cn } from "@/lib/format";

const urutan: Council[] = ["market", "persona", "finance", "report"];

/**
 * Proposal §7.3 meminta status keempat agen terlihat selama proses.
 * Strip ini membuat klaim "empat agent" terbaca dalam dua detik,
 * tanpa pengguna perlu membaca feed.
 */
export function AgentStrip({
  aktivitas,
  selesai,
  gagal,
}: {
  aktivitas: Langkah[];
  selesai: boolean;
  gagal?: Council | null;
}) {
  const hitung = new Map<Council, number>();
  let terakhir: Council | null = null;

  for (const l of aktivitas) {
    const c = l.aktivitas?.council;
    if (!c) continue;
    hitung.set(c, (hitung.get(c) ?? 0) + 1);
    terakhir = c;
  }

  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {urutan.map((c) => {
        const n = hitung.get(c) ?? 0;
        const gagalIni = gagal === c;
        const aktif = !selesai && terakhir === c && !gagalIni;
        const sudah = n > 0;

        return (
          <li
            key={c}
            className={cn(
              "rounded-[10px] border bg-surface px-3 py-2.5 transition-colors",
              gagalIni
                ? "border-warn-600/50 bg-warn-50/40"
                : aktif
                  ? "border-teal-700/50 ring-1 ring-teal-700/15"
                  : sudah
                    ? "border-line"
                    : "border-line opacity-60",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  gagalIni
                    ? "bg-warn-600"
                    : aktif
                      ? "animate-pulse bg-teal-700"
                      : sudah
                        ? "bg-success-600"
                        : "bg-ink-400/40",
                )}
              />
              <span className="truncate text-[12.5px] font-semibold text-ink-900">
                {councilMeta[c].nama}
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-ink-400">
              {gagalIni
                ? "gagal karena timeout"
                : aktif
                  ? "sedang bekerja"
                  : n > 0
                    ? `${n} aksi tercatat`
                    : "menunggu"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
