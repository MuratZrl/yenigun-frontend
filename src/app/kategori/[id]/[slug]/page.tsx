"use client";

import { Advert, Advisor, AdvertDetails, Steps } from "@/app/types/search";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Home,
  Building,
  ChevronRight,
  Search,
  Calendar,
  User,
} from "lucide-react";
import api from "@/app/lib/api";
import DynamicSearch from "@/app/components/DynamicSearch";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  features: any[];
  subcategories?: Subcategory[];
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAds, setLoadingAds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/categories");

        if (response.data && response.data.success) {
          const categories = response.data.data;
          const foundCategory = categories.find(
            (cat: Category) => cat._id === categoryId
          );

          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError("Kategori bulunamadı");
          }
        } else {
          throw new Error("API yanıtı beklenen formatta değil");
        }
      } catch (err: any) {
        console.error("Kategori detayları yüklenirken hata:", err);
        setError("Kategori yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  const fetchAdverts = async (filters: any = {}) => {
    try {
      setLoadingAds(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
      };

      if (category) {
        params.category = category.name;
      }

      if (selectedSubcategories.length > 0) {
        params.subcategories = selectedSubcategories.join(",");
      }

      console.log("📤 İlan arama parametreleri:", params);
      const response = await api.get("/advert/search", { params });
      console.log(response.data);

      let filteredData = response.data.data || [];

      const formattedAdverts = filteredData.map((ad: any) => ({
        uid: ad.uid,
        title: ad.title || "İsimsiz İlan",
        fee: ad.fee || "Fiyat Belirtilmemiş",
        address: {
          ...ad.address,
          full_address: ad.address?.full_address || "Adres bilgisi yok",
          province: ad.address?.province || "",
          district: ad.address?.district || "",
          quarter: ad.address?.quarter || "",
          mapCoordinates: ad.address?.mapCoordinates
            ? {
                lat: ad.address.mapCoordinates.lat,
                lng: ad.address.mapCoordinates.lng,
              }
            : undefined,
        },
        photos: ad.photos || [],
        thoughts: ad.thoughts || "",
        created: ad.created || { createdTimestamp: Date.now() },
        advisor: ad.advisor,
        details: ad.details,
        isNew: ad.isNew || false,
        steps: ad.steps,
      }));

      const withCoordinates = formattedAdverts.filter(
        (ad: any) =>
          ad.address?.mapCoordinates?.lat && ad.address?.mapCoordinates?.lng
      );
      console.log("📍 Koordinatı olan ilanlar:", withCoordinates.length);

      setAdverts(formattedAdverts);
      setTotalItems(
        response.data.pagination?.totalItems || formattedAdverts.length
      );
    } catch (error: any) {
      console.error("❌ İlanlar yüklenirken hata:", error);
      setAdverts([]);
      setTotalItems(0);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchAdverts(searchFilters);
    }
  }, [category, currentPage, selectedSubcategories, searchFilters]);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handleSubcategoryClickWithFilter = (
    subcategoryId: string,
    subcategoryName: string
  ) => {
    if (category) {
      const params = new URLSearchParams();
      params.set("type", `${category.name} > ${subcategoryName}`);
      router.push(`/ads?${params.toString()}`);
    }
  };

  const hasValidImage = (advert: Advert): boolean => {
    if (!advert.photos || !Array.isArray(advert.photos)) {
      return false;
    }

    const firstPhoto = advert.photos[0];

    if (typeof firstPhoto !== "string" || firstPhoto.trim() === "") {
      return false;
    }

    try {
      new URL(firstPhoto);
      return true;
    } catch {
      return false;
    }
  };

  const logoUrl = "/logo.png";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Tarih yok";
    const date = new Date(timestamp);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hata!</h2>
          <p className="text-gray-600 mb-6">{error || "Kategori bulunamadı"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-5 bg-white shadow-sm"></div>

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
          <div className="lg:w-1/4">
            <div
              className="bg-white rounded-2xl shadow-lg p-6"
              style={{
                position: "sticky",
                top: "6rem",
                maxHeight: "calc(100vh - 8rem)",
                overflowY: "auto",
              }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {totalItems} ilan bulundu
                </p>
              </div>

              {category.subcategories.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Alt Kategoriler
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {category.subcategories.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {category.subcategories.map((subcat) => (
                      <button
                        key={subcat._id}
                        onClick={() =>
                          handleSubcategoryClickWithFilter(
                            subcat._id,
                            subcat.name
                          )
                        }
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Building className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-blue-700">
                            {subcat.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {subcat.subcategories &&
                            subcat.subcategories.length > 0 && (
                              <span className="text-xs text-gray-500 mr-2">
                                {subcat.subcategories.length} alt
                              </span>
                            )}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("type", category.name);
                  router.push(`/ads?${params.toString()}`);
                }}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Tüm İlanları Görüntüle
              </button>
            </div>
          </div>

          {!isMobile && (
            <div className="lg:w-3/4">
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
                      const params = new URLSearchParams();
                      params.set("type", category.name);
                      router.push(`/ads?${params.toString()}`);
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Tüm İlanları Görüntüle
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 pt-3">
                    {adverts.map((advert) => (
                      <Link
                        href={`/ads/${advert.uid}`}
                        key={advert.uid}
                        className="flex relative bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 overflow-hidden group"
                      >
                        <div className="w-20 h-20 md:w-36 md:h-36 shrink-0 relative m-2 md:m-3">
                          {hasValidImage(advert) ? (
                            <>
                              <img
                                src={advert.photos[0]}
                                alt={advert.title || "İlan görseli"}
                                className="w-full h-full object-cover rounded group-hover:opacity-90 transition-opacity"
                                onError={(e) => {
                                  console.log(
                                    `❌ Görsel yüklenemedi: ${advert.photos[0]}`
                                  );
                                  e.currentTarget.src = logoUrl;
                                  e.currentTarget.alt = "Logo";
                                  e.currentTarget.className =
                                    "w-full h-full object-contain p-2 md:p-3 bg-gray-100 rounded";
                                }}
                                onLoad={() =>
                                  console.log(
                                    `✅ Görsel yüklendi: ${advert.photos[0]}`
                                  )
                                }
                              />
                            </>
                          ) : (
                            <div className="flex items-center justify-center bg-gray-100 w-full h-full rounded">
                              <img
                                src={logoUrl}
                                alt="Logo"
                                className="object-contain h-8 md:h-12 opacity-70"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/150x150?text=Logo";
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2 md:py-3 pr-2 md:pr-3 min-w-0">
                          <div className="mb-1">
                            <h3 className="font-bold text-gray-900 text-xs md:text-base hover:text-blue-600 transition-colors break-words whitespace-normal line-clamp-2">
                              {advert.title || "İsimsiz İlan"}
                            </h3>
                          </div>

                          <div className="mb-1">
                            {advert.steps?.second && (
                              <span className="text-[10px] md:text-xs text-gray-600 bg-gray-100 px-1.5 md:px-2 py-0.5 rounded">
                                {advert.steps.second}
                              </span>
                            )}
                          </div>

                          <div className="hidden md:grid md:grid-cols-3 gap-2 mb-2">
                            {advert.details?.netArea && (
                              <div className="text-center">
                                <div className="text-gray-500 text-xs">
                                  Net Alan
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {advert.details.netArea} m²
                                </div>
                              </div>
                            )}

                            {advert.details?.grossArea && (
                              <div className="text-center">
                                <div className="text-gray-500 text-xs">
                                  Brüt Alan
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {advert.details.grossArea} m²
                                </div>
                              </div>
                            )}

                            {advert.details?.buildingAge && (
                              <div className="text-center">
                                <div className="text-gray-500 text-xs">
                                  Bina Yaşı
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {advert.details.buildingAge} Yıl
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <div className="text-[10px] md:text-sm text-gray-600 truncate pr-1 min-w-0">
                              <p className="truncate hidden md:block">
                                {advert.address?.province &&
                                  `${advert.address.province}`}
                                {advert.address?.district &&
                                  ` - ${advert.address.district}`}
                                {advert.address?.quarter &&
                                  `, ${advert.address.quarter}`}
                                {!advert.address?.province &&
                                  !advert.address?.district &&
                                  !advert.address?.quarter &&
                                  "Lokasyon yok"}
                              </p>

                              <div className="md:hidden flex flex-col gap-0.5">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>
                                    {formatDate(
                                      advert.created?.createdTimestamp
                                    )}
                                  </span>
                                </div>
                                {advert.advisor && (
                                  <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    <span className="truncate">
                                      {advert.advisor.name}{" "}
                                      {advert.advisor.surname}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0 pl-1">
                              <div className="text-xs md:text-xl font-bold text-gray-900 whitespace-nowrap">
                                {advert.fee ? (
                                  <>{advert.fee}</>
                                ) : (
                                  <span className="text-gray-500 text-[10px] md:text-sm block">
                                    Fiyat Belirtilmemiş
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="hidden md:flex items-center gap-4 text-gray-500 text-xs mt-1">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>
                                {formatDate(advert.created?.createdTimestamp)}
                              </span>
                            </div>
                            {advert.advisor && (
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                <span>
                                  {advert.advisor.name} {advert.advisor.surname}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {totalItems > itemsPerPage && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Önceki
                        </button>

                        {Array.from(
                          { length: Math.ceil(totalItems / itemsPerPage) },
                          (_, i) => i + 1
                        )
                          .slice(Math.max(0, currentPage - 3), currentPage + 2)
                          .map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage >= Math.ceil(totalItems / itemsPerPage)
                          }
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sonraki →
                        </button>
                      </div>
                    </div>
                  )}
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
