import type { Membership } from "@/lib/contracts/auth";

export type NavigationItem = { href: string; label: string };
export type WorkspaceMode = "onboarding" | "owner" | "cashier";

const ownerNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda" },
  { href: "/transaksi", label: "Transaksi" },
  { href: "/analitik", label: "Analitik" },
  { href: "/produk", label: "Produk" },
  { href: "/pengaturan", label: "Pengaturan" },
];

const cashierNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda" },
  { href: "/transaksi/catat", label: "Catat transaksi" },
];

const onboardingNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda" },
  { href: "/pengaturan", label: "Mulai usaha" },
];

export function workspaceMode(memberships: Membership[]): WorkspaceMode {
  if (memberships.length === 0) return "onboarding";
  return memberships.some((membership) => membership.role === "owner") ? "owner" : "cashier";
}

export function hasOwnerAccess(memberships: Membership[]): boolean {
  return memberships.some((membership) => membership.role === "owner");
}

export function workspaceNavigation(memberships: Membership[]): NavigationItem[] {
  const mode = workspaceMode(memberships);
  if (mode === "owner") return ownerNavigation;
  if (mode === "onboarding") return onboardingNavigation;
  return cashierNavigation;
}
