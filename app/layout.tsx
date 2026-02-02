import Providers from "@/providers";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIFE - Gamificação V4",
  description: "Sistema de check-in e reconhecimento profissional focado em Profissional, Intelectual, Físico e Emocional",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}
