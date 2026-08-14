"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui/DataState";
import { apiFetch, ApiError } from "@/lib/api/client";
import { messageSchema, sessionSchema, type Session } from "@/lib/contracts/auth";

type SessionState = {
  session: Session | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    session: Session | null;
    error: ApiError | null;
    loadedRevision: number;
  }>({ session: null, error: null, loadedRevision: -1 });
  const [revision, setRevision] = useState(0);
  const router = useRouter();

  const reload = useCallback(() => {
    setRevision((current) => current + 1);
    return Promise.resolve();
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch("/v1/me", sessionSchema)
      .then((session) => {
        if (active) setState({ session, error: null, loadedRevision: revision });
      })
      .catch((caught: unknown) => {
        if (active) {
          setState({
            session: null,
            error: caught instanceof ApiError ? caught : null,
            loadedRevision: revision,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [revision]);

  const logout = useCallback(async () => {
    await apiFetch("/v1/auth/logout", messageSchema, { method: "POST" });
    setState((current) => ({ ...current, session: null }));
    router.replace("/masuk");
  }, [router]);

  const value = useMemo(
    () => ({
      session: state.session,
      loading: state.loadedRevision !== revision,
      error: state.error,
      reload,
      logout,
    }),
    [state, revision, reload, logout],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession harus berada di dalam SessionProvider.");
  return value;
}

export function AuthBoundary({ children }: { children: React.ReactNode }) {
  const { session, loading, error, reload } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && error?.status === 401) {
      router.replace(`/masuk?next=${encodeURIComponent(pathname)}`);
    }
  }, [error, loading, pathname, router]);

  if (loading) return <AppShellSkeleton />;
  if (!session && error?.status !== 401) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-20">
        <ErrorState
          message={error?.message ?? "Terjadi gangguan yang tidak terduga."}
          correlationId={error?.correlationId ?? "tidak tersedia"}
          retryable
          onRetry={() => void reload()}
        />
      </main>
    );
  }
  if (!session) return <AppShellSkeleton />;
  return children;
}

function AppShellSkeleton() {
  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]" aria-label="Memuat ruang kerja">
      <div className="hidden border-r border-line bg-surface md:block" />
      <div className="animate-pulse space-y-4 p-6 md:p-10">
        <div className="h-9 w-56 rounded-[8px] bg-line-soft" />
        <div className="h-32 rounded-[12px] bg-line-soft" />
        <div className="h-52 rounded-[12px] bg-line-soft" />
      </div>
    </div>
  );
}
