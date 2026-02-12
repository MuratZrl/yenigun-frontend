// src/features/ads/ui/detail/AdvertDetail.client.tsx
"use client";

import React, { useEffect, useMemo } from "react";

import GoToTop from "@/components/GoToTop";
import type { AdvertData, SimilarAd } from "@/types/advert";

import HeaderSection from "./components/sections/HeaderSection.client";
import PhotoGallerySection from "./components/sections/PhotoGallerySection.client";
import PriceSummarySection from "./components/sections/PriceSummarySection.client";
import TabsSection from "./components/sections/TabsSection.client";
import BottomActionBar from "./components/sections/BottomActionBar.client";
import RightSidebarSection from "./components/sections/RightSidebarSection.client";
import BottomInfoSection from "./components/sections/BottomInfoSection.client";

import {
  useBreadcrumb,
  type BreadcrumbItem,
  type RightLink,
} from "@/context/BreadcrumbContext";

type Props = {
  data: AdvertData;
  similarAds: SimilarAd[];
  breadcrumbs?: BreadcrumbItem[];
  breadcrumbRightLinks?: RightLink[];
};

export default function AdvertDetailClient({
  data,
  similarAds: _similarAds,
  breadcrumbs,
  breadcrumbRightLinks,
}: Props) {
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb();

  const title = useMemo(() => {
    return String((data as any)?.title ?? "").trim();
  }, [data]);

  const uid = useMemo(() => {
    const v = (data as any)?.uid;
    return v === null || v === undefined ? "" : String(v).trim();
  }, [data]);

  // Title set
  useEffect(() => {
    if (title) document.title = `${title} - Yenigün Emlak`;
  }, [title]);

  // Breadcrumb items: PM zinciri varsa onu kullan, yoksa title fallback
  const itemsToSet = useMemo<BreadcrumbItem[] | null>(() => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs;

    if (title && uid) {
      return [
        { label: "Anasayfa", href: "/" },
        { label: "İlanlar", href: "/ilanlar" },
        { label: title, href: `/ilan/${uid}` },
      ];
    }

    if (title) {
      return [
        { label: "Anasayfa", href: "/" },
        { label: "İlanlar", href: "/ilanlar" },
        { label: title },
      ];
    }

    return null;
  }, [breadcrumbs, title, uid]);

  // Breadcrumb set (yeniden render oldukça değil, gerçekten değişince)
  useEffect(() => {
    if (itemsToSet && itemsToSet.length > 0) {
      setBreadcrumb(itemsToSet, breadcrumbRightLinks);
    }
  }, [itemsToSet, breadcrumbRightLinks, setBreadcrumb]);

  // Cleanup sadece unmount'ta
  useEffect(() => {
    return () => {
      clearBreadcrumb();
    };
  }, [clearBreadcrumb]);

  return (
    <main className="min-h-screen">
      <div className="w-full lg:mx-auto lg:max-w-[1200px]">
        <HeaderSection data={data} />

        <div className="hidden lg:block border-t border-gray-300 mb-2" />

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <PhotoGallerySection data={data} />
          </div>

          <div className="lg:col-span-3">
            <PriceSummarySection data={data} />
          </div>

          <div className="lg:col-span-3">
            <RightSidebarSection data={data} />
          </div>
        </div>

        <div className="mt-4">
          <TabsSection data={data} />
        </div>

        <div className="mt-4">
          <BottomInfoSection data={data} />
        </div>

        <GoToTop />
      </div>

      <BottomActionBar data={data} />
    </main>
  );
}
