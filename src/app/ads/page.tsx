"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GoToTop from "@/app/components/GoToTop";
import {
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import api from "@/app/lib/api";
import JSONDATA from "@/app/data.json";
import {
  Advert,
  FilterState,
  Category,
  Subcategory,
  Feature,
} from "@/app/types/advert";
import FilterSidebar from "../components/FilterSidebar";

const decodeURLParam = (param: string): string => {
  return decodeURIComponent(param.replace(/\+/g, " "));
};

const turkeyCities = JSONDATA.map((city: any) => {
  return {
    province: city.name,
    districts: city.towns.map((district: any) => {
      return {
        district: district.name,
        quarters: district.districts.reduce((acc: any, district: any) => {
          const quarterNames = district.quarters.map(
            (quarter: any) => quarter.name
          );
          return acc.concat(quarterNames);
        }, []),
      };
    }),
  };
});

export default function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const router = useRouter();
  const searchParamsClient = useSearchParams();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "Hepsi",
    district: "Hepsi",
    type: "Hepsi",
    action: "Tümü",
    minPrice: null,
    maxPrice: null,
    sortBy: "date",
    sortOrder: "desc",
  });

  const [data, setData] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<Subcategory | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState<
    Subcategory[]
  >([]);

  const [featureFilters, setFeatureFilters] = useState<Record<string, any>>({});

  const itemsPerPage = 12;

  const isInitialLoad = useRef(true);
  const isInitializingFilters = useRef(false);

  const [activeUrlParams, setActiveUrlParams] = useState<Record<string, any>>(
    {}
  );
  const [showUrlDebug, setShowUrlDebug] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/admin/categories");
        console.log("Kategoriler:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const categoriesData = response.data.data;
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (loadingCategories || categories.length === 0) return;

    console.log("📋 Kategoriler yüklendi, URL'den filtreleri alıyorum...");

    const initializeFiltersFromURL = async () => {
      if (isInitializingFilters.current) return;
      isInitializingFilters.current = true;

      try {
        const typeParam = resolvedSearchParams.type as string;
        const decodedTypeParam = typeParam
          ? decodeURLParam(typeParam)
          : "Hepsi";

        const sortByParam = resolvedSearchParams.sortBy as string;
        const sortOrderParam = resolvedSearchParams.sortOrder as string;

        const newFilters: FilterState = {
          keyword:
            typeof resolvedSearchParams.q === "string"
              ? decodeURLParam(resolvedSearchParams.q)
              : "",
          location:
            typeof resolvedSearchParams.location === "string"
              ? decodeURLParam(resolvedSearchParams.location)
              : "Hepsi",
          district:
            typeof resolvedSearchParams.district === "string"
              ? decodeURLParam(resolvedSearchParams.district)
              : "Hepsi",
          type: decodedTypeParam,
          action: "Tümü",
          minPrice: resolvedSearchParams.minPrice
            ? Number(resolvedSearchParams.minPrice)
            : null,
          maxPrice: resolvedSearchParams.maxPrice
            ? Number(resolvedSearchParams.maxPrice)
            : null,
          sortBy:
            sortByParam === "date" || sortByParam === "price"
              ? sortByParam
              : "date",
          sortOrder:
            sortOrderParam === "asc" || sortOrderParam === "desc"
              ? sortOrderParam
              : "desc",
        };

        console.log("📝 URL'den alınan filtreler:", newFilters);
        console.log("🔍 Decoded type param:", decodedTypeParam);

        setFilters(newFilters);

        const featureFiltersFromUrl: Record<string, any> = {};
        Object.keys(resolvedSearchParams).forEach((key) => {
          if (key.startsWith("feature_")) {
            const featureId = key.replace("feature_", "");
            const value = resolvedSearchParams[key];

            if (typeof value === "string") {
              const decodedValue = decodeURLParam(value);
              if (decodedValue.includes(",")) {
                featureFiltersFromUrl[featureId] = decodedValue.split(",");
              } else if (decodedValue === "true" || decodedValue === "false") {
                featureFiltersFromUrl[featureId] = decodedValue === "true";
              } else if (!isNaN(Number(decodedValue))) {
                featureFiltersFromUrl[featureId] = Number(decodedValue);
              } else {
                featureFiltersFromUrl[featureId] = decodedValue;
              }
            }
          }
        });

        if (Object.keys(featureFiltersFromUrl).length > 0) {
          setFeatureFilters(featureFiltersFromUrl);
        }

        const pageFromUrl = resolvedSearchParams.page
          ? Number(resolvedSearchParams.page)
          : 1;
        setCurrentPage(pageFromUrl);

        if (decodedTypeParam && decodedTypeParam !== "Hepsi") {
          await handleCategorySelectionFromURL(decodedTypeParam, categories);
        }

        const urlParams: Record<string, any> = {};
        Object.entries(resolvedSearchParams).forEach(([key, value]) => {
          if (value) {
            if (typeof value === "string") {
              urlParams[key] = decodeURLParam(value);
            }
          }
        });
        setActiveUrlParams(urlParams);

        const hasFilterParams = Object.keys(urlParams).some(
          (key) => !["page"].includes(key)
        );
        setShowUrlDebug(hasFilterParams);

        if (isInitialLoad.current) {
          console.log("🚀 İlk API isteğini gönderiyorum...");
          await fetchSearchResults(
            newFilters,
            pageFromUrl,
            featureFiltersFromUrl
          );
          isInitialLoad.current = false;
        }
      } catch (error) {
        console.error("❌ Filtre başlatma hatası:", error);
      } finally {
        isInitializingFilters.current = false;
      }
    };

    initializeFiltersFromURL();
  }, [categories, loadingCategories, resolvedSearchParams]);

  const handleCategorySelectionFromURL = async (
    typeParam: string,
    categories: Category[]
  ) => {
    console.log("🎯 URL'den kategori seçimi yapılıyor:", typeParam);

    const categoryPath = typeParam.split(" > ");
    console.log("🎯 Parsed category path:", categoryPath);

    if (categoryPath.length === 0) {
      console.log("🎯 Kategori path'i boş");
      return;
    }

    const firstPart = categoryPath[0];
    const secondPart = categoryPath[1];
    const thirdPart = categoryPath[2];

    const foundCategory = categories.find((cat) => cat.name === firstPart);
    if (!foundCategory) {
      console.log("❌ Ana kategori bulunamadı:", firstPart);
      return;
    }

    console.log("✅ Ana kategori bulundu:", foundCategory.name);
    setSelectedCategory(foundCategory);
    setAvailableSubcategories(foundCategory.subcategories || []);

    if (secondPart && foundCategory.subcategories) {
      const foundSubcategory = foundCategory.subcategories.find(
        (sub) => sub.name === secondPart
      );

      if (foundSubcategory) {
        console.log("✅ Alt kategori bulundu:", foundSubcategory.name);
        setSelectedSubcategory(foundSubcategory);
        setAvailableSubSubcategories(foundSubcategory.subcategories || []);

        if (thirdPart && foundSubcategory.subcategories) {
          const foundSubSubcategory = foundSubcategory.subcategories.find(
            (subsub) => subsub.name === thirdPart
          );

          if (foundSubSubcategory) {
            console.log(
              "✅ Alt-alt kategori bulundu:",
              foundSubSubcategory.name
            );
            setSelectedSubSubcategory(foundSubSubcategory);
          }
        }
      }
    }
  };

  const handleOpenSortMenu = () => {
    setIsSortMenuOpen(true);
  };

  const updateURL = useCallback(
    (
      filters: FilterState,
      page: number,
      featureFilters: Record<string, any>
    ) => {
      const params = new URLSearchParams();

      if (filters.keyword) params.set("q", filters.keyword);
      if (filters.location && filters.location !== "Hepsi")
        params.set("location", filters.location);
      if (filters.district && filters.district !== "Hepsi")
        params.set("district", filters.district);
      if (filters.type && filters.type !== "Hepsi")
        params.set("type", filters.type);
      if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());

      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

      if (page > 1) params.set("page", page.toString());

      Object.entries(featureFilters).forEach(([featureId, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value) && value.length > 0) {
            params.set(`feature_${featureId}`, value.join(","));
          } else if (typeof value === "boolean") {
            params.set(`feature_${featureId}`, value.toString());
          } else {
            params.set(`feature_${featureId}`, value.toString());
          }
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `/ads?${queryString}` : "/ads";

      const urlParams: Record<string, any> = {};
      params.forEach((value, key) => {
        urlParams[key] = value;
      });
      setActiveUrlParams(urlParams);

      const hasFilterParams = Object.keys(urlParams).some(
        (key) => !["page"].includes(key)
      );
      setShowUrlDebug(hasFilterParams);

      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (isInitialLoad.current) return;

    const handlePageChange = async () => {
      await fetchSearchResults(filters, currentPage, featureFilters);
      updateURL(filters, currentPage, featureFilters);
      window.scrollTo(0, 0);
    };

    handlePageChange();
  }, [currentPage]);

  const searchAdvertsAPI = async (
    page: number = 1,
    limit: number = 12,
    filters?: any
  ) => {
    try {
      console.log("🔍 API isteği gönderiliyor, filtreler:", filters);

      const response = await api.get("/advert/search", {
        params: {
          ...filters,
          page,
          limit,
        },
      });

      console.log("📥 API yanıtı:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Arama hatası:", error);
      throw error;
    }
  };

  const buildApiFilters = (
    filterValues: FilterState,
    currentFeatureFilters: Record<string, any> = {}
  ) => {
    const apiFilters: any = {};

    if (filterValues.location && filterValues.location !== "Hepsi") {
      apiFilters.city = filterValues.location;
      if (filterValues.district && filterValues.district !== "Hepsi") {
        apiFilters.district = filterValues.district;
      }
    }

    if (filterValues.type && filterValues.type !== "Hepsi") {
      const categoryPath = filterValues.type.split(" > ");

      if (categoryPath.length > 0) {
        apiFilters.category = categoryPath[0];

        if (categoryPath.length > 1) {
          apiFilters.type = categoryPath[1];

          if (categoryPath.length > 2) {
            apiFilters.subcategory = categoryPath[2];
          }
        }
      }
    }

    if (filterValues.minPrice !== null && filterValues.minPrice > 0) {
      apiFilters.minPrice = filterValues.minPrice;
    }

    if (filterValues.maxPrice !== null && filterValues.maxPrice > 0) {
      apiFilters.maxPrice = filterValues.maxPrice;
    }

    if (filterValues.keyword && filterValues.keyword.trim() !== "") {
      apiFilters.search = filterValues.keyword.trim();
    }

    apiFilters.sortBy = filterValues.sortBy;
    apiFilters.sortOrder = filterValues.sortOrder;

    const currentFeatures = getCurrentFeatures();
    if (currentFeatures.length > 0) {
      const featureFiltersArray = Object.entries(currentFeatureFilters)
        .filter(([featureId, value]) => {
          if (value === undefined || value === null || value === "")
            return false;
          if (typeof value === "number" && value === 0) return false;
          if (Array.isArray(value) && value.length === 0) return false;
          if (typeof value === "object" && value !== null) {
            if (value.min === null && value.max === null) return false;
            if (value.min === 0 && value.max === 0) return false;
          }
          return true;
        })
        .map(([featureId, value]) => ({
          featureId,
          value,
        }));

      if (featureFiltersArray.length > 0) {
        apiFilters.featureFilters = featureFiltersArray;
      }
    }

    return apiFilters;
  };

  const fetchSearchResults = async (
    filterValues: FilterState,
    page: number = 1,
    currentFeatureFilters: Record<string, any> = {}
  ) => {
    try {
      setLoading(true);
      console.log("🔍 Yeni API isteği gönderiliyor, sayfa:", page);

      const apiFilters = buildApiFilters(filterValues, currentFeatureFilters);

      console.log("📤 API İSTEĞİ SIRALAMA:", {
        sortBy: apiFilters.sortBy,
        sortOrder: apiFilters.sortOrder,
      });

      console.log("📤 API İSTEĞİ:", {
        ...apiFilters,
        page,
        limit: itemsPerPage,
      });

      const result = await searchAdvertsAPI(page, itemsPerPage, apiFilters);

      console.log("📥 API YANITI:", result);

      if (result.success && Array.isArray(result.data)) {
        setData(result.data);

        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setTotalItems(result.pagination.totalItems || 0);
        }
      } else {
        setData([]);
        setTotalPages(1);
        setTotalItems(0);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("❌ API İstek Hatası:", error);
      setData([]);
      setLoading(false);
    }
  };

  const handleSortChangeDesktop = useCallback(
    async (sortBy: "date" | "price", sortOrder: "asc" | "desc") => {
      const newFilters = {
        ...filters,
        sortBy,
        sortOrder,
      };

      setFilters(newFilters);

      setCurrentPage(1);

      await fetchSearchResults(newFilters, 1, featureFilters);

      updateURL(newFilters, 1, featureFilters);
    },
    [filters, featureFilters, fetchSearchResults, updateURL]
  );

  const getCurrentFeatures = (): Feature[] => {
    console.log("🔍 getCurrentFeatures çağrıldı:");
    console.log("   - filters.type:", filters.type);

    if (filters.type === "Hepsi") {
      console.log("   - Tüm kategoriler seçili, özellik yok");
      return [];
    }

    const categoryPath = filters.type.split(" > ");
    console.log("   - categoryPath:", categoryPath);

    if (categoryPath.length === 0) {
      return [];
    }

    const foundCategory = categories.find(
      (cat) => cat.name === categoryPath[0]
    );
    if (!foundCategory) {
      console.log("   - Kategori bulunamadı:", categoryPath[0]);
      return [];
    }

    if (categoryPath.length === 1) {
      if (
        foundCategory.subcategories &&
        foundCategory.subcategories.length > 0
      ) {
        const firstSubcategory = foundCategory.subcategories[0];
        console.log(
          "   - Varsayılan alt kategori özellikleri:",
          firstSubcategory.features
        );
        return firstSubcategory.features || [];
      }
      return [];
    }

    const foundSubcategory = foundCategory.subcategories?.find(
      (sub) => sub.name === categoryPath[1]
    );

    if (!foundSubcategory) {
      console.log("   - Alt kategori bulunamadı:", categoryPath[1]);
      return [];
    }

    console.log("   - Bulunan özellikler:", foundSubcategory.features);
    return foundSubcategory.features || [];
  };

  const handleFilter = useCallback(async () => {
    setCurrentPage(1);
    await fetchSearchResults(filters, 1, featureFilters);
    updateURL(filters, 1, featureFilters);
  }, [filters, featureFilters, updateURL]);

  const clearFilters = async () => {
    const clearedFilters: FilterState = {
      keyword: "",
      location: "Hepsi",
      district: "Hepsi",
      type: "Hepsi",
      action: "Tümü",
      minPrice: null,
      maxPrice: null,
    };

    setFilters(clearedFilters);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setAvailableSubcategories([]);
    setAvailableSubSubcategories([]);
    setFeatureFilters({});
    setCurrentPage(1);
    setActiveUrlParams({});
    setShowUrlDebug(false);

    await fetchSearchResults(clearedFilters, 1, {});

    router.replace("/ads", { scroll: false });
  };

  const hasValidImage = (ad: Advert): boolean => {
    if (!ad.photos || !Array.isArray(ad.photos)) return false;

    const validPhoto = ad.photos.find((photo: any) => {
      if (typeof photo === "string") {
        return (
          photo.trim() !== "" &&
          !photo.includes("default-image") &&
          !photo.includes("placeholder")
        );
      }
      return false;
    });

    return !!validPhoto;
  };

  const CustomPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisiblePages = 7;

      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => {
            const newPage = Math.max(1, currentPage - 1);
            setCurrentPage(newPage);
            updateURL(filters, newPage, featureFilters);
          }}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => {
              setCurrentPage(page);
              updateURL(filters, page, featureFilters);
            }}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-md"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => {
            const newPage = Math.min(totalPages, currentPage + 1);
            setCurrentPage(newPage);
            updateURL(filters, newPage, featureFilters);
          }}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const logoUrl = "/logo.png";

  if (loading && data.length === 0) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-600"></div>
          <p className="text-gray-600 font-medium">İlanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        <div className="flex">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedSubSubcategory={selectedSubSubcategory}
            setSelectedSubSubcategory={setSelectedSubSubcategory}
            categories={categories}
            loadingCategories={loadingCategories}
            availableSubcategories={availableSubcategories}
            setAvailableSubcategories={setAvailableSubcategories}
            availableSubSubcategories={availableSubSubcategories}
            setAvailableSubSubcategories={setAvailableSubSubcategories}
            featureFilters={featureFilters}
            setFeatureFilters={setFeatureFilters}
            handleFilter={handleFilter}
            clearFilters={clearFilters}
            totalItems={totalItems}
            showUrlDebug={showUrlDebug}
            urlParams={activeUrlParams}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenSortMenu={handleOpenSortMenu}
            citiesData={turkeyCities}
            handleSortChangeDesktop={handleSortChangeDesktop}
            setCurrentPage={setCurrentPage}
          />

          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filters.type && filters.type !== "Hepsi"
                    ? filters.type
                    : "Tüm İlanlar"}
                  <span className="text-sm text-gray-500 ml-2">
                    ({totalItems} sonuç)
                  </span>
                </h2>
              </div>

              {(filters.location !== "Hepsi" ||
                filters.district !== "Hepsi" ||
                filters.type !== "Hepsi" ||
                filters.minPrice ||
                filters.maxPrice ||
                Object.keys(featureFilters).length > 0) && (
                <button
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200"
                  onClick={clearFilters}
                >
                  <RotateCcw size={16} />
                  Filtreleri Temizle
                </button>
              )}
            </div>

            <div className="space-y-0 mb-8">
              {data.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <Search size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      İlan bulunamadı
                    </p>
                    <p className="text-gray-600 mb-4">
                      Filtrelerinizi değiştirerek tekrar deneyin
                    </p>
                  </div>
                </div>
              ) : (
                data.map((ad: Advert, index: number) => (
                  <Link
                    href={`/ads/${ad.uid}`}
                    key={ad.uid || index}
                    className="flex relative bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 overflow-hidden group"
                  >
                    <div className="w-20 h-20 md:w-36 md:h-36 shrink-0 relative m-2 md:m-3">
                      {hasValidImage(ad) ? (
                        <img
                          src={ad.photos?.find(
                            (photo: any) => typeof photo === "string"
                          )}
                          alt={ad.title || "İlan görseli"}
                          className="w-full h-full object-cover rounded group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.src = logoUrl;
                            e.currentTarget.alt = "Logo";
                            e.currentTarget.className =
                              "w-full h-full object-contain p-2 md:p-3 bg-gray-100 rounded";
                          }}
                        />
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
                        <h3 className="font-bold text-gray-900 text-xs md:text-base hover:text-blue-600 transition-colors wrap-break-words whitespace-normal line-clamp-2">
                          {ad.title || "Başlık Yok"}
                        </h3>
                      </div>

                      <div className="mb-1">
                        {ad.steps?.second && (
                          <span className="text-[10px] md:text-xs text-gray-600 bg-gray-100 px-1.5 md:px-2 py-0.5 rounded">
                            {ad.steps.second}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <div className="text-[10px] md:text-sm text-gray-600 truncate pr-1 min-w-0">
                          <p className="truncate">
                            {ad.address?.province && `${ad.address.province}`}
                            {ad.address?.district &&
                              ` - ${ad.address.district}`}
                            <span className="hidden md:inline">
                              {ad.address?.quarter && `, ${ad.address.quarter}`}
                            </span>
                            {!ad.address?.province &&
                              !ad.address?.district &&
                              !ad.address?.quarter &&
                              "Lokasyon yok"}
                          </p>
                        </div>

                        <div className="text-right shrink-0 pl-1">
                          <div className="text-xs md:text-xl font-bold text-gray-900 whitespace-nowrap">
                            {ad.fee ? (
                              <>{ad.fee}</>
                            ) : (
                              <span className="text-gray-500 text-[10px] md:text-sm block">
                                Fiyat Yok
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {totalPages > 1 && <CustomPagination />}
          </div>
        </div>
      </div>
      {isSortMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setIsSortMenuOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 p-6 max-h-[80vh] overflow-y-auto md:hidden animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sıralama</h3>
              <button
                onClick={() => setIsSortMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: "date_desc",
                  label: "Yeni ilanlar önce",
                  sortBy: "date",
                  sortOrder: "desc",
                },
                {
                  id: "date_asc",
                  label: "Eski ilanlar önce",
                  sortBy: "date",
                  sortOrder: "asc",
                },
                {
                  id: "price_asc",
                  label: "Ucuzdan pahalıya",
                  sortBy: "price",
                  sortOrder: "asc",
                },
                {
                  id: "price_desc",
                  label: "Pahalıdan ucuza",
                  sortBy: "price",
                  sortOrder: "desc",
                },
              ].map((option) => {
                const isSelected =
                  filters.sortBy === option.sortBy &&
                  filters.sortOrder === option.sortOrder;

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      const newFilters = {
                        ...filters,
                        sortBy: option.sortBy as "date" | "price",
                        sortOrder: option.sortOrder as "asc" | "desc",
                      };

                      setFilters(newFilters);

                      fetchSearchResults(
                        newFilters,
                        currentPage,
                        featureFilters
                      );

                      updateURL(newFilters, currentPage, featureFilters);

                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      isSelected
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {isSelected && (
                        <Check size={20} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsSortMenuOpen(false)}
              className="w-full mt-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>

          <style jsx>{`
            @keyframes slide-up {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }

            .animate-slide-up {
              animation: slide-up 0.3s ease-out;
            }
          `}</style>
        </>
      )}
      <Footer />
      <GoToTop />
    </main>
  );
}
