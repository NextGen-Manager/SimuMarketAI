/**
 * Payloads shaped exactly like the backend contract. They exist so the tests
 * can prove the UI renders what the server sent, including the parts that are
 * deliberately undefined.
 */

export const analysisId = "8ff7d369-924a-4d6e-ac0e-4c94aa868d0a";

export const analysisInput = {
  business_type: "food_stall",
  concept_name: "Rice Bowl Sambal",
  location: {
    area_id: "jabodetabek-tebet",
    area_name: "Tebet, Jakarta Selatan",
    latitude: -6.2,
    longitude: 106.8,
    analysis_radius_m: 1500,
  },
  pricing: {
    average_selling_price_idr: 18000,
    variable_cost_per_unit_idr: 11000,
  },
  operations: {
    initial_investment_idr: 15000000,
    fixed_cost_month_idr: 5000000,
    operating_days_month: 26,
    capacity_units_day: 80,
    volume_units_day: { min: 25, base: 40, max: 55 },
  },
  channels: ["takeaway", "delivery"],
  value_proposition: "Makan siang cepat dengan pilihan sambal",
};

export const analysisRun = {
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
    completed_stages: [
      "queued",
      "collecting_evidence",
      "building_context",
      "calculating_finance",
      "scoring",
      "composing_report",
      "validating_report",
    ],
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
    {
      code: "evidence_missing",
      stage: "collecting_evidence",
      message: "Bukti berikut belum tersedia: jumlah kompetitor pada radius analisis.",
    },
  ],
};

const dimensions = [
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
    rationale: "Data populasi atau kompetitor belum tersedia.",
    missing_inputs: ["population_count", "competitor_count"],
    evidence_metrics: ["population_count", "competitor_count"],
  },
  {
    key: "price_positioning",
    label: "Posisi harga",
    weight_percent: 15,
    status: "not_scorable",
    score: null,
    applied_rules: [],
    rationale: "Harga pembanding pasar belum tersedia.",
    missing_inputs: ["comparable_price_median_idr"],
    evidence_metrics: ["comparable_price_median_idr", "comparable_price_sample_size"],
  },
  {
    key: "operational_readiness",
    label: "Kesiapan operasional",
    weight_percent: 40,
    status: "scored",
    score: 92,
    applied_rules: ["OR-001a", "OR-002a", "OR-003b", "OR-004a"],
    rationale:
      "Marjin kontribusi 40/40, kapasitas terhadap BEP 30/30, runway 12/20, volume terhadap kapasitas 10/10.",
    missing_inputs: [],
    evidence_metrics: [],
  },
];

export const financeResult = {
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
      // Deliberately not volume * days * price: the UI must print the server
      // value instead of recomputing it.
      monthly_revenue_idr: 18720001,
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
  assumptions_included: ["Biaya variabel per unit (HPP) sesuai input pengguna"],
  assumptions_excluded: ["Pajak", "Depresiasi", "Gaji pemilik"],
  warnings: [
    {
      code: "operating_profit_not_positive",
      scenario: "conservative",
      message:
        "Laba operasional bulanan skenario konservatif tidak positif sehingga payback tidak terdefinisi.",
    },
  ],
};

export const analysisReport = {
  analysis_id: analysisId,
  report_version: "report-v1",
  status: "partial",
  generated_at: "2026-08-15T02:00:01Z",
  rule_version: "lrs-v0.2-unvalidated",
  evidence_snapshot_version: "evidence-snapshot-unavailable-v1",
  input_snapshot: analysisInput,
  readiness: {
    rule_version: "lrs-v0.2-unvalidated",
    validation_status: "unvalidated",
    status: "unavailable",
    score: null,
    interpretation: null,
    interpretation_label: null,
    dimensions,
    missing_dimensions: ["market_saturation", "demand_potential", "price_positioning"],
  },
  evidence_confidence: {
    formula_version: "evidence-confidence-v0.1-unvalidated",
    score: null,
    label: "tidak_tersedia",
    missing: [
      "competitor_count",
      "population_count",
      "comparable_price_median_idr",
      "comparable_price_sample_size",
    ],
  },
  market: {
    area_id: "jabodetabek-tebet",
    area_name: "Tebet, Jakarta Selatan",
    analysis_radius_m: 1500,
    category_mapping_version: "fnb-taxonomy-v1",
    competitor_count: null,
    population_count: null,
    comparable_price_median_idr: null,
    comparable_price_sample_size: null,
    notes: ["Jumlah kompetitor pada radius analisis: Sumber data pasar belum tersedia."],
  },
  synthetic_simulation: {
    status: "unavailable",
    reason:
      "Simulasi agent belum dijalankan karena integrasi OASIS belum aktif pada versi ini.",
    cohort_size: null,
    metrics: {},
    limitations: [
      "Tidak ada kutipan persona pada laporan ini karena simulasi belum dijalankan.",
    ],
  },
  finance: financeResult,
  risks: [
    {
      id: "RISK-SCORE-001",
      severity: "tinggi",
      title: "Skor kelayakan belum dapat dihitung",
      detail: "Dimensi yang belum dapat dinilai: Saturasi pasar.",
      source: "score.status",
    },
  ],
  recommendations: [
    {
      id: "REC-EVIDENCE-competitor_count",
      priority: "sedang",
      title: "Kumpulkan data jumlah kompetitor pada radius analisis",
      rationale: "Sumber data pasar belum tersedia untuk metrik ini.",
      source: "evidence.missing.competitor_count",
    },
  ],
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
