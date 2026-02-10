// src/features/ads/hooks/useAdsController.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Advert, Category, Feature, FilterState, Subcategory } from "@/types/advert";
import { fetchCategoriesApi, searchAdvertsApi } from "../api/adsApi";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "../model/defaults";
import { buildApiFilters } from "../model/mappers";
import { buildStateToUrl, parseUrlToState } from "../model/url";

type UseAdsControllerArgs = {
  initialSearchParams: { [key: string]: string | string[] | undefined };
  contextSelectedSubcat: any | null;
  listBase?: string;
};

const AUTO_KEY = "ads_autoApply";

export function useAdsController({
  initialSearchParams,
  contextSelectedSubcat,
  listBase = "/ilanlar",
}: UseAdsControllerArgs) {
  const router = useRouter();
  const sp = useSearchParams();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [featureFilters, setFeatureFilters] = useState<Record<string, any>>({});

  const [data, setData] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [pageSize, setPageSize] = useState<number>(ITEMS_PER_PAGE);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [localSelectedSubcat, setLocalSelectedSubcat] = useState<Subcategory | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<Subcategory | null>(null);

  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState<Subcategory[]>([]);

  const [activeUrlParams, setActiveUrlParams] = useState<Record<string, any>>({});
  const [showUrlDebug, setShowUrlDebug] = useState(false);

  // ✅ Tek kaynak: Dinamik filtreleme modu controller’da
  const [autoApply, setAutoApply] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(AUTO_KEY) === "1";
  });

  // Guard ref'leri
  const isInitialLoad = useRef(true);
  const isSyncingFromUrl = useRef(false);
  const isPushingUrl = useRef(false);

  // Aynı anda iki apply çalışmasın (özellikle autoApply + manual çakışınca)
  const isApplyingRef = useRef(false);

  // “Ben burada fetch ettim, pagination effect'i tekrar fetch etmesin”
  const skipNextPageEffectRef = useRef(false);

  // Auto debounce timer
  const autoTimerRef = useRef<number | null>(null);

  // stale state yememek için
  const filtersRef = useRef<FilterState>(filters);
  const featureFiltersRef = useRef<Record<string, any>>(featureFilters);
  const pageSizeRef = useRef<number>(pageSize);
  const currentPageRef = useRef<number>(currentPage);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    featureFiltersRef.current = featureFilters;
  }, [featureFilters]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // autoApply persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(AUTO_KEY, autoApply ? "1" : "0");
  }, [autoApply]);

  const initialParamsAsUrlSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(initialSearchParams).forEach(([k, v]) => {
      if (typeof v === "string") params.set(k, v);
      if (Array.isArray(v)) v.forEach((vv) => params.append(k, vv));
    });
    return params;
  }, [initialSearchParams]);

  const fetchSearchResults = useCallback(
    async (
      filterValues: FilterState,
      page: number,
      currentFeatureFilters: Record<string, any>,
      limit: number,
    ) => {
      try {
        setLoading(true);

        const apiFilters = buildApiFilters(filterValues, currentFeatureFilters);
        const result = await searchAdvertsApi<Advert>({
          page,
          limit,
          filters: apiFilters,
        });

        if (result.success && Array.isArray(result.data)) {
          setData(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
          setTotalItems(result.pagination?.totalItems || 0);
        } else {
          setData([]);
          setTotalPages(1);
          setTotalItems(0);
        }

        setLastUpdatedAt(Date.now());
      } catch (e) {
        console.error("❌ API İstek Hatası:", e);
        setData([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleCategorySelectionFromType = useCallback((typeParam: string, cats: Category[]) => {
    const categoryPath = typeParam.split(" > ");
    if (categoryPath.length === 0) return;

    const firstPart = categoryPath[0];
    const secondPart = categoryPath[1];
    const thirdPart = categoryPath[2];

    const foundCategory = cats.find((cat) => cat.name === firstPart);
    if (!foundCategory) return;

    setSelectedCategory(foundCategory);
    setAvailableSubcategories(foundCategory.subcategories || []);

    if (secondPart && foundCategory.subcategories) {
      const foundSubcategory = foundCategory.subcategories.find((sub) => sub.name === secondPart);
      if (foundSubcategory) {
        setLocalSelectedSubcat(foundSubcategory);
        setAvailableSubSubcategories(foundSubcategory.subcategories || []);

        if (thirdPart && foundSubcategory.subcategories) {
          const foundSubSubcategory = foundSubcategory.subcategories.find((subsub) => subsub.name === thirdPart);
          if (foundSubSubcategory) setSelectedSubSubcategory(foundSubSubcategory);
        }
      }
    }
  }, []);

  const pushUrlFromState = useCallback(
    (nextFilters: FilterState, page: number, nextFeatureFilters: Record<string, any>) => {
      const { newUrl, activeUrlParams, showUrlDebug } = buildStateToUrl(
        nextFilters,
        page,
        nextFeatureFilters,
        listBase,
      );

      setActiveUrlParams(activeUrlParams);
      setShowUrlDebug(showUrlDebug);

      // Next'te searchParams güncellemesi bazen “bir tick sonra” geliyor.
      // 0ms yerine 50ms tutmak sync-effect'in yanlışlıkla çalışmasını ciddi azaltır.
      isPushingUrl.current = true;
      router.replace(newUrl, { scroll: false });
      window.setTimeout(() => {
        isPushingUrl.current = false;
      }, 50);
    },
    [router, listBase],
  );

  const runSearchAndPush = useCallback(
    async (f: FilterState, page: number, ff: Record<string, any>, limit: number) => {
      await fetchSearchResults(f, page, ff, limit);
      pushUrlFromState(f, page, ff);
    },
    [fetchSearchResults, pushUrlFromState],
  );

  // ✅ Tek noktadan “page=1 + fetch + url push”
  const applyNow = useCallback(
    async (override?: { filters?: FilterState; featureFilters?: Record<string, any>; limit?: number }) => {
      if (isSyncingFromUrl.current) return;
      if (isPushingUrl.current) return;

      if (isApplyingRef.current) return;
      isApplyingRef.current = true;

      // varsa bekleyen auto timer'ı öldür
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }

      try {
        const f = override?.filters ?? filtersRef.current;
        const ff = override?.featureFilters ?? featureFiltersRef.current;
        const limit = override?.limit ?? pageSizeRef.current;

        // page 1'e çekiyoruz
        if (currentPageRef.current !== 1) {
          skipNextPageEffectRef.current = true;
          setCurrentPage(1);
        }

        // pagination effect’i bir tur skip etsin
        skipNextPageEffectRef.current = true;

        await runSearchAndPush(f, 1, ff, limit);
      } finally {
        isApplyingRef.current = false;
      }
    },
    [runSearchAndPush],
  );

  const clearFilters = useCallback(async () => {
    skipNextPageEffectRef.current = true;

    setFilters(DEFAULT_FILTERS);
    setSelectedCategory(null);
    setLocalSelectedSubcat(null);
    setSelectedSubSubcategory(null);
    setAvailableSubcategories([]);
    setAvailableSubSubcategories([]);
    setFeatureFilters({});
    setCurrentPage(1);
    setPageSize(ITEMS_PER_PAGE);

    setActiveUrlParams({});
    setShowUrlDebug(false);

    await fetchSearchResults(DEFAULT_FILTERS, 1, {}, ITEMS_PER_PAGE);

    isPushingUrl.current = true;
    router.replace(listBase, { scroll: false });
    window.setTimeout(() => {
      isPushingUrl.current = false;
    }, 50);
  }, [fetchSearchResults, router, listBase]);

  // ✅ Manuel “Ara”
  const handleFilter = useCallback(async () => {
    await applyNow();
  }, [applyNow]);

  const handleSortChangeDesktop = useCallback(
    async (sortBy: "date" | "price", sortOrder: "asc" | "desc") => {
      const newFilters = { ...filtersRef.current, sortBy, sortOrder };
      setFilters(newFilters);
      await applyNow({ filters: newFilters });
    },
    [applyNow],
  );

  const handleOpenSortMenu = useCallback(() => setIsSortMenuOpen(true), []);

  const handlePageSizeChange = useCallback(
    async (nextSize: number) => {
      if (nextSize === pageSizeRef.current) return;

      setPageSize(nextSize);

      // page=1 + yeni limit ile uygula
      await applyNow({ limit: nextSize });
      window.scrollTo(0, 0);
    },
    [applyNow],
  );

  // Kategorileri çek
  useEffect(() => {
    const run = async () => {
      try {
        setLoadingCategories(true);
        const cats = await fetchCategoriesApi();
        setCategories(cats);
      } catch (e) {
        console.error("Kategoriler yüklenirken hata oluştu:", e);
      } finally {
        setLoadingCategories(false);
      }
    };
    run();
  }, []);

  // Context’ten gelen subcat varsa filtreye bas
  useEffect(() => {
    if (!contextSelectedSubcat) return;

    if (contextSelectedSubcat.path) {
      setFilters((prev) => ({
        ...prev,
        type:
          contextSelectedSubcat.path ||
          `${contextSelectedSubcat.parentCategoryName} > ${contextSelectedSubcat.name}`,
      }));
    }

    if (Array.isArray(contextSelectedSubcat.features) && contextSelectedSubcat.features.length > 0) {
      const initial: Record<string, any> = {};
      contextSelectedSubcat.features.forEach((feature: any) => {
        if (initial[feature._id] !== undefined) return;

        if (feature.type === "multi_select") initial[feature._id] = [];
        else if (feature.type === "boolean") initial[feature._id] = false;
        else if (feature.type === "range") initial[feature._id] = { min: null, max: null };
        else initial[feature._id] = "";
      });

      setFeatureFilters((prev) => ({ ...prev, ...initial }));
    }
  }, [contextSelectedSubcat]);

  // URL -> state sync + ilk fetch
  useEffect(() => {
    if (loadingCategories) return;

    const sourceParams =
      sp?.toString() && sp.toString().length > 0
        ? new URLSearchParams(sp.toString())
        : initialParamsAsUrlSearchParams;

    if (isSyncingFromUrl.current) return;
    if (isPushingUrl.current) return;

    isSyncingFromUrl.current = true;

    const { filters: parsedFilters, featureFilters: parsedFF, page, activeUrlParams, showUrlDebug } =
      parseUrlToState(sourceParams);

    setFilters(parsedFilters);
    setFeatureFilters(parsedFF);
    setCurrentPage(page);
    setActiveUrlParams(activeUrlParams);
    setShowUrlDebug(showUrlDebug);

    if (parsedFilters.type && parsedFilters.type !== "Hepsi" && categories.length > 0) {
      handleCategorySelectionFromType(parsedFilters.type, categories);
    }

    const runFetch = async () => {
      try {
        await fetchSearchResults(parsedFilters, page, parsedFF, pageSizeRef.current);
        isInitialLoad.current = false;
      } finally {
        isSyncingFromUrl.current = false;
      }
    };

    runFetch().catch((e) => {
      console.error("❌ Filtre başlatma hatası:", e);
      isSyncingFromUrl.current = false;
    });
  }, [
    categories,
    fetchSearchResults,
    handleCategorySelectionFromType,
    initialParamsAsUrlSearchParams,
    loadingCategories,
    sp,
  ]);

  // ✅ Pagination: sadece sayfa değişince fetch + url push
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (isSyncingFromUrl.current) return;
    if (isPushingUrl.current) return;

    if (skipNextPageEffectRef.current) {
      skipNextPageEffectRef.current = false;
      return;
    }

    const run = async () => {
      const f = filtersRef.current;
      const ff = featureFiltersRef.current;

      await runSearchAndPush(f, currentPage, ff, pageSizeRef.current);
      window.scrollTo(0, 0);
    };

    run().catch(console.error);
  }, [currentPage, runSearchAndPush]);

  // ✅ AutoApply: filtre/feature/pageSize değişince debounce ile otomatik uygula
  const prevAutoRef = useRef<boolean>(autoApply);

  useEffect(() => {
    const prev = prevAutoRef.current;
    prevAutoRef.current = autoApply;

    if (!autoApply) {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
      return;
    }

    // Auto yeni açıldıysa (ve initial sync değilse) bir kere uygula
    if (!prev && autoApply) {
      if (!isInitialLoad.current && !isSyncingFromUrl.current && !isPushingUrl.current) {
        void applyNow();
      }
    }
  }, [autoApply, applyNow]);

  useEffect(() => {
    if (!autoApply) return;
    if (isInitialLoad.current) return;
    if (isSyncingFromUrl.current) return;
    if (isPushingUrl.current) return;
    if (isApplyingRef.current) return;

    if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);

    autoTimerRef.current = window.setTimeout(() => {
      void applyNow();
    }, 350);

    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    };
  }, [autoApply, filters, featureFilters, pageSize, applyNow]);

  return {
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isSortMenuOpen,
    setIsSortMenuOpen,

    filters,
    setFilters,

    data,
    loading,

    categories,
    loadingCategories,

    currentPage,
    setCurrentPage,

    totalPages,
    totalItems,

    pageSize,
    handlePageSizeChange,
    lastUpdatedAt,

    selectedCategory,
    setSelectedCategory,

    localSelectedSubcat,
    setLocalSelectedSubcat,

    selectedSubSubcategory,
    setSelectedSubSubcategory,

    availableSubcategories,
    setAvailableSubcategories,

    availableSubSubcategories,
    setAvailableSubSubcategories,

    featureFilters,
    setFeatureFilters,

    handleFilter,
    clearFilters,

    handleSortChangeDesktop,
    handleOpenSortMenu,

    activeUrlParams,
    showUrlDebug,

    // ✅ Dinamik filtreleme state’i burada, tek kaynak
    autoApply,
    setAutoApply,

    contextFeatures: ((contextSelectedSubcat?.features || []) as Feature[]),
  };
}
