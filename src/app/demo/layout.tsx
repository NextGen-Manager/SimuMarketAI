import type { Metadata } from "next";
import { DemoFlowProvider } from "@/demo/DemoFlowProvider";
import { DemoChrome } from "@/demo/components/DemoChrome";
import "leaflet/dist/leaflet.css";

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
      <DemoChrome>{children}</DemoChrome>
    </DemoFlowProvider>
  );
}
