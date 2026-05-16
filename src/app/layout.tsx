import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react";
import { TrackingProvider } from "@/components/providers/TrackingProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";


import MasterAccess from "@/components/debug/MasterAccess";
import WhatsAppFab from "@/components/ui/WhatsAppFab";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acelerador de Entrevistas | Tu PrÃ³ximo Salto Profesional",
  description: "Diagnostica tu perfil profesional en 60 segundos. Optimiza tu CV con IA y estrategias de Ã©lite para cualquier mercado.",
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
        <script dangerouslySetInnerHTML={{ __html: `window.hasStrategyActionsRemaining = true;` }} />
        <SessionProvider>
          <TrackingProvider>
            {children}
          </TrackingProvider>
          <Analytics />
          
          <WhatsAppFab />
          <MasterAccess />
        </SessionProvider>
      </body>
    </html>
  );
}


