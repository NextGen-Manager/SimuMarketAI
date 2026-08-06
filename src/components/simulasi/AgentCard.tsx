import { councilMeta, type Aktivitas } from "@/demo/data/simulation";
import { cn, formatDetik } from "@/lib/format";

function inisial(agent?: string) {
  if (!agent) return "··";
  const bagian = agent.split("-");
  return (bagian[0]?.[0] ?? "a").toUpperCase() + (bagian[1]?.[0] ?? "1").toUpperCase();
}

function Avatar({ aktivitas }: { aktivitas: Aktivitas }) {
  const meta = councilMeta[aktivitas.council];
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[10px] font-bold",
        meta.bg,
        meta.warna,
      )}
    >
      {inisial(aktivitas.agent)}
    </span>
  );
}

/**
 * Tidak semua action layak jadi kartu penuh — kalau tidak, feed jadi derau.
 * Bentuk per jenis mengikuti tabel di dokumen 13.
 */
export function AgentCard({
  aktivitas,
  waktu,
}: {
  aktivitas: Aktivitas;
  waktu: number;
}) {
  const meta = councilMeta[aktivitas.council];

  // Reaksi ringan digabung jadi satu baris.
  if (aktivitas.jenis === "like") {
    return (
      <div className="animate-feed-in flex items-center gap-2.5 px-1 py-1.5 text-[13px] text-ink-500">
        <span aria-hidden className="flex -space-x-1">
          {aktivitas.agents?.slice(0, 3).map((a) => (
            <span
              key={a}
              className={cn(
                "grid h-5 w-5 place-items-center rounded-[5px] border border-surface text-[8px] font-bold",
                meta.bg,
                meta.warna,
              )}
            >
              {inisial(a)}
            </span>
          ))}
        </span>
        <span>
          {aktivitas.agents?.length} persona menyukai{" "}
          <span className="font-mono text-[12px] text-ink-400">
            {aktivitas.target}
          </span>
        </span>
      </div>
    );
  }

  // Satu-satunya action yang diberi warna — sinyal terpenting.
  if (aktivitas.jenis === "purchase") {
    return (
      <div className="animate-feed-in flex items-center gap-2.5 rounded-[8px] border border-amber-600/30 bg-amber-50 px-3 py-2 text-[13px]">
        <Avatar aktivitas={aktivitas} />
        <span className="text-ink-700">
          <span className="font-semibold text-amber-600">
            {aktivitas.agent}
          </span>{" "}
          membeli{" "}
          <span className="font-mono text-[12px]">{aktivitas.target}</span>
        </span>
      </div>
    );
  }

  if (aktivitas.jenis === "ringkasan") {
    return (
      <div className="animate-feed-in px-1 py-1.5 text-[12.5px] italic text-ink-400">
        {aktivitas.teks}
      </div>
    );
  }

  // Kartu sistem, bukan kartu agent.
  if (aktivitas.jenis === "tool") {
    return (
      <div className="animate-feed-in rounded-[8px] border border-line bg-surface-2 px-3 py-2">
        <p className="font-mono text-[12px] leading-relaxed text-ink-500">
          <span className="text-teal-700">⌘</span> {aktivitas.teks}
        </p>
      </div>
    );
  }

  const menantang = aktivitas.jenis === "challenge";

  return (
    <article
      className={cn(
        "animate-feed-in rounded-[10px] border bg-surface px-4 py-3",
        menantang ? "border-line border-l-[3px] border-l-ink-400" : "border-line",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar aktivitas={aktivitas} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-mono text-[12.5px] font-semibold text-ink-900">
              {aktivitas.agent}
            </span>
            {aktivitas.label ? (
              <span className="text-[12.5px] text-ink-500">
                · {aktivitas.label}
              </span>
            ) : null}
            <span className="ml-auto shrink-0 text-[11.5px] text-ink-400">
              R{aktivitas.round} ·{" "}
              {menantang ? (
                <span className="font-medium text-ink-500">
                  menantang #{aktivitas.refs}
                </span>
              ) : aktivitas.klaim ? (
                <span className="font-medium text-ink-500">
                  klaim #{aktivitas.klaim}
                </span>
              ) : (
                "komentar"
              )}{" "}
              · <span className="tnum">{formatDetik(waktu)}</span>
            </span>
          </div>

          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-700">
            {aktivitas.teks}
          </p>

          {aktivitas.keberatan ? (
            <div className="mt-2 flex justify-end">
              <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11.5px] font-medium text-ink-500">
                keberatan: {aktivitas.keberatan}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
