"use client";

import { Button } from "@/components/ui/Button";

export function DataSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-label="Memuat data">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-20 rounded-[12px] border border-line bg-surface" />
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  correlationId,
  retryable,
  onRetry,
}: {
  message: string;
  correlationId: string;
  retryable: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-danger-600/40 bg-danger-50 p-5" role="alert">
      <h2 className="font-semibold text-ink-900">Data belum dapat dimuat</h2>
      <p className="mt-1 text-[14px] text-ink-700">{message}</p>
      <p className="mt-3 font-mono text-[11px] text-ink-500">
        ID korelasi: {correlationId}
      </p>
      {retryable && onRetry ? (
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          Coba lagi
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-dashed border-line bg-surface px-6 py-12 text-center">
      <h2 className="text-[18px] font-semibold text-ink-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-[52ch] text-[14px] leading-relaxed text-ink-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
