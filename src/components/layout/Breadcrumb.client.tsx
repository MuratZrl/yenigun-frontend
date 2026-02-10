// src/components/layout/Breadcrumb.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBreadcrumbContext } from "@/context/BreadcrumbContext";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

const DEFAULT_LABEL_MAP: Record<string, string> = {
  ads: "İlanlar",
  ilanlar: "İlanlar",
  ilan: "İlan",
  "ilan-ekle": "İlan Ekle",
  admin: "Yönetim",
  emlak: "Emlak",
  konut: "Konut",
  satilik: "Satılık",
  kiralik: "Kiralık",
};

function formatSegment(seg: string) {
  const decoded = decodeURIComponent(seg);
  const normalized = decoded.replace(/[-_]+/g, " ").trim();
  if (!normalized) return "";
  return normalized.charAt(0).toLocaleUpperCase("tr-TR") + normalized.slice(1);
}

type RightLink = { label: string; href: string };

export default function BreadcrumbBar({
  items,
  className = "",
  rightLinks,
}: {
  items?: BreadcrumbItem[];
  className?: string;
  rightLinks?: RightLink[];
}) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);

  // Provider yanlış yerde kalırsa sayfayı patlatmayalım, fallback'e dönelim.
  let ctxState:
    | {
        ownerPathname: string;
        items: BreadcrumbItem[];
        rightLinks?: RightLink[];
      }
    | null = null;

  try {
    const ctx = useBreadcrumbContext();
    ctxState = ctx?.state ?? null;
  } catch {
    ctxState = null;
  }

  const autoItems: BreadcrumbItem[] = [
    { label: "Anasayfa", href: "/" },
    ...segments.map((seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label = DEFAULT_LABEL_MAP[seg] ?? formatSegment(seg);
      return { label, href };
    }),
  ];

  const autoList = autoItems.filter((x) => x.label && x.label.trim() !== "");

  // Context'ten sadece gerçekten anlamlı breadcrumb gelirse kullan.
  // (Bazı sayfalar yanlışlıkla 1 eleman set edebiliyor; o durumda auto'ya dönmek daha iyi.)
  const contextItems =
    !items &&
    ctxState &&
    ctxState.ownerPathname === pathname &&
    Array.isArray(ctxState.items) &&
    ctxState.items.length > 1
      ? ctxState.items
      : undefined;

  const contextRightLinks =
    !rightLinks && ctxState && ctxState.ownerPathname === pathname
      ? ctxState.rightLinks
      : undefined;

  const sourceItems =
    items && items.length > 1
      ? items
      : contextItems && contextItems.length > 1
      ? contextItems
      : autoItems;

  const list = sourceItems.filter((x) => x.label && x.label.trim() !== "");

  // 🔧 Kritik fix: Eğer props/context breadcrumb yanlışlıkla 1 elemana düştüyse,
  // bar'ı tamamen kapatmak yerine auto breadcrumb'a geri dön.
  const finalList = list.length <= 1 ? autoList : list;

  const menu: RightLink[] =
    (rightLinks && rightLinks.length > 0
      ? rightLinks
      : contextRightLinks && contextRightLinks.length > 0
      ? contextRightLinks
      : [
          { label: "Favori İlanlarım", href: "/favori-ilanlar" },
          { label: "Favori Aramalarım", href: "/favori-aramalar" },
          { label: "Size Özel İlanlar", href: "/size-ozel-ilanlar" },
          { label: "Karşılaştır", href: "/karsilastir" },
        ]) ?? [];

  if (finalList.length <= 1) return null;

  return (
    <div className={`w-full bg-white border-b border-gray-200 relative z-50 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-1 flex items-center justify-between gap-4">
          <nav aria-label="breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-center gap-1 text-[12px]">
              {finalList.map((item, idx) => {
                const isLast = idx === finalList.length - 1;

                const content =
                  item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-gray-900 font-medium" : "text-gray-600"}>
                      {item.label}
                    </span>
                  );

                return (
                  <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
                    {content}
                    {!isLast && <span className="text-gray-400 px-1">{">"}</span>}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="hidden md:flex items-center text-[12px] text-blue-700 shrink-0">
            {menu.map((m, i) => (
              <span key={`${m.href}-${i}`} className="flex items-center">
                <Link href={m.href} className="hover:underline underline-offset-4">
                  {m.label}
                </Link>
                {i !== menu.length - 1 && <span className="text-gray-300 px-2">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
