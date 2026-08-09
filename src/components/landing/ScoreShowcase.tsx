import { ScoreGauge } from "@/components/ui/Gauge";
import { SceneReveal } from "./SceneReveal";

const outputs = [
  "Breakdown kesiapan",
  "Tingkat keyakinan",
  "Risiko utama",
  "Langkah berikutnya",
] as const;

export function ScoreShowcase({ aktif }: { aktif: boolean }) {
  return (
    <SceneReveal aktif={aktif} className="w-full max-w-[430px]">
      <div className="rounded-[18px] border border-white/15 bg-white/[0.08] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
            Contoh keluaran
          </p>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[10px] font-bold tracking-wide text-amber-400">
            CONTOH DATA
          </span>
        </div>

        <div className="mt-2 flex justify-center">
          <ScoreGauge nilai={68} interpretasi="Layak dengan mitigasi" ukuran={220} />
        </div>

        <p className="mt-1 text-center font-mono text-[10.5px] text-white/35">
          Aturan contoh · lrs-v0.1-unvalidated · bukan hasil analisis nyata
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          {outputs.map((output, index) => (
            <SceneReveal key={output} aktif={aktif} delay={300 + index * 90}>
              <div className="flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="text-[12px] text-white/65">{output}</span>
              </div>
            </SceneReveal>
          ))}
        </div>
      </div>
    </SceneReveal>
  );
}
