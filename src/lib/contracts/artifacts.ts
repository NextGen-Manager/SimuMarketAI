import { z } from "zod";
import { transactionSchema } from "@/lib/contracts/operations";

export const signedTransferSchema = z.object({
  method: z.enum(["PUT", "GET"]),
  url: z.string(),
  expires_at: z.iso.datetime(),
});

export const receiptStatusSchema = z.enum([
  "created",
  "uploading",
  "queued",
  "preprocessing",
  "extracting",
  "ready_for_review",
  "confirmed",
  "committed",
  "failed",
  "cancelled",
]);

const confidenceFieldSchema = z.object({
  value: z.union([z.string(), z.int(), z.null()]),
  confidence: z.number().min(0).max(1).nullable(),
});

export const receiptCreatedSchema = z.object({
  receipt_import_id: z.uuid(),
  status: z.literal("uploading"),
  upload: signedTransferSchema,
});

export const receiptDraftItemSchema = z.object({
  position: z.int().nonnegative(),
  raw_name: z.string(),
  matched_product_id: z.uuid().nullable(),
  quantity: z.int().positive(),
  unit_price_idr: z.int().nonnegative(),
  line_total_idr: z.int().nonnegative(),
  confidence: z.number().min(0).max(1).nullable(),
  corrected: z.boolean(),
});

export const receiptImportSchema = z.object({
  receipt_import_id: z.uuid(),
  business_id: z.uuid(),
  status: receiptStatusSchema,
  draft: z
    .object({
      version: z.int().positive(),
      merchant_name: confidenceFieldSchema,
      occurred_at: confidenceFieldSchema,
      items: z.array(receiptDraftItemSchema),
      total_idr: confidenceFieldSchema,
      calculated_items_total_idr: z.int().nonnegative(),
      total_matches_items: z.boolean(),
    })
    .nullable(),
  warnings: z.array(z.string()),
  image: signedTransferSchema.nullable(),
  failure_code: z.string().nullable(),
  transaction: transactionSchema.nullable(),
});

export const receiptConfirmSchema = z.object({
  receipt_import_id: z.uuid(),
  status: z.literal("committed"),
  transaction: transactionSchema,
});

export const exportSchema = z.object({
  export_id: z.uuid(),
  kind: z.enum(["analysis_report", "transaction_summary"]),
  status: z.enum(["queued", "processing", "ready", "failed", "expired"]),
  created_at: z.iso.datetime(),
  download: signedTransferSchema.nullable(),
  failure_code: z.string().nullable(),
});

export type ReceiptImport = z.infer<typeof receiptImportSchema>;
export type ReceiptDraftItem = z.infer<typeof receiptDraftItemSchema>;
export type ExportArtifact = z.infer<typeof exportSchema>;
