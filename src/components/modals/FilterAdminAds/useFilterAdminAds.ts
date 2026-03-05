// src/components/modals/FilterAdminAds/useFilterAdminAds.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import type Advisor from "@/types/advisor";
import type Customer from "@/types/customers";

import type {
  CategoryNode,
  SubcategoryNode,
  Feature,
  FilterState,
  FeatureFilterValue,
  RangeValue,
  ApiResponse,
} from "./types";

import {
  buildTurkeyCities,
  unwrapArray,
  safeArr,
  normalizeCategoryPath,
  countTruthy,
  isMeaningfulFeatureValue,
  initFeatureFilters,
} from "./utils";

/* ------------------------------------------------------------------ */
/*  Hook options                                                       */
/* ------------------------------------------------------------------ */

interface UseFilterAdminAdsOptions {
  setOpen: (v: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleCleanFilters: () => void;
  page: number;
  limit: number;
  onSearchResult?: (data: Record<string, unknown>) => void;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export default function useFilterAdminAds({
  setOpen,
  filters,
  setFilters,
  handleCleanFilters,
  page,
  limit,
  onSearchResult,
}: UseFilterAdminAdsOptions) {
  /* ---------- people ---------- */
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  /* ---------- loading ---------- */
  const [loading, setLoading] = useState(false);

  /* ---------- categories ---------- */
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryNode | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubcategoryNode | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<SubcategoryNode | null>(null);

  /* ---------- feature filters ---------- */
  const [featureFilters, setFeatureFilters] = useState<
    Record<string, FeatureFilterValue>
  >({});

  /* ---------- portal target for react-select ---------- */
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  /* ---------- derived ---------- */

  const turkeyCities = useMemo(() => buildTurkeyCities(), []);

  const availableSubcategories = useMemo(
    () => safeArr(selectedCategory?.subcategories),
    [selectedCategory],
  );

  const availableSubSubcategories = useMemo(
    () => safeArr(selectedSubcategory?.subcategories),
    [selectedSubcategory],
  );

  const currentFeatures = useMemo<Feature[]>(() => {
    const fromSubSub = safeArr(selectedSubSubcategory?.features);
    if (fromSubSub.length) return fromSubSub;
    return safeArr(selectedSubcategory?.features);
  }, [selectedSubcategory, selectedSubSubcategory]);

  const activeCount = useMemo(() => {
    const base = countTruthy(filters);
    const feat = Object.values(featureFilters).filter(
      isMeaningfulFeatureValue,
    ).length;
    return base + feat;
  }, [featureFilters, filters]);

  /* ---------- data fetching ---------- */

  const fetchCustomers = useCallback(async () => {
    const res = await api.get("/admin/customers");
    setCustomers(unwrapArray<Customer>(res as unknown as ApiResponse));
  }, []);

  const fetchAdvisors = useCallback(async () => {
    const res = await api.get("/admin/users");
    setAdvisors(unwrapArray<Advisor>(res as unknown as ApiResponse));
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await api.get("/admin/categories/tree");
      setCategories(unwrapArray<CategoryNode>(res as unknown as ApiResponse));
    } catch (e) {
      console.error("Kategoriler yuklenirken hata:", e);
      toast.error("Kategoriler yuklenemedi");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchAdvisors().catch(() => {}),
          fetchCustomers().catch(() => {}),
        ]);
      } catch {
        if (cancelled) return;
        toast.error("Bir hata olustu.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchAdvisors, fetchCategories, fetchCustomers]);

  /* ---------- handlers ---------- */

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleCategorySelect = useCallback(
    (category: CategoryNode | null) => {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
      setSelectedSubSubcategory(null);
      setFeatureFilters({});

      setFilters((prev) => ({
        ...prev,
        category: category?.name ?? null,
        subcategory: null,
        subsubcategory: null,
        categoryPath: category?.name ?? null,
      }));
    },
    [setFilters],
  );

  const handleSubcategorySelect = useCallback(
    (sub: SubcategoryNode | null) => {
      setSelectedSubcategory(sub);
      setSelectedSubSubcategory(null);
      setFeatureFilters({});

      if (sub) setFeatureFilters(initFeatureFilters(safeArr(sub.features)));

      const path = normalizeCategoryPath([
        selectedCategory?.name ?? null,
        sub?.name ?? null,
      ]);
      setFilters((prev) => ({
        ...prev,
        subcategory: sub?.name ?? null,
        subsubcategory: null,
        categoryPath: path || (selectedCategory?.name ?? null),
      }));
    },
    [selectedCategory?.name, setFilters],
  );

  const handleSubSubcategorySelect = useCallback(
    (subsub: SubcategoryNode | null) => {
      setSelectedSubSubcategory(subsub);
      setFeatureFilters({});

      if (subsub)
        setFeatureFilters(initFeatureFilters(safeArr(subsub.features)));

      const path = normalizeCategoryPath([
        selectedCategory?.name ?? null,
        selectedSubcategory?.name ?? null,
        subsub?.name ?? null,
      ]);

      setFilters((prev) => ({
        ...prev,
        subsubcategory: subsub?.name ?? null,
        categoryPath: path || prev.categoryPath || null,
      }));
    },
    [selectedCategory?.name, selectedSubcategory?.name, setFilters],
  );

  const handleFeatureFilterChange = useCallback(
    (featureId: string, value: FeatureFilterValue) => {
      setFeatureFilters((prev) => ({ ...prev, [featureId]: value }));
    },
    [],
  );

  const handleClearCategory = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});
    setFilters((prev) => ({
      ...prev,
      category: null,
      subcategory: null,
      subsubcategory: null,
      categoryPath: null,
    }));
  }, [setFilters]);

  /* ---------- search params ---------- */

  const prepareSearchParams = useCallback(() => {
    const params: Record<string, string | number | boolean> = { page, limit };

    if (filters.search) params.search = filters.search;
    if (filters.province) params.province = filters.province;
    if (filters.district) params.district = filters.district;
    if (filters.quarter) params.quarter = filters.quarter;

    if (filters.type && filters.type !== "Hepsi" && filters.type !== "")
      params.type = filters.type;

    if (filters.minFee !== null && filters.minFee !== undefined)
      params.minPrice = filters.minFee;
    if (filters.maxFee !== null && filters.maxFee !== undefined)
      params.maxPrice = filters.maxFee;

    if (filters.advisor) {
      const adv = advisors.find(
        (a) => `${a.name} ${a.surname}` === filters.advisor,
      );
      if (adv) params.advisorUid = adv.uid;
    }

    if (filters.customer) {
      const cust = customers.find(
        (c) => `${c.name} ${c.surname}` === filters.customer,
      );
      if (cust) params.customerUid = cust.uid;
    }

    if (filters.categoryPath) {
      const last = filters.categoryPath.split(" > ").pop();
      params.category = last || filters.categoryPath;
    }

    for (const feature of currentFeatures) {
      const v = featureFilters[feature._id];
      if (!isMeaningfulFeatureValue(v)) continue;

      const keyBase = `features.${feature.name}`;

      if (Array.isArray(v)) {
        params[keyBase] = v.join(",");
      } else if (typeof v === "object" && v !== null) {
        const range = v as RangeValue;
        if (range.min !== undefined && range.min !== null)
          params[`${keyBase}.min`] = range.min;
        if (range.max !== undefined && range.max !== null)
          params[`${keyBase}.max`] = range.max;
      } else if (v !== undefined && v !== null) {
        params[keyBase] = v as string | number | boolean;
      }
    }

    for (const k of Object.keys(params)) {
      const v = params[k];
      if (v === undefined || v === null) delete params[k];
      else if (typeof v === "string" && v.trim() === "") delete params[k];
    }

    return params;
  }, [advisors, customers, currentFeatures, featureFilters, filters, limit, page]);

  /* ---------- submit / clean ---------- */

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const params = prepareSearchParams();
        const res = await api.get("/admin/adverts/search", { params });

        const resData = res?.data as Record<string, unknown> | undefined;
        const data = (resData?.data ?? resData) as Record<string, unknown>;
        if (onSearchResult) onSearchResult(data);

        toast.success("Filtreleme basarili!");
        setOpen(false);
      } catch (err: unknown) {
        console.error("Filtreleme hatasi:", err);
        const errObj = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          errObj?.response?.data?.message ||
            "Filtreleme sirasinda bir hata olustu",
        );
      } finally {
        setLoading(false);
      }
    },
    [onSearchResult, prepareSearchParams, setOpen],
  );

  const handleClean = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      handleCleanFilters();
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedSubSubcategory(null);
      setFeatureFilters({});
      setOpen(false);

      if (onSearchResult) {
        try {
          const res = await api.get("/admin/adverts/search", {
            params: { page, limit },
          });
          const resData = res?.data as Record<string, unknown> | undefined;
          onSearchResult((resData?.data ?? resData) as Record<string, unknown>);
        } catch {
          toast.error("Sifirlama sirasinda bir hata olustu");
        }
      }
    },
    [handleCleanFilters, limit, onSearchResult, page, setOpen],
  );

  /* ---------- return ---------- */

  return {
    // people
    customers,
    advisors,

    // loading
    loading,

    // categories
    categories,
    loadingCategories,
    selectedCategory,
    selectedSubcategory,
    selectedSubSubcategory,
    availableSubcategories,
    availableSubSubcategories,
    currentFeatures,
    featureFilters,

    // location
    turkeyCities,
    portalTarget,

    // counts
    activeCount,

    // handlers
    handleClose,
    handleCategorySelect,
    handleSubcategorySelect,
    handleSubSubcategorySelect,
    handleFeatureFilterChange,
    handleClearCategory,
    handleSubmit,
    handleClean,
  };
}
