import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReportView } from "@/features/analysis/ReportView";
import { analysisReportSchema } from "@/lib/contracts/analysis";
import { analysisId, analysisReport, analysisRun } from "./fixtures/analysis";

const simulation = {
  status: "experimental" as const,
  reason: null,
  cohort_size: 16,
  cohort_version: "jabodetabek-fnb-v1",
  rounds: 4,
  metrics: {
    cohort_size: 16,
    activated_persona_count: 16,
    purchase_intent_count: 6,
    positive_reaction_count: 11,
    opinion_shift_count: 4,
  },
  segments: [
    {
      archetype: "budget_driven",
      label: "Sensitif harga",
      persona_count: 4,
      purchase_intent_count: 1,
    },
  ],
  objections: [
    { code: "price_above_comfort", label: "Harga di atas batas nyaman", count: 5 },
  ],
  acceptable_price_band: { min_idr: 16000, max_idr: 20000 },
  quotes: [
    {
      agent_id: "persona-budget-driven-01",
      archetype: "Sensitif harga",
      text: "Respons sintetis: tawaran ini masih perlu saya bandingkan.",
      label: "respons sintetis" as const,
    },
  ],
  limitations: [
    "Respons persona adalah sinyal sintetis eksploratif, bukan perilaku pelanggan nyata.",
  ],
};

const agentReview = {
  status: "available" as const,
  reason: null,
  label: "respons sintetis" as const,
  manifest: {
    adapter_id: "oasis-live",
    provider: "gemini",
    model_id: "gemini-3.1-flash-lite",
    prompt_version: "oasis-council-v1",
    cohort_version: "jabodetabek-fnb-v1",
    oasis_version: "0.2.5",
    camel_version: "0.2.78",
    seed: 42,
    persona_count: 16,
    round_limit: 4,
    token_budget: 120000,
    tokens_used: 8320,
  },
  market_observations: [
    {
      id: "MA-001",
      stance: "risk" as const,
      claim: "Kepadatan kompetitor perlu diperiksa ulang di lapangan.",
      evidence_metrics: ["competitor_count"],
      confidence: "medium" as const,
    },
  ],
  evidence_gaps: ["population_count"],
  disagreements: ["Scout dan Skeptic berbeda pandangan tentang kesiapan lokasi."],
  finance_critiques: [
    {
      id: "FIN-001",
      assumption: "Volume harian dasar tercapai sejak bulan pertama.",
      concern: "Volume awal usaha baru umumnya di bawah rencana.",
      severity: "high" as const,
      tool_call_ids: ["finance-volume-40"],
    },
  ],
  fragile_assumptions: ["Susut bahan tidak dimasukkan ke perhitungan."],
  narrative_sections: [
    {
      id: "NAR-001",
      title: "Ringkasan penilaian",
      body: "Seluruh angka pada laporan berasal dari engine, bukan dari narasi ini.",
      source_artifact_types: ["MarketAssessment", "FinanceReview"],
    },
  ],
  red_team_findings: ["Klaim peluang tanpa metrik dihapus dari draft."],
};

const completedReport = {
  ...analysisReport,
  status: "completed",
  synthetic_simulation: simulation,
  agent_review: agentReview,
};

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

function mockApi(report: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/report")) return jsonResponse(report);
      return jsonResponse({ ...analysisRun, status: "completed" });
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("bagian simulasi pada laporan", () => {
  it("menerima bentuk laporan dengan simulasi dan tinjauan agent", () => {
    expect(analysisReportSchema.safeParse(completedReport).success).toBe(true);
  });

  it("menolak kutipan persona tanpa label respons sintetis", () => {
    const withoutLabel = {
      ...completedReport,
      synthetic_simulation: {
        ...simulation,
        quotes: [{ ...simulation.quotes[0], label: "kutipan pelanggan" }],
      },
    };
    expect(analysisReportSchema.safeParse(withoutLabel).success).toBe(false);
  });

  it("menampilkan hitungan beserta pembaginya, bukan persentase", async () => {
    mockApi(completedReport);
    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("6 dari 16")).toBeInTheDocument();
    expect(screen.getByText("11 dari 16")).toBeInTheDocument();
    expect(screen.getByText("4 dari 16")).toBeInTheDocument();
    expect(
      screen.getByText("1 dari 4 memilih membeli"),
    ).toBeInTheDocument();
  });

  it("memberi label respons sintetis pada setiap kutipan persona", async () => {
    mockApi(completedReport);
    render(<ReportView analysisId={analysisId} />);

    expect(
      await screen.findByText(/tawaran ini masih perlu saya bandingkan/),
    ).toBeInTheDocument();
    expect(screen.getByText("respons sintetis")).toBeInTheDocument();
  });

  it("menampilkan manifest run sehingga hasil dapat diaudit", async () => {
    mockApi(completedReport);
    render(<ReportView analysisId={analysisId} />);

    const manifest = await screen.findByText(/gemini-3\.1-flash-lite/);
    expect(manifest).toHaveTextContent("oasis-council-v1");
    expect(manifest).toHaveTextContent("jabodetabek-fnb-v1");
    expect(manifest).toHaveTextContent("seed 42");
    expect(manifest).toHaveTextContent("8320 dari 120000 token");
  });

  it("menautkan kritik finansial ke hasil kalkulator deterministik", async () => {
    mockApi(completedReport);
    render(<ReportView analysisId={analysisId} />);

    expect(
      await screen.findByText(/Hasil kalkulator: finance-volume-40/),
    ).toBeInTheDocument();
  });

  it("tetap menampilkan bagian simulasi saat tidak tersedia", async () => {
    mockApi(analysisReport);
    render(<ReportView analysisId={analysisId} />);

    // Bagian yang gagal tetap pada posisinya dan menyatakan alasannya.
    expect(await screen.findByText("06 Simulasi persona sintetis")).toBeInTheDocument();
    expect(screen.getByText("07 Tinjauan agent")).toBeInTheDocument();
    expect(
      screen.getAllByText(/integrasi OASIS belum aktif/).length,
    ).toBeGreaterThan(0);
  });

  it("tidak menghitung ulang nilai server", async () => {
    // Server melaporkan enam persona membeli walau segmen hanya menjumlah satu;
    // UI wajib menampilkan angka server apa adanya.
    mockApi(completedReport);
    render(<ReportView analysisId={analysisId} />);

    expect(await screen.findByText("6 dari 16")).toBeInTheDocument();
    expect(screen.queryByText("1 dari 16")).not.toBeInTheDocument();
  });
});
