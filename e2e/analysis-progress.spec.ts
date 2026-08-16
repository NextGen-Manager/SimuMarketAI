import { expect, test, type Page } from "@playwright/test";

const businessId = "47b6be46-a366-4e37-b406-90c6758902a5";
const analysisId = "8ff7d369-924a-4d6e-ac0e-4c94aa868d0a";
const correlationId = "3d0b0f70-9a2f-4a4e-8e5d-9d84f6a4a6f1";

const session = {
  user: {
    id: "c448be66-439a-47f3-8bf5-1bf1f08dc102",
    email: "owner@example.test",
    display_name: "Pemilik Uji",
    created_at: "2026-08-14T01:00:00Z",
  },
  memberships: [
    {
      business_id: businessId,
      business_name: "Kedai Uji",
      location_name: "Tebet",
      role: "owner",
    },
  ],
};

const prerequisites = {
  rule_version: "education-gate-v1",
  business_type: "food_stall",
  satisfied: true,
  content_available: true,
  required: [],
  outstanding: [],
  note: null,
};

type StageEvent = {
  id: number;
  status: string;
  stage: string;
  completed: string[];
  percent: number;
  message: string;
};

const stages: StageEvent[] = [
  {
    id: 1,
    status: "collecting_evidence",
    stage: "collecting_evidence",
    completed: ["queued"],
    percent: 0,
    message: "Mengumpulkan bukti lokal",
  },
  {
    id: 2,
    status: "building_context",
    stage: "building_context",
    completed: ["queued", "collecting_evidence"],
    percent: 15,
    message: "Menyusun konteks",
  },
  {
    id: 3,
    status: "simulating",
    stage: "simulating",
    completed: ["queued", "collecting_evidence", "building_context"],
    percent: 25,
    message: "Panel persona berjalan",
  },
  {
    id: 4,
    status: "scoring",
    stage: "scoring",
    completed: [
      "queued",
      "collecting_evidence",
      "building_context",
      "simulating",
      "calculating_finance",
    ],
    percent: 65,
    message: "Menilai kelayakan",
  },
  {
    id: 5,
    status: "partial",
    stage: "validating_report",
    completed: [
      "queued",
      "collecting_evidence",
      "building_context",
      "simulating",
      "calculating_finance",
      "scoring",
      "composing_report",
      "validating_report",
    ],
    percent: 100,
    message: "Memvalidasi klaim",
  },
];

const warnings = [
  {
    code: "simulation_failed",
    stage: "simulating",
    message:
      "Simulasi agent tidak tersedia sehingga laporan hanya memuat hasil deterministik.",
  },
];

function sseBody(events: StageEvent[]): string {
  return events
    .map((event) => {
      const payload = {
        schema_version: "analysis-event-v1",
        event_id: String(event.id),
        analysis_id: analysisId,
        status: event.status,
        current_stage: event.stage,
        completed_stages: event.completed,
        skipped_stages: [],
        percent: event.percent,
        message: event.message,
        warnings: event.status === "partial" ? warnings : [],
        correlation_id: correlationId,
        occurred_at: "2026-08-15T02:00:00Z",
      };
      return `id: ${event.id}\nevent: status\ndata: ${JSON.stringify(payload)}\n\n`;
    })
    .join("");
}

const analysisRun = {
  analysis_id: analysisId,
  status: "partial",
  concept_name: "Rice Bowl Sambal",
  area_name: "Tebet, Jakarta Selatan",
  business_type: "food_stall",
  score: null,
  interpretation: null,
  rule_version: "lrs-v0.2-unvalidated",
  evidence_snapshot_version: "evidence-snapshot-unavailable-v1",
  correlation_id: correlationId,
  created_at: "2026-08-15T02:00:00Z",
  started_at: "2026-08-15T02:00:00Z",
  completed_at: "2026-08-15T02:00:05Z",
  failure_code: null,
  progress: {
    completed_stages: stages[4].completed,
    skipped_stages: [],
    current_stage: "validating_report",
    message: "Memvalidasi klaim",
    percent: 100,
  },
  warnings,
};

