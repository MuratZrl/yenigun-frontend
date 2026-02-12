// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ClientProviders from "@/providers/ClientProviders";
import LayoutShell from "@/components/layout/LayoutShell.client";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yenigunemlak.com"),
  title: "Yenigün Emlak",
  description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <ClientProviders>
          <LayoutShell>{children}</LayoutShell>
        </ClientProviders>
      </body>
    </html>
  );
}