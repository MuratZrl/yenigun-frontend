"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GoToTop from "@/app/components/GoToTop";
import { useCategoryContext } from "@/app/context/CategoryContext";
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
            (quarter: any) => quarter.name,
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
    null,
  );
  const [localSelectedSubcat, setLocalSelectedSubcat] =
    useState<Subcategory | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<Subcategory | null>(null);
  const { selectedSubcategory: contextSelectedSubcat } = useCategoryContext();
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
    {},
  );
  const [showUrlDebug, setShowUrlDebug] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/admin/categories");

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
    if (contextSelectedSubcat) {
      if (contextSelectedSubcat.path) {
        const newFilters = {
          ...filters,
          type:
            contextSelectedSubcat.path ||
            `${contextSelectedSubcat.parentCategoryName} > ${contextSelectedSubcat.name}`,
        };
        setFilters(newFilters);
      }

      if (contextSelectedSubcat.features.length > 0) {
        const initialFeatureFilters: Record<string, any> = {};
        contextSelectedSubcat.features.forEach((feature: any) => {
          if (!featureFilters[feature._id]) {
            if (feature.type === "multi_select") {
              initialFeatureFilters[feature._id] = [];
            } else if (feature.type === "boolean") {
              initialFeatureFilters[feature._id] = false;
            } else if (feature.type === "range") {
              initialFeatureFilters[feature._id] = { min: null, max: null };
            } else if (feature.type === "single_select") {
              initialFeatureFilters[feature._id] = "";
            } else {
              initialFeatureFilters[feature._id] = "";
            }
          }
        });

        setFeatureFilters((prev) => ({
          ...prev,
          ...initialFeatureFilters,
        }));
      }
    }
  }, [contextSelectedSubcat]);

  useEffect(() => {
    if (loadingCategories || categories.length === 0) return;

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
          (key) => !["page"].includes(key),
        );
        setShowUrlDebug(hasFilterParams);

        if (isInitialLoad.current) {
          await fetchSearchResults(
            newFilters,
            pageFromUrl,
            featureFiltersFromUrl,
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
    categories: Category[],
  ) => {
    const categoryPath = typeParam.split(" > ");

    if (categoryPath.length === 0) {
      return;
    }

    const firstPart = categoryPath[0];
    const secondPart = categoryPath[1];
    const thirdPart = categoryPath[2];

    const foundCategory = categories.find((cat) => cat.name === firstPart);
    if (!foundCategory) {
      return;
    }

    setSelectedCategory(foundCategory);
    setAvailableSubcategories(foundCategory.subcategories || []);

    if (secondPart && foundCategory.subcategories) {
      const foundSubcategory = foundCategory.subcategories.find(
        (sub) => sub.name === secondPart,
      );

      if (foundSubcategory) {
        setLocalSelectedSubcat(foundSubcategory);
        setAvailableSubSubcategories(foundSubcategory.subcategories || []);

        if (thirdPart && foundSubcategory.subcategories) {
          const foundSubSubcategory = foundSubcategory.subcategories.find(
            (subsub) => subsub.name === thirdPart,
          );

          if (foundSubSubcategory) {
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
      featureFilters: Record<string, any>,
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
        (key) => !["page"].includes(key),
      );
      setShowUrlDebug(hasFilterParams);

      router.replace(newUrl, { scroll: false });
    },
    [router],
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
    filters?: any,
  ) => {
    try {
      let params: any = {
        ...filters,
        page,
        limit,
      };
      if (filters.featureFilters && Array.isArray(filters.featureFilters)) {
        delete params.featureFilters;

        filters.featureFilters.forEach((filter: any, index: number) => {
          params[`featureFilters[${index}][featureId]`] = filter.featureId;
          params[`featureFilters[${index}][value]`] = filter.value;
        });
      }

      const response = await api.get("/advert/search", {
        params,
        paramsSerializer: (params) => {
          const items: string[] = [];

          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((item, index) => {
                  items.push(`${key}[${index}]=${encodeURIComponent(item)}`);
                });
              } else {
                items.push(`${key}=${encodeURIComponent(value)}`);
              }
            }
          });

          return items.join("&");
        },
      });

      console.log("✅ Arama başarılı:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Arama hatası:", error);
      throw error;
    }
  };

  const buildApiFilters = (
    filterValues: FilterState,
    currentFeatureFilters: Record<string, any> = {},
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

    apiFilters.sortBy = filterValues.sortBy || "date";
    apiFilters.sortOrder = filterValues.sortOrder || "desc";

    const featureFiltersArray = Object.entries(currentFeatureFilters)
      .filter(([featureId, value]) => {
        if (value === undefined || value === null || value === "") return false;

        if (typeof value === "number" && value === 0) return false;

        if (Array.isArray(value) && value.length === 0) return false;

        if (typeof value === "object" && value !== null) {
          if (value.min === null && value.max === null) return false;
          if (value.min === 0 && value.max === 0) return false;
        }

        return true;
      })
      .map(([featureId, value]) => {
        let formattedValue: any = value;

        if (Array.isArray(value)) {
          formattedValue = value.join(",");
        }

        if (typeof value === "boolean") {
          formattedValue = value ? "true" : "false";
        }

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          if (value.min !== null && value.max !== null) {
            formattedValue = `${value.min}-${value.max}`;
          } else if (value.min !== null) {
            formattedValue = `${value.min}`;
          } else if (value.max !== null) {
            formattedValue = `${value.max}`;
          }
        }

        return {
          featureId,
          value: formattedValue,
        };
      });

    if (featureFiltersArray.length > 0) {
      apiFilters.featureFilters = featureFiltersArray;
    }

    return apiFilters;
  };

  const fetchSearchResults = async (
    filterValues: FilterState,
    page: number = 1,
    currentFeatureFilters: Record<string, any> = {},
  ) => {
    try {
      setLoading(true);

      const apiFilters = buildApiFilters(filterValues, currentFeatureFilters);

      const result = await searchAdvertsAPI(page, itemsPerPage, apiFilters);

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
    [filters, featureFilters, fetchSearchResults, updateURL],
  );

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
    setLocalSelectedSubcat(null);
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

  const formatTRY = (v: any) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number") {
      return new Intl.NumberFormat("tr-TR").format(v) + " TL";
    }
    return String(v);
  };

  const GROSS_M2_FEATURE_ID = "69679f63cd76859b79ca8aa4";
  const NET_M2_FEATURE_ID = "69679f97cd76859b79ca8ac6";
  const ALT_M2_FEATURE_ID = "6968858ccd76859b79ca9451";
  const DONUM_FEATURE_ID = "6931851fc9f133554f0adc75";

  const isValidM2 = (v: any) =>
    v !== undefined &&
    v !== null &&
    String(v).trim() !== "" &&
    String(v).trim() !== "0";

  const getM2Text = (ad: Advert) => {
    if (!ad.isFeatures || !Array.isArray(ad.featureValues)) return "";

    const gross = ad.featureValues.find(
      (f) => f.featureId === GROSS_M2_FEATURE_ID,
    );
    const net = ad.featureValues.find((f) => f.featureId === NET_M2_FEATURE_ID);
    const alt = ad.featureValues.find((f) => f.featureId === ALT_M2_FEATURE_ID);
    const donum = ad.featureValues.find(
      (f) => f.featureId === DONUM_FEATURE_ID,
    );

    const grossVal = isValidM2(gross?.value) ? String(gross!.value) : "";
    const netVal = isValidM2(net?.value) ? String(net!.value) : "";
    const altVal = isValidM2(alt?.value) ? String(alt!.value) : "";
    const donumVal = isValidM2(donum?.value) ? String(donum!.value) : "";

    /**
     * 🎯 ÖNCELİK SIRASI
     * 1️⃣ Brüt + Net
     * 2️⃣ Brüt
     * 3️⃣ Net
     * 4️⃣ Alternatif m²
     * 5️⃣ Dönüm
     */

    if (grossVal && netVal) {
      return `${grossVal} m²  • ${netVal}  m² `;
    }

    if (grossVal) {
      return `${grossVal} m² (Brüt)`;
    }

    if (netVal) {
      return `${netVal} m² (Net)`;
    }

    if (altVal) {
      return `${altVal} m²`;
    }

    if (donumVal) {
      return `${donumVal} Dönüm`;
    }

    return "";
  };

  const getRoom = (ad: Advert) => {
    if (ad.details?.roomCount) return String(ad.details.roomCount);
    if (ad.isFeatures && Array.isArray(ad.featureValues)) {
      const rc = ad.featureValues.find(
        (f) => f.featureId === "693a974dfc353e4edee38799",
      );
      if (rc?.value) return String(rc.value);
    }
    return "";
  };

  const getCityDistrict = (ad: Advert) => {
    const p = ad.address?.province;
    const d = ad.address?.district;
    if (p && d) return `${p}\n${d}`;
    if (p) return p;
    if (d) return d;
    return "";
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
        currentPage - Math.floor(maxVisiblePages / 2),
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
            selectedSubcategory={localSelectedSubcat}
            setSelectedSubcategory={setLocalSelectedSubcat}
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
            contextFeatures={
              (contextSelectedSubcat?.features || []) as Feature[]
            }
          />

          <div className="flex-1 min-w-0">
            {/* ÜST BAR (sahibinden gibi) */}
            <div className="border border-gray-200 rounded-md">
              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">
                      {filters.type && filters.type !== "Hepsi"
                        ? `"${filters.type}"`
                        : `"Tüm İlanlar"`}
                    </span>{" "}
                    aramanızda{" "}
                    <span className="text-red-600 font-semibold">
                      {totalItems.toLocaleString("tr-TR")}
                    </span>{" "}
                    ilan bulundu.
                  </div>
                </div>

                {/* Sekmeler + sağ aksiyonlar */}
                <div className="flex items-center justify-between gap-3">
                  {/* sağ: görünüm + sıralama */}
                  <div className="flex items-center gap-2">
                    <select
                      value={`${filters.sortBy}_${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sb, so] = e.target.value.split("_");
                        handleSortChangeDesktop(
                          sb as "date" | "price",
                          so as "asc" | "desc",
                        );
                      }}
                      className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                    >
                      <option value="date_desc">
                        Gelişmiş sıralama (Yeni → Eski)
                      </option>
                      <option value="date_asc">Eski ilanlar önce</option>
                      <option value="price_asc">Ucuzdan pahalıya</option>
                      <option value="price_desc">Pahalıdan ucuza</option>
                    </select>

                    {(filters.location !== "Hepsi" ||
                      filters.district !== "Hepsi" ||
                      filters.type !== "Hepsi" ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      Object.keys(featureFilters).length > 0) && (
                      <button
                        className="ml-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded flex items-center gap-2"
                        onClick={clearFilters}
                      >
                        <RotateCcw size={16} />
                        Temizle
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* TABLO BAŞLIKLARI */}
              <div className="hidden md:grid grid-cols-[120px_1fr_90px_90px_140px_130px_140px] border-t border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
                <div className="px-3 py-2"> </div>
                <div className="px-3 py-2">İlan Başlığı</div>
                <div className="px-3 py-2 text-center">m² (Brüt)</div>
                <div className="px-3 py-2 text-right">Fiyat</div>
                <div className="px-3 py-2 text-center">İlan Tarihi</div>
                <div className="px-3 py-2 text-center">İl / İlçe</div>
              </div>

              {/* SATIRLAR */}
              <div className="divide-y divide-gray-200">
                {data.length === 0 ? (
                  <div className="py-16 text-center">
                    <Search size={56} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-semibold text-gray-900">
                      İlan bulunamadı
                    </p>
                    <p className="text-gray-600">
                      Filtrelerinizi değiştirerek tekrar deneyin
                    </p>
                  </div>
                ) : (
                  data.map((ad: Advert, index: number) => (
                    <Link
                      href={`/ads/${ad.uid}`}
                      key={ad.uid || index}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      {/* DESKTOP ROW */}
                      <div className="hidden md:grid grid-cols-[120px_1fr_90px_90px_140px_130px_140px] items-center">
                        {/* görsel */}
                        <div className="p-2">
                          <div className="w-[110px] h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            {hasValidImage(ad) ? (
                              <img
                                src={ad.photos?.find(
                                  (p: any) => typeof p === "string",
                                )}
                                alt={ad.title || "İlan görseli"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/logo.png";
                                  e.currentTarget.className =
                                    "w-full h-full object-contain p-2";
                                }}
                              />
                            ) : (
                              <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-full h-full object-contain p-2 opacity-70"
                              />
                            )}
                          </div>
                        </div>
                        {/* başlık */}
                        <div className="px-3 py-2 min-w-0">
                          <div className="text-[13px] font-semibold text-blue-700 hover:underline line-clamp-2">
                            {ad.title || "Başlık Yok"}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {ad.steps?.second ? ad.steps.second : ""}
                          </div>
                        </div>
                        {/* m2 */}

                        <div className="px-3 py-2 text-center text-sm text-gray-800">
                          {getM2Text(ad) || "-"}
                        </div>

                        {/* fiyat */}
                        <div className="px-3 py-2 text-right">
                          <div className="text-sm font-bold text-blue-800 whitespace-nowrap">
                            {formatTRY(ad.fee) || "Fiyat Yok"}
                          </div>
                        </div>
                        {/* ilan tarihi */}
                        <div className="px-3 py-2 text-center text-sm text-gray-800">
                          {ad.created?.createdTimestamp
                            ? new Date(
                                ad.created.createdTimestamp,
                              ).toLocaleDateString("tr-TR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                        </div>
                        {/* il/ilçe */}
                        <div className="px-3 py-2 text-center text-sm text-gray-800 whitespace-pre-line">
                          {getCityDistrict(ad) || "-"}
                        </div>
                      </div>

                      {/* MOBILE CARD (basit) */}
                      <div className="md:hidden flex gap-3 p-3">
                        <div className="w-24 h-20 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                          {hasValidImage(ad) ? (
                            <img
                              src={ad.photos?.find(
                                (p: any) => typeof p === "string",
                              )}
                              alt={ad.title || "İlan görseli"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/logo.png";
                                e.currentTarget.className =
                                  "w-full h-full object-contain p-2";
                              }}
                            />
                          ) : (
                            <img
                              src="/logo.png"
                              alt="Logo"
                              className="w-full h-full object-contain p-2 opacity-70"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-blue-700 line-clamp-2">
                            {ad.title || "Başlık Yok"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {ad.address?.province || ""}
                            {ad.address?.district
                              ? ` - ${ad.address.district}`
                              : ""}
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="text-xs text-gray-700">
                              <span className="text-[10px] md:text-xs text-gray-700 px-1 py-0.5">
                                {getM2Text(ad) || "-"}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-blue-800 whitespace-nowrap">
                              {formatTRY(ad.fee) || "Fiyat Yok"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
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
                        featureFilters,
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
