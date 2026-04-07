import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react";
import { TrackingProvider } from "@/components/providers/TrackingProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

import ChatWrapper from "@/components/chat/ChatWrapper";
import MasterAccess from "@/components/debug/MasterAccess";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acelerador de Entrevistas | Tu Próximo Salto Profesional",
  description: "Diagnostica tu perfil profesional en 60 segundos. Optimiza tu CV con IA y estrategias de élite para cualquier mercado.",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <TrackingProvider>
            {children}
          </TrackingProvider>
          <Analytics />
          <ChatWrapper />
          <MasterAccess />
        </SessionProvider>
      </body>
    </html>
  );
}
