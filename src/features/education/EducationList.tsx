"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
  UnauthorizedState,
} from "@/components/ui/DataState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useApiResource } from "@/lib/api/useApiResource";
import { educationModulesSchema } from "@/lib/contracts/education";

export function EducationList() {
  const { data, loading, error, reload } = useApiResource(
    "/v1/education/modules",
    educationModulesSchema,
  );

  if (loading) return <DataSkeleton rows={3} />;
  if (error?.status === 401) return <UnauthorizedState next="/edukasi" />;
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
        title="Belum ada modul terbit"
        description="Materi edukasi masih dalam kurasi dan belum ditinjau. Modul akan muncul di sini setelah terbit, lengkap dengan versi kontennya."
      />
    );
  }

  const selesai = data.filter((module) => module.progress?.passed).length;

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-ink-500">
        {selesai} dari {data.length} modul selesai.
      </p>
      <ul className="space-y-3">
        {data.map((module) => (
          <li key={module.id}>
            <Card>
              <CardBody className="pt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/edukasi/${module.id}`}
                      className="text-[16px] font-semibold text-ink-900 underline-offset-4 hover:underline"
                    >
                      {module.title}
                    </Link>
                    <p className="mt-1 max-w-[70ch] text-[13.5px] leading-relaxed text-ink-500">
                      {module.summary}
                    </p>
                  </div>
                  <StatusBadge
                    status={module.progress?.passed ? "terdeteksi" : "perlu-dilengkapi"}
                    label={module.progress?.passed ? "Selesai" : "Belum selesai"}
                  />
                </div>
                <p className="mt-3 font-mono text-[10px] text-ink-400">
                  {module.topic} · {module.estimated_minutes} menit · versi konten{" "}
                  {module.content_version}
                  {module.is_required ? " · prasyarat analisis" : ""}
                </p>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
