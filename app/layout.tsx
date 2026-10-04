import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const siteUrl = "https://www.insiderlaun.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "InsiderLaun — Memecoin Radar & Community",
  description:
    "InsiderLaun es un radar y comunidad para seguir la cultura de las memecoins. Encontrá los espacios oficiales en Telegram, Discord y FOMO Family.",
  applicationName: "InsiderLaun",
  alternates: {
    canonical: "/",
  },
  keywords: ["InsiderLaun", "memecoins", "radar", "comunidad", "cultura onchain"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "InsiderLaun — Memecoin Radar & Community",
    description:
      "Un radar y punto de encuentro para seguir las conversaciones y comunidades de la cultura memecoin.",
    url: siteUrl,
    siteName: "InsiderLaun",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: "InsiderLaun — Memecoin Radar & Community",
    description:
      "Un radar y punto de encuentro para la cultura memecoin y su comunidad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090b0a",
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
    <html lang="es" className="dark">
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
