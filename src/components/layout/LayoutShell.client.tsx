// src/components/layout/LayoutShell.client.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoToTop from "@/components/ui/GoToTop";
import BreadcrumbBar from "@/components/layout/Breadcrumb.client";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";
  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";
  const isFullWidth = isHome || isAbout || isContact;

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {!isFullWidth && <BreadcrumbBar className="sticky top-16 z-30" />}
        <main className={isFullWidth ? "min-h-screen" : "mx-auto max-w-6xl px-4 pt-4 pb-4 bg-white min-h-screen"}>
          {children}
        </main>
        <Footer />
        <GoToTop />
      </div>
    </>
  );
}