import Link from "next/link";

export function AuthPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-10 flex items-center gap-2.5 text-[17px] font-bold text-ink-900">
        <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-teal-700 text-[12px] text-white" aria-hidden>
          SM
        </span>
        SimuMarket AI
      </Link>
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink-900">{title}</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{description}</p>
      {children}
      <Link href="/demo" className="mt-6 text-center text-[13px] font-semibold text-teal-700 hover:underline">
        Lihat mode demo
      </Link>
    </main>
  );
}
