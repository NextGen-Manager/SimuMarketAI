import { z } from "zod";

const ownerProductSchema = z.object({
  access: z.literal("owner"),
  id: z.uuid(),
  business_id: z.uuid(),
  name: z.string(),
  selling_price_idr: z.int(),
  hpp_idr: z.int(),
  margin_idr: z.int(),
  is_active: z.boolean(),
}).strict();

const cashierProductSchema = z.object({
  access: z.literal("cashier"),
  id: z.uuid(),
  business_id: z.uuid(),
  name: z.string(),
  selling_price_idr: z.int(),
  is_active: z.boolean(),
}).strict();

export const productSchema = z.discriminatedUnion("access", [
  ownerProductSchema,
  cashierProductSchema,
]);
export const productsSchema = z.array(productSchema);

const observationWindowSchema = z.object({
  start: z.iso.date(),
  end: z.iso.date(),
  timezone: z.literal("Asia/Jakarta"),
});

const productSalesSchema = z.object({
  product_id: z.uuid(),
  product_name: z.string(),
  quantity: z.int(),
  revenue_idr: z.int(),
  exposure_days: z.int(),
});

const insightSchema = z.object({
  rule_version: z.literal("transaction-insight-v1"),
  message: z.string(),
  observation_window: observationWindowSchema,
});

export const analyticsSchema = z.object({
  status: z.enum(["collecting", "available"]),
  business_id: z.uuid(),
  days_recorded: z.int(),
  threshold_days: z.literal(7),
  observation_window: observationWindowSchema.nullable(),
  daily_sales: z.array(
    z.object({
      date: z.iso.date(),
      transaction_count: z.int(),
      revenue_idr: z.int(),
    }),
  ),
  product_sales: z.array(productSalesSchema),
  top_product: productSalesSchema.nullable(),
  bottom_product: productSalesSchema.nullable(),
  hourly_sales: z.array(
    z.object({
      hour: z.int(),
      transaction_count: z.int(),
      revenue_idr: z.int(),
    }),
  ),
  insights: z.array(insightSchema),
  limitations: z.array(z.string()),
});

const dashboardAnalysisSchema = z.object({
  id: z.uuid(),
  nama: z.string(),
  area: z.string(),
  skor: z.int(),
  interpretasi: z.string(),
  rule_version: z.string(),
  dibuat: z.iso.datetime(),
});

export const dashboardSchema = z.object({
  keadaan: z.enum([
    "belum_ada_data",
    "sudah_menganalisis",
    "usaha_berjalan_data_kurang",
    "usaha_berjalan_data_cukup",
    "kasir_belum_mencatat",
    "kasir_sudah_mencatat",
  ]),
  analisis_terakhir: dashboardAnalysisSchema.nullable(),
  rencana_30_hari: z.object({
    total: z.int(),
    selesai: z.int(),
    berikutnya: z.array(z.string()),
  }),
  transaksi: z.object({
    hari_tercatat: z.int(),
    ambang: z.literal(7),
    hari_ini: z.object({
      jumlah: z.int(),
      pendapatan_idr: z.int(),
    }),
  }),
  insight_terbaru: insightSchema.nullable(),
  edukasi: z.object({ total: z.int(), selesai: z.int() }),
  riwayat_analisis: z.array(dashboardAnalysisSchema),
});

export const transactionSchema = z.object({
  id: z.uuid(),
  business_id: z.uuid(),
  occurred_at: z.iso.datetime(),
  channel: z.string(),
  gross_total_idr: z.int(),
  source: z.string(),
  client_reference: z.string().nullable(),
  items: z.array(
    z.object({
      product_id: z.uuid(),
      product_name: z.string(),
      quantity: z.int(),
      unit_price_idr: z.int(),
      line_total_idr: z.int(),
    }),
  ),
});

export const transactionsSchema = z.array(transactionSchema);

export type Product = z.infer<typeof productSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
