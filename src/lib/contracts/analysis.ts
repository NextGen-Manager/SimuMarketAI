import { z } from "zod";
import { businessTypeSchema } from "@/lib/contracts/education";

export const analysisStageSchema = z.enum([
  "queued",
  "collecting_evidence",
  "building_context",
  "simulating",
  "calculating_finance",
  "scoring",
  "composing_report",
  "validating_report",
]);

export const analysisStatusSchema = z.enum([
  ...analysisStageSchema.options,
  "completed",
  "partial",
  "failed",
  "cancelled",
]);

export const salesChannelSchema = z.enum([
  "dine_in",
  "takeaway",
  "delivery",
  "catering_order",
]);

export const channelLabels: Record<z.infer<typeof salesChannelSchema>, string> = {
  dine_in: "Makan di tempat",
  takeaway: "Bawa pulang",
  delivery: "Pesan antar",
  catering_order: "Pesanan katering",
};

export const analysisInputSchema = z.object({
  business_type: businessTypeSchema,
  concept_name: z.string(),
  location: z.object({
    area_id: z.string(),
    area_name: z.string().nullable(),
    latitude: z.number(),
    longitude: z.number(),
    analysis_radius_m: z.int(),
  }),
  pricing: z.object({
    average_selling_price_idr: z.int(),
    variable_cost_per_unit_idr: z.int(),
  }),
  operations: z.object({
    initial_investment_idr: z.int(),
    fixed_cost_month_idr: z.int(),
    operating_days_month: z.int(),
    capacity_units_day: z.int(),
    volume_units_day: z.object({ min: z.int(), base: z.int(), max: z.int() }),
  }),
  channels: z.array(salesChannelSchema),
  value_proposition: z.string(),
});

const financeWarningSchema = z.object({
  code: z.string(),
  message: z.string(),
  scenario: z.enum(["conservative", "base", "optimistic"]).nullable(),
});

const financeScenarioSchema = z.object({
  name: z.enum(["conservative", "base", "optimistic"]),
  label: z.string(),
  volume_units_day: z.int(),
  monthly_units: z.int(),
  monthly_revenue_idr: z.int(),
  monthly_operating_profit_idr: z.int(),
  payback_months: z.int().nullable(),
  exceeds_capacity: z.boolean(),
});

export const financeResultSchema = z.object({
  currency: z.literal("IDR"),
  rule_version: z.literal("finance-v1"),
  contribution_margin_per_unit_idr: z.int(),
  contribution_margin_ratio_bps: z.int().nullable(),
  bep_units_month: z.int().nullable(),
  bep_units_day: z.int().nullable(),
  bep_revenue_month_idr: z.int().nullable(),
  runway_months: z.int().nullable(),
  scenarios: z.array(financeScenarioSchema),
  assumptions_included: z.array(z.string()),
  assumptions_excluded: z.array(z.string()),
  warnings: z.array(financeWarningSchema),
});

export const dimensionKeySchema = z.enum([
  "market_saturation",
  "demand_potential",
  "price_positioning",
  "operational_readiness",
]);

const dimensionScoreSchema = z.object({
  key: dimensionKeySchema,
  label: z.string(),
  weight_percent: z.int(),
  status: z.enum(["scored", "not_scorable"]),
  score: z.int().nullable(),
  applied_rules: z.array(z.string()),
  rationale: z.string(),
  missing_inputs: z.array(z.string()),
  evidence_metrics: z.array(z.string()),
});

export const scoreResultSchema = z.object({
  rule_version: z.literal("lrs-v0.2-unvalidated"),
  validation_status: z.literal("unvalidated"),
  status: z.enum(["available", "unavailable"]),
  score: z.int().nullable(),
  interpretation: z.string().nullable(),
  interpretation_label: z.string().nullable(),
  dimensions: z.array(dimensionScoreSchema),
  missing_dimensions: z.array(dimensionKeySchema),
});

const evidenceRecordSchema = z.object({
  metric: z.string(),
  value: z.int(),
  unit: z.string(),
  geography: z.object({
    type: z.enum(["radius", "area", "national"]),
    area_id: z.string().nullable(),
    center_id: z.string().nullable(),
    meters: z.int().nullable(),
  }),
  category_mapping_version: z.string().nullable(),
  source: z.string(),
  source_url: z.string().nullable(),
  observed_at: z.iso.datetime(),
  retrieved_at: z.iso.datetime(),
  quality: z.object({
    coverage: z.enum(["complete", "partial", "unknown"]),
    freshness: z.enum(["recent", "aging", "stale", "unknown"]),
    geographic_fit: z.number(),
    sample_sufficiency: z.number(),
    cross_source_consistency: z.number(),
    source_quality: z.number(),
    sample_size: z.int().nullable(),
  }),
  limitations: z.array(z.string()),
});

const missingEvidenceSchema = z.object({
  metric: z.string(),
  reason_code: z.string(),
  reason: z.string(),
});

export const analysisWarningSchema = z.object({
  code: z.string(),
  stage: analysisStageSchema.nullable(),
  message: z.string(),
});

