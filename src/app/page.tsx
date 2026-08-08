"use client";

import Image from "next/image";
import Link from "next/link";
import { PersonaField } from "@/components/landing/PersonaField";
import { SceneStack, type Scene } from "@/components/landing/SceneStack";

function Tombol({
  href,
  children,
  utama = false,
  terang = false,
}: {
  href: string;
  children: React.ReactNode;
  utama?: boolean;
  terang?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-[11px] px-6 py-3.5 text-[15px] font-semibold transition-colors";
  const gaya = utama
    ? terang
      ? "bg-white text-ink-900 hover:bg-white/90"
      : "bg-ink-900 text-white hover:bg-ink-700"
    : terang
      ? "border border-white/25 text-white hover:bg-white/10"
      : "border border-ink-900/20 bg-white/70 text-ink-900 backdrop-blur hover:bg-white";

  return (
    <Link href={href} className={`${base} ${gaya}`}>
      {children}
    </Link>
  );
}

function Bingkai({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-10">{children}</div>
  );
}

export default function Landing() {
  const scenes: Scene[] = [
    /* ── 1 · Pembuka ─────────────────────────────────────────── */
    {
      id: "buka",
      dasar: "#cfe4ee",
      latar: (
        <Image
          src="/landing.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
      ),
      hias: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_46%_58%_at_26%_44%,rgba(255,255,255,0.86),rgba(255,255,255,0.34)_52%,transparent_78%)]"
        />
      ),
      isi: (
        <Bingkai>
          <div className="max-w-[30rem]">
            <h1 className="font-serif text-[46px] font-bold leading-[1.03] tracking-[-0.025em] text-ink-900 text-balance sm:text-[64px]">
              Uji dulu.
              <br />
              Baru keluarkan modal.
            </h1>
            <p className="mt-6 max-w-[26rem] text-[16.5px] leading-[1.6] text-ink-700">
              Simulasi pasar untuk usaha makanan dan minuman di Jabodetabek.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Tombol href="/demo" utama>
                Coba Demo <span aria-hidden>→</span>
              </Tombol>
              <Tombol href="/login">Masuk</Tombol>
            </div>
          </div>
        </Bingkai>
      ),
    },

    /* ── 2 · Masalah ─────────────────────────────────────────── */
    {
      id: "masalah",
      dasar: "var(--color-canvas)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,var(--color-teal-50),transparent_72%)]"
        />
      ),
      isi: (
        <Bingkai>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="label-eyebrow mb-6">Kenapa ini dibuat</p>
              <h2 className="max-w-[16ch] font-serif text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-ink-900 text-balance sm:text-[52px]">
                Paling banyak dicoba, paling sering ditebak.
              </h2>
              <p className="mt-7 max-w-[38ch] text-[17px] leading-[1.65] text-ink-500">
                Modalnya terjangkau, jadi banyak yang masuk. Yang jarang ada
                justru bagian penentunya: seberapa padat pesaing di titik itu,
                dan berapa lama modal kembali.
              </p>
            </div>

            <dl className="grid gap-px overflow-hidden rounded-[16px] border border-line bg-line">
              {[
                { a: "4,85 juta", b: "usaha makanan dan minuman", c: "BPS, 2023" },
                { a: "21,13%", b: "pertumbuhan sejak 2016", c: "BPS, 2024" },
                { a: "99,5%", b: "nilai penjualan dari UKM", c: "BPS, 2024" },
              ].map((s) => (
                <div key={s.a} className="bg-surface px-6 py-5">
                  <dt className="tnum font-serif text-[32px] font-bold leading-none text-ink-900">
                    {s.a}
                  </dt>
                  <dd className="mt-2 text-[14.5px] text-ink-500">
                    {s.b}
                    <span className="ml-2 font-mono text-[11.5px] text-ink-400">
                      {s.c}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Bingkai>
      ),
    },

    /* ── 3 · Simulasi ────────────────────────────────────────── */
    {
      id: "simulasi",
      dasar: "var(--color-ink-900)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />
      ),
      hias: (
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/12 blur-[130px]"
        />
      ),
      isi: (
        <Bingkai>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-teal-500">
                Di dalam simulasi
              </p>
              <h2 className="max-w-[15ch] font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance sm:text-[52px]">
                Mereka tidak sepakat. Itu gunanya.
              </h2>
              <p className="mt-7 max-w-[38ch] text-[17px] leading-[1.65] text-white/60">
                Enam belas pelanggan sintetis menilai sendiri, lalu saling
                menantang, lalu diwawancarai. Perbedaannya disimpan — bukan
                dirata-ratakan sampai hilang.
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
              <PersonaField fase={2} />
            </div>
          </div>
        </Bingkai>
      ),
    },

    /* ── 4 · Angka ───────────────────────────────────────────── */
    {
      id: "angka",
      dasar: "var(--color-surface)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_28%_50%,var(--color-amber-50),transparent_70%)]"
        />
      ),
      isi: (
        <Bingkai>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="rounded-[18px] border border-line bg-surface p-8 text-center">
              <p className="label-eyebrow mb-4">Launch Readiness Score</p>
              <p className="tnum font-serif text-[84px] font-bold leading-none text-amber-600">
                68
              </p>
              <p className="mt-1 text-[13px] font-medium text-ink-400">
                dari 100
              </p>
              <p className="mt-5 inline-block rounded-full border border-warn-600/30 bg-warn-50 px-3.5 py-1.5 text-[13px] font-semibold text-warn-600">
                Layak dengan mitigasi
              </p>
            </div>

            <div>
              <h2 className="max-w-[17ch] font-serif text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-ink-900 text-balance sm:text-[48px]">
                Angkanya dihitung kode, bukan dikarang.
              </h2>
              <p className="mt-7 max-w-[40ch] text-[17px] leading-[1.65] text-ink-500">
                Titik impas, marjin, dan payback berasal dari rumus yang bisa
                dibuka dan diuji ulang. Agen boleh mengkritik asumsinya — tidak
                boleh menuliskan angkanya.
              </p>
              <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-ink-400">
                Setiap angka membawa sumber, waktu pengambilan, dan tingkat
                keyakinannya.
              </p>
            </div>
          </div>
        </Bingkai>
      ),
    },

    /* ── 5 · Ajakan ──────────────────────────────────────────── */
    {
      id: "mulai",
      dasar: "var(--color-ink-900)",
      latar: (
        <Image
          src="/landing.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[42%_center] opacity-25"
        />
      ),
      hias: <div aria-hidden className="absolute inset-0 bg-ink-900/70" />,
      isi: (
        <Bingkai>
          <div className="mx-auto max-w-[34rem] text-center">
            <h2 className="font-serif text-[38px] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance sm:text-[54px]">
              Lihat alurnya dari ujung ke ujung.
            </h2>
            <p className="mx-auto mt-6 max-w-[30rem] text-[16.5px] leading-relaxed text-white/60">
              Dua alur tersedia: calon pengusaha, dan pemilik usaha yang sudah
              berjalan.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Tombol href="/demo" utama terang>
                Coba Demo <span aria-hidden>→</span>
              </Tombol>
              <Tombol href="/login" terang>
                Masuk
              </Tombol>
            </div>
            <p className="mt-12 text-[12.5px] text-white/35">
              © 2026 NextGen Managers · Universitas Indonesia
            </p>
          </div>
        </Bingkai>
      ),
    },
  ];

  return <SceneStack scenes={scenes} />;
}