const analysisReport = {
  analysis_id: analysisId,
  report_version: "report-v1",
  status: "partial",
  generated_at: "2026-08-15T02:00:05Z",
  rule_version: "lrs-v0.2-unvalidated",
  evidence_snapshot_version: "evidence-snapshot-unavailable-v1",
  input_snapshot: {
    business_type: "food_stall",
    concept_name: "Rice Bowl Sambal",
    location: {
      area_id: "jabodetabek-tebet",
      area_name: null,
      latitude: -6.2,
      longitude: 106.8,
      analysis_radius_m: 1500,
    },
    pricing: { average_selling_price_idr: 18000, variable_cost_per_unit_idr: 11000 },
    operations: {
      initial_investment_idr: 15000000,
      fixed_cost_month_idr: 5000000,
      operating_days_month: 26,
      capacity_units_day: 80,
      volume_units_day: { min: 25, base: 40, max: 55 },
    },
    channels: ["takeaway"],
    value_proposition: "",
  },
  readiness: {
    rule_version: "lrs-v0.2-unvalidated",
    validation_status: "unvalidated",
    status: "unavailable",
    score: null,
    interpretation: null,
    interpretation_label: null,
    dimensions: [
      {
        key: "market_saturation",
        label: "Saturasi pasar",
        weight_percent: 20,
        status: "not_scorable",
        score: null,
        applied_rules: [],
        rationale: "Jumlah kompetitor belum tersedia.",
        missing_inputs: ["competitor_count"],
        evidence_metrics: ["competitor_count"],
      },
      {
        key: "demand_potential",
        label: "Potensi permintaan",
        weight_percent: 25,
        status: "not_scorable",
        score: null,
        applied_rules: [],
        rationale: "Data populasi belum tersedia.",
        missing_inputs: ["population_count"],
        evidence_metrics: ["population_count"],
      },
      {
        key: "price_positioning",
        label: "Posisi harga",
        weight_percent: 15,
        status: "not_scorable",
        score: null,
        applied_rules: [],
        rationale: "Harga pembanding belum tersedia.",
        missing_inputs: ["comparable_price_median_idr"],
        evidence_metrics: ["comparable_price_median_idr"],
      },
      {
        key: "operational_readiness",
        label: "Kesiapan operasional",
        weight_percent: 40,
        status: "scored",
        score: 92,
        applied_rules: ["OR-001a"],
        rationale: "Marjin kontribusi 40/40.",
        missing_inputs: [],
        evidence_metrics: [],
      },
    ],
    missing_dimensions: ["market_saturation", "demand_potential", "price_positioning"],
  },
  evidence_confidence: {
    formula_version: "evidence-confidence-v0.1-unvalidated",
    score: null,
    label: "tidak_tersedia",
    missing: ["competitor_count"],
  },
  market: {
    area_id: "jabodetabek-tebet",
    area_name: null,
    analysis_radius_m: 1500,
    category_mapping_version: "fnb-taxonomy-v1",
    competitor_count: null,
    population_count: null,
    comparable_price_median_idr: null,
    comparable_price_sample_size: null,
    notes: [],
  },
  synthetic_simulation: {
    status: "unavailable",
    reason: "Kunci penyedia model belum tersedia sehingga simulasi agent tidak dijalankan.",
    cohort_size: null,
    cohort_version: null,
    rounds: null,
    metrics: {},
    segments: [],
    objections: [],
    acceptable_price_band: null,
    quotes: [],
    limitations: [
      "Tidak ada kutipan persona pada laporan ini karena simulasi belum dijalankan.",
    ],
  },
  agent_review: {
    status: "unavailable",
    reason: "Kunci penyedia model belum tersedia sehingga simulasi agent tidak dijalankan.",
    label: "respons sintetis",
    manifest: null,
    market_observations: [],
    evidence_gaps: [],
    disagreements: [],
    finance_critiques: [],
    fragile_assumptions: [],
    narrative_sections: [],
    red_team_findings: [],
  },
  finance: {
    currency: "IDR",
    rule_version: "finance-v1",
    contribution_margin_per_unit_idr: 7000,
    contribution_margin_ratio_bps: 3889,
    bep_units_month: 715,
    bep_units_day: 28,
    bep_revenue_month_idr: 12857143,
    runway_months: 3,
    scenarios: [
      {
        name: "conservative",
        label: "Konservatif",
        volume_units_day: 25,
        monthly_units: 650,
        monthly_revenue_idr: 11700000,
        monthly_operating_profit_idr: -450000,
        payback_months: null,
        exceeds_capacity: false,
      },
      {
        name: "base",
        label: "Dasar",
        volume_units_day: 40,
        monthly_units: 1040,
        monthly_revenue_idr: 18720000,
        monthly_operating_profit_idr: 2280000,
        payback_months: 7,
        exceeds_capacity: false,
      },
      {
        name: "optimistic",
        label: "Optimistis",
        volume_units_day: 55,
        monthly_units: 1430,
        monthly_revenue_idr: 25740000,
        monthly_operating_profit_idr: 5010000,
        payback_months: 3,
        exceeds_capacity: false,
      },
    ],
    assumptions_included: ["Biaya tetap bulanan sesuai input pengguna"],
    assumptions_excluded: ["Pajak"],
    warnings: [],
  },
  risks: [],
  recommendations: [],
  evidence: [],
  missing_evidence: [
    {
      metric: "competitor_count",
      reason_code: "source_not_configured",
      reason: "Sumber data pasar belum tersedia untuk metrik ini.",
    },
  ],
  limitations: [
    "Bobot Launch Readiness Score berstatus hipotesis pada rule set lrs-v0.2-unvalidated dan belum melewati expert review maupun kalibrasi.",
    "Simulasi persona sintetis tidak tersedia pada laporan ini sehingga sinyal permintaan dari agent tidak dapat ditampilkan.",
  ],
  warnings,
  disclaimer: "Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha.",
};

