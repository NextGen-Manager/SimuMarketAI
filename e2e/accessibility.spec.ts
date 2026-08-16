import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", name: "halaman utama" },
  { path: "/masuk", name: "halaman masuk" },
  { path: "/daftar", name: "halaman daftar" },
];

for (const route of publicRoutes) {
  test(`${route.name} tidak memiliki pelanggaran WCAG 2.1 AA otomatis`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route.path, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.flatMap((node) => node.target),
      })),
    ).toEqual([]);
  });
}

test("respons frontend membawa header keamanan", async ({ request }) => {
  const response = await request.get("/");

  expect(response.headers()["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
  expect(response.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response.headers()["strict-transport-security"]).toBe(
    "max-age=31536000; includeSubDomains",
  );
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
});
