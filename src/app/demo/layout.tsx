import type { Metadata } from "next";
import { DemoFlowProvider } from "@/demo/DemoFlowProvider";
import { Header } from "@/demo/components/Header";

export const metadata: Metadata = {
  title: "SimuMarket AI — Demo",
  description:
    "Demo klik-melalui dua journey SimuMarket AI. Seluruh data adalah contoh.",
};

/**
 * Shell khusus demo. Seluruh state, header, dan penanda MODE DEMO
 * berhenti di sini — tidak ada yang bocor ke `/`.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoFlowProvider>
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
    </DemoFlowProvider>
  );
}
