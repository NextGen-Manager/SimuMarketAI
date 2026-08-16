import { expect, test, type Page } from "@playwright/test";

const businessId = "47b6be46-a366-4e37-b406-90c6758902a5";
const moduleId = "0f3f6d0e-93b5-4d3c-9b31-04e1f6d7f0a2";
const analysisId = "8ff7d369-924a-4d6e-ac0e-4c94aa868d0a";

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

const moduleSummary = {
  id: moduleId,
  slug: "dasar-hpp",
  title: "Menghitung HPP dan marjin",
  summary: "Dasar perhitungan harga pokok penjualan.",
  topic: "finansial",
  content_version: "v1",
  estimated_minutes: 8,
  business_types: ["food_stall"],
  is_required: true,
  reviewed_at: "2026-08-01T00:00:00Z",
  progress: null,
};

const moduleDetail = {
  ...moduleSummary,
  body: "Marjin kontribusi adalah harga jual dikurangi biaya variabel per unit.",
  passing_score_percent: 70,
  questions: [
    {
      id: "3b0c7b6a-1f14-4d0f-9d1f-6a3f9d0a1e77",
      position: 0,
      prompt: "Marjin kontribusi dihitung dari?",
      options: [
        "Harga jual dikurangi biaya variabel",
        "Harga jual dikurangi biaya tetap",
        "Biaya tetap dibagi kapasitas",
      ],
    },
  ],
};

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
  correlation_id: "3d0b0f70-9a2f-4a4e-8e5d-9d84f6a4a6f1",
  created_at: "2026-08-15T02:00:00Z",
  started_at: "2026-08-15T02:00:00Z",
  completed_at: "2026-08-15T02:00:01Z",
  failure_code: null,
  progress: {
    completed_stages: ["queued", "collecting_evidence", "validating_report"],
    skipped_stages: ["simulating"],
    current_stage: "validating_report",
    message: "Memvalidasi klaim",
    percent: 100,
  },
  warnings: [
    {
      code: "simulation_skipped",
      stage: "simulating",
      message:
        "Simulasi agent belum dijalankan karena integrasi OASIS belum aktif pada versi ini.",
    },
  ],
};

const analysisReport = {
  analysis_id: analysisId,
  report_version: "report-v1",
  status: "partial",
  generated_at: "2026-08-15T02:00:01Z",
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
    reason:
      "Simulasi agent belum dijalankan karena integrasi OASIS belum aktif pada versi ini.",
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
    reason:
      "Simulasi agent belum dijalankan karena integrasi OASIS belum aktif pada versi ini.",
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
  ],
  warnings: analysisRun.warnings,
  disclaimer: "Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha.",
};

async function mockApi(page: Page, state: { satisfied: () => boolean }) {
  await page.route("**/api/backend/v1/me", (route) => route.fulfill({ json: session }));
  await page.route("**/api/backend/v1/education/modules", (route) =>
    route.fulfill({
      json: [
        state.satisfied()
          ? {
              ...moduleSummary,
              progress: {
                module_id: moduleId,
                content_version: "v1",
                started_at: "2026-08-15T01:00:00Z",
                completed_at: "2026-08-15T01:05:00Z",
                correct_answers: 1,
                total_questions: 1,
                passed: true,
              },
            }
          : moduleSummary,
      ],
    }),
  );
  await page.route(`**/api/backend/v1/education/modules/${moduleId}`, (route) =>
    route.fulfill({ json: moduleDetail }),
  );
  await page.route(`**/api/backend/v1/education/modules/${moduleId}/complete`, (route) =>
    route.fulfill({
      json: {
        module_id: moduleId,
        content_version: "v1",
        passed: true,
        correct_answers: 1,
        total_questions: 1,
        passing_score_percent: 70,
        completed_at: "2026-08-15T01:05:00Z",
      },
    }),
  );
  await page.route("**/api/backend/v1/education/prerequisites*", (route) => {
    const entry = {
      id: moduleId,
      slug: "dasar-hpp",
      title: "Menghitung HPP dan marjin",
      content_version: "v1",
      estimated_minutes: 8,
      completed: state.satisfied(),
    };
    return route.fulfill({
      json: {
        rule_version: "education-gate-v1",
        business_type: "food_stall",
        satisfied: state.satisfied(),
        content_available: true,
        required: [entry],
        outstanding: state.satisfied() ? [] : [entry],
        note: null,
      },
    });
  });
  await page.route("**/api/backend/v1/analyses", (route) => {
    if (route.request().method() !== "POST") {
      return route.fulfill({ json: [] });
    }
    // The gate is enforced by the API too, not only by the button.
    if (!state.satisfied()) {
      return route.fulfill({
        status: 409,
        json: {
          error: {
            code: "EDUCATION_PREREQUISITE_NOT_MET",
            message: "Selesaikan modul edukasi prasyarat sebelum menjalankan analisis.",
            fields: [],
            correlation_id: "5a3f2c1e-7b1a-4b0e-9d2a-1c8f7e6d5b4a",
            retryable: false,
          },
        },
      });
    }
    return route.fulfill({
      status: 202,
      json: {
        analysis_id: analysisId,
        // The worker has not run yet; the API answers before any work happens.
        status: "queued",
        created_at: "2026-08-15T02:00:00Z",
        status_url: `/v1/analyses/${analysisId}`,
        events_url: `/v1/analyses/${analysisId}/events`,
      },
    });
  });
  await page.route(`**/api/backend/v1/analyses/${analysisId}/events`, (route) =>
    route.fulfill({
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache, no-transform",
      },
      body:
        `id: 1
event: status
data: ${JSON.stringify({
          schema_version: "analysis-event-v1",
          event_id: "1",
          analysis_id: analysisId,
          status: "partial",
          current_stage: "validating_report",
          completed_stages: analysisRun.progress.completed_stages,
          skipped_stages: analysisRun.progress.skipped_stages,
          percent: 100,
          message: "Memvalidasi klaim",
          warnings: analysisRun.warnings,
          correlation_id: analysisRun.correlation_id,
          occurred_at: "2026-08-15T02:00:01Z",
        })}

`,
    }),
  );
  await page.route(`**/api/backend/v1/analyses/${analysisId}`, (route) =>
    route.fulfill({ json: analysisRun }),
  );
  await page.route(`**/api/backend/v1/analyses/${analysisId}/report`, (route) =>
    route.fulfill({ json: analysisReport }),
  );
}

