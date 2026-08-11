"use client";

import Image from "next/image";
import Link from "next/link";
import { JourneyPaths } from "@/components/landing/JourneyPaths";
import { LandingStats } from "@/components/landing/LandingStats";
import { ModuleFlow } from "@/components/landing/ModuleFlow";
import { PersonaFieldAuto } from "@/components/landing/PersonaField";
import { SceneReveal } from "@/components/landing/SceneReveal";
import { SceneStack, type Scene } from "@/components/landing/SceneStack";
import { ScoreShowcase } from "@/components/landing/ScoreShowcase";

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
      isi: (aktif: boolean) => (
        <Bingkai>
          <SceneReveal aktif={aktif} className="max-w-[29rem]">
            <p className="label-eyebrow mb-5">SimuMarket AI · Jabodetabek</p>
            <h1 className="font-serif text-[46px] font-bold leading-[1.03] tracking-[-0.025em] text-ink-900 text-balance sm:text-[64px]">
              Usaha F&B,
              <br />
              lebih terukur.
            </h1>
            <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink-700">
              Dari ide sampai penjualan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Tombol href="/demo" utama>
                Coba Demo <span aria-hidden>→</span>
              </Tombol>
              <Tombol href="/login">Masuk</Tombol>
            </div>
          </SceneReveal>
        </Bingkai>
      ),
    },
    {
      id: "masalah",
      dasar: "var(--color-canvas)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,var(--color-teal-50),transparent_72%)]"
        />
      ),
      isi: (aktif: boolean) => (
        <Bingkai>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <SceneReveal aktif={aktif} className="max-w-[39rem]">
              <p className="label-eyebrow mb-6">Kenapa ini dibuat</p>
              <h2 className="max-w-[17ch] font-serif text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-ink-900 text-balance sm:text-[52px]">
                Usaha F&B terus bertambah. Tapi keputusan bisnis belum selalu
                berbasis data.
              </h2>
              <p className="mt-6 max-w-[42ch] text-[16.5px] leading-[1.65] text-ink-500">
                Lokasi, harga, dan strategi sering ditentukan dengan informasi
                terbatas. Pencatatan transaksi pun belum selalu berubah menjadi
                insight yang bisa digunakan.
              </p>
            </SceneReveal>

            <LandingStats aktif={aktif} />
          </div>
        </Bingkai>
      ),
    },
    {
      id: "modul",
      dasar: "var(--color-surface)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_28%_50%,var(--color-amber-50),transparent_70%)]"
        />
      ),
      isi: (aktif: boolean) => (
        <Bingkai>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <SceneReveal aktif={aktif} className="max-w-[27rem]">
              <p className="label-eyebrow mb-6">Satu platform</p>
              <h2 className="font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-ink-900 text-balance sm:text-[50px]">
                Dari sebelum usaha dibuka sampai setelah berjalan.
              </h2>
              <p className="mt-6 text-[16.5px] leading-[1.65] text-ink-500">
                Satu alur untuk memahami pasar, membangun fondasi bisnis, dan
                membaca penjualan nyata.
              </p>
            </SceneReveal>

            <ModuleFlow aktif={aktif} />
          </div>
        </Bingkai>
      ),
    },
    {
      id: "alur",
      dasar: "var(--color-ink-900)",
      latar: (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />
      ),
      hias: (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_70%_45%,rgba(26,136,145,0.17),rgba(26,136,145,0.04)_48%,transparent_76%)]"
        />
      ),
      isi: (aktif: boolean) => (
        <Bingkai>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <SceneReveal aktif={aktif}>
                <p className="mb-5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-teal-500">
                  Sesuai tahap usaha
                </p>
                <h2 className="max-w-[16ch] font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance sm:text-[50px]">
                  Mulai dari mana pun usahamu.
                </h2>
                <p className="mt-6 max-w-[38ch] text-[16.5px] leading-[1.65] text-white/60">
                  Calon pengusaha dan pemilik usaha berjalan mendapat jalur yang
                  berbeda, tetapi sama-sama berakhir pada keputusan yang lebih
                  terukur.
                </p>
              </SceneReveal>

              <div className="mt-7">
                <JourneyPaths aktif={aktif} />
              </div>
            </div>

            <PersonaFieldAuto aktif={aktif} />
          </div>
        </Bingkai>
      ),
    },
    {
      id: "hasil",
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
      isi: (aktif: boolean) => (
        <Bingkai>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16">
            <ScoreShowcase aktif={aktif} />

            <SceneReveal aktif={aktif} delay={180} className="max-w-[34rem]">
              <p className="mb-5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-teal-500">
                Hasil yang dapat dibaca
              </p>
              <h2 className="font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance sm:text-[50px]">
                Tahu bukan hanya skornya, tetapi kenapa.
              </h2>
              <p className="mt-6 text-[16.5px] leading-[1.65] text-white/60">
                Lihat alasan, sumber, tingkat keyakinan, risiko, dan langkah
                berikutnya. Hasilnya membantu pertimbangan, bukan menjanjikan
                keberhasilan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
            </SceneReveal>
          </div>
        </Bingkai>
      ),
    },
  ];

  return <SceneStack scenes={scenes} />;
}
