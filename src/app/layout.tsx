import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimuMarket AI",
  description:
    "Decision support system untuk calon dan pelaku UMKM F&B di Jabodetabek.",
};

/**
 * Root layout sengaja minimal: hanya font dan stylesheet global.
 * Shell demo (provider, header, stepper) berada di app/demo/layout.tsx
 * supaya aplikasi sebenarnya bisa dibangun di `/` tanpa terbawa demo.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
