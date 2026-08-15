"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import {
  analysisEventSchema,
  analysisReadSchema,
  isTerminalStatus,
  type AnalysisEvent,
} from "@/lib/contracts/analysis";

const API_PREFIX = "/api/backend";

/** Setelah sekian kali putus, SSE dihentikan dan status diambil lewat polling. */
export const MAX_STREAM_ERRORS = 3;

/** docs/12 menetapkan polling tiap tiga detik sebagai fallback SSE. */
export const POLL_INTERVAL_MS = 3_000;

export type StreamTransport = "stream" | "polling";

export type AnalysisStreamState = {
  event: AnalysisEvent | null;
  transport: StreamTransport;
  reconnecting: boolean;
  error: ApiError | null;
};

type Options = {
  /** Disuntik oleh test; browser memakai `EventSource` bawaan. */
  eventSourceFactory?: (url: string) => EventSource;
};

/**
 * Mengikuti progres satu analysis.
 *
 * `EventSource` melakukan reconnect sendiri dan membawa `Last-Event-ID`, jadi
 * koneksi tidak dibuat ulang secara manual — cukup dihitung kegagalannya. Kalau
 * sudah melewati batas, stream ditutup dan status diambil lewat polling supaya
 * tidak ada retry tanpa henti.
 *
 * Hook ini tidak menghitung apa pun. Persentase, tahap, dan status seluruhnya
 * berasal dari server.
 */
export function useAnalysisStream(
  analysisId: string | null,
  options: Options = {},
): AnalysisStreamState {
  const [state, setState] = useState<AnalysisStreamState>({
    event: null,
    transport: "stream",
    reconnecting: false,
    error: null,
  });
  const doneRef = useRef(false);
  const factory = options.eventSourceFactory;

  /**
   * Terima satu event.
   *
   * `ordered` hanya berlaku untuk frame SSE, yang bisa tiba lagi dengan urutan
   * lama setelah reconnect. Hasil polling adalah pembacaan langsung ke sistem
   * pencatat, jadi selalu lebih baru daripada apa pun yang ada di state — kalau
   * ia ikut dibandingkan lewat `event_id`, satu event SSE yang sempat masuk akan
   * membuat seluruh hasil polling dibuang dan UI berhenti di tahap lama.
   */
  const receive = useCallback((event: AnalysisEvent, { ordered }: { ordered: boolean }) => {
    doneRef.current = isTerminalStatus(event.status);
    setState((current) => {
      if (
        ordered &&
        current.event &&
        Number(current.event.event_id) > Number(event.event_id)
      ) {
        return current;
      }
      return { ...current, event, reconnecting: false, error: null };
    });
  }, []);

  useEffect(() => {
    if (!analysisId) return;
    doneRef.current = false;

    let closed = false;
    let source: EventSource | null = null;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let failures = 0;

    const poll = async () => {
      if (closed) return;
      try {
        const run = await apiFetch(`/v1/analyses/${analysisId}`, analysisReadSchema);
        if (closed) return;
        receive(
          {
            schema_version: "analysis-event-v1",
            event_id: "0",
            analysis_id: run.analysis_id,
            status: run.status,
            current_stage: run.progress.current_stage,
            completed_stages: run.progress.completed_stages,
            skipped_stages: run.progress.skipped_stages,
            percent: run.progress.percent,
            message: run.progress.message,
            warnings: run.warnings,
            failure_code: run.failure_code,
            correlation_id: run.correlation_id,
            occurred_at: run.completed_at ?? run.started_at ?? run.created_at,
          },
          { ordered: false },
        );
        if (isTerminalStatus(run.status)) return;
      } catch (caught) {
        if (closed) return;
        setState((current) => ({
          ...current,
          error: caught instanceof ApiError ? caught : null,
        }));
        // 401 dan 404 tidak akan membaik dengan diulang.
        if (caught instanceof ApiError && caught.status < 500) return;
      }
      pollTimer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    };

    const fallBackToPolling = () => {
      source?.close();
      source = null;
      setState((current) => ({ ...current, transport: "polling", reconnecting: false }));
      void poll();
    };

    const open = () => {
      const url = `${API_PREFIX}/v1/analyses/${analysisId}/events`;
      source = factory ? factory(url) : new EventSource(url);

      source.addEventListener("status", (message) => {
        let payload: unknown;
        try {
          payload = JSON.parse((message as MessageEvent<string>).data) as unknown;
        } catch {
          return;
        }
        const parsed = analysisEventSchema.safeParse(payload);
        if (!parsed.success) return;
        failures = 0;
        receive(parsed.data, { ordered: true });
        if (doneRef.current) {
          source?.close();
          source = null;
        }
      });

      source.addEventListener("error", () => {
        if (closed || doneRef.current) {
          source?.close();
          return;
        }
        failures += 1;
        if (failures > MAX_STREAM_ERRORS) {
          fallBackToPolling();
          return;
        }
        setState((current) => ({ ...current, reconnecting: true }));
      });
    };

    if (typeof EventSource === "undefined" && !factory) {
      fallBackToPolling();
    } else {
      open();
    }

    return () => {
      closed = true;
      source?.close();
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [analysisId, factory, receive]);

  return state;
}
