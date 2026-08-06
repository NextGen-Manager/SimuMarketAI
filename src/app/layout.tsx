import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { DemoFlowProvider } from "@/demo/DemoFlowProvider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimuMarket AI — Demo",
  description:
    "Decision support system untuk calon dan pelaku UMKM F&B di Jabodetabek.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen antialiased">
        <DemoFlowProvider>
          <Header />
          <main>{children}</main>
          <footer className="mt-20 border-t border-line bg-surface">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-8 text-[12.5px] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 SimuMarket AI — Solusi Cerdas UMKM.</p>
              <p className="max-w-[46ch]">
                Seluruh data pada demo ini adalah contoh, bukan hasil analisis
                nyata.
              </p>
            </div>
          </footer>
        </DemoFlowProvider>
      </body>
    </html>
  );
}
