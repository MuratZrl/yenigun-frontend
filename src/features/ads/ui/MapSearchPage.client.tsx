// src/features/ads/ui/MapSearchPage.client.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCategoryContext } from "@/context/CategoryContext";

import FilterSidebar from "./components/filter/FilterSidebar.client";
import { turkeyCities } from "../model/turkeyCities";
import { useAdsController } from "../hooks/useAdsController";

import AdsMap from "./components/map/AdsMap.client";

export default function MapSearchPageClient({
  params,
  initialSearchParams,
}: {
  params: { category: string; city: string };
  initialSearchParams: { [key: string]: string | string[] | undefined };
}) {
  const { selectedSubcategory: contextSelectedSubcat } = useCategoryContext();

  const listBase = useMemo(
    () => `/haritada-emlak-arama/${params.category}/${params.city}`,
    [params.category, params.city],
  );

  const c = useAdsController({
    initialSearchParams,
    contextSelectedSubcat,
    listBase, // ✅ hook artık map route üzerinde kalacak
  });

  return (
    <div className="w-full bg-white">
      <div className="flex gap-2">
        <div className="hidden md:block">
          {/* Sol panel üstü: Liste Görünümü */}
          <div className="w-80">
            <div className="border border-gray-200 bg-white px-3 py-3">
              <Link
                href={`/ilanlar`}
                className="block text-center border border-gray-300 bg-gray-50 hover:bg-gray-100 px-3 py-2 text-[13px] font-semibold text-blue-700"
                style={{ borderRadius: 2 }}
              >
                Liste Görünümü
              </Link>
            </div>
          </div>

          {/* Sol panel: senin mevcut filtre */}
          <FilterSidebar
            filters={c.filters}
            setFilters={c.setFilters}
            selectedCategory={c.selectedCategory}
            setSelectedCategory={c.setSelectedCategory}
            selectedSubcategory={c.localSelectedSubcat}
            setSelectedSubcategory={c.setLocalSelectedSubcat}
            selectedSubSubcategory={c.selectedSubSubcategory}
            setSelectedSubSubcategory={c.setSelectedSubSubcategory}
            categories={c.categories}
            loadingCategories={c.loadingCategories}
            availableSubcategories={c.availableSubcategories}
            setAvailableSubcategories={c.setAvailableSubcategories}
            availableSubSubcategories={c.availableSubSubcategories}
            setAvailableSubSubcategories={c.setAvailableSubSubcategories}
            featureFilters={c.featureFilters}
            setFeatureFilters={c.setFeatureFilters}
            handleFilter={c.handleFilter}
            clearFilters={c.clearFilters}
            totalItems={c.totalItems}
            isMobileSidebarOpen={c.isMobileSidebarOpen}
            onCloseMobileSidebar={() => c.setIsMobileSidebarOpen(false)}
            onOpenMobileSidebar={() => c.setIsMobileSidebarOpen(true)}
            onOpenSortMenu={c.handleOpenSortMenu}
            citiesData={turkeyCities}
            handleSortChangeDesktop={c.handleSortChangeDesktop}
            setCurrentPage={c.setCurrentPage}
            contextFeatures={c.contextFeatures}
            showMobileTopBar={false} // map ekranında üst bar istemiyorsan
          />
        </div>

        {/* Sağ taraf: harita */}
        <div className="flex-1 min-w-0">
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <div className="h-[calc(100vh-5rem)]">
              <AdsMap adverts={c.data} filters={c.filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
