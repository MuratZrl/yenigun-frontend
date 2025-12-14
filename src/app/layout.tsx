import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "./providers/ClientProviders";
import { CategoryProvider } from "@/app/context/CategoryContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yenigunemlak.com"),  
  title: "Yenigün Emlak",
  description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className={inter.className}>
        <ClientProviders>
          <CategoryProvider> {children}</CategoryProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
