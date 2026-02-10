// src/features/ads/ui/detail/AdvertBreadcrumbSetter.client.tsx  (YENİ DOSYA)
"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

type BreadcrumbItem = { label: string; href?: string };
type RightLink = { label: string; href: string };

export default function AdvertBreadcrumbSetter({
  items,
  rightLinks,
}: {
  items: BreadcrumbItem[] | undefined;
  rightLinks?: RightLink[];
}) {
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    if (items && items.length > 0) setBreadcrumb(items, rightLinks);
    return () => clearBreadcrumb();
  }, [items, rightLinks, setBreadcrumb, clearBreadcrumb]);

  return null;
}
