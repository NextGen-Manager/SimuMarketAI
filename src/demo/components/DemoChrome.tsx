"use client";

import { usePathname } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { Header } from "./Header";
import { WorkspaceShell } from "./WorkspaceShell";

export function DemoChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { journey } = useDemoFlow();

  if (pathname === "/demo/dashboard") {
    return <>{children}</>;
  }

  const isTransactionPage = pathname.startsWith("/demo/transaksi");
  const usesWorkspace =
    (isTransactionPage && journey !== "B") ||
    pathname.startsWith("/demo/laporan") ||
    pathname === "/demo/edukasi" ||
    pathname === "/demo/analisis/riwayat";

  if (usesWorkspace) {
    return <WorkspaceShell>{children}</WorkspaceShell>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <footer className="mt-20 border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-8 text-[12.5px] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SimuMarket AI — Solusi Cerdas UMKM.</p>
          <p className="max-w-[46ch]">
            Seluruh data pada demo ini adalah contoh, bukan hasil analisis nyata.
          </p>
        </div>
      </footer>
    </>
  );
}
