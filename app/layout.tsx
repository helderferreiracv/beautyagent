import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BeautyAgent – A Inteligência que o teu salão merece.",
  description: "Plataforma SaaS de gestão inteligente com foco em AI e design minimalista.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className="dark">
      <body className="bg-[#1a1a1c] text-[#f1f0e6] antialiased selection:bg-[#ebff57]/20 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}