async function mockApi(page: Page, options: { streamFails?: boolean } = {}) {
  await page.route("**/api/backend/v1/me", (route) => route.fulfill({ json: session }));
  await page.route("**/api/backend/v1/education/prerequisites*", (route) =>
    route.fulfill({ json: prerequisites }),
  );
  await page.route("**/api/backend/v1/analyses", (route) => {
    if (route.request().method() !== "POST") return route.fulfill({ json: [] });
    return route.fulfill({
      status: 202,
      json: {
        analysis_id: analysisId,
        // The worker has not started yet; this is what the API really returns.
        status: "queued",
        created_at: "2026-08-15T02:00:00Z",
        status_url: `/v1/analyses/${analysisId}`,
        events_url: `/v1/analyses/${analysisId}/events`,
      },
    });
  });

  await page.route(`**/api/backend/v1/analyses/${analysisId}/events`, (route) => {
    if (options.streamFails) return route.abort("failed");
    return route.fulfill({
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache, no-transform",
      },
      body: sseBody(stages),
    });
  });

  await page.route(`**/api/backend/v1/analyses/${analysisId}`, (route) =>
    route.fulfill({ json: analysisRun }),
  );
  await page.route(`**/api/backend/v1/analyses/${analysisId}/report`, (route) =>
    route.fulfill({ json: analysisReport }),
  );
}

