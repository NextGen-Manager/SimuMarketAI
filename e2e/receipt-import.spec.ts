import { expect, test } from "@playwright/test";

const userId = "c448be66-439a-47f3-8bf5-1bf1f08dc102";
const businessId = "47b6be46-a366-4e37-b406-90c6758902a5";
const productId = "dc05e622-351d-458d-91a1-3933d50af405";
const receiptId = "d1adac7f-c1a6-4d23-ae18-038c407ec75d";
const transactionId = "70fcf067-d03d-4f1d-9395-d3ecf8a8ae41";

test("foto struk direview dengan keyboard sebelum menjadi transaksi", async ({ page }) => {
  let version = 1;
  let committed = false;
  await page.route("**/api/backend/v1/me", (route) =>
    route.fulfill({
      json: {
        user: {
          id: userId,
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
      },
    }),
  );
  await page.route("**/api/backend/v1/products?*", (route) =>
    route.fulfill({
      json: [
        {
          access: "owner",
          id: productId,
          business_id: businessId,
          name: "Rice Bowl Ayam",
          selling_price_idr: 18_000,
          hpp_idr: 9_000,
          margin_idr: 9_000,
          is_active: true,
        },
      ],
    }),
  );
  await page.route("**/api/backend/v1/receipt-imports?*", (route) =>
    route.fulfill({
      status: 201,
      json: {
        receipt_import_id: receiptId,
        status: "uploading",
        upload: {
          method: "PUT",
          url: "https://storage.example.test/upload",
          expires_at: "2026-08-16T08:10:00Z",
        },
      },
    }),
  );
  await page.route("https://storage.example.test/upload", (route) =>
    route.fulfill({ status: 200 }),
  );
  await page.route("**/complete-upload?*", (route) =>
    route.fulfill({ status: 202, json: receiptPayload(version, false) }),
  );
  await page.route(`**/api/backend/v1/receipt-imports/${receiptId}?*`, (route) =>
    route.fulfill({ json: receiptPayload(version, committed) }),
  );
  await page.route("https://storage.example.test/receipt", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: tinyPng() }),
  );
  await page.route("**/draft?*", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.items[0].matched_product_id).toBe(productId);
    version = 2;
    await route.fulfill({ json: receiptPayload(version, false) });
  });
  await page.route("**/confirm?*", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.accept_total_mismatch).toBe(true);
    committed = true;
    await route.fulfill({
      json: {
        receipt_import_id: receiptId,
        status: "committed",
        transaction: transaction(),
      },
    });
  });

  await page.goto("/transaksi/struk");
  await page.getByLabel("Foto struk").setInputFiles({
    name: "struk.png",
    mimeType: "image/png",
    buffer: tinyPng(),
  });
  await expect(page.getByRole("heading", { name: "Periksa hasil OCR" })).toBeVisible();
  await expect(page.getByLabel("Nama pada struk")).toBeFocused();
  await page.getByLabel("Cocokkan produk").selectOption(productId);
  await page.getByRole("button", { name: "Simpan koreksi" }).click();
  await expect(page.getByText("Jumlah item dari server: Rp 36.000")).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Konfirmasi dan catat transaksi" }).click();
  await expect(page.getByRole("heading", { name: "Transaksi berhasil dicatat" })).toBeVisible();
  await expect(page.getByText("Rp 36.000")).toBeVisible();
});

function receiptPayload(currentVersion: number, isCommitted: boolean) {
  return {
    receipt_import_id: receiptId,
    business_id: businessId,
    status: isCommitted ? "committed" : "ready_for_review",
    draft: isCommitted
      ? null
      : {
          version: currentVersion,
          merchant_name: { value: "Warung Contoh", confidence: 0.94 },
          occurred_at: { value: "2026-08-05T05:10:00Z", confidence: 0.81 },
          items: [
            {
              position: 0,
              raw_name: "RICE BOWL AYM",
              matched_product_id: currentVersion > 1 ? productId : null,
              quantity: 2,
              unit_price_idr: 18_000,
              line_total_idr: 36_000,
              confidence: 0.76,
              corrected: currentVersion > 1,
            },
          ],
          total_idr: { value: 40_000, confidence: 0.92 },
          calculated_items_total_idr: 36_000,
          total_matches_items: false,
        },
    warnings: isCommitted ? [] : ["Jumlah item berbeda dari total struk."],
    image: isCommitted
      ? null
      : {
          method: "GET",
          url: "https://storage.example.test/receipt",
          expires_at: "2026-08-16T08:10:00Z",
        },
    failure_code: null,
    transaction: isCommitted ? transaction() : null,
  };
}

function transaction() {
  return {
    id: transactionId,
    business_id: businessId,
    occurred_at: "2026-08-05T05:10:00Z",
    channel: "takeaway",
    gross_total_idr: 36_000,
    source: "receipt_ocr",
    client_reference: `receipt:${receiptId}`,
    items: [
      {
        product_id: productId,
        product_name: "Rice Bowl Ayam",
        quantity: 2,
        unit_price_idr: 18_000,
        line_total_idr: 36_000,
      },
    ],
  };
}

function tinyPng(): Buffer {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZlS8AAAAASUVORK5CYII=",
    "base64",
  );
}
