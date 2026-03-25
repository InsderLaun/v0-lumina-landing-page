import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Lumina Protocol — The Safety Net for Autonomous AI Agents",
  description:
    "Parametric insurance on Base L2. Protect your AI agent against liquidations, depeg events, and bridge failures — or provide liquidity and earn real yield from premiums. Powered by Chainlink oracles. 100% automated resolution.",
  keywords: [
    "AI agent insurance",
    "parametric insurance",
    "Base L2",
    "Chainlink",
    "DeFi insurance",
    "autonomous agents",
    "machine-to-machine",
    "M2M insurance",
    "USDC",
    "liquid staking",
    "on-chain insurance",
  ],
  authors: [{ name: "Lumina Protocol" }],
  openGraph: {
    title: "Lumina Protocol — The Safety Net for Autonomous AI Agents",
    description:
      "Parametric insurance on Base L2 for AI agents. 8 products. 100% automated resolution via Chainlink oracles.",
    url: "https://lumina-org.com",
    siteName: "Lumina Protocol",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Protocol — AI Agent Insurance on Base L2",
    description:
      "Parametric insurance for autonomous AI agents. Powered by Chainlink. 100% automated.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
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
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
