import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
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
    <html lang="id" className={`${jakarta.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
