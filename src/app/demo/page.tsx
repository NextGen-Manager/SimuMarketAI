"use client";

import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { journeys, type JourneyId } from "@/demo/journeys";
import { Button } from "@/components/ui/Button";
import { PageHead } from "@/components/layout/PageHead";

export default function PilihJourney() {
  const router = useRouter();
  const { pilihJourney, reset } = useDemoFlow();

  function mulai(j: JourneyId) {
    reset();
    pilihJourney(j);
    router.push(journeys[j].mulai);
  }

  function bukaDashboard() {
    reset();
    router.push("/demo/dashboard");
  }

  return (
    <div className="mx-auto max-w-[980px] px-6 py-16">
      <PageHead
        judul="Pilih alur yang ingin dilihat"
        sub="SimuMarket AI melayani dua jenis pengguna dengan kebutuhan yang berbeda. Pilih flow untuk mengikuti perjalanan penggunanya dari awal."
        tengah
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {(["A", "B"] as JourneyId[]).map((id) => {
          const j = journeys[id];
          return (
            <div
              key={id}
              className="flex flex-col rounded-[14px] border border-line bg-surface p-6"
            >
              <span className="label-eyebrow">Journey {id}</span>
              <h2 className="mt-2 text-[20px] font-bold tracking-tight text-ink-900">
                {j.nama}
              </h2>
              <p className="mt-3 font-serif text-[16px] italic leading-relaxed text-ink-500">
                “{j.pertanyaan}”
              </p>

              <div className="mt-5 rounded-[10px] border border-line bg-surface-2 px-4 py-3">
                <div className="text-[13px] font-semibold text-ink-900">
                  {j.modul}
                </div>
                <div className="text-[12.5px] text-ink-500">{j.ringkas}</div>
              </div>

              <ol className="mt-4 flex-1 space-y-1.5">
                {j.langkah.map((l, i) => (
                  <li
                    key={l.href + i}
                    className="flex items-start gap-2.5 text-[13.5px] text-ink-500"
                  >
                    <span
                      aria-hidden
                      className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line text-[9px] font-bold text-ink-400"
                    >
                      {i + 1}
                    </span>
                    {l.label}
                  </li>
                ))}
              </ol>

              <Button onClick={() => mulai(id)} className="mt-6 w-full">
                Mulai Flow {id}
                <span aria-hidden>→</span>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-9 flex flex-col items-center border-t border-line pt-7 text-center">
        <p className="text-[12.5px] text-ink-400">
          Ingin langsung melihat kondisi aplikasi setelah usaha memiliki data?
        </p>
        <Button variant="secondary" onClick={bukaDashboard} className="mt-3">
          Buka Dashboard Demo
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
