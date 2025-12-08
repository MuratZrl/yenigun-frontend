"use client";
import React, { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
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

const actionOptions = [
  { value: "Tümü", label: "Tümü" },
  { value: "Kiralık", label: "Kiralık" },
  { value: "Günlük Kiralık", label: "Günlük Kiralık" },
  { value: "Devren Kiralık", label: "Devren Kiralık" },
  { value: "Satılık", label: "Satılık" },
  { value: "Devren Satılık", label: "Devren Satılık" },
];

const staticTypeOptions = [{ value: "Hepsi", label: "Hepsi" }];

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

  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "Hepsi",
    district: "Hepsi",
    action: "Tümü",
    type: "Hepsi",
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
    const initializeFilters = async () => {
      const newFilters: FilterState = {
        keyword:
          typeof resolvedSearchParams.q === "string"
            ? resolvedSearchParams.q
            : "",
        location:
          typeof resolvedSearchParams.location === "string"
            ? resolvedSearchParams.location
            : "Hepsi",
        district:
          typeof resolvedSearchParams.district === "string"
            ? resolvedSearchParams.district
            : "Hepsi",
        action:
          typeof resolvedSearchParams.action === "string"
            ? resolvedSearchParams.action
            : "Tümü",
        type:
          typeof resolvedSearchParams.type === "string"
            ? resolvedSearchParams.type
            : "Hepsi",
        minPrice: resolvedSearchParams.minPrice
          ? Number(resolvedSearchParams.minPrice)
          : null,
        maxPrice: resolvedSearchParams.maxPrice
          ? Number(resolvedSearchParams.maxPrice)
          : null,
      };

      setFilters(newFilters);

      const pageFromUrl = resolvedSearchParams.page
        ? Number(resolvedSearchParams.page)
        : 1;
      setCurrentPage(pageFromUrl);

      await fetchSearchResults(newFilters, pageFromUrl);
    };

    initializeFilters();
  }, [resolvedSearchParams]);

  useEffect(() => {
    const handlePageChange = async () => {
      await fetchSearchResults(filters, currentPage);
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
    page: number = 1
  ) => {
    try {
      setLoading(true);

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
        const lastCategory = categoryPath.split(" > ").pop();
        params.category = lastCategory || categoryPath;
      }

      const features = getCurrentFeatures();
      features.forEach((feature) => {
        const filterValue = featureFilters[feature._id];
        if (
          filterValue !== undefined &&
          filterValue !== null &&
          filterValue !== ""
        ) {
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            params[`features.${feature.name}`] = filterValue.join(",");
          } else if (typeof filterValue === "object" && filterValue !== null) {
            if (filterValue.min !== undefined && filterValue.min !== null) {
              params[`features.${feature.name}.min`] = filterValue.min;
            }
            if (filterValue.max !== undefined && filterValue.max !== null) {
              params[`features.${feature.name}.max`] = filterValue.max;
            }
          } else if (filterValue !== false) {
            params[`features.${feature.name}`] = filterValue;
          }
        }
      });

      if (filterValues.action && filterValues.action !== "Tümü") {
        if (!params.search) {
          params.search = filterValues.action;
        } else {
          params.search += ` ${filterValues.action}`;
        }
      }

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
    await fetchSearchResults(filters, 1);
  }, [filters, featureFilters]);

  const clearFilters = async () => {
    const clearedFilters: FilterState = {
      keyword: "",
      location: "Hepsi",
      district: "Hepsi",
      action: "Tümü",
      type: "Hepsi",
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

    await fetchSearchResults(clearedFilters, 1);
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
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
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
                {filters.action !== "Tümü" && ` / ${filters.action}`}
                {filters.type !== "Hepsi" && ` / ${filters.type}`}
              </p>
            )}
          </div>

          {(filters.location !== "Hepsi" ||
            filters.district !== "Hepsi" ||
            filters.action !== "Tümü" ||
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

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                className="flex relative flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 border border-gray-200"
              >
                {ad.steps?.first && ad.steps?.second && (
                  <div className="absolute z-10 top-3 left-3 bg-linear-to-r from-orange-500 to-red-500 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-lg">
                    {ad.steps.second} / {ad.steps.first}
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  {hasValidImage(ad) ? (
                    <img
                      src={ad.photos?.find(
                        (photo: any) => typeof photo === "string"
                      )}
                      alt={ad.title || "İlan görseli"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = logoUrl;
                        e.currentTarget.alt = "Logo";
                        e.currentTarget.className =
                          "w-full h-full object-contain p-4 bg-gray-100";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 w-full h-full">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="object-contain h-16 opacity-70"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150x150?text=Logo";
                        }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                <div className="flex flex-col gap-3 p-5 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {ad.title || "Başlık Yok"}
                  </h3>

                  {(ad.address?.province ||
                    ad.address?.district ||
                    ad.address?.quarter) && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={14} className="text-blue-500" />
                      {[
                        ad.address?.province,
                        ad.address?.district,
                        ad.address?.quarter,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 my-1">
                    {ad.steps?.third && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <Building size={12} className="text-blue-500" />
                        <span className="font-medium">{ad.steps.third}</span>
                      </div>
                    )}

                    {ad.details?.roomCount && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                        <Armchair size={12} className="text-green-500" />
                        <span className="font-medium">
                          {ad.details.roomCount} Oda
                        </span>
                      </div>
                    )}

                    {ad.details?.floor && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                        <Layers size={12} className="text-purple-500" />
                        <span className="font-medium">
                          {ad.details.floor}. Kat
                        </span>
                      </div>
                    )}

                    {(ad.details?.netArea || ad.details?.acre) && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                        <Square size={12} className="text-orange-500" />
                        <span className="font-medium">
                          {ad.details.netArea
                            ? `${ad.details.netArea} m²`
                            : `${ad.details.acre} dönüm`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                      {ad.fee ? `${ad.fee}` : "Fiyat belirtilmemiş"}
                    </div>
                    {ad.created?.createdTimestamp && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium whitespace-nowrap">
                          {new Date(
                            ad.created.createdTimestamp
                          ).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
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
                    Emlak Bilgileri
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Tür (Satılık/Kiralık)
                    </label>
                    <select
                      value={filters.action}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          action: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-300"
                    >
                      {actionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Emlak Tipi
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

                        {/* Kategori Seçim Grid'i - Sahibinden.com stili */}
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
