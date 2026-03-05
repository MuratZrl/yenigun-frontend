// src/features/category-detail/hooks/useCategoryDetail.ts
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Advert } from "@/types/search";
import api from "@/lib/api";
import { useCategoryContext } from "@/context/CategoryContext";
import { Category, Feature, Subcategory } from "../types";

const findFeaturesInSubcategory = (subcat: Subcategory): Feature[] => {
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

export default function useCategoryDetail() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
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
  const [searchFilters, setSearchFilters] = useState<Record<string, unknown>>({});
  const [isMobile, setIsMobile] = useState(false);

  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

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
      } catch (err: unknown) {
        console.error("Kategori detayları yüklenirken hata:", err);
        setError("Kategori yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchCategoryDetails();
  }, [categoryId]);

  const fetchAdverts = useCallback(
    async (filters: Record<string, unknown> = {}) => {
      try {
        setLoadingAds(true);

        const reqParams: Record<string, unknown> = {
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

        const response = await api.get("/advert/search", {
          params: reqParams,
        });
        const filteredData = (response.data.data || []) as Partial<Advert>[];

        const formattedAdverts = filteredData.map((ad) => ({
          uid: ad.uid ?? 0,
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
          details: ad.details ?? {},
          isNew: ad.isNew || false,
          steps: ad.steps,

          isFeatures: ad.isFeatures,
          featureValues: ad.featureValues,
        }));

        setAdverts(formattedAdverts);
        setTotalItems(
          response.data.pagination?.totalItems || formattedAdverts.length,
        );
      } catch (error: unknown) {
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

  const handleSearch = (filters: Record<string, unknown>) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
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
  };
}
