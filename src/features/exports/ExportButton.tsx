"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api/client";
import { exportSchema, type ExportArtifact } from "@/lib/contracts/artifacts";

export function ExportButton({
  endpoint,
  payload,
  label = "Unduh PDF",
}: {
  endpoint: string;
  payload: object;
  label?: string;
}) {
  const [artifact, setArtifact] = useState<ExportArtifact | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!artifact || !["queued", "processing"].includes(artifact.status)) return;
    const timer = window.setTimeout(() => {
      void apiFetch(`/v1/exports/${artifact.export_id}`, exportSchema)
        .then(setArtifact)
        .catch((caught: unknown) => {
          setError(caught instanceof ApiError ? caught : null);
          setArtifact(null);
        });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [artifact]);

  async function createExport() {
    setCreating(true);
    setError(null);
    try {
      const created = await apiFetch(endpoint, exportSchema, {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(payload),
      });
      setArtifact(created);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : null);
    } finally {
      setCreating(false);
    }
  }

  if (artifact?.status === "ready" && artifact.download) {
    return (
      <a
        href={artifact.download.url}
        className="inline-flex h-10 items-center justify-center rounded-[9px] bg-teal-700 px-4 text-[12px] font-bold text-surface hover:bg-teal-600"
      >
        Unduh PDF siap
      </a>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        onClick={() => void createExport()}
        disabled={creating || artifact?.status === "queued" || artifact?.status === "processing"}
      >
        {creating
          ? "Menyiapkan..."
          : artifact?.status === "queued" || artifact?.status === "processing"
            ? "PDF sedang dibuat..."
            : label}
      </Button>
      {artifact?.status === "failed" ? (
        <span className="text-[12px] text-danger-600" role="alert">
          PDF gagal dibuat. Coba lagi.
        </span>
      ) : null}
      {artifact?.status === "expired" ? (
        <span className="text-[12px] text-ink-500">Tautan telah kedaluwarsa. Buat ulang PDF.</span>
      ) : null}
      {error ? (
        <span className="text-[12px] text-danger-600" role="alert">
          {error.message} ID korelasi: {error.correlationId}
        </span>
      ) : null}
    </div>
  );
}
