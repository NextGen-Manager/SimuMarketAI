import { describe, expect, it } from "vitest";
import {
  analysisListSchema,
  analysisReadSchema,
  analysisReportSchema,
} from "@/lib/contracts/analysis";
import {
  educationModuleDetailSchema,
  educationPrerequisitesSchema,
} from "@/lib/contracts/education";
import { analysisReport, analysisRun } from "./fixtures/analysis";

describe("analysis contracts", () => {
  it("accepts a partial report whose score and confidence are undefined", () => {
    const parsed = analysisReportSchema.safeParse(analysisReport);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.readiness.score).toBeNull();
    expect(parsed.data.evidence_confidence.score).toBeNull();
    expect(parsed.data.readiness.missing_dimensions).toHaveLength(3);
  });

  it("accepts a run whose progress skips the simulation stage", () => {
    const parsed = analysisReadSchema.safeParse(analysisRun);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.progress.skipped_stages).toEqual(["simulating"]);
    expect(parsed.data.progress.completed_stages).not.toContain("simulating");
  });

  it("rejects a report without the DSS disclaimer", () => {
    const parsed = analysisReportSchema.safeParse({
      ...analysisReport,
      disclaimer: "Analisis ini menjamin usahamu berhasil.",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a money field that arrives as a float", () => {
    const parsed = analysisReportSchema.safeParse({
      ...analysisReport,
      finance: {
        ...analysisReport.finance,
        contribution_margin_per_unit_idr: 7000.5,
      },
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a scored dimension that hides its rule version", () => {
    const parsed = analysisReportSchema.safeParse({
      ...analysisReport,
      readiness: { ...analysisReport.readiness, rule_version: "lrs-v0.3" },
    });
    expect(parsed.success).toBe(false);
  });

  it("keeps the unvalidated label mandatory on the score", () => {
    const parsed = analysisReportSchema.safeParse({
      ...analysisReport,
      readiness: { ...analysisReport.readiness, validation_status: "validated" },
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts an empty analysis history", () => {
    expect(analysisListSchema.safeParse([]).success).toBe(true);
  });
});

describe("education contracts", () => {
  it("rejects a question payload that leaks the answer key", () => {
    const parsed = educationModuleDetailSchema.safeParse({
      id: "0f3f6d0e-93b5-4d3c-9b31-04e1f6d7f0a2",
      slug: "dasar-hpp",
      title: "Menghitung HPP",
      summary: "Ringkasan",
      topic: "finansial",
      content_version: "v1",
      estimated_minutes: 8,
      business_types: ["food_stall"],
      is_required: true,
      reviewed_at: null,
      progress: null,
      body: null,
      passing_score_percent: 70,
      questions: [
        {
          id: "3b0c7b6a-1f14-4d0f-9d1f-6a3f9d0a1e77",
          position: 0,
          prompt: "Apa itu HPP?",
          options: ["A", "B"],
          correct_index: 1,
        },
      ],
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts prerequisites that are satisfied without any published module", () => {
    const parsed = educationPrerequisitesSchema.safeParse({
      rule_version: "education-gate-v1",
      business_type: "food_stall",
      satisfied: true,
      content_available: false,
      required: [],
      outstanding: [],
      note: "Belum ada modul edukasi terbit untuk jenis usaha ini.",
    });
    expect(parsed.success).toBe(true);
  });
});
