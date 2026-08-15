import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalysisProgress } from "@/features/analysis/AnalysisProgress";
import {
  analysisEventSchema,
  isTerminalStatus,
  stageDetails,
  stageOrder,
  statusLabels,
} from "@/lib/contracts/analysis";
import { analysisId, analysisRun, analysisReport } from "./fixtures/analysis";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

type Listener = (event: MessageEvent<string>) => void;

/**
 * Minimal EventSource stand-in. jsdom has none, and the real browser class
 * reconnects on its own — behaviour the hook relies on, so the fake models it
 * by firing `error` without closing.
 */
class FakeEventSource {
  static instances: FakeEventSource[] = [];
  readonly listeners = new Map<string, Listener[]>();
  closed = false;

  constructor(readonly url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: Listener) {
    const existing = this.listeners.get(type) ?? [];
    this.listeners.set(type, [...existing, listener]);
  }

  close() {
    this.closed = true;
  }

  emit(payload: Record<string, unknown>) {
    const data = JSON.stringify(payload);
    for (const listener of this.listeners.get("status") ?? []) {
      listener(new MessageEvent("status", { data }));
    }
  }

  fail() {
    for (const listener of this.listeners.get("error") ?? []) {
      listener(new MessageEvent("error", { data: "" }));
    }
  }
}

function event(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: "analysis-event-v1",
    event_id: "1",
    analysis_id: analysisId,
    status: "collecting_evidence",
    current_stage: "collecting_evidence",
    completed_stages: ["queued"],
    skipped_stages: [],
    percent: 0,
    message: "Mengumpulkan bukti lokal",
    warnings: [],
    correlation_id: "3d0b0f70-9a2f-4a4e-8e5d-9d84f6a4a6f1",
    occurred_at: "2026-08-15T02:00:00Z",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
}

beforeEach(() => {
  FakeEventSource.instances = [];
  vi.stubGlobal("EventSource", FakeEventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("kontrak event SSE", () => {
  it("menerima bentuk event yang dikirim backend", () => {
    const parsed = analysisEventSchema.safeParse(event());
    expect(parsed.success).toBe(true);
  });

  it("menolak event tanpa field wajib", () => {
    const incomplete: Record<string, unknown> = event();
    delete incomplete.percent;
    expect(analysisEventSchema.safeParse(incomplete).success).toBe(false);
  });

  it("menolak persen di luar 0 sampai 100", () => {
    expect(analysisEventSchema.safeParse(event({ percent: 140 })).success).toBe(false);
  });

  it("mengenali status terminal", () => {
    expect(isTerminalStatus("completed")).toBe(true);
    expect(isTerminalStatus("partial")).toBe(true);
    expect(isTerminalStatus("failed")).toBe(true);
    expect(isTerminalStatus("cancelled")).toBe(true);
    expect(isTerminalStatus("simulating")).toBe(false);
  });
});

describe("rendering tahap", () => {
  it("menampilkan seluruh tahap termasuk simulating", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    FakeEventSource.instances[0].emit(event());
    await screen.findByText("Mengumpulkan bukti lokal");

    // Daftar tahap dicari di dalam list-nya sendiri, karena label tahap yang
    // sedang berjalan juga muncul di live region dan di bar kemajuan.
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(stageOrder.length);

    const rendered = items.map((item) => item.textContent ?? "");
    for (const [index, stage] of stageOrder.entries()) {
      expect(rendered[index]).toContain(statusLabels[stage]);
      expect(rendered[index]).toContain(stageDetails[stage]);
    }
    expect(rendered.join(" ")).toContain("Simulasi persona");
  });

  it("memakai persen dari server dan tidak menghitung sendiri", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    // 45 tidak dapat diturunkan dari dua tahap selesai; nilai ini hanya bisa
    // datang dari server.
    FakeEventSource.instances[0].emit(
      event({
        event_id: "3",
        status: "simulating",
        current_stage: "simulating",
        completed_stages: ["queued", "collecting_evidence", "building_context"],
        percent: 45,
        message: "Panel persona berjalan",
      }),
    );

    const bar = await screen.findByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "45");
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("mengumumkan perubahan tahap lewat live region polite", async () => {
    const { container } = render(<AnalysisProgress analysisId={analysisId} />);
    FakeEventSource.instances[0].emit(event());

    await waitFor(() => {
      const live = container.querySelector('[aria-live="polite"]');
      expect(live?.textContent).toContain("Mengumpulkan bukti");
    });
  });

  it("menandai tahap yang dilewati sebagai tidak dijalankan", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    FakeEventSource.instances[0].emit(
      event({ skipped_stages: ["simulating"], percent: 20 }),
    );

    expect(await screen.findByText(/tidak dijalankan/)).toBeInTheDocument();
  });

  it("mengabaikan event lama yang tiba setelah event baru", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    const source = FakeEventSource.instances[0];
    source.emit(event({ event_id: "5", percent: 60, message: "Menilai kelayakan" }));
    await screen.findByText("60%");

    source.emit(event({ event_id: "2", percent: 15, message: "Menyusun konteks" }));

    await waitFor(() => expect(screen.getByText("60%")).toBeInTheDocument());
    expect(screen.queryByText("15%")).not.toBeInTheDocument();
  });
});

