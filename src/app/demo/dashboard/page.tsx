"use client";

import Link from "next/link";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { journeys } from "@/demo/journeys";
import { modul } from "@/demo/data/education";
import { AMBANG_HARI } from "@/demo/data/transactions";
import { PageHead } from "@/components/layout/PageHead";
import { cn } from "@/lib/format";

export default function Dashboard() {
  const { journey, modulSelesai, hariTercatat, gerbangTerbuka } = useDemoFlow();
  useAutoplay();

  const sorotA = journey === "A";
  const sorotB = journey === "B";

  const modules = [
    {
      id: "A",
      judul: "Market Analysis",
      isi: "Uji kelayakan lokasi, harga, dan modal sebelum usaha dibuka.",
      status: gerbangTerbuka
        ? "Modul edukasi wajib sudah selesai"
        : "Modul edukasi wajib belum selesai",
      statusTone: gerbangTerbuka ? "text-success-600" : "text-warn-600",
      href: journeys.A.mulai,
      cta: "Mulai analisis",
      sorot: sorotA,
    },
    {
      id: "B",
      judul: "Transaction Management",
      isi: "Catat penjualan harian dan lihat produk mana yang benar-benar jalan.",
      status: `${hariTercatat} dari ${AMBANG_HARI} hari data tercatat`,
      statusTone:
        hariTercatat >= AMBANG_HARI ? "text-success-600" : "text-ink-500",
      href: journeys.B.mulai,
      cta: "Buka transaksi",
      sorot: sorotB,
    },
    {
      id: "E",
      judul: "Edukasi Bisnis F&B",
      isi: "Empat topik singkat: perizinan, harga, bahan baku, dan pelanggan awal.",
      status: `${modulSelesai.size} dari ${modul.length} topik selesai`,
      statusTone: "text-ink-500",
      href: "/demo/edukasi",
      cta: "Lanjut belajar",
      sorot: false,
    },
  ];

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-14">
      <PageHead
        judul="Dashboard"
        sub={
          journey
            ? `Alur yang dipilih: Journey ${journey} — ${journeys[journey].nama}. Modul yang relevan disorot, dua lainnya tetap bisa dibuka.`
            : "Tiga modul SimuMarket AI."
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className={cn(
              "group flex flex-col rounded-[14px] border bg-surface p-6 transition-colors",
              m.sorot
                ? "border-teal-700/50 ring-1 ring-teal-700/15"
                : "border-line hover:border-ink-400/40",
            )}
          >
            {m.sorot ? (
              <span className="mb-3 w-fit rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-teal-700">
                ALUR TERPILIH
              </span>
            ) : null}
            <h2 className="text-[17px] font-bold text-ink-900">{m.judul}</h2>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">
              {m.isi}
            </p>
            <p className={cn("mt-4 text-[12.5px] font-semibold", m.statusTone)}>
              {m.status}
            </p>
            <span className="mt-3 text-[13.5px] font-semibold text-teal-700">
              {m.cta} <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>

      {!gerbangTerbuka ? (
        <div className="mt-6 rounded-[10px] border border-line border-l-[3px] border-l-warn-600 bg-surface px-4 py-3 text-[13.5px] leading-relaxed text-ink-500">
          <span className="font-semibold text-ink-900">
            Market Analysis terkunci.
          </span>{" "}
          Dua modul edukasi wajib — Perizinan dan Legalitas, serta Strategi
          Penetapan Harga — harus diselesaikan lebih dulu. Ini gerbang F-09,
          bukan peringatan yang bisa dilewati.
        </div>
      ) : null}
    </div>
  );
}
