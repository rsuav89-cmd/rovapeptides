import type { Metadata, Viewport } from "next";
import { Syncopate, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const display = Syncopate({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "700"],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const title = "RovaPeptides — Research-Grade Peptides, Verified to the Batch";
const description =
  "Premium research peptides with 99%+ verified purity, USA laboratory batch testing, and third-party Certificates of Analysis on every batch. For Research Use Only.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: site.siteUrl,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} overflow-x-hidden`}>
      <body id="top" className="overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
