// src/features/ads/ui/detail/AdvertDetail.client.tsx
"use client";

import React, { useEffect } from "react";

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

  // Şu an UI içinde kullanılmıyor olabilir; lint’i üzmemek için aşağıda _similarAds diye alıyoruz.
  similarAds: SimilarAd[];

  // PM’in istediği breadcrumb zinciri (Emlak > Konut > Satılık > ...)
  breadcrumbs?: BreadcrumbItem[];

  // İstersen breadcrumb bar’ın sağındaki linkleri de sayfa bazında override edebilirsin
  breadcrumbRightLinks?: RightLink[];
};

export default function AdvertDetailClient({
  data,
  similarAds: _similarAds,
  breadcrumbs,
  breadcrumbRightLinks,
}: Props) {
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    const title = (data as any)?.title;
    if (typeof title === "string" && title.trim()) {
      document.title = `${title} - Yenigün Emlak`;
    }
  }, [data]);

  useEffect(() => {
    // Breadcrumb override sadece breadcrumbs geldiyse set edilir.
    // Sayfadan çıkınca temizlenir ki başka sayfaya "sarkmasın".
    if (breadcrumbs && breadcrumbs.length > 0) {
      setBreadcrumb(breadcrumbs, breadcrumbRightLinks);
    }

    return () => {
      clearBreadcrumb();
    };
  }, [breadcrumbs, breadcrumbRightLinks, setBreadcrumb, clearBreadcrumb]);

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
