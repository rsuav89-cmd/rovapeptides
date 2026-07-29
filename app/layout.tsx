import type { Metadata } from "next";
import { Syncopate, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Headings & headlines — Syncopate (uppercase, geometric luxury)
const display = Syncopate({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "700"],
});

// Body, specs, prices, compliance — Montserrat
const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RovaPeptides — Research-Grade Peptides, Verified to the Batch",
  description:
    "Premium research peptides with 99%+ verified purity, USA laboratory batch testing, and third-party Certificates of Analysis on every batch. For Research Use Only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body id="top">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
