"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataSkeleton, ErrorState, UnauthorizedState } from "@/components/ui/DataState";
import { Callout } from "@/components/ui/Metric";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReportView } from "@/features/analysis/ReportView";
import { useAnalysisStream } from "@/lib/api/useAnalysisStream";
import {
  failureCodeLabels,
  isTerminalStatus,
  stageDetails,
  stageOrder,
  statusLabels,
  type AnalysisEvent,
} from "@/lib/contracts/analysis";
import { cn } from "@/lib/format";

type StageState = "selesai" | "berjalan" | "dilewati" | "menunggu";

function stageStateOf(event: AnalysisEvent, stage: string): StageState {
  if (event.skipped_stages.includes(stage as never)) return "dilewati";
  if (event.completed_stages.includes(stage as never)) return "selesai";
  if (event.current_stage === stage && !isTerminalStatus(event.status)) return "berjalan";
  if (event.current_stage === stage) return "selesai";
  return "menunggu";
}

export function AnalysisProgress({ analysisId }: { analysisId: string }) {
  const { event, transport, reconnecting, error } = useAnalysisStream(analysisId);

  if (error?.status === 401) return <UnauthorizedState next={`/analisis/${analysisId}`} />;
  if (error && !event) {
    return (
      <ErrorState
        message={error.message}
        correlationId={error.correlationId}
        retryable={error.retryable}
      />
    );
  }
  if (!event) return <DataSkeleton rows={4} />;

  const terminal = isTerminalStatus(event.status);
  const failed = event.status === "failed" || event.status === "cancelled";

  return (
    <div className="space-y-5">
      {/* Perubahan tahap diumumkan sopan; kegagalan terminal lewat role="alert". */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {terminal
          ? `Analisis ${statusLabels[event.status] ?? event.status}.`
          : `Tahap ${statusLabels[event.current_stage] ?? event.current_stage}, ${event.percent} persen.`}
      </div>

      {failed ? (
        <div role="alert">
          <Callout tone="danger">
            <p className="font-semibold text-ink-900">
              Analisis {statusLabels[event.status] ?? event.status}
            </p>
            <p className="mt-1">
              {failureCodeLabels[event.warnings[0]?.code ?? ""] ??
                "Analisis berhenti sebelum menghasilkan laporan. Tidak ada angka sementara yang diisikan menggantikan hasil yang gagal."}
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink-500">
              ID korelasi: {event.correlation_id}
            </p>
          </Callout>
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="Proses analisis"
          aside={
            <StatusBadge
              status={
                failed
                  ? "perlu-dilengkapi"
                  : event.status === "partial"
                    ? "tidak-tersedia"
                    : terminal
                      ? "terdeteksi"
                      : "perlu-dikonfirmasi"
              }
              label={statusLabels[event.status] ?? event.status}
            />
          }
        />
        <CardBody>
          <div className="mb-4">
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <span className="text-[13px] font-medium text-ink-700">{event.message}</span>
              <span className="tnum text-[13px] font-semibold text-teal-700">
                {event.percent}%
              </span>
            </div>
            <div
              className="h-[6px] w-full overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={event.percent}
              aria-label="Kemajuan analisis"
            >
              <div
                className="h-full rounded-full bg-teal-700 transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${event.percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[12px] text-ink-400">
              Persentase berasal dari tahap yang benar-benar selesai di server, bukan dari
              timer di halaman ini.
            </p>
          </div>

          <ol className="space-y-2.5">
            {stageOrder.map((stage) => {
              const state = stageStateOf(event, stage);
              return (
                <li key={stage} className="flex gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] leading-none",
                      state === "selesai" && "border-teal-700 bg-teal-700 text-white",
                      state === "berjalan" && "border-teal-700 text-teal-700",
                      state === "dilewati" && "border-line text-ink-400",
                      state === "menunggu" && "border-line text-ink-400",
                    )}
                  >
                    {state === "selesai" ? "✓" : state === "dilewati" ? "–" : ""}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[13.5px] font-medium",
                        state === "menunggu" ? "text-ink-400" : "text-ink-900",
                      )}
                    >
                      {statusLabels[stage] ?? stage}
                      {state === "berjalan" ? " · berjalan" : ""}
                      {state === "dilewati" ? " · tidak dijalankan" : ""}
                    </p>
                    <p className="text-[12px] leading-snug text-ink-500">
                      {stageDetails[stage]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {reconnecting ? (
            <p className="mt-4 text-[12.5px] text-warn-600" aria-live="polite">
              Koneksi status terputus. Mencoba menyambung kembali.
            </p>
          ) : null}
          {transport === "polling" && !terminal ? (
            <p className="mt-4 text-[12.5px] text-ink-500" aria-live="polite">
              Aliran langsung tidak tersedia. Status diperbarui berkala.
            </p>
          ) : null}
        </CardBody>
      </Card>

      {event.warnings.length > 0 ? (
        <Callout tone="warn">
          <p className="font-semibold text-ink-900">Catatan run</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {event.warnings.map((warning) => (
              <li key={warning.code}>{warning.message}</li>
            ))}
          </ul>
        </Callout>
      ) : null}

      {failed ? (
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/analisis" variant="secondary">
            Jalankan analisis baru
          </ButtonLink>
          <ButtonLink href="/analisis/riwayat" variant="secondary">
            Lihat riwayat analisis
          </ButtonLink>
        </div>
      ) : null}

      {/* Laporan hanya dirender setelah server menyatakan run selesai. */}
      {event.status === "completed" || event.status === "partial" ? (
        <ReportView analysisId={analysisId} />
      ) : null}
    </div>
  );
}
