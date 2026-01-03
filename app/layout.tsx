
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

// Explicitly typing RootLayout props to ensure children are recognized by Next.js and TypeScript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className="dark">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#29292b] text-[#f1f0e6] antialiased selection:bg-[#ebff57]/20 font-sans">
        {/* Pass children through the Providers client component to maintain global state and theme */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
