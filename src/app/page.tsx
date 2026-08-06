"use client";

import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { totalDetik } from "@/demo/useAutoplay";
import { Button, ButtonLink } from "@/components/ui/Button";

const tahapan = [
  {
    no: "01",
    judul: "Masukkan rencana usaha",
    isi: "Unggah proposal yang sudah ada, atau isi manual. Hasil pembacaan AI selalu ditampilkan untuk kamu koreksi lebih dulu.",
  },
  {
    no: "02",
    judul: "Panel agent berdeliberasi",
    isi: "Empat council—pasar, persona pelanggan, finansial, dan laporan—saling mengkritik secara terbuka. Setiap klaim bisa ditantang agent lain.",
  },
  {
    no: "03",
    judul: "Laporan dengan sumber terlihat",
    isi: "Skor kelayakan, proyeksi finansial, dan rekomendasi—lengkap dengan sumber data, waktu pengambilan, dan tingkat keyakinan tiap angka.",
  },
];

export default function Landing() {
  const router = useRouter();
  const { setAutoplay, capai, reset } = useDemoFlow();

  function putarDemo() {
    reset();
    capai("upload");
    setAutoplay(true);
    router.push("/upload");
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero */}
      <section className="border-b border-line py-20 sm:py-28">
        <div className="max-w-[46rem]">
          <p className="label-eyebrow mb-5">
            Decision Support System · UMKM F&amp;B Jabodetabek
          </p>
          <h1 className="text-[38px] font-bold leading-[1.1] tracking-[-0.02em] text-ink-900 text-balance sm:text-[52px]">
            Uji rencana usahamu sebelum modal keluar.
          </h1>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-ink-500">
            SimuMarket AI menjalankan simulasi multi-agent atas rencana usahamu,
            lalu mengeluarkan skor kesiapan, proyeksi finansial, dan rekomendasi
            — dengan sumber dan tingkat keyakinan yang bisa kamu periksa satu per
            satu.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={putarDemo} className="px-5 py-3">
              Putar Demo Otomatis
              <span aria-hidden>→</span>
            </Button>
            <ButtonLink href="/upload" variant="secondary" className="px-5 py-3">
              Jalankan Sendiri
            </ButtonLink>
            <span className="text-[13px] text-ink-400">
              sekitar {totalDetik} detik, berhenti kapan saja
            </span>
          </div>

          <p className="mt-8 max-w-[40rem] rounded-[10px] border border-line border-l-[3px] border-l-amber-600 bg-surface px-4 py-3 text-[13.5px] leading-relaxed text-ink-500">
            <span className="font-semibold text-ink-900">Ini mode demo.</span>{" "}
            Tidak ada AI yang dijalankan dan tidak ada angka yang dihitung —
            seluruh isinya data contoh yang sudah ditulis sebelumnya, dipakai
            untuk memperlihatkan alur aplikasi.
          </p>
        </div>
      </section>

      {/* Tahapan */}
      <section className="py-16 sm:py-20">
        <h2 className="mb-10 text-[22px] font-semibold tracking-tight text-ink-900">
          Yang akan kamu lihat
        </h2>
        <ol className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-3">
          {tahapan.map((t) => (
            <li key={t.no} className="bg-surface p-6">
              <span className="font-mono text-[12px] font-semibold text-teal-700">
                {t.no}
              </span>
              <h3 className="mt-3 text-[16px] font-semibold text-ink-900">
                {t.judul}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
                {t.isi}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Batas produk */}
      <section className="border-t border-line py-16">
        <div className="grid gap-10 sm:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink-900 text-balance">
            Alat bantu keputusan, bukan peramal
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-ink-500">
            <p>
              Skor, titik impas, dan marjin dihitung kode deterministik yang bisa
              diaudit — bukan dikarang model bahasa. Agent boleh mengkritik
              angka, tidak boleh membuatnya.
            </p>
            <p>
              Respons persona adalah data sintetis untuk mengeksplorasi
              keberatan, bukan hasil survei pelanggan nyata. Setiap angka yang
              tampil membawa sumber, waktu pengambilan, dan tingkat keyakinannya.
            </p>
            <p className="text-ink-400">
              Hasil tetap perlu diverifikasi di lapangan sebelum kamu mengambil
              keputusan investasi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
