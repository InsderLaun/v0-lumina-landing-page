import React from "react"
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Lumina | Organización de Seguros",
  description:
    "La única organización que te permite elegir: operá con las máximas comisiones del mercado GRATIS, o sumate a nuestro Hub Corporativo para escalar tu negocio.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
