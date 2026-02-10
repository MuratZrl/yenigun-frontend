// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import ClientProviders from "@/providers/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoToTop from "@/components/GoToTop";
import BreadcrumbBar from "@/components/layout/Breadcrumb.client";

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
          {/* Navbar fixed ise mutlaka aşağıya offset ver */}
          <Navbar />

          {/* Navbar h-14 (56px) olduğu için içerik blokunu 56px aşağı itiyoruz */}
          <div className="pt-14">
            {/* Breadcrumb navbarın altında sticky kalsın */}
            <BreadcrumbBar className="sticky top-14 z-40" />

            <main className="mx-auto max-w-6xl px-4 pt-4 pb-4 bg-white min-h-screen">
              {children}
            </main>

            <Footer />
            <GoToTop />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
