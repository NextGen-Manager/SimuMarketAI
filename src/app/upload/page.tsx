"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { Button } from "@/components/ui/Button";
import { PageHead } from "@/components/layout/PageHead";

const contoh = [
  { nama: "Proposal-Kopi-Senja.pdf", ukuran: "1,2 MB", jenis: "PDF" },
  { nama: "Estimasi-Biaya.xlsx", ukuran: "84 KB", jenis: "XLSX" },
];

export default function Upload() {
  const router = useRouter();
  const { tandaiSelesai } = useDemoFlow();
  const [terunggah, setTerunggah] = useState(false);

  useEffect(() => {
    tandaiSelesai("upload");
  }, [tandaiSelesai]);

  return (
    <div className="mx-auto max-w-[880px] px-6 py-14">
      <PageHead
        judul="Mulai dari dokumen yang sudah kamu punya"
        sub="Unggah proposal, rencana usaha, atau catatan biaya. Sistem akan membacanya menjadi ringkasan terstruktur yang bisa kamu koreksi."
      />

      {!terunggah ? (
        <div className="rounded-[12px] border-2 border-dashed border-line bg-surface px-8 py-14 text-center">
          <div
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-[10px] bg-teal-50 text-[20px] text-teal-700"
          >
            ↑
          </div>
          <p className="mt-4 text-[15px] font-medium text-ink-900">
            Seret berkas ke sini, atau pilih dari perangkat
          </p>
          <p className="mt-1.5 text-[13px] text-ink-400">
            PDF, DOCX, MD, TXT, atau foto — maksimum 10 MB per berkas
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setTerunggah(true)}>Pakai dokumen contoh</Button>
            <Button variant="secondary" onClick={() => router.push("/analisis/konfirmasi")}>
              Isi manual saja
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {contoh.map((f) => (
            <div
              key={f.nama}
              className="flex items-center gap-4 rounded-[12px] border border-line bg-surface px-5 py-4"
            >
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-surface-2 font-mono text-[10px] font-bold text-ink-500"
              >
                {f.jenis}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-medium text-ink-900">
                  {f.nama}
                </p>
                <p className="text-[12.5px] text-ink-400">{f.ukuran}</p>
              </div>
              <span className="shrink-0 text-[13px] font-semibold text-success-600">
                ✓ Siap
              </span>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                tandaiSelesai("baca");
                router.push("/analisis/baca");
              }}
            >
              Baca Dokumen
              <span aria-hidden>→</span>
            </Button>
          </div>
        </div>
      )}

      <p className="mt-8 text-[13px] leading-relaxed text-ink-400">
        Dokumen disimpan sebagai objek privat dan tidak pernah dikirim utuh ke
        penyedia AI. Isi teks bebas diperlakukan sebagai data, bukan instruksi.
      </p>
    </div>
  );
}