describe("kegagalan dan status terminal", () => {
  it("mengumumkan kegagalan terminal lewat role alert", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    FakeEventSource.instances[0].emit(
      event({
        event_id: "9",
        status: "failed",
        current_stage: "validating_report",
        percent: 100,
        warnings: [
          {
            code: "report_validation_failed",
            stage: "validating_report",
            message: "Laporan gagal validasi.",
          },
        ],
      }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Gagal");
    expect(
      screen.getByRole("link", { name: "Jalankan analisis baru" }),
    ).toBeInTheDocument();
  });

  it("menutup stream setelah status terminal", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    const source = FakeEventSource.instances[0];
    source.emit(event({ event_id: "9", status: "completed", percent: 100 }));

    await waitFor(() => expect(source.closed).toBe(true));
  });

  it("menampilkan laporan server setelah run selesai sebagian", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/report")) return jsonResponse(analysisReport);
      return jsonResponse(analysisRun);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<AnalysisProgress analysisId={analysisId} />);
    FakeEventSource.instances[0].emit(
      event({ event_id: "9", status: "partial", percent: 100 }),
    );

    expect(await screen.findByText("Laporan selesai sebagian")).toBeInTheDocument();
    // Nilai laporan berasal dari server, bukan dihitung ulang di halaman ini.
    expect(await screen.findByText("Rp 7.000")).toBeInTheDocument();
  });
});

describe("reconnect dan fallback", () => {
  it("menampilkan keadaan menyambung ulang tanpa membuat koneksi baru", async () => {
    render(<AnalysisProgress analysisId={analysisId} />);
    const source = FakeEventSource.instances[0];
    source.emit(event());
    await screen.findByText("Mengumpulkan bukti lokal");

    source.fail();

    expect(
      await screen.findByText("Koneksi status terputus. Mencoba menyambung kembali."),
    ).toBeInTheDocument();
    // EventSource melakukan reconnect sendiri sambil membawa Last-Event-ID.
    expect(FakeEventSource.instances).toHaveLength(1);
    expect(source.closed).toBe(false);
  });

  it("beralih ke polling setelah batas kegagalan dan tidak mengulang tanpa henti", async () => {
    const fetchMock = vi.fn(() =>
      jsonResponse({
        ...analysisRun,
        status: "scoring",
        completed_at: null,
        progress: {
          completed_stages: ["queued", "collecting_evidence"],
          skipped_stages: [],
          current_stage: "scoring",
          message: "Menilai kelayakan",
          percent: 70,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<AnalysisProgress analysisId={analysisId} />);
    const source = FakeEventSource.instances[0];
    for (let attempt = 0; attempt < 4; attempt += 1) source.fail();

    expect(
      await screen.findByText("Aliran langsung tidak tersedia. Status diperbarui berkala."),
    ).toBeInTheDocument();
    expect(await screen.findByText("70%")).toBeInTheDocument();
    expect(source.closed).toBe(true);
    // Tidak ada koneksi SSE baru yang dibuat setelah menyerah.
    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("berhenti polling ketika sesi berakhir", async () => {
    const fetchMock = vi.fn(() =>
      jsonResponse(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Silakan masuk terlebih dahulu.",
            fields: [],
            correlation_id: "3d0b0f70-9a2f-4a4e-8e5d-9d84f6a4a6f1",
            retryable: false,
          },
        },
        401,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<AnalysisProgress analysisId={analysisId} />);
    for (let attempt = 0; attempt < 4; attempt += 1) {
      FakeEventSource.instances[0].fail();
    }

    expect(await screen.findByText("Sesi kamu sudah berakhir")).toBeInTheDocument();
    const callsAfterUnauthorized = fetchMock.mock.calls.length;
    await new Promise((resolve) => setTimeout(resolve, 50));
    // 401 tidak akan membaik dengan diulang, jadi polling berhenti.
    expect(fetchMock.mock.calls.length).toBe(callsAfterUnauthorized);
  });
});
