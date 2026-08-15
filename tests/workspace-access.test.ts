import { describe, expect, it } from "vitest";
import {
  activeNavigationHref,
  hasAnalysisAccess,
  hasOwnerAccess,
  primaryNavigation,
  workspaceNavigation,
} from "@/lib/workspace-access";
import type { Membership } from "@/lib/contracts/auth";

const cashier: Membership = {
  business_id: "47b6be46-a366-4e37-b406-90c6758902a5",
  business_name: "Kedai Uji",
  location_name: "Tebet",
  role: "cashier",
};

const owner: Membership = { ...cashier, role: "owner" };

describe("workspace access", () => {
  it("limits a cashier-only account to dashboard and transaction entry", () => {
    const navigation = workspaceNavigation([cashier]);
    expect(navigation.map((item) => item.href)).toEqual(["/beranda", "/transaksi/catat"]);
    expect(hasOwnerAccess([cashier])).toBe(false);
  });

  it("keeps analysis, report, and education out of cashier navigation", () => {
    const hrefs = workspaceNavigation([cashier]).map((item) => item.href);
    expect(hrefs).not.toContain("/analisis");
    expect(hrefs).not.toContain("/analisis/riwayat");
    expect(hrefs).not.toContain("/laporan");
    expect(hrefs).not.toContain("/edukasi");
    expect(primaryNavigation([cashier]).map((item) => item.href)).not.toContain("/analisis");
    expect(hasAnalysisAccess([cashier])).toBe(false);
  });

  it("uses owner navigation when at least one business is owned", () => {
    expect(hasOwnerAccess([cashier, owner])).toBe(true);
    const hrefs = workspaceNavigation([cashier, owner]).map((item) => item.href);
    expect(hrefs).toContain("/analitik");
    expect(hrefs).toContain("/analisis");
    expect(hrefs).toContain("/analisis/riwayat");
    expect(hrefs).toContain("/laporan");
    expect(hrefs).toContain("/edukasi");
  });

  it("lets a brand new account reach analysis and education before owning a business", () => {
    const hrefs = workspaceNavigation([]).map((item) => item.href);
    expect(hrefs).toEqual(["/beranda", "/analisis", "/edukasi", "/pengaturan"]);
    expect(hasAnalysisAccess([])).toBe(true);
  });

  it("keeps the narrow-screen bar to the day to day destinations", () => {
    expect(primaryNavigation([owner]).length).toBeLessThanOrEqual(4);
    expect(primaryNavigation([owner]).map((item) => item.href)).toContain("/beranda");
  });

  it("marks the longest matching destination as active", () => {
    const navigation = workspaceNavigation([owner]);
    expect(activeNavigationHref("/analisis/riwayat", navigation)).toBe("/analisis/riwayat");
    expect(activeNavigationHref("/analisis", navigation)).toBe("/analisis");
    expect(activeNavigationHref("/laporan/8ff7d369", navigation)).toBe("/laporan");
    expect(activeNavigationHref("/tidak-ada", navigation)).toBeNull();
  });
});
