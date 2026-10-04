import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = "https://www.insiderlaun.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "InsiderLaun — Memecoin Radar & Community",
  description:
    "Discover memecoin culture with InsiderLaun. Follow the Telegram Live Radar, join the Discord community, and explore FOMO with our invitation.",
  applicationName: "InsiderLaun",
  alternates: {
    canonical: "/",
  },
  keywords: ["InsiderLaun", "memecoins", "radar", "community", "internet culture"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "InsiderLaun — Memecoin Radar & Community",
    description:
      "Memecoin discoveries, internet culture and your people. Find the InsiderLaun radar and community.",
    url: siteUrl,
    siteName: "InsiderLaun",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "InsiderLaun — Memecoin Radar & Community",
    description:
      "Your home for memecoin discoveries and community. Find your people with InsiderLaun.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#141714",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('caches' in window) {
            caches.keys().then(function(names) {
              names.forEach(function(name) { caches.delete(name); });
            });
          }
        `}} />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${bricolage.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
