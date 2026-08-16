import { expect, test, type Page } from "@playwright/test";

const userId = "c448be66-439a-47f3-8bf5-1bf1f08dc102";
const businessId = "47b6be46-a366-4e37-b406-90c6758902a5";
const productId = "dc05e622-351d-458d-91a1-3933d50af405";

function session(role: "owner" | "cashier") {
  return {
    user: {
      id: userId,
      email: `${role}@example.test`,
      display_name: role === "owner" ? "Pemilik Uji" : "Kasir Uji",
      created_at: "2026-08-14T01:00:00Z",
    },
    memberships: [
      {
        business_id: businessId,
        business_name: "Kedai Uji",
        location_name: "Tebet",
        role,
      },
    ],
  };
}

async function mockSession(page: Page, role: "owner" | "cashier") {
  await page.route("**/api/backend/v1/me", (route) => route.fulfill({ json: session(role) }));
}

test("owner can log in and receives owner navigation", async ({ page }) => {
  await page.route("**/api/backend/v1/auth/login", (route) => route.fulfill({ json: session("owner") }));
  await mockSession(page, "owner");
  await page.route("**/api/backend/v1/dashboard", (route) =>
    route.fulfill({
      json: {
        keadaan: "belum_ada_data",
        analisis_terakhir: null,
        rencana_30_hari: { total: 0, selesai: 0, berikutnya: [] },
        transaksi: { hari_tercatat: 0, ambang: 7, hari_ini: { jumlah: 0, pendapatan_idr: 0 } },
        insight_terbaru: null,
        edukasi: { total: 0, selesai: 0 },
        riwayat_analisis: [],
      },
    }),
  );

  await page.goto("/masuk");
  await page.getByLabel("Email").fill("owner@example.test");
  await page.getByLabel("Kata sandi").fill("kata-sandi-uji");
  await page.getByRole("button", { name: "Masuk" }).click();

  await expect(page).toHaveURL(/\/beranda$/);
  await expect(page.getByRole("link", { name: "Analitik", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Produk", exact: true }).first()).toBeVisible();
});

test("cashier only sees permitted navigation and can record a sale", async ({
  page,
  browserName,
}) => {
  if (browserName === "chromium") {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await mockSession(page, "cashier");
  await page.route("**/api/backend/v1/products?*", (route) =>
    route.fulfill({
      json: [
        {
          access: "cashier",
          id: productId,
          business_id: businessId,
          name: "Kopi susu",
          selling_price_idr: 18_000,
          is_active: true,
        },
      ],
    }),
  );
  await page.route("**/api/backend/v1/transactions", (route) =>
    route.fulfill({
      status: 201,
      json: {
        id: "ac729b4f-b42d-4af0-8aeb-bceb43d58a16",
        business_id: businessId,
        occurred_at: "2026-08-14T08:00:00Z",
        channel: "dine_in",
        gross_total_idr: 18_000,
        source: "manual",
        client_reference: "browser-test",
        items: [
          {
            product_id: productId,
            product_name: "Kopi susu",
            quantity: 1,
            unit_price_idr: 18_000,
            line_total_idr: 18_000,
          },
        ],
      },
    }),
  );

  await page.goto("/transaksi/catat");
  await expect(page.getByText("Ruang kerja kasir")).toBeVisible();
  await expect(page.getByRole("link", { name: "Analitik", exact: true })).toHaveCount(0);
  const startedAt = Date.now();
  await page.getByRole("button", { name: "Tambah Kopi susu" }).click();
  await page.getByRole("button", { name: "Simpan transaksi" }).click();
  await expect(page.getByText("Transaksi berhasil dicatat")).toBeVisible();
  await expect(page.getByRole("status").getByText("Rp 18.000")).toBeVisible();
  expect(Date.now() - startedAt).toBeLessThan(10_000);
});
