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
  about: "Hakkımızda",
  contact: "İletişim",
  search: "Arama",
  map: "Harita",
  login: "Giriş",
  category: "Kategori",
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
  rightLinks: _rightLinks,
}: {
  items?: BreadcrumbItem[];
  className?: string;
  rightLinks?: RightLink[];
}) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);

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

  const contextItems =
    !items &&
    ctxState &&
    ctxState.ownerPathname === pathname &&
    Array.isArray(ctxState.items) &&
    ctxState.items.length > 1
      ? ctxState.items
      : undefined;

  const sourceItems =
    items && items.length > 1
      ? items
      : contextItems && contextItems.length > 1
        ? contextItems
        : autoItems;

  const list = sourceItems.filter((x) => x.label && x.label.trim() !== "");

  const finalList = list.length <= 1 ? autoList : list;

  if (finalList.length <= 1) return null;

  return (
    <div
      className={`w-full bg-white border-b border-gray-200 relative z-30 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-2.5">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
              {finalList.map((item, idx) => {
                const isLast = idx === finalList.length - 1;

                return (
                  <li
                    key={`${item.label}-${idx}`}
                    className="flex items-center gap-1.5"
                  >
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="text-gray-500 hover:text-[#035DBA] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-gray-900 font-semibold" : "text-gray-500"}>
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}