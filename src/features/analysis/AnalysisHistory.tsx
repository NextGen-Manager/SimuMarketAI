"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
  UnauthorizedState,
} from "@/components/ui/DataState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useApiResource } from "@/lib/api/useApiResource";
import { analysisListSchema, statusLabels } from "@/lib/contracts/analysis";
import { businessTypeLabels } from "@/lib/contracts/education";
import { formatDateTime } from "@/lib/format";

export function AnalysisHistory({ basePath }: { basePath: "/analisis/riwayat" | "/laporan" }) {
  const { data, loading, error, reload } = useApiResource("/v1/analyses", analysisListSchema);

  if (loading) return <DataSkeleton rows={3} />;
  if (error?.status === 401) return <UnauthorizedState next={basePath} />;
  if (error) {
    return (
      <ErrorState
        message={error.message}
        correlationId={error.correlationId}
        retryable={error.retryable}
        onRetry={() => void reload()}
      />
    );
  }
  if (!data) return null;

  if (data.length === 0) {
    return (
      <EmptyState
        title="Belum ada analisis tersimpan"
        description="Jalankan analisis pertama untuk melihat Launch Readiness Score, proyeksi finansial, dan daftar bukti beserta keterbatasannya."
        action={<ButtonLink href="/analisis">Mulai analisis</ButtonLink>}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((item) => (
        <li key={item.analysis_id}>
          <Card tone={item.status === "partial" ? "invalid" : "default"}>
            <CardBody className="grid gap-4 pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <Link
                  href={`/laporan/${item.analysis_id}`}
                  className="text-[16px] font-semibold text-ink-900 underline-offset-4 hover:underline"
                >
                  {item.concept_name}
                </Link>
                <p className="mt-1 text-[13px] text-ink-500">
                  {item.area_name} · {businessTypeLabels[item.business_type]}
                </p>
                <p className="mt-2 font-mono text-[10px] text-ink-400">
                  {formatDateTime(item.created_at)} · {item.rule_version}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <StatusBadge
                  status={
                    item.status === "completed"
                      ? "terdeteksi"
                      : item.status === "partial"
                        ? "perlu-dilengkapi"
                        : "tidak-tersedia"
                  }
                  label={statusLabels[item.status] ?? item.status}
                />
                <div className="tnum text-right">
                  {item.score === null ? (
                    <>
                      <p className="text-[15px] font-semibold text-ink-500">Tidak tersedia</p>
                      <p className="text-[11px] text-ink-400">Skor belum dapat dihitung</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[28px] font-bold text-teal-700">{item.score}</p>
                      <p className="text-[11px] text-ink-500">{item.interpretation}</p>
                    </>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
