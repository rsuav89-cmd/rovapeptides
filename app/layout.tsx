import type { Metadata, Viewport } from "next";
import { Syncopate, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { StructuredData } from "@/components/StructuredData";
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
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title,
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "research peptides",
    "peptides for research",
    "certificate of analysis",
    "HPLC verified peptides",
    "research grade peptides",
    "RovaPeptides",
  ],
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-cta focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <StructuredData />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
