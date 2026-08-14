import { AppShell } from "@/components/layout/AppShell";
import { AuthBoundary, SessionProvider } from "@/features/auth/SessionProvider";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthBoundary>
        <AppShell>{children}</AppShell>
      </AuthBoundary>
    </SessionProvider>
  );
}
