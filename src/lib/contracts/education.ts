import { z } from "zod";

export const businessTypeSchema = z.enum([
  "food_stall",
  "coffee_shop",
  "restaurant",
  "bakery",
  "catering",
  "food_truck",
  "cloud_kitchen",
  "beverage_stand",
]);

export const businessTypeLabels: Record<z.infer<typeof businessTypeSchema>, string> = {
  food_stall: "Warung atau kedai makan",
  coffee_shop: "Kedai kopi",
  restaurant: "Restoran",
  bakery: "Toko roti dan kue",
  catering: "Katering",
  food_truck: "Food truck",
  cloud_kitchen: "Dapur satelit",
  beverage_stand: "Gerai minuman",
};

const educationProgressSchema = z.object({
  module_id: z.uuid(),
  content_version: z.string(),
  started_at: z.iso.datetime(),
  completed_at: z.iso.datetime().nullable(),
  correct_answers: z.int(),
  total_questions: z.int(),
  passed: z.boolean(),
});

export const educationModuleSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  topic: z.string(),
  content_version: z.string(),
  estimated_minutes: z.int(),
  business_types: z.array(businessTypeSchema),
  is_required: z.boolean(),
  reviewed_at: z.iso.datetime().nullable(),
  progress: educationProgressSchema.nullable(),
});

export const educationModulesSchema = z.array(educationModuleSchema);

/** The answer key never leaves the server, so the option index is not present. */
export const educationQuestionSchema = z
  .object({
    id: z.uuid(),
    position: z.int(),
    prompt: z.string(),
    options: z.array(z.string()),
  })
  .strict();

export const educationModuleDetailSchema = educationModuleSchema.extend({
  body: z.string().nullable(),
  passing_score_percent: z.int(),
  questions: z.array(educationQuestionSchema),
});

export const educationCompleteSchema = z.object({
  module_id: z.uuid(),
  content_version: z.string(),
  passed: z.boolean(),
  correct_answers: z.int(),
  total_questions: z.int(),
  passing_score_percent: z.int(),
  completed_at: z.iso.datetime().nullable(),
});

const prerequisiteModuleSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  content_version: z.string(),
  estimated_minutes: z.int(),
  completed: z.boolean(),
});

export const educationPrerequisitesSchema = z.object({
  rule_version: z.literal("education-gate-v1"),
  business_type: businessTypeSchema,
  satisfied: z.boolean(),
  content_available: z.boolean(),
  required: z.array(prerequisiteModuleSchema),
  outstanding: z.array(prerequisiteModuleSchema),
  note: z.string().nullable(),
});

export type BusinessType = z.infer<typeof businessTypeSchema>;
export type EducationModule = z.infer<typeof educationModuleSchema>;
export type EducationModuleDetail = z.infer<typeof educationModuleDetailSchema>;
export type EducationCompleteResult = z.infer<typeof educationCompleteSchema>;
export type EducationPrerequisites = z.infer<typeof educationPrerequisitesSchema>;
