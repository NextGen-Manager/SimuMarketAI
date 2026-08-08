import Link from "next/link";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <rect width="24" height="24" rx="6" fill="var(--color-teal-700)" />
      <path
        d="M6 15.5 L10 10.5 L13.5 13.5 L18 7.5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Login() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-9 flex items-center gap-2.5">
        <Mark />
        <span className="text-[17px] font-bold tracking-tight text-ink-900">
          SimuMarket AI
        </span>
      </Link>

      <h1 className="font-serif text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink-900">
        Masuk ke akunmu
      </h1>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
        Lanjutkan analisis dan catatan penjualan usahamu.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="label-eyebrow mb-1.5 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@contoh.com"
            className="w-full rounded-[9px] border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="sandi" className="label-eyebrow">
              Kata sandi
            </label>
            <Link
              href="/login"
              className="text-[12.5px] font-semibold text-teal-700 hover:underline"
            >
              Lupa sandi?
            </Link>
          </div>
          <input
            id="sandi"
            name="sandi"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-[9px] border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400"
          />
        </div>

        <label className="flex items-center gap-2.5 text-[14px] text-ink-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-teal-700"
            name="ingat"
          />
          Ingat saya di perangkat ini
        </label>

        <button
          type="submit"
          className="w-full rounded-[10px] bg-teal-700 px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-teal-600"
        >
          Masuk
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[12.5px] text-ink-400">atau</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Link
        href="/demo"
        className="flex items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 py-3 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-surface-2"
      >
        Coba demo tanpa akun
        <span aria-hidden>→</span>
      </Link>

      <p className="mt-8 text-center text-[14px] text-ink-500">
        Belum punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-teal-700 underline underline-offset-2"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}
