import { describe, expect, it } from "vitest";
import { formatIDR } from "@/lib/format";

describe("formatIDR", () => {
  it("formats integer rupiah with Indonesian grouping", () => {
    expect(formatIDR(18500)).toBe("Rp 18.500");
  });

  it("formats zero without falling back to a dash", () => {
    expect(formatIDR(0)).toBe("Rp 0");
  });

  it("formats millions", () => {
    expect(formatIDR(15000000)).toBe("Rp 15.000.000");
  });

  it("says so plainly when a value is missing, never a dash or NaN", () => {
    expect(formatIDR(null)).toBe("Tidak tersedia");
    expect(formatIDR(undefined)).toBe("Tidak tersedia");
  });
});
