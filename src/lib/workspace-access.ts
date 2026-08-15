import type { Membership } from "@/lib/contracts/auth";

export type NavigationItem = { href: string; label: string; primary?: boolean };
export type WorkspaceMode = "onboarding" | "owner" | "cashier";

const ownerNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda", primary: true },
  { href: "/transaksi", label: "Transaksi", primary: true },
  { href: "/analitik", label: "Analitik" },
  { href: "/produk", label: "Produk" },
  { href: "/analisis", label: "Analisis", primary: true },
  { href: "/analisis/riwayat", label: "Riwayat analisis" },
  { href: "/laporan", label: "Laporan" },
  { href: "/edukasi", label: "Edukasi", primary: true },
  { href: "/pengaturan", label: "Pengaturan" },
];

const cashierNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda", primary: true },
  { href: "/transaksi/catat", label: "Catat transaksi", primary: true },
];

// Analysis and education are reachable before a business exists, because
// testing an idea first is exactly what a prospective owner comes here for.
const onboardingNavigation: NavigationItem[] = [
  { href: "/beranda", label: "Beranda", primary: true },
  { href: "/analisis", label: "Analisis", primary: true },
  { href: "/edukasi", label: "Edukasi", primary: true },
  { href: "/pengaturan", label: "Mulai usaha", primary: true },
];

export function workspaceMode(memberships: Membership[]): WorkspaceMode {
  if (memberships.length === 0) return "onboarding";
  return memberships.some((membership) => membership.role === "owner") ? "owner" : "cashier";
}

export function hasOwnerAccess(memberships: Membership[]): boolean {
  return memberships.some((membership) => membership.role === "owner");
}

/** True when the account may reach owner-only areas, including brand new accounts. */
export function hasAnalysisAccess(memberships: Membership[]): boolean {
  return memberships.length === 0 || hasOwnerAccess(memberships);
}

export function workspaceNavigation(memberships: Membership[]): NavigationItem[] {
  const mode = workspaceMode(memberships);
  if (mode === "owner") return ownerNavigation;
  if (mode === "onboarding") return onboardingNavigation;
  return cashierNavigation;
}

/** The narrow-screen bar carries only the destinations used day to day. */
export function primaryNavigation(memberships: Membership[]): NavigationItem[] {
  return workspaceNavigation(memberships).filter((item) => item.primary);
}

/**
 * The longest matching href wins so `/analisis/riwayat` does not light up
 * `/analisis` as well.
 */
export function activeNavigationHref(
  pathname: string,
  items: NavigationItem[],
): string | null {
  let match: string | null = null;
  for (const item of items) {
    const isMatch = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (isMatch && (match === null || item.href.length > match.length)) {
      match = item.href;
    }
  }
  return match;
}
