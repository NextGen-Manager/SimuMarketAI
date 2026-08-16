"use client";

import { EmptyState } from "@/components/ui/DataState";
import { useSession } from "@/features/auth/SessionProvider";
import { hasOwnerAccess } from "@/lib/workspace-access";

export function OwnerBoundary({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  if (!session || !hasOwnerAccess(session.memberships)) {
    return (
      <EmptyState
        title="Halaman tidak tersedia"
        description="Akun kasir hanya dapat membuka beranda dan mencatat transaksi untuk usaha yang ditugaskan."
      />
    );
  }
  return children;
}

export function OwnerOrOnboardingBoundary({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  if (session && session.memberships.length > 0 && !hasOwnerAccess(session.memberships)) {
    return (
      <EmptyState
        title="Halaman tidak tersedia"
        description="Pengaturan profil usaha dan akses kasir hanya dapat dikelola oleh pemilik."
      />
    );
  }
  return children;
}
