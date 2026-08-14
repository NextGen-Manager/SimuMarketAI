import { describe, expect, it } from "vitest";
import { hasOwnerAccess, workspaceNavigation } from "@/lib/workspace-access";
import type { Membership } from "@/lib/contracts/auth";

const cashier: Membership = {
  business_id: "47b6be46-a366-4e37-b406-90c6758902a5",
  business_name: "Kedai Uji",
  location_name: "Tebet",
  role: "cashier",
};

describe("workspace access", () => {
  it("limits a cashier-only account to dashboard and transaction entry", () => {
    const navigation = workspaceNavigation([cashier]);
    expect(navigation.map((item) => item.href)).toEqual(["/beranda", "/transaksi/catat"]);
    expect(hasOwnerAccess([cashier])).toBe(false);
  });

  it("uses owner navigation when at least one business is owned", () => {
    const owner = { ...cashier, role: "owner" as const };
    expect(hasOwnerAccess([cashier, owner])).toBe(true);
    expect(workspaceNavigation([cashier, owner]).map((item) => item.href)).toContain("/analitik");
  });

  it("gives a new account an onboarding path without labeling it cashier", () => {
    expect(workspaceNavigation([]).map((item) => item.href)).toEqual(["/beranda", "/pengaturan"]);
  });
});