test("education gate blocks the analysis, then the report renders honestly", async ({
  page,
}) => {
  let completed = false;
  await mockApi(page, { satisfied: () => completed });

  await page.goto("/analisis");
  await expect(page.getByText("Selesaikan modul edukasi dulu")).toBeVisible();
  await expect(page.getByRole("link", { name: "Selesaikan modul dulu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Jalankan analisis" })).toHaveCount(0);

  await page.goto("/edukasi");
  await expect(page.getByText("0 dari 1 modul selesai.")).toBeVisible();
  await page.getByRole("link", { name: "Menghitung HPP dan marjin" }).click();
  await page.getByLabel("Harga jual dikurangi biaya variabel").check();
  completed = true;
  await page.getByRole("button", { name: "Kirim jawaban" }).click();
  await expect(page.getByText("Modul selesai")).toBeVisible();

  await page.goto("/analisis");
  await expect(page.getByRole("button", { name: "Jalankan analisis" })).toBeVisible();

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
  await page.getByRole("button", { name: "Jalankan analisis" }).click();

  // A queued run goes to the live progress screen, which renders the report
  // itself once the server reports a terminal status.
  await expect(page).toHaveURL(new RegExp(`/analisis/${analysisId}$`));

  await expect(page.getByText("Laporan selesai sebagian")).toBeVisible();
  await expect(page.getByText("Skor tidak tersedia")).toBeVisible();
  await expect(
    page.getByText("lrs-v0.2-unvalidated · status validasi unvalidated"),
  ).toBeVisible();
  await expect(page.getByText("Skor keyakinan bukti")).toBeVisible();
  await expect(
    page.getByText("Sumber data pasar belum tersedia untuk metrik ini.", { exact: false }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(/Bobot Launch Readiness Score berstatus hipotesis/),
  ).toBeVisible();
  await expect(
    page.getByText("Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha."),
  ).toBeVisible();
  await expect(page.getByText("Tidak terdefinisi").first()).toBeVisible();
});

test("a cashier gets no analysis navigation and no analysis page", async ({ page }) => {
  await page.route("**/api/backend/v1/me", (route) =>
    route.fulfill({
      json: {
        ...session,
        memberships: [{ ...session.memberships[0], role: "cashier" }],
      },
    }),
  );

  await page.goto("/beranda");
  await expect(page.getByText("Ruang kerja kasir")).toBeVisible();
  await expect(page.getByRole("link", { name: "Analisis", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Laporan", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Edukasi", exact: true })).toHaveCount(0);

  await page.goto("/analisis");
  await expect(page.getByText("Halaman tidak tersedia")).toBeVisible();

  await page.goto("/edukasi");
  await expect(page.getByText("Halaman tidak tersedia")).toBeVisible();

  await page.goto(`/laporan/${analysisId}`);
  await expect(page.getByText("Halaman tidak tersedia")).toBeVisible();
});