/**
 * Label wajib pada setiap kutipan agent. Backend mengirimkannya bersama data
 * supaya tidak ada permukaan yang bisa lupa menampilkannya.
 */
export const SYNTHETIC_LABEL = "respons sintetis" as const;

export const syntheticSimulationSchema = z.object({
  status: z.enum(["unavailable", "experimental"]),
  reason: z.string().nullable(),
  cohort_size: z.int().nullable(),
  cohort_version: z.string().nullable(),
  rounds: z.int().nullable(),
  // Hitungan, bukan persentase: pembaginya harus tetap terlihat.
  metrics: z.record(z.string(), z.int()),
  segments: z.array(
    z.object({
      archetype: z.string(),
      label: z.string(),
      persona_count: z.int(),
      purchase_intent_count: z.int(),
    }),
  ),
  objections: z.array(
    z.object({ code: z.string(), label: z.string(), count: z.int() }),
  ),
  acceptable_price_band: z
    .object({ min_idr: z.int(), max_idr: z.int() })
    .nullable(),
  quotes: z.array(
    z.object({
      agent_id: z.string(),
      archetype: z.string(),
      text: z.string(),
      label: z.literal(SYNTHETIC_LABEL),
    }),
  ),
  limitations: z.array(z.string()),
});

export const agentReviewSchema = z.object({
  status: z.enum(["available", "partial", "unavailable"]),
  reason: z.string().nullable(),
  label: z.literal(SYNTHETIC_LABEL),
  manifest: z
    .object({
      adapter_id: z.string(),
      provider: z.string(),
      model_id: z.string(),
      prompt_version: z.string(),
      cohort_version: z.string(),
      oasis_version: z.string(),
      camel_version: z.string(),
      seed: z.int(),
      persona_count: z.int(),
      round_limit: z.int(),
      token_budget: z.int(),
      tokens_used: z.int(),
    })
    .nullable(),
  market_observations: z.array(
    z.object({
      id: z.string(),
      stance: z.enum(["opportunity", "risk", "uncertainty"]),
      claim: z.string(),
      evidence_metrics: z.array(z.string()),
      confidence: z.enum(["low", "medium", "high"]),
    }),
  ),
  evidence_gaps: z.array(z.string()),
  disagreements: z.array(z.string()),
  finance_critiques: z.array(
    z.object({
      id: z.string(),
      assumption: z.string(),
      concern: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      tool_call_ids: z.array(z.string()),
    }),
  ),
  fragile_assumptions: z.array(z.string()),
  narrative_sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
      source_artifact_types: z.array(z.string()),
    }),
  ),
  red_team_findings: z.array(z.string()),
});

/**
 * Satu transisi tahap yang dikirim lewat SSE. Bentuknya sama persis dengan yang
 * disimpan backend di PostgreSQL, sehingga reconnect dan polling menghasilkan
 * data yang identik.
 */
export const analysisEventSchema = z.object({
  schema_version: z.literal("analysis-event-v1"),
  event_id: z.string(),
  analysis_id: z.uuid(),
  status: analysisStatusSchema,
  current_stage: analysisStageSchema,
  completed_stages: z.array(analysisStageSchema),
  skipped_stages: z.array(analysisStageSchema),
  percent: z.int().min(0).max(100),
  message: z.string(),
  warnings: z.array(analysisWarningSchema),
  correlation_id: z.uuid(),
  occurred_at: z.iso.datetime(),
});

export const analysisReportSchema = z.object({
  analysis_id: z.uuid(),
  report_version: z.literal("report-v1"),
  status: analysisStatusSchema,
  generated_at: z.iso.datetime(),
  rule_version: z.literal("lrs-v0.2-unvalidated"),
  evidence_snapshot_version: z.string(),
  input_snapshot: analysisInputSchema,
  readiness: scoreResultSchema,
  evidence_confidence: z.object({
    formula_version: z.literal("evidence-confidence-v0.1-unvalidated"),
    score: z.number().nullable(),
    label: z.enum(["tinggi", "sedang", "rendah", "tidak_tersedia"]),
    missing: z.array(z.string()),
  }),
  market: z.object({
    area_id: z.string(),
    area_name: z.string().nullable(),
    analysis_radius_m: z.int(),
    category_mapping_version: z.string(),
    competitor_count: z.int().nullable(),
    population_count: z.int().nullable(),
    comparable_price_median_idr: z.int().nullable(),
    comparable_price_sample_size: z.int().nullable(),
    notes: z.array(z.string()),
  }),
  synthetic_simulation: syntheticSimulationSchema,
  agent_review: agentReviewSchema,
  finance: financeResultSchema,
  risks: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["tinggi", "sedang", "rendah"]),
      title: z.string(),
      detail: z.string(),
      source: z.string(),
    }),
  ),
  recommendations: z.array(
    z.object({
      id: z.string(),
      priority: z.enum(["tinggi", "sedang", "rendah"]),
      title: z.string(),
      rationale: z.string(),
      source: z.string(),
    }),
  ),
  evidence: z.array(evidenceRecordSchema),
  missing_evidence: z.array(missingEvidenceSchema),
  limitations: z.array(z.string()),
  warnings: z.array(analysisWarningSchema),
  disclaimer: z.literal(
    "Hasil adalah alat bantu keputusan, bukan jaminan keberhasilan usaha.",
  ),
});

