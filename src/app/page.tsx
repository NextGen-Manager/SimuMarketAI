"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PersonaField } from "@/components/landing/PersonaField";
import { useCountUp, useFase, useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/format";

function Mark({ terang = false }: { terang?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect
        width="24"
        height="24"
        rx="6"
        fill={terang ? "white" : "var(--color-teal-700)"}
      />
      <path
        d="M6 15.5 L10 10.5 L13.5 13.5 L18 7.5"
        fill="none"
        stroke={terang ? "var(--color-ink-900)" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Nav() {
  const [lewat, setLewat] = useState(false);

  useEffect(() => {
    const f = () => setLewat(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        lewat ? "border-b border-line bg-canvas/85 backdrop-blur" : "",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-[16px] font-bold tracking-tight text-ink-900">
            SimuMarket AI
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-[9px] px-3.5 py-2 text-[14px] font-semibold text-ink-500 transition-colors hover:bg-surface-2 hover:text-ink-900"
          >
            Masuk
          </Link>
          <Link
            href="/demo"
            className="rounded-[9px] bg-teal-700 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-teal-600"
          >
            Coba Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, terlihat } = useReveal<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        terlihat ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const { ref: faseRef, fase } = useFase<HTMLDivElement>();
  const faseKohort: 0 | 1 | 2 = fase < 0.34 ? 0 : fase < 0.62 ? 1 : 2;

  const skor = useCountUp(68, 1400);

  return (
    <>
      <Nav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,var(--color-teal-50),transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-[1180px] gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="label-eyebrow mb-6">
              Decision Support System · UMKM F&amp;B Jabodetabek
            </p>
            <h1 className="font-serif text-[44px] font-bold leading-[1.04] tracking-[-0.02em] text-ink-900 text-balance sm:text-[62px]">
              Uji dulu.
              <br />
              Baru keluarkan modal.
            </h1>
            <p className="mt-7 max-w-[34rem] text-[17px] leading-[1.65] text-ink-500">
              Enam belas pelanggan sintetis menilai rencana usahamu — harga,
              lokasi, dan menunya — lalu mesin deterministik menghitung
              kelayakannya. Setiap angka membawa sumber dan tingkat
              keyakinannya.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 rounded-[11px] bg-teal-700 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-teal-600"
              >
                Coba Demo
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-[11px] border border-line bg-surface px-6 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-surface-2"
              >
                Masuk
              </Link>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-ink-400">
              Demo berjalan tanpa akun dan tanpa data aslimu.
            </p>
          </div>

          {/* Kohort persona */}
          <div className="relative rounded-[16px] border border-line bg-surface p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="label-eyebrow">Kohort persona</span>
              <span className="font-mono text-[11.5px] text-ink-400">
                16 agen · 4 arketipe
              </span>
            </div>
            <div className="rounded-[12px] bg-ink-900 p-2">
              <PersonaField fase={0} padat />
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-400">
              Bukan satu jawaban dari satu prompt. Populasi heterogen yang
              berdebat, lalu perbedaannya dihitung.
            </p>
          </div>
        </div>
      </section>

      {/* ── Masalah ────────────────────────────────────────────── */}
      <section className="border-t border-line py-20 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-6">
          <Reveal>
            <h2 className="max-w-[24ch] font-serif text-[30px] font-bold leading-[1.15] tracking-[-0.01em] text-ink-900 text-balance sm:text-[38px]">
              Sektor paling diminati, sekaligus paling sering ditebak.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
            {[
              {
                angka: "4,85 juta",
                label: "usaha makanan dan minuman di Indonesia",
                sumber: "BPS, 2023",
              },
              {
                angka: "21,13%",
                label: "pertumbuhan jumlah usaha sejak 2016",
                sumber: "BPS, 2024",
              },
              {
                angka: "99,5%",
                label: "nilai penjualan sektor ini berasal dari UKM",
                sumber: "BPS, 2024",
              },
            ].map((s, i) => (
              <Reveal key={s.angka} delay={i * 90}>
                <div className="h-full bg-surface p-7">
                  <p className="tnum font-serif text-[36px] font-bold leading-none text-ink-900">
                    {s.angka}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
                    {s.label}
                  </p>
                  <p className="mt-3 font-mono text-[11.5px] text-ink-400">
                    {s.sumber}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-10 max-w-[58ch] text-[16px] leading-[1.7] text-ink-500">
              Modalnya terjangkau dan modelnya terasa jelas, jadi banyak orang
              masuk. Yang jarang tersedia justru bagian paling menentukan:
              gambaran seberapa padat pesaing di lokasi itu, apakah harganya
              masuk akal untuk daerah tersebut, dan berapa lama modal kembali.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Simulasi (gelap) ───────────────────────────────────── */}
      <section
        ref={faseRef}
        className="relative overflow-hidden bg-ink-900 py-24 sm:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1180px] px-6">
          <Reveal>
            <p className="mb-5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-teal-500">
              Di dalam simulasi
            </p>
            <h2 className="max-w-[20ch] font-serif text-[32px] font-bold leading-[1.12] tracking-[-0.01em] text-white text-balance sm:text-[44px]">
              Mereka tidak sepakat. Itu justru gunanya.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[16.5px] leading-[1.7] text-white/60">
              Setiap persona menilai sendiri lebih dulu, lalu melihat pendapat
              yang lain, lalu diwawancarai. Perbedaan pendapatnya disimpan —
              bukan dirata-ratakan sampai hilang.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-5">
              <PersonaField fase={faseKohort} />
            </div>

            <ol className="space-y-3">
              {[
                {
                  n: "00",
                  j: "Penilaian mandiri",
                  d: "Tiap persona menjawab sebelum melihat jawaban siapa pun. Mencegah satu suara mendominasi.",
                },
                {
                  n: "01",
                  j: "Paparan konsep",
                  d: "Kartu konsep yang sama ditunjukkan ke semuanya — harga, menu, lokasi, jam buka.",
                },
                {
                  n: "02",
                  j: "Saling menantang",
                  d: "Klaim satu agen bisa ditolak agen lain. Yang ditantang wajib merujuk bukti.",
                },
                {
                  n: "03",
                  j: "Intervensi terkendali",
                  d: "Satu variabel diubah — misalnya harga — sisanya dikunci, supaya efeknya bisa dibaca.",
                },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <li className="flex gap-4 rounded-[12px] border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/15">
                    <span className="font-mono text-[12px] font-bold text-teal-500">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-white/90">
                        {s.j}
                      </h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-white/50">
                        {s.d}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={140}>
            <p className="mt-12 max-w-[56ch] border-l-2 border-teal-500/40 pl-5 text-[14px] leading-relaxed text-white/45">
              Kutipan persona adalah data sintetis untuk menemukan keberatan yang
              mungkin muncul — bukan hasil survei pelanggan nyata, dan belum
              dikalibrasi terhadap wawancara manusia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Angka deterministik ────────────────────────────────── */}
      <section className="border-b border-line py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div
              ref={skor.ref}
              className="rounded-[16px] border border-line bg-surface p-8 text-center"
            >
              <p className="label-eyebrow mb-4">Launch Readiness Score</p>
              <p className="tnum font-serif text-[76px] font-bold leading-none text-amber-600">
                {skor.nilai}
              </p>
              <p className="mt-1 text-[13px] font-medium text-ink-400">
                dari 100
              </p>
              <p className="mt-4 inline-block rounded-full border border-warn-600/30 bg-warn-50 px-3.5 py-1.5 text-[13px] font-semibold text-warn-600">
                Layak dengan mitigasi
              </p>
              <p className="mt-5 font-mono text-[11px] text-ink-400">
                lrs-v0.1-unvalidated · bobot belum divalidasi ahli
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="max-w-[22ch] font-serif text-[30px] font-bold leading-[1.15] tracking-[-0.01em] text-ink-900 text-balance sm:text-[38px]">
                Angkanya dihitung kode, bukan dikarang model bahasa.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-6 max-w-[48ch] text-[16px] leading-[1.7] text-ink-500">
                Titik impas, marjin, dan payback berasal dari rumus yang bisa
                dibuka dan diuji ulang. Agen AI boleh mengkritik asumsinya,
                menantang hasilnya, dan menandai yang rapuh — tetapi tidak boleh
                menuliskan angkanya sendiri.
              </p>
            </Reveal>
            <div className="mt-8 space-y-3">
              {[
                "Skor dan tingkat keyakinan tampil berdampingan, tidak saling menutupi.",
                "Kalau marjin kontribusi nol, titik impas ditulis tidak terdefinisi — bukan diisi angka.",
                "Bila simulasi gagal, laporan tetap terbit sebagai parsial dengan dimensi yang tidak dinilai.",
              ].map((t, i) => (
                <Reveal key={t} delay={120 + i * 80}>
                  <div className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700"
                    />
                    <p className="text-[15px] leading-relaxed text-ink-700">
                      {t}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tiga modul ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-6">
          <Reveal>
            <h2 className="font-serif text-[30px] font-bold tracking-[-0.01em] text-ink-900 sm:text-[36px]">
              Tiga modul, satu alur
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                j: "Market Analysis",
                d: "Pilih titik di peta, masukkan menu dan modal, lalu jalankan simulasi empat council. Keluarannya skor kelayakan dengan rinciannya.",
              },
              {
                n: "02",
                j: "Edukasi Bisnis F&B",
                d: "Perizinan, penetapan harga, bahan baku, dan pelanggan awal. Wajib diselesaikan agar kamu bisa mengkritisi hasil AI, bukan menelannya.",
              },
              {
                n: "03",
                j: "Transaction Management",
                d: "Catat penjualan harian, lalu baca produk terlaris, sebaran per jam, dan tren mingguan setelah data cukup.",
              },
            ].map((m, i) => (
              <Reveal key={m.n} delay={i * 90}>
                <div className="group h-full rounded-[14px] border border-line bg-surface p-6 transition-colors hover:border-teal-700/35">
                  <span className="font-mono text-[12px] font-semibold text-teal-700">
                    {m.n}
                  </span>
                  <h3 className="mt-3 text-[17px] font-bold text-ink-900">
                    {m.j}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Batas produk ───────────────────────────────────────── */}
      <section className="border-t border-line bg-surface py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 sm:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <h2 className="font-serif text-[26px] font-bold leading-[1.2] tracking-[-0.01em] text-ink-900 text-balance sm:text-[32px]">
              Alat bantu keputusan, bukan peramal
            </h2>
          </Reveal>
          <div className="space-y-4">
            <Reveal delay={80}>
              <p className="text-[16px] leading-[1.7] text-ink-500">
                SimuMarket AI membantu mempersempit pilihan dan menemukan risiko
                lebih awal. Ia tidak menjanjikan usahamu berhasil, dan tidak
                menggantikan pengecekan lapangan.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-[16px] leading-[1.7] text-ink-500">
                Bobot penilaiannya masih berstatus hipotesis dan sedang
                divalidasi bersama pelaku dan pakar UMKM F&amp;B. Selama itu
                belum selesai, hasilnya diberi label apa adanya.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="bg-ink-900 py-24">
        <div className="mx-auto max-w-[1180px] px-6 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[18ch] font-serif text-[34px] font-bold leading-[1.12] tracking-[-0.01em] text-white text-balance sm:text-[46px]">
              Lihat alurnya dari ujung ke ujung.
            </h2>
            <p className="mx-auto mt-5 max-w-[42ch] text-[16px] leading-relaxed text-white/55">
              Demo berjalan penuh tanpa akun. Dua alur tersedia: calon pengusaha
              dan pemilik usaha yang sudah jalan.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 rounded-[11px] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-white/90"
              >
                Coba Demo
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-[11px] border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Masuk
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line bg-canvas">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-6 py-9 text-[12.5px] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Mark />
            <span className="font-semibold text-ink-700">SimuMarket AI</span>
          </div>
          <p>© 2026 NextGen Managers · Universitas Indonesia</p>
        </div>
      </footer>
    </>
  );
}
