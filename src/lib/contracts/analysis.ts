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
  synthetic_simulation: z.object({
    status: z.enum(["unavailable", "experimental"]),
    reason: z.string().nullable(),
    cohort_size: z.int().nullable(),
    metrics: z.record(z.string(), z.int()),
    limitations: z.array(z.string()),
  }),
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

export type AnalysisReport = z.infer<typeof analysisReportSchema>;
export type AnalysisRead = z.infer<typeof analysisReadSchema>;
export type AnalysisListItem = z.infer<typeof analysisListItemSchema>;
export type AnalysisInput = z.infer<typeof analysisInputSchema>;
export type FinanceResult = z.infer<typeof financeResultSchema>;
export type ScoreResult = z.infer<typeof scoreResultSchema>;
export type SalesChannel = z.infer<typeof salesChannelSchema>;
