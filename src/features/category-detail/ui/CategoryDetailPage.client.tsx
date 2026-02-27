// src/features/category-detail/ui/CategoryDetailPage.client.tsx
"use client";

import React from "react";
import { Home, ChevronRight, Loader2 } from "lucide-react";
import DynamicSearch from "@/components/ui/DynamicSearch";
import useCategoryDetail from "../hooks/useCategoryDetail";
import LoadingState from "./components/LoadingState.client";
import ErrorState from "./components/ErrorState.client";
import CategorySidebar from "./components/CategorySidebar.client";
import SortInfoBar from "./components/SortInfoBar.client";
import AdvertListDesktop from "./components/AdvertListDesktop.client";
import AdvertCardMobile from "./components/AdvertCardMobile.client";
import Pagination from "./components/Pagination.client";

export default function CategoryDetailPage() {
  const {
    category,
    categoryId,
    loading,
    loadingAds,
    error,
    adverts,
    totalItems,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    isMobile,
    router,
    handleSearch,
    handleSubcategoryClickWithFilter,
    handleSortChange,
    handlePageChange,
  } = useCategoryDetail();

  if (loading) return <LoadingState />;
  if (error || !category) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-5 bg-white shadow-sm" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ana Sayfa
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                    {category.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="lg:w-1/4">
            <CategorySidebar
              category={category}
              totalItems={totalItems}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSubcategoryClick={handleSubcategoryClickWithFilter}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Right */}
          {!isMobile && (
            <div className="lg:w-3/4">
              <SortInfoBar
                totalItems={totalItems}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />

              <DynamicSearch
                categoryId={categoryId}
                categoryName={category.name}
                categoryData={category}
                onSearch={handleSearch}
                adverts={adverts}
              />

              {loadingAds ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : adverts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    İlan Bulunamadı
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bu kategoride henüz ilan bulunmuyor veya filtrelerinize
                    uygun ilan yok.
                  </p>
                  <button
                    onClick={() => {
                      const p = new URLSearchParams();
                      p.set("type", category.name);
                      router.push(`/ads?${p.toString()}`);
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Tüm İlanları Görüntüle
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 pt-3">
                    <AdvertListDesktop adverts={adverts} />

                    {/* Mobile cards */}
                    {adverts.map((advert: any, index: number) => (
                      <AdvertCardMobile
                        key={advert.uid || index}
                        advert={advert}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .category-detail-page .right-content {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
