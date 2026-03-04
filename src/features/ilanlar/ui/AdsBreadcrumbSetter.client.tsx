// src/features/ads/ui/AdsBreadcrumbSetter.client.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import type { FilterState } from "@/types/advert";

type BreadcrumbItem = { label: string; href?: string };

function splitTrail(raw: string) {
  return raw
    .split(">")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdsBreadcrumbSetter({
  filters,
  rootTypeValue = "Hepsi",
}: {
  filters: FilterState;
  rootTypeValue?: string;
}) {
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb();

  const items = useMemo<BreadcrumbItem[]>(() => {
    const out: BreadcrumbItem[] = [
      { label: "Anasayfa", href: "/" },
      { label: "Emlak", href: "/ilanlar" },
    ];

    const rawType = (filters)?.type;
    if (typeof rawType === "string") {
      const t = rawType.trim();
      if (t && t !== rootTypeValue) {
        let parts = splitTrail(t);
        if (parts[0]?.toLocaleLowerCase("tr-TR") === "emlak") parts = parts.slice(1);

        for (let i = 0; i < parts.length; i++) {
          const label = parts[i];
          const prefix = parts.slice(0, i + 1).join(" > ");
          out.push({
            label,
            href: i === parts.length - 1 ? undefined : `/ilanlar?type=${encodeURIComponent(prefix)}`,
          });
        }
      }
    }

    return out;
  }, [filters, rootTypeValue]);

  // Flicker olmasın diye: değiştikçe set et, ama dependency cleanup’ta clear etme.
  useEffect(() => {
    setBreadcrumb(items);
  }, [items, setBreadcrumb]);

  // Sadece unmount’ta temizle.
  useEffect(() => {
    return () => clearBreadcrumb();
  }, [clearBreadcrumb]);

  return null;
}