export const analysisAcceptedSchema = z.object({
  analysis_id: z.uuid(),
  status: analysisStatusSchema,
  created_at: z.iso.datetime(),
  status_url: z.string(),
  events_url: z.string(),
});

export const analysisReadSchema = z.object({
  analysis_id: z.uuid(),
  status: analysisStatusSchema,
  concept_name: z.string(),
  area_name: z.string(),
  business_type: businessTypeSchema,
  score: z.int().nullable(),
  interpretation: z.string().nullable(),
  rule_version: z.string(),
  evidence_snapshot_version: z.string(),
  correlation_id: z.uuid(),
  created_at: z.iso.datetime(),
  started_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
  failure_code: z.string().nullable(),
  progress: z.object({
    completed_stages: z.array(analysisStageSchema),
    skipped_stages: z.array(analysisStageSchema),
    current_stage: analysisStageSchema,
    message: z.string(),
    percent: z.int(),
  }),
  warnings: z.array(analysisWarningSchema),
});

export const analysisListItemSchema = z.object({
  analysis_id: z.uuid(),
  status: analysisStatusSchema,
  concept_name: z.string(),
  area_name: z.string(),
  business_type: businessTypeSchema,
  score: z.int().nullable(),
  interpretation: z.string().nullable(),
  rule_version: z.string(),
  created_at: z.iso.datetime(),
});

export const analysisListSchema = z.array(analysisListItemSchema);

export const metricLabels: Record<string, string> = {
  competitor_count: "Jumlah kompetitor pada radius analisis",
  population_count: "Populasi pada radius analisis",
  comparable_price_median_idr: "Median harga produk pembanding",
  comparable_price_sample_size: "Jumlah observasi harga pembanding",
};

export const confidenceLabels: Record<string, string> = {
  tinggi: "Tinggi",
  sedang: "Sedang",
  rendah: "Rendah",
  tidak_tersedia: "Tidak tersedia",
};

export const statusLabels: Record<string, string> = {
  queued: "Menyiapkan run",
  collecting_evidence: "Mengumpulkan bukti",
  building_context: "Menyusun konteks",
  simulating: "Simulasi persona",
  calculating_finance: "Menghitung skenario",
  scoring: "Menilai kelayakan",
  composing_report: "Menyusun laporan",
  validating_report: "Memvalidasi klaim",
  completed: "Selesai",
  partial: "Selesai sebagian",
  failed: "Gagal",
  cancelled: "Dibatalkan",
};

/** Urutan tahap sesuai state machine docs/02. Dipakai untuk merender daftar. */
export const stageOrder = analysisStageSchema.options;

/** Yang terlihat bergerak di tiap tahap, sesuai tabel docs/12. */
export const stageDetails: Record<string, string> = {
  queued: "Run menunggu giliran di antrean worker.",
  collecting_evidence: "Mengambil bukti pasar beserta sumber dan waktu pengamatannya.",
  building_context: "Membekukan concept card yang dilihat seluruh persona.",
  simulating: "Empat council agent berjalan: pasar, persona, finansial, dan laporan.",
  calculating_finance: "Engine deterministik menghitung tiga skenario.",
  scoring: "Menilai empat dimensi kelayakan dari rule versioned.",
  composing_report: "Menyusun laporan dari artifact terstruktur.",
  validating_report: "Memeriksa aritmetika, provenance, dan klaim tanpa sumber.",
};

export const terminalStatuses = ["completed", "partial", "failed", "cancelled"] as const;

export function isTerminalStatus(status: string): boolean {
  return (terminalStatuses as readonly string[]).includes(status);
}

export const failureCodeLabels: Record<string, string> = {
  report_validation_failed:
    "Laporan tidak lolos pemeriksaan klaim sehingga tidak disimpan.",
  invalid_finance_input: "Isian finansial tidak dapat dipakai untuk perhitungan.",
  input_snapshot_missing: "Snapshot input untuk run ini tidak ditemukan.",
  internal_error: "Terjadi gangguan pada sistem saat menjalankan analisis.",
};

export type AnalysisReport = z.infer<typeof analysisReportSchema>;
export type AnalysisEvent = z.infer<typeof analysisEventSchema>;
export type AnalysisStage = z.infer<typeof analysisStageSchema>;
export type AgentReview = z.infer<typeof agentReviewSchema>;
export type SyntheticSimulation = z.infer<typeof syntheticSimulationSchema>;
export type AnalysisRead = z.infer<typeof analysisReadSchema>;
export type AnalysisListItem = z.infer<typeof analysisListItemSchema>;
export type AnalysisInput = z.infer<typeof analysisInputSchema>;
export type FinanceResult = z.infer<typeof financeResultSchema>;
export type ScoreResult = z.infer<typeof scoreResultSchema>;
export type SalesChannel = z.infer<typeof salesChannelSchema>;
