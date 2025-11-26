import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "./providers/ClientProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
