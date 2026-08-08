export function PageHead({
  judul,
  sub,
  tengah = false,
}: {
  judul: string;
  sub?: string;
  tengah?: boolean;
}) {
  return (
    <div className={tengah ? "mb-10 text-center" : "mb-8"}>
      <h1 className="text-[28px] font-bold tracking-[-0.015em] text-ink-900 text-balance sm:text-[32px]">
        {judul}
      </h1>
      {sub ? (
        <p
          className={`mt-3 text-[15.5px] leading-relaxed text-ink-500 ${
            tengah ? "mx-auto max-w-[46rem]" : "max-w-[46rem]"
          }`}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
