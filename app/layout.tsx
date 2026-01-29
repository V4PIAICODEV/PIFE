import Providers from "@/providers";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  // MUDANÇA AQUI: De LIFE para GROW
  title: "GROW - Trilha de Desenvolvimento",
  description: "Plataforma gamificada para desenvolvimento profissional",

  icons: {
    icon: "/images/logo-v4.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}