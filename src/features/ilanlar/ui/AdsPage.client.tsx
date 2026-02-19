// src/features/ilanlar/ui/AdsPage.client.tsx
"use client";

import React from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCategoryContext } from "@/context/CategoryContext";
import type { Advert } from "@/types/advert";

import AdsBreadcrumbSetter from "./AdsBreadcrumbSetter.client";

import FilterSidebar from "./components/filter/FilterSidebar.client";
import AdsHeaderBar from "./components/AdsHeaderBar.client";
import AdsTopToolbar from "./components/AdsTopToolbar.client";
import CustomPagination from "./components/CustomPagination.client";
import SortModal from "./components/SortModal.client";

import { turkeyCities } from "../model/turkeyCities";
import { useAdsController } from "../hooks/useAdsController";

import {
  AdsTableHeader,
  AdsRowDesktop,
  AdsRowMobile,
  AdsGridCard,
} from "./components/AdsRow.client";
import AdsMap from "./components/map/AdsMap.client";

function formatLastUpdated(ts: number) {
  return new Date(ts).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdsPageClient({
  initialSearchParams,
}: {
  initialSearchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const pathname = usePathname() || "/ilanlar";
  const sp = useSearchParams();

  const view = sp.get("view");
  const isMapView = view === "map";

  const { selectedSubcategory: contextSelectedSubcat } = useCategoryContext();

  const c = useAdsController({
    initialSearchParams,
    contextSelectedSubcat,
    // listBase default zaten "/ilanlar"
  });

  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  // ✅ Hook'lar asla if/return altına inmez.
  const didMountRef = React.useRef(false);
  const lastCatKeyRef = React.useRef<string | null>(null);

  const filterType = c.filters.type ?? "";
  const { handleFilter } = c;

  // ✅ Kategoriye tıklar tıklamaz filtre uygula (Ara butonu gereksiz)
  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      lastCatKeyRef.current = filterType || null;
      return;
    }

    if ((filterType || null) === lastCatKeyRef.current) return;
    lastCatKeyRef.current = filterType || null;

    void handleFilter();
  }, [filterType, handleFilter]);

  const totalPagesLabel = (c.totalPages || 1).toLocaleString("tr-TR");
  const currentPageLabel = (c.currentPage || 1).toLocaleString("tr-TR");

  const goListView = () => {
    const params = new URLSearchParams(sp.toString());
    params.delete("view");
    params.delete("autoViewport");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  if (c.loading && c.data.length === 0) {
    return (
      <>
        <AdsBreadcrumbSetter filters={c.filters} />
        <div className="w-full min-h-[30vh] flex justify-center items-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-600" />
            <p className="text-gray-600 font-medium">İlanlar yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  // ✅ MAP VIEW
  if (isMapView) {
    return (
      <>
        <AdsBreadcrumbSetter filters={c.filters} />
        <div className="w-full bg-white">
          <div className="flex gap-6">
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
              autoApply={c.autoApply}
              setAutoApply={c.setAutoApply}
            />

            <div className="flex-1 min-w-0">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="text-[13px] text-gray-700 truncate">
                    <span className="font-semibold">
                      {c.filters.location && c.filters.location !== "Hepsi"
                        ? `"${c.filters.location}"`
                        : `"Türkiye"`}
                    </span>{" "}
                    aramanız için{" "}
                    <span className="font-semibold">
                      {c.totalItems.toLocaleString("tr-TR")}
                    </span>{" "}
                    ilan arasından{" "}
                    <span className="font-semibold">
                      {Math.min(c.data.length, 1000).toLocaleString("tr-TR")}
                    </span>{" "}
                    ilan gösteriliyor.
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goListView}
                      className="text-[13px] text-blue-700 hover:underline"
                    >
                      Liste Görünümü
                    </button>
                  </div>
                </div>

                <div className="h-[calc(100vh-8.5rem)]">
                  <AdsMap adverts={c.data} filters={c.filters} />
                </div>
              </div>
            </div>
          </div>

          <SortModal
            open={c.isSortMenuOpen}
            filters={c.filters}
            currentPage={c.currentPage}
            featureFilters={c.featureFilters}
            onClose={() => c.setIsSortMenuOpen(false)}
            onApply={(next) =>
              void c.handleSortChangeDesktop(next.sortBy, next.sortOrder)
            }
          />
        </div>
      </>
    );
  }

  // ✅ LIST VIEW
  return (
    <>
      <AdsBreadcrumbSetter filters={c.filters} />
      <div className="w-full bg-white">
        <div className="flex gap-4">
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
            autoApply={c.autoApply}
            setAutoApply={c.setAutoApply}
          />

          <div className="flex-1 min-w-0">
            <AdsHeaderBar
              filters={c.filters}
              totalItems={c.totalItems}
              featureFilters={c.featureFilters}
              onClear={c.clearFilters}
            />

            <div className="mt-3 border border-gray-200 border-t-0 rounded-md overflow-hidden">
              <AdsTopToolbar
                viewMode={viewMode}
                onViewChange={setViewMode}
                sortValue={`${c.filters.sortBy}_${c.filters.sortOrder}`}
                onSortChange={(v) => {
                  const [sb, so] = v.split("_");
                  void c.handleSortChangeDesktop(
                    sb as "date" | "price",
                    so as "asc" | "desc",
                  );
                }}
              />

              {c.data.length === 0 ? (
                <div className="py-16 text-center">
                  <Search size={56} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-semibold text-gray-900">
                    İlan bulunamadı
                  </p>
                  <p className="text-gray-600">
                    Filtrelerinizi değiştirerek tekrar deneyin
                  </p>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-gray-200">
                  <AdsTableHeader />

                  {c.data.map((ad: Advert, index: number) => (
                    <div key={ad.uid || index}>
                      <AdsRowDesktop
                        ad={ad}
                        fallbackKey={index}
                        rowIndex={index}
                      />
                      <AdsRowMobile
                        ad={ad}
                        fallbackKey={index}
                        rowIndex={index}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 border border-gray-200 bg-white">
                  {c.data.map((ad, i) => (
                    <AdsGridCard
                      key={ad.uid || i}
                      ad={ad}
                      fallbackKey={i}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 border border-gray-200 rounded-sm bg-white">
              <div className="px-4 py-6">
                <div className="text-center text-[13px] text-gray-700">
                  Toplam <span className="font-medium">{totalPagesLabel}</span>{" "}
                  sayfa içerisinde{" "}
                  <span className="font-medium">{currentPageLabel}</span>.
                  sayfayı görmektesiniz.
                </div>

                <div className="mt-3 flex justify-center">
                  <CustomPagination
                    totalPages={c.totalPages}
                    currentPage={c.currentPage}
                    onChange={(p) => c.setCurrentPage(p)}
                  />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-gray-700">
                  Her sayfada
                  <button
                    type="button"
                    onClick={() => void c.handlePageSizeChange(20)}
                    className={[
                      "min-w-[52px] px-3 py-2 border rounded-sm",
                      c.pageSize === 20
                        ? "bg-gray-600 text-white border-gray-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    20
                  </button>
                  <button
                    type="button"
                    onClick={() => void c.handlePageSizeChange(50)}
                    className={[
                      "min-w-[52px] px-3 py-2 border rounded-sm",
                      c.pageSize === 50
                        ? "bg-gray-600 text-white border-gray-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    50
                  </button>
                  sonuç göster
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-[13px] text-gray-700">
              Bu sayfa en son{" "}
              <span className="text-red-600 font-semibold">
                {c.lastUpdatedAt ? formatLastUpdated(c.lastUpdatedAt) : "-"}
              </span>{" "}
              tarihinde güncellenmiştir.
            </div>
          </div>
        </div>

        <SortModal
          open={c.isSortMenuOpen}
          filters={c.filters}
          currentPage={c.currentPage}
          featureFilters={c.featureFilters}
          onClose={() => c.setIsSortMenuOpen(false)}
          onApply={(next) =>
            void c.handleSortChangeDesktop(next.sortBy, next.sortOrder)
          }
        />
      </div>
    </>
  );
}
