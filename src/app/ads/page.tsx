"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GoToTop from "@/app/components/GoToTop";
import JSONDATA from "../data.json";
import {
  Filter,
  Clock,
  Armchair,
  Layers,
  Square,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  DollarSign,
  Building,
  Navigation,
  Loader,
  Home,
  Check,
  ChevronDown,
  Tag,
  Bed,
  Bath,
  Car,
  Ruler,
  Thermometer,
  Eye,
} from "lucide-react";
import api from "@/app/lib/api";
import {
  Advert,
  FilterState,
  Category,
  Subcategory,
  Feature,
} from "@/app/types/advert";

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

const staticTypeOptions = [{ value: "Hepsi", label: "Hepsi" }];

const decodeURLParam = (param: string): string => {
  return decodeURIComponent(param.replace(/\+/g, " "));
};

const FeatureInput = ({
  feature,
  value,
  onChange,
}: {
  feature: Feature;
  value: any;
  onChange: (value: any) => void;
}) => {
  switch (feature.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`feature-${feature._id}`}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor={`feature-${feature._id}`}
            className="text-sm text-gray-700"
          >
            {feature.name}
          </label>
        </div>
      );

    case "single_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {feature.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {feature.options?.map((option: string, index: number) => {
              const isSelected = value?.includes(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const newValue = isSelected
                      ? value.filter((v: string) => v !== option)
                      : [...(value || []), option];
                    onChange(newValue);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );

    case "range":
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={value?.min || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    min: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={value?.max || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    max: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
  }
};