async function fillAnalysisForm(page: Page) {
  await page.getByLabel("Nama konsep").fill("Rice Bowl Sambal");
  await page.getByLabel("Kode area Jabodetabek").fill("jabodetabek-tebet");
  await page.getByLabel("Harga jual rata-rata (Rp/unit)").fill("18000");
  await page.getByLabel("Biaya variabel per unit (Rp/unit)").fill("11000");
  await page.getByLabel("Modal awal (Rp)").fill("15000000");
  await page.getByLabel("Biaya tetap per bulan (Rp)").fill("5000000");
  await page.getByLabel("Kapasitas per hari (unit)").fill("80");
  await page.getByLabel("Volume harian minimum").fill("25");
  await page.getByLabel("Volume harian dasar").fill("40");
  await page.getByLabel("Volume harian maksimum").fill("55");
}

test("input analisis berlanjut ke proses live lalu laporan parsial", async ({ page }) => {
  await mockApi(page);

  await page.goto("/analisis");
  await fillAnalysisForm(page);
  await page.getByRole("button", { name: "Jalankan analisis" }).click();

  // The queued run leads to the progress screen, not straight to a report.
  await expect(page).toHaveURL(new RegExp(`/analisis/${analysisId}$`));
  await expect(page.getByRole("heading", { name: "Proses analisis", level: 1 })).toBeVisible();

  // Every stage is listed, including the simulation stage.
  await expect(page.getByText("Empat council agent berjalan", { exact: false })).toBeVisible();

  // Progress comes from the server, and the run ends partial.
  await expect(page.getByText("Selesai sebagian").first()).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await expect(
    page.getByText("Simulasi agent tidak tersedia sehingga laporan hanya memuat", {
      exact: false,
    }).first(),
  ).toBeVisible();

  // The report renders below, with the failed section still in place.
  await expect(page.getByText("Laporan selesai sebagian")).toBeVisible();
  await expect(page.getByText("06 Simulasi persona sintetis")).toBeVisible();
  await expect(page.getByText("07 Tinjauan agent")).toBeVisible();
  await expect(page.getByText("Skor tidak tersedia")).toBeVisible();
  await expect(
    page.getByText("Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha."),
  ).toBeVisible();
});

test("status tetap tampil lewat polling ketika SSE gagal", async ({ page }) => {
  await mockApi(page, { streamFails: true });
  await page.addInitScript(() => {
    Object.defineProperty(window, "EventSource", { value: undefined });
  });

  await page.goto(`/analisis/${analysisId}`);

  // Tidak ada satu pun event yang sampai, jadi seluruh isi layar ini hanya bisa
  // berasal dari polling `GET /v1/analyses/{id}`.
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await expect(page.getByText("Selesai sebagian").first()).toBeVisible();
  await expect(page.getByText("Laporan selesai sebagian")).toBeVisible();
  await expect(page.getByText("06 Simulasi persona sintetis")).toBeVisible();
});

test("sesi berakhir saat submit tidak membuang isian", async ({ page }) => {
  await page.route("**/api/backend/v1/me", (route) => route.fulfill({ json: session }));
  await page.route("**/api/backend/v1/education/prerequisites*", (route) =>
    route.fulfill({ json: prerequisites }),
  );
  await page.route("**/api/backend/v1/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: {} }),
  );
  await page.route("**/api/backend/v1/analyses", (route) =>
    route.fulfill({
      status: 401,
      json: {
        error: {
          code: "UNAUTHORIZED",
          message: "Silakan masuk terlebih dahulu.",
          fields: [],
          correlation_id: correlationId,
          retryable: false,
        },
      },
    }),
  );

  await page.goto("/analisis");
  await fillAnalysisForm(page);
  await page.getByRole("button", { name: "Jalankan analisis" }).click();

  await expect(page.getByText("Sesi kamu sudah berakhir")).toBeVisible();
  // The draft is still on screen, so signing in again does not cost the input.
  await expect(page.getByLabel("Nama konsep")).toHaveValue("Rice Bowl Sambal");
  await expect(page.getByLabel("Harga jual rata-rata (Rp/unit)")).toHaveValue("18000");
});
