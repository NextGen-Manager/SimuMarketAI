export function WorkspacePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-ink-900">{title}</h1>
          <p className="mt-2 max-w-[64ch] text-[14px] leading-relaxed text-ink-500">{description}</p>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
