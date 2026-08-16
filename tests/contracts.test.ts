import { describe, expect, it } from "vitest";
import { dashboardSchema, productSchema } from "@/lib/contracts/operations";

describe("operational API contracts", () => {
  it("rejects cost and margin leakage in a cashier product payload", () => {
    const parsed = productSchema.safeParse({
      access: "cashier",
      id: "47b6be46-a366-4e37-b406-90c6758902a5",
      business_id: "c448be66-439a-47f3-8bf5-1bf1f08dc102",
      name: "Kopi susu",
      selling_price_idr: 18_000,
      hpp_idr: 8_000,
      margin_idr: 10_000,
      is_active: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts the backend-owned empty dashboard state without invented metrics", () => {
    const parsed = dashboardSchema.safeParse({
      keadaan: "belum_ada_data",
      analisis_terakhir: null,
      rencana_30_hari: { total: 0, selesai: 0, berikutnya: [] },
      transaksi: {
        hari_tercatat: 0,
        ambang: 7,
        hari_ini: { jumlah: 0, pendapatan_idr: 0 },
      },
      insight_terbaru: null,
      edukasi: { total: 0, selesai: 0 },
      riwayat_analisis: [],
    });
    expect(parsed.success).toBe(true);
  });
});
