"use client";

import { Advert } from "@/app/types/search";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Home,
  Building,
  ChevronRight,
  Search,
  Calendar,
  User,
  ArrowUpDown,
} from "lucide-react";
import api from "@/app/lib/api";
import DynamicSearch from "@/app/components/DynamicSearch";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useCategoryContext } from "@/app/context/CategoryContext";

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

/** -------------------------
 * Helpers
 * ------------------------- */

/**
 * details.acre normalize:
 * - "1935 m² m²" -> "1935 m²"
 * - "1935 m2" -> "1935 m²"
 * - "0", "0 m2", "0 m²" -> null
 * - birim yoksa ekler: "1935" -> "1935 m²"
 */
const normalizeAreaText = (raw: any): string | null => {
  if (raw == null || raw === false) return null;

  let t = String(raw).trim();
  if (!t) return null;

  const lower = t.toLowerCase();
  if (lower === "false") return null;

  t = t.replace(/㎡/g, "m²").replace(/m2/gi, "m²");

  t = t.replace(/(m²)(\s*m²)+/gi, "m²");

  t = t.replace(/\s+/g, " ").trim();

  if (!/m²/i.test(t)) t = `${t} m²`;

  const normalizedForZero = t
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("m²", "m2");

  if (normalizedForZero === "0" || normalizedForZero === "0m2") return null;

  const num = Number(t.match(/\d+(\.\d+)?/)?.[0] ?? "0");
  if (!num || num === 0) return null;

  return t;
};

// ✅ Feature ID’ler (alan)
const GROSS_M2_FEATURE_ID = "69679f63cd76859b79ca8aa4"; // m² (Brüt)
const NET_M2_FEATURE_ID = "69679f97cd76859b79ca8ac6"; // m² (Net)
const ALT_M2_FEATURE_ID = "6968858ccd76859b79ca9451"; // eski/alternatif m²
const DONUM_FEATURE_ID = "6931851fc9f133554f0adc75"; // dönüm

const isValidM2 = (v: any) =>
  v !== undefined &&
  v !== null &&
  String(v).trim() !== "" &&
  String(v).trim() !== "0";

const getM2Text = (ad: any) => {
  if (!ad?.isFeatures || !Array.isArray(ad?.featureValues)) return "";

  const gross = ad.featureValues.find(
    (f: any) => f.featureId === GROSS_M2_FEATURE_ID,
  );
  const net = ad.featureValues.find(
    (f: any) => f.featureId === NET_M2_FEATURE_ID,
  );
  const alt = ad.featureValues.find(
    (f: any) => f.featureId === ALT_M2_FEATURE_ID,
  );
  const donum = ad.featureValues.find(
    (f: any) => f.featureId === DONUM_FEATURE_ID,
  );

  const grossVal = isValidM2(gross?.value) ? String(gross.value) : "";
  const netVal = isValidM2(net?.value) ? String(net.value) : "";
  const altVal = isValidM2(alt?.value) ? String(alt.value) : "";
  const donumVal = isValidM2(donum?.value) ? String(donum.value) : "";

  // Öncelik: Brüt+Net > Brüt > Net > Alt m² > Dönüm
  if (grossVal && netVal) return `${grossVal} m² (Brüt) • ${netVal} m² (Net)`;
  if (grossVal) return `${grossVal} m² (Brüt)`;
  if (netVal) return `${netVal} m² (Net)`;
  if (altVal) return `${altVal} m²`;
  if (donumVal) return `${donumVal} Dönüm`;

  return "";
};

