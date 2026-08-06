"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { FieldLabel } from "@/components/ui/Field";
import { PageHead } from "@/components/layout/PageHead";
import { cn } from "@/lib/format";

const sumberBukti = [
  { nama: "Kompetitor (OpenStreetMap)", status: "ok", nilai: "18 POI · radius 1,5 km" },
  { nama: "Populasi (BPS)", status: "degraded", nilai: "hanya sampai kecamatan" },
  { nama: "Harga pembanding", status: "degraded", nilai: "4 observasi · di bawah ambang" },
  { nama: "Traffic pejalan kaki", status: "missing", nilai: "tidak tersedia" },
];

const statusMeta = {
  ok: { label: "Tersedia", cls: "text-success-600" },
  degraded: { label: "Terbatas", cls: "text-warn-600" },
  missing: { label: "Kosong", cls: "text-danger-600" },
} as const;

export default function Pasar() {
  const router = useRouter();
  const { capai } = useDemoFlow();
  const [cohort, setCohort] = useState(16);
  const [round, setRound] = useState(4);

  useEffect(() => {
    capai("pasar");
  }, [capai]);

  return (
    <div className="mx-auto max-w-[980px] px-6 py-12">
      <PageHead
        judul="Setup Pasar"
        sub="Lengkapi parameter yang tidak ada di dokumen, lalu periksa kualitas bukti sebelum simulasi dijalankan."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Area & Operasi" icon={<span aria-hidden>◈</span>} />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Area Target</FieldLabel>
                <p className="text-[15px] text-ink-900">Tebet, Jakarta Selatan</p>
              </div>
              <div>
                <FieldLabel>Radius Analisis</FieldLabel>
                <p className="tnum text-[15px] text-ink-900">1.500 m</p>
              </div>
              <div>
                <FieldLabel>Jam Operasi</FieldLabel>
                <p className="text-[15px] text-ink-900">07.00 – 22.00</p>
              </div>
              <div>
                <FieldLabel>Hari Operasi / Bulan</FieldLabel>
                <p className="tnum text-[15px] text-ink-900">26 hari</p>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Kanal</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {["Dine-in", "Takeaway", "Delivery"].map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-teal-700/30 bg-teal-50 px-3 py-1 text-[12.5px] font-medium text-teal-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Volume Harian"
              icon={<span aria-hidden>▲</span>}
              aside={
                <span className="text-[12px] text-ink-400">
                  rentang, bukan angka tunggal
                </span>
              }
            />
            <CardBody>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Minimum", v: 40 },
                  { l: "Base", v: 60 },
                  { l: "Maksimum", v: 75 },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 text-center"
                  >
                    <div className="label-eyebrow mb-1">{x.l}</div>
                    <p className="tnum text-[19px] font-bold text-ink-900">
                      {x.v}
                    </p>
                    <p className="text-[11.5px] text-ink-400">cup/hari</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-400">
                Finance Council membutuhkan batas bawah dan atas untuk menyusun
                skenario konservatif dan optimis.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Cakupan Simulasi" icon={<span aria-hidden>◉</span>} />
            <CardBody className="space-y-4">
              <div>
                <FieldLabel>Ukuran Cohort Persona</FieldLabel>
                <div className="flex gap-2">
                  {[12, 16, 24].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCohort(n)}
                      className={cn(
                        "tnum rounded-[8px] border px-4 py-2 text-[14px] font-semibold transition-colors",
                        cohort === n
                          ? "border-teal-700 bg-teal-700 text-white"
                          : "border-line bg-surface text-ink-500 hover:bg-surface-2",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Jumlah Round</FieldLabel>
                <div className="flex gap-2">
                  {[3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRound(n)}
                      className={cn(
                        "tnum rounded-[8px] border px-4 py-2 text-[14px] font-semibold transition-colors",
                        round === n
                          ? "border-teal-700 bg-teal-700 text-white"
                          : "border-line bg-surface text-ink-500 hover:bg-surface-2",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Pratinjau kualitas bukti sebelum run */}
        <div>
          <Card tone="muted">
            <CardHeader title="Kualitas Bukti" icon={<span aria-hidden>◇</span>} />
            <CardBody className="space-y-3">
              <div className="rounded-[10px] border border-line bg-surface px-4 py-3">
                <div className="label-eyebrow mb-1">Perkiraan Confidence</div>
                <p className="tnum text-[28px] font-bold text-amber-600">0,58</p>
                <p className="text-[13px] font-medium text-ink-500">Sedang</p>
              </div>

              <ul className="space-y-2">
                {sumberBukti.map((s) => {
                  const m = statusMeta[s.status as keyof typeof statusMeta];
                  return (
                    <li
                      key={s.nama}
                      className="rounded-[8px] border border-line bg-surface px-3 py-2"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-medium text-ink-900">
                          {s.nama}
                        </span>
                        <span className={cn("text-[11.5px] font-semibold", m.cls)}>
                          {m.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-ink-400">{s.nilai}</p>
                    </li>
                  );
                })}
              </ul>

              <Callout tone="warn">
                Confidence sedang. Hasil dapat dipakai untuk mempersempit pilihan,
                tetapi belum cukup untuk keputusan akhir tanpa cek lapangan.
              </Callout>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => {
            capai("simulasi");
            router.push("/simulasi");
          }}
        >
          Jalankan Simulasi
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