export default function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const router = useRouter();
  const searchParamsClient = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "Hepsi",
    district: "Hepsi",
    type: "Hepsi",
    action: "Tümü",
    minPrice: null,
    maxPrice: null,
  });

  const [data, setData] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [modal, setModal] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});

    if (category) {
      setAvailableSubcategories(category.subcategories || []);
      setFilters((prev) => ({ ...prev, type: category.name }));
    } else {
      setAvailableSubcategories([]);
      setAvailableSubSubcategories([]);
      setFilters((prev) => ({ ...prev, type: "Hepsi" }));
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});

    if (subcategory) {
      setAvailableSubSubcategories(subcategory.subcategories || []);

      if (subcategory.features && subcategory.features.length > 0) {
        const initialFilters: Record<string, any> = {};
        subcategory.features.forEach((feature: Feature) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          }
        });
        setFeatureFilters(initialFilters);
      }

      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${subcategory.name}`
        : subcategory.name;
      setFilters((prev) => ({ ...prev, type: categoryPath }));
    } else {
      setAvailableSubSubcategories([]);
      if (selectedCategory) {
        setFilters((prev) => ({ ...prev, type: selectedCategory.name }));
      }
    }
  };

  const handleSubSubcategorySelect = (subsubcategory: Subcategory | null) => {
    setSelectedSubSubcategory(subsubcategory);
    setFeatureFilters({});

    if (subsubcategory) {
      if (subsubcategory.features && subsubcategory.features.length > 0) {
        const initialFilters: Record<string, any> = {};
        subsubcategory.features.forEach((feature: Feature) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          }
        });
        setFeatureFilters(initialFilters);
      }

      const categoryPath =
        selectedCategory && selectedSubcategory
          ? `${selectedCategory.name} > ${selectedSubcategory.name} > ${subsubcategory.name}`
          : subsubcategory.name;
      setFilters((prev) => ({ ...prev, type: categoryPath }));
    } else if (selectedSubcategory) {
      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${selectedSubcategory.name}`
        : selectedSubcategory.name;
      setFilters((prev) => ({ ...prev, type: categoryPath }));
    }
  };

  const handleFeatureFilterChange = (featureId: string, value: any) => {
    setFeatureFilters((prev) => ({
      ...prev,
      [featureId]: value,
    }));
  };

  const getCurrentFeatures = (): Feature[] => {
    if (selectedSubSubcategory?.features) {
      return selectedSubSubcategory.features;
    }
    if (selectedSubcategory?.features) {
      return selectedSubcategory.features;
    }
    return [];
  };

  const fetchSearchResults = async (
    filterValues: FilterState,
    page: number = 1,
    currentFeatureFilters: Record<string, any> = {}
  ) => {
    try {
      setLoading(true);
      console.log("🔍 API isteği gönderiliyor, sayfa:", page);

      const params: any = {
        page: page,
        limit: itemsPerPage,
      };

      if (filterValues.keyword && filterValues.keyword.trim() !== "") {
        params.search = filterValues.keyword.trim();
      }

      if (filterValues.location && filterValues.location !== "Hepsi") {
        params.city = filterValues.location;

        if (filterValues.district && filterValues.district !== "Hepsi") {
          params.district = filterValues.district;
        }
      }

      if (filterValues.type && filterValues.type !== "Hepsi") {
        const categoryPath = filterValues.type;
        const categoryPathParts = categoryPath.split(" > ");

        if (categoryPathParts.length > 0) {
          params.category = categoryPathParts[0];
          console.log(
            "🎯 Backend'e gönderilen ana kategori:",
            categoryPathParts[0]
          );
        }

        if (categoryPathParts.length > 1) {
          params.subcategory = categoryPathParts[1];
          console.log(
            "🎯 Backend'e gönderilen alt kategori:",
            categoryPathParts[1]
          );
        }

        if (categoryPathParts.length > 2) {
          params.subsubcategory = categoryPathParts[2];
          console.log(
            "🎯 Backend'e gönderilen alt-alt kategori:",
            categoryPathParts[2]
          );
        }

        console.log("🎯 Tüm kategori path:", categoryPathParts);
      }

      const features = getCurrentFeatures();
      let featureIndex = 0;

      features.forEach((feature) => {
        const filterValue = currentFeatureFilters[feature._id];

        if (
          filterValue !== undefined &&
          filterValue !== null &&
          filterValue !== ""
        ) {
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            filterValue.forEach((value, index) => {
              params[`featureFilters[${featureIndex}][featureId]`] =
                feature._id;
              params[`featureFilters[${featureIndex}][value]`] = value;
              featureIndex++;
            });
          } else if (typeof filterValue === "object" && filterValue !== null) {
            if (filterValue.min !== undefined && filterValue.min !== null) {
              params[`featureFilters[${featureIndex}][featureId]`] =
                feature._id;
              params[`featureFilters[${featureIndex}][value]`] =
                filterValue.min;
              params[`featureFilters[${featureIndex}][operator]`] = "gte";
              featureIndex++;
            }
            if (filterValue.max !== undefined && filterValue.max !== null) {
              params[`featureFilters[${featureIndex}][featureId]`] =
                feature._id;
              params[`featureFilters[${featureIndex}][value]`] =
                filterValue.max;
              params[`featureFilters[${featureIndex}][operator]`] = "lte";
              featureIndex++;
            }
          } else if (filterValue !== false) {
            params[`featureFilters[${featureIndex}][featureId]`] = feature._id;

            if (typeof filterValue === "boolean") {
              params[`featureFilters[${featureIndex}][value]`] = filterValue
                ? "true"
                : "false";
            } else {
              params[`featureFilters[${featureIndex}][value]`] =
                String(filterValue);
            }

            featureIndex++;
          }
        }
      });

      if (filterValues.minPrice !== null && filterValues.minPrice > 0) {
        params.minPrice = filterValues.minPrice;
      }

      if (filterValues.maxPrice !== null && filterValues.maxPrice > 0) {
        params.maxPrice = filterValues.maxPrice;
      }

      console.log("📤 API İSTEĞİ:", params);

      const response = await api.get("/advert/search", {
        params,
        validateStatus: function (status) {
          return status < 500;
        },
      });

      console.log("📥 API YANITI:", response.data);

      let filteredData = response.data.data || [];

      if (Array.isArray(filteredData)) {
        setData(filteredData);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalItems(response.data.pagination.totalItems || 0);
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

  const handleFilter = useCallback(async () => {
    setModal(false);
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

    await fetchSearchResults(clearedFilters, 1, {});

    router.replace("/ads", { scroll: false });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFilter();
    }
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
      const maxVisiblePages = isMobile ? 5 : 7;

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

      <div className="pt-20 container mx-auto max-w-6xl px-4 py-8 -mt-8">
        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="İl, ilçe, mahalle veya proje adı yazın..."
                value={filters.keyword}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm shadow-sm transition-colors"
                onChange={(e) => {
                  setFilters({ ...filters, keyword: e.target.value });
                }}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 flex-1 lg:flex-none justify-center font-medium text-sm transition-colors shadow-sm hover:shadow-md"
                onClick={handleFilter}
              >
                <Search size={16} />
                Ara
              </button>

              <button
                className="bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2.5 flex items-center gap-2 rounded-lg flex-1 lg:flex-none justify-center font-medium text-sm transition-colors shadow-sm hover:shadow-md"
                onClick={() => setModal(true)}
              >
                <Filter size={16} />
                Filtre
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filters.keyword ? `"${filters.keyword}"` : "Tüm İlanlar"}
              <span className="text-sm text-gray-500 ml-2">
                ({totalItems} sonuç)
              </span>
            </h2>
            {filters.location !== "Hepsi" && (
              <p className="text-gray-600 mt-1">
                {filters.location}
                {filters.district !== "Hepsi" && ` / ${filters.district}`}
                {filters.type !== "Hepsi" && ` / ${filters.type}`}
              </p>
            )}
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
            <div className="col-span-3 py-16 text-center">
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  İlan bulunamadı
                </p>
                <p className="text-gray-600 mb-4">
                  Filtrelerinizi değiştirerek tekrar deneyin
                </p>
                <button
                  onClick={() => setModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <Filter size={18} />
                  Filtreleri Değiştir
                </button>
              </div>
            </div>
          ) : (
            data.map((ad: Advert, index: number) => (
              <Link
                href={`/ads/${ad.uid}`}
                key={ad.uid || index}
                className="flex relative bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 overflow-hidden group"
              >
                {/* Sol taraf - Resim (Mobilde daha küçük) */}
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

                {/* Orta ve Sağ kısım */}
                <div className="flex-1 flex flex-col justify-between py-2 md:py-3 pr-2 md:pr-3 min-w-0">
                  {/* EN ÜST: Başlık */}
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

                  {/* ALT KISIM: Adres ve Fiyat (Karşılıklı) */}
                  <div className="flex justify-between items-center mt-auto">
                    {/* Sol taraf - Adres (Mobilde sadece il-ilçe) */}
                    <div className="text-[10px] md:text-sm text-gray-600 truncate pr-1 min-w-0">
                      <p className="truncate">
                        {ad.address?.province && `${ad.address.province}`}
                        {ad.address?.district && ` - ${ad.address.district}`}
                        {/* Mobilde quarter gözükmüyor */}
                        <span className="hidden md:inline">
                          {ad.address?.quarter && `, ${ad.address.quarter}`}
                        </span>
                        {!ad.address?.province &&
                          !ad.address?.district &&
                          !ad.address?.quarter &&
                          "Lokasyon yok"}
                      </p>
                    </div>

                    {/* Sağ taraf - Fiyat (Mobilde daha küçük ama görünür) */}
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

      <Footer />
      <GoToTop />

      {/* Filter Modal */}
      {modal && (
        <div className="fixed inset-0 z-9999 flex items-start justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-linear-to-br from-gray-50 to-white w-full max-w-4xl rounded-2xl shadow-2xl shadow-gray-900/10 my-8 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-linear-to-r from-slate-900 to-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Filter size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Detaylı Filtreleme
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                      İlanları özelliklerine göre filtreleyin
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                >
                  <X
                    size={22}
                    className="text-gray-300 group-hover:text-white transition-colors"
                  />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter();
              }}
              className="p-8 space-y-8 max-h-[80vh] overflow-y-auto"
            >
              {/* Location Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-rose-100 to-pink-100 rounded-lg">
                    <Navigation size={18} className="text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Konum
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      İl
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          location: e.target.value,
                          district: "Hepsi",
                        });
                      }}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="Hepsi">Tüm İller</option>
                      {turkeyCities.map((city: any) => (
                        <option key={city.province} value={city.province}>
                          {city.province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      İlçe
                    </label>
                    <select
                      value={filters.district}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          district: e.target.value,
                        });
                      }}
                      disabled={filters.location === "Hepsi"}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="Hepsi">
                        {filters.location === "Hepsi"
                          ? "Önce il seçiniz"
                          : "Tüm İlçeler"}
                      </option>
                      {turkeyCities
                        .find((city: any) => city.province === filters.location)
                        ?.districts.map((district: any) => (
                          <option
                            key={district.district}
                            value={district.district}
                          >
                            {district.district}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Type Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-emerald-100 to-teal-100 rounded-lg">
                    <Building size={18} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Emlak Tipi
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Kategori
                    </label>
                    {loadingCategories ? (
                      <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white flex items-center justify-center">
                        <Loader
                          size={18}
                          className="animate-spin text-gray-400"
                        />
                        <span className="ml-2 text-gray-500">
                          Kategoriler yükleniyor...
                        </span>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl bg-white p-4">
                        {/* Seçim Yolu */}
                        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={16} className="text-blue-600" />
                            <span className="font-medium text-blue-800">
                              Seçilen:
                            </span>
                            <div className="flex-1">
                              <span className="text-blue-700">
                                {filters.type === "Hepsi"
                                  ? "Tüm Kategoriler"
                                  : filters.type}
                              </span>
                            </div>
                            {(selectedCategory ||
                              selectedSubcategory ||
                              selectedSubSubcategory) && (
                              <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <RotateCcw size={12} />
                                Temizle
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Kategori Seçim Grid'i */}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Ana Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Ana Kategori
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(null)}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                !selectedCategory
                                  ? "bg-blue-100 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Home size={16} />
                                <span className="font-medium">Tümü</span>
                              </div>
                            </button>
                            {categories.map((category) => (
                              <button
                                key={category._id}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  selectedCategory?._id === category._id
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Building size={16} />
                                    <span className="font-medium">
                                      {category.name}
                                    </span>
                                  </div>
                                  {selectedCategory?._id === category._id && (
                                    <Check
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Alt Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Alt Kategori
                            </h4>
                            {selectedCategory ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSubcategorySelect(null)}
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    !selectedSubcategory
                                      ? "bg-blue-100 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Tag size={16} />
                                    <span className="font-medium">Tümü</span>
                                  </div>
                                </button>
                                {availableSubcategories.map((subcategory) => (
                                  <button
                                    key={subcategory._id}
                                    type="button"
                                    onClick={() =>
                                      handleSubcategorySelect(subcategory)
                                    }
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                                      selectedSubcategory?._id ===
                                      subcategory._id
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {subcategory.name}
                                      </span>
                                      {selectedSubcategory?._id ===
                                        subcategory._id && (
                                        <Check
                                          size={16}
                                          className="text-blue-600"
                                        />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </>
                            ) : (
                              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                Önce ana kategori seçin
                              </div>
                            )}
                          </div>

                          {/* Alt Alt Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Detay
                            </h4>
                            {selectedSubcategory ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSubSubcategorySelect(null)
                                  }
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    !selectedSubSubcategory
                                      ? "bg-blue-100 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Tag size={16} />
                                    <span className="font-medium">Tümü</span>
                                  </div>
                                </button>
                                {availableSubSubcategories.map(
                                  (subsubcategory) => (
                                    <button
                                      key={subsubcategory._id}
                                      type="button"
                                      onClick={() =>
                                        handleSubSubcategorySelect(
                                          subsubcategory
                                        )
                                      }
                                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        selectedSubSubcategory?._id ===
                                        subsubcategory._id
                                          ? "bg-blue-100 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          {subsubcategory.name}
                                        </span>
                                        {selectedSubSubcategory?._id ===
                                          subsubcategory._id && (
                                          <Check
                                            size={16}
                                            className="text-blue-600"
                                          />
                                        )}
                                      </div>
                                    </button>
                                  )
                                )}
                              </>
                            ) : (
                              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                {selectedCategory
                                  ? "Önce alt kategori seçin"
                                  : "Önce kategori seçin"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Özellik Filtreleri */}
                        {getCurrentFeatures().length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              Özellik Filtreleri
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {getCurrentFeatures().map((feature) => (
                                <div key={feature._id} className="space-y-3">
                                  <FeatureInput
                                    feature={feature}
                                    value={featureFilters[feature._id]}
                                    onChange={(value) =>
                                      handleFeatureFilterChange(
                                        feature._id,
                                        value
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Range Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-amber-100 to-yellow-100 rounded-lg">
                    <DollarSign size={18} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Fiyat Aralığı
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Min. Fiyat
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₺
                      </span>
                      <input
                        type="number"
                        placeholder="Minimum"
                        value={filters.minPrice || ""}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-300"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minPrice: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Max. Fiyat
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₺
                      </span>
                      <input
                        type="number"
                        placeholder="Maksimum"
                        value={filters.maxPrice || ""}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-300"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxPrice: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Filter size={20} />
                  Filtrele ({totalItems} ilan)
                </button>
                <button
                  type="button"
                  className="flex-1 bg-white hover:bg-gray-50 text-slate-700 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                  onClick={() => {
                    setFilters({
                      keyword: "",
                      location: "Hepsi",
                      district: "Hepsi",
                      action: "Tümü",
                      type: "Hepsi",
                      minPrice: null,
                      maxPrice: null,
                    });
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSelectedSubSubcategory(null);
                    setAvailableSubcategories([]);
                    setAvailableSubSubcategories([]);
                    setFeatureFilters({});
                    setModal(false);
                  }}
                >
                  <RotateCcw size={20} />
                  Formu Temizle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