const isValidNumber = (v: any) => typeof v === "number" && isFinite(v) && v > 0;

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "Tarih yok";
  const date = new Date(timestamp);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const slug = params.slug as string;
  const { setSelectedSubcategory } = useCategoryContext();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAds, setLoadingAds] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const findFeaturesInSubcategory = (subcat: Subcategory): any[] => {
    if (subcat.features && subcat.features.length > 0) return subcat.features;

    if (subcat.subcategories && subcat.subcategories.length > 0) {
      for (const childSubcat of subcat.subcategories) {
        const childFeatures = findFeaturesInSubcategory(childSubcat);
        if (childFeatures.length > 0) return childFeatures;
      }
    }
    return [];
  };

  const findSubcategoryPath = (
    category: Category,
    subcategoryId: string,
  ): string => {
    const findPath = (
      subcats: Subcategory[],
      targetId: string,
      path: string[] = [],
    ): string[] | null => {
      for (const subcat of subcats) {
        const currentPath = [...path, subcat.name];

        if (subcat._id === targetId) return currentPath;

        if (subcat.subcategories && subcat.subcategories.length > 0) {
          const found = findPath(subcat.subcategories, targetId, currentPath);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findPath(category.subcategories, subcategoryId);
    return path ? path.join(" > ") : "";
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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
            (cat: Category) => cat._id === categoryId,
          );

          if (foundCategory) setCategory(foundCategory);
          else setError("Kategori bulunamadı");
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

    if (categoryId) fetchCategoryDetails();
  }, [categoryId]);

  const fetchAdverts = useCallback(
    async (filters: any = {}) => {
      try {
        setLoadingAds(true);

        const reqParams: any = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          sortOrder,
          ...filters,
        };

        if (category) reqParams.category = category.name;
        if (selectedSubcategories.length > 0) {
          reqParams.subcategories = selectedSubcategories.join(",");
        }

        const response = await api.get("/advert/search", { params: reqParams });
        const filteredData = response.data.data || [];

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

          isFeatures: ad.isFeatures,
          featureValues: ad.featureValues,
        }));

        setAdverts(formattedAdverts);
        setTotalItems(
          response.data.pagination?.totalItems || formattedAdverts.length,
        );
      } catch (error: any) {
        console.error("❌ İlanlar yüklenirken hata:", error);
        setAdverts([]);
        setTotalItems(0);
      } finally {
        setLoadingAds(false);
      }
    },
    [
      category,
      currentPage,
      itemsPerPage,
      sortBy,
      sortOrder,
      selectedSubcategories,
    ],
  );

  useEffect(() => {
    if (adverts && adverts.length > 0) {
      console.log("📦 Sayfada gösterilen adverts:", adverts);
    }
  }, [adverts]);

  useEffect(() => {
    if (category) fetchAdverts(searchFilters);
  }, [
    category,
    currentPage,
    selectedSubcategories,
    searchFilters,
    sortBy,
    sortOrder,
    fetchAdverts,
  ]);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handleSubcategoryClickWithFilter = (
    subcategoryId: string,
    subcategoryName: string,
  ) => {
    if (!category) return;

    const findSubcategory = (
      subcats: Subcategory[],
      targetId: string,
    ): Subcategory | null => {
      for (const subcat of subcats) {
        if (subcat._id === targetId) return subcat;

        if (subcat.subcategories && subcat.subcategories.length > 0) {
          const found = findSubcategory(subcat.subcategories, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedSubcat = findSubcategory(
      category.subcategories,
      subcategoryId,
    );

    if (selectedSubcat) {
      const features = findFeaturesInSubcategory(selectedSubcat);
      const path = findSubcategoryPath(category, subcategoryId);

      setSelectedSubcategory(
        category._id,
        category.name,
        selectedSubcat._id,
        selectedSubcat.name,
        features,
        path,
      );
    }

    const urlParams = new URLSearchParams();
    urlParams.set("type", `${category.name} > ${subcategoryName}`);
    urlParams.set("subcategoryId", subcategoryId);
    router.push(`/ads?${urlParams.toString()}`);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const hasValidImage = (advert: Advert): boolean => {
    const photos: any = (advert as any).photos;
    if (!photos || !Array.isArray(photos)) return false;

    const firstPhoto = photos[0];
    if (typeof firstPhoto !== "string" || firstPhoto.trim() === "")
      return false;

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
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {category.name}
                  </h1>
                  <button
                    onClick={() => {
                      const p = new URLSearchParams();
                      p.set("type", category.name);
                      router.push(`/ads?${p.toString()}`);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 border border-blue-200"
                  >
                    <Search className="w-3 h-3" />
                    Tümü
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {totalItems} ilan bulundu
                </p>
              </div>

              {category.subcategories.length > 0 && (
                <div className="mb-6">
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
                            subcat.name,
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

              {/* Sort */}
              <div className="hidden md:block mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Sırala</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleSortChange("date", "asc")}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                        sortBy === "date" && sortOrder === "asc"
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>Eski ilanlar önce</span>
                      {sortBy === "date" && sortOrder === "asc" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSortChange("date", "desc")}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                        sortBy === "date" && sortOrder === "desc"
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>Yeni ilanlar önce</span>
                      {sortBy === "date" && sortOrder === "desc" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleSortChange("price", "asc")}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                        sortBy === "price" && sortOrder === "asc"
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>Ucuzdan pahalıya</span>
                      {sortBy === "price" && sortOrder === "asc" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSortChange("price", "desc")}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                        sortBy === "price" && sortOrder === "desc"
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>Pahalıdan ucuza</span>
                      {sortBy === "price" && sortOrder === "desc" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          {!isMobile && (
            <div className="lg:w-3/4">
              <div className="hidden md:flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{totalItems}</span> ilan
                  <span className="mx-2">•</span>
                  <span className="text-blue-600 font-medium">
                    {sortBy === "date"
                      ? sortOrder === "asc"
                        ? "Eski İlanlar Önce"
                        : "Yeni İlanlar Önce"
                      : sortOrder === "asc"
                        ? "Ucuzdan Pahalıya"
                        : "Pahalıdan Ucuza"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">Sıralı</span>
                </div>
              </div>

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
                    {/* ✅ Desktop header */}
                    <div className="hidden md:grid grid-cols-[120px_1fr_140px_110px_160px_160px] gap-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 text-xs font-semibold text-gray-600">
                        Görsel
                      </div>
                      <div className="px-4 py-3 text-xs font-semibold text-gray-600">
                        İlan
                      </div>
                      <div className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">
                        m²
                      </div>

                      <div className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">
                        Konum
                      </div>
                      <div className="px-4 py-3 text-xs font-semibold text-gray-600 text-right">
                        Fiyat
                      </div>
                    </div>

                    {adverts.map((advert: any, index: number) => {
                      const m2Text = getM2Text(advert);
                      const room =
                        advert?.details?.roomCount ||
                        advert?.featureValues?.find((f: any) =>
                          f?.name?.toLowerCase().includes("oda"),
                        )?.value ||
                        "";

                      const locationText = advert?.address?.province
                        ? `${advert.address.province}${advert.address?.district ? ` / ${advert.address.district}` : ""}`
                        : "Lokasyon yok";

                      return (
                        <Link
                          href={`/ads/${advert.uid}`}
                          key={advert.uid || index}
                          className="group block"
                        >
                          {/* ✅ Desktop row (table like) */}
                          <div className="hidden md:grid grid-cols-[120px_1fr_140px_110px_160px_160px] items-center bg-white border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors">
                            {/* Görsel */}
                            <div className="p-3">
                              <div className="w-[110px] h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                {hasValidImage(advert) ? (
                                  <img
                                    src={advert.photos[0]}
                                    alt={advert.title || "İlan görseli"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = logoUrl;
                                      e.currentTarget.className =
                                        "w-full h-full object-contain p-2";
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="w-full h-full object-contain p-2 opacity-70"
                                  />
                                )}
                              </div>
                            </div>

                            {/* İlan */}
                            <div className="px-4 py-3 min-w-0">
                              <div className="text-[13px] font-semibold text-blue-700 group-hover:underline line-clamp-2">
                                {advert.title || "İsimsiz İlan"}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                {advert.steps?.second && (
                                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                                    {advert.steps.second}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(advert.created?.createdTimestamp)}
                                </span>
                              </div>
                            </div>

                            {/* m² */}
                            <div className="px-4 py-3 text-center text-sm text-gray-800">
                              {m2Text || "-"}
                            </div>

                            {/* Konum */}
                            <div className="px-4 py-3 text-center text-sm text-gray-700 truncate">
                              {locationText}
                            </div>

                            {/* Fiyat */}
                            <div className="px-4 py-3 text-right">
                              <div className="text-base font-bold text-gray-900 whitespace-nowrap">
                                {advert.fee || "Fiyat Belirtilmemiş"}
                              </div>
                              {advert.advisor && (
                                <div className="mt-1 text-xs text-gray-500 flex items-center justify-end gap-1">
                                  <User className="w-3 h-3" />
                                  <span className="truncate max-w-[140px]">
                                    {advert.advisor.name}{" "}
                                    {advert.advisor.surname}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ✅ Mobile card */}
                          <div className="md:hidden bg-white border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors">
                            <div className="flex gap-3 p-3">
                              {/* img */}
                              <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                {hasValidImage(advert) ? (
                                  <img
                                    src={advert.photos[0]}
                                    alt={advert.title || "İlan görseli"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = logoUrl;
                                      e.currentTarget.className =
                                        "w-full h-full object-contain p-2";
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="w-full h-full object-contain p-2 opacity-70"
                                  />
                                )}
                              </div>

                              {/* content */}
                              <div className="min-w-0 flex-1">
                                <div className="text-[13px] font-semibold text-blue-700 line-clamp-2">
                                  {advert.title || "İsimsiz İlan"}
                                </div>

                                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-600">
                                  {advert.steps?.second && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                      {advert.steps.second}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded bg-gray-100">
                                    {m2Text || "-"}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-gray-100">
                                    {room || "-"} Oda
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                  <div className="text-xs text-gray-600 truncate max-w-[55%]">
                                    {locationText}
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                    {advert.fee || "Fiyat Yok"}
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(
                                      advert.created?.createdTimestamp,
                                    )}
                                  </span>

                                  {advert.advisor && (
                                    <span className="flex items-center gap-1 truncate max-w-[45%]">
                                      <User className="w-3 h-3" />
                                      {advert.advisor.name}{" "}
                                      {advert.advisor.surname}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
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
                          (_, i) => i + 1,
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
