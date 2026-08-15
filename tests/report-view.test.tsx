import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReportView } from "@/features/analysis/ReportView";
import { analysisId, analysisReport, analysisRun } from "./fixtures/analysis";

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => payload,
  } as unknown as Response;
}

function errorResponse(status: number, code: string) {
  return {
    ok: false,
    status,
    headers: { get: () => null },
    json: async () => ({
      error: {
        code,
        message: "Data yang diminta tidak ditemukan.",
        fields: [],
        correlation_id: "6c1e0d1f-6a11-4c47-92f4-8b2f3f2a0a11",
        retryable: false,
      },
    }),
  } as unknown as Response;
}

function mockApi(overrides: { run?: unknown; report?: unknown } = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith("/report")) return jsonResponse(overrides.report ?? analysisReport);
    if (url.includes("/v1/analyses/")) return jsonResponse(overrides.run ?? analysisRun);
    return errorResponse(404, "NOT_FOUND");
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("report view", () => {
  beforeEach(() => {
    mockApi();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("says the score is unavailable instead of showing a default", async () => {
    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("Skor tidak tersedia")).toBeInTheDocument();
    expect(
      screen.getByText(/Bobot\s+dimensi yang hilang tidak dialihkan ke dimensi lain\./),
    ).toBeInTheDocument();
    expect(screen.queryByText("dari 100")).not.toBeInTheDocument();
    expect(screen.getAllByText("Tidak dapat dinilai")).toHaveLength(3);
  });

  it("always shows the rule version and the unvalidated label next to the score", async () => {
    render(<ReportView analysisId={analysisId} />);

    expect(
      await screen.findByText(/lrs-v0\.2-unvalidated · status validasi unvalidated/),
    ).toBeInTheDocument();
  });

  it("shows evidence confidence, missing evidence, and limitations without collapsing", async () => {
    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("Skor keyakinan bukti")).toBeInTheDocument();
    expect(screen.getByText(/Label\s+Tidak tersedia/)).toBeInTheDocument();
    expect(
      screen.getAllByText("Jumlah kompetitor pada radius analisis").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /Jumlah kompetitor pada radius analisis: Sumber data pasar belum tersedia\./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bobot Launch Readiness Score berstatus hipotesis/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Bukti dan keterbatasan/ })).toBeNull();
  });

  it("keeps the DSS disclaimer on screen", async () => {
    render(<ReportView analysisId={analysisId} />);

    expect(
      await screen.findByText(
        "Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha.",
      ),
    ).toBeInTheDocument();
  });

  it("reports the agent simulation as unavailable rather than inventing quotes", async () => {
    render(<ReportView analysisId={analysisId} />);

    // Repeated on purpose: the partial header, the simulation section that keeps
    // its place in the table of contents, and the run warning list.
    expect(
      (
        await screen.findAllByText(
          "Simulasi agent belum dijalankan karena integrasi OASIS belum aktif pada versi ini.",
        )
      ).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText(
        "Tidak ada kutipan persona pada laporan ini karena simulasi belum dijalankan.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Tidak tersedia").length).toBeGreaterThan(0);
  });

  it("writes an undefined payback in words, never as a dash or infinity", async () => {
    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("Tidak terdefinisi")).toBeInTheDocument();
    expect(screen.queryByText("∞")).toBeNull();
    expect(screen.queryByText("NaN")).toBeNull();
  });

  it("prints the revenue the backend sent instead of recomputing it", async () => {
    render(<ReportView analysisId={analysisId} />);

    // volume 40 * 26 days * Rp 18.000 would be Rp 18.720.000; the fixture sends
    // Rp 18.720.001 so a recomputing UI would fail this assertion.
    expect(await screen.findByText("Rp 18.720.001")).toBeInTheDocument();
    expect(screen.queryByText("Rp 18.720.000")).toBeNull();
  });

  it("renders the score gauge and interpretation when the score is available", async () => {
    vi.unstubAllGlobals();
    mockApi({
      run: { ...analysisRun, status: "completed", score: 78 },
      report: {
        ...analysisReport,
        status: "completed",
        readiness: {
          ...analysisReport.readiness,
          status: "available",
          score: 78,
          interpretation: "layak_dengan_mitigasi",
          interpretation_label: "Layak dengan mitigasi",
          missing_dimensions: [],
          dimensions: analysisReport.readiness.dimensions.map((dimension) => ({
            ...dimension,
            status: "scored",
            score: 78,
          })),
        },
      },
    });

    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("Layak dengan mitigasi")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /Launch Readiness Score 78 dari 100/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Skor tidak tersedia")).toBeNull();
  });

  it("explains a failed run instead of rendering an empty report", async () => {
    vi.unstubAllGlobals();
    mockApi({
      run: { ...analysisRun, status: "failed", failure_code: "report_validation_failed" },
    });

    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("Laporan tidak tersedia")).toBeInTheDocument();
    expect(
      screen.getByText(/Kode kegagalan: report_validation_failed/),
    ).toBeInTheDocument();
  });

  it("offers a login route when the session has expired", async () => {
    vi.unstubAllGlobals();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => errorResponse(401, "UNAUTHORIZED")),
    );

    render(<ReportView analysisId={analysisId} />);

    await waitFor(() =>
      expect(screen.getByText("Sesi kamu sudah berakhir")).toBeInTheDocument(),
    );
  });
});
