// src/features/admin/emlak-list/hooks/useAdvertFilters.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import type { Advert, FilterState } from "../types";
import { EMPTY_FILTERS } from "../types";

/* ------------------------------------------------------------------ */
/*  Sorting                                                            */
/* ------------------------------------------------------------------ */

function sortByNewest(a: Advert, b: Advert): number {
  const aC = a.created?.createdTimestamp || 0;
  const bC = b.created?.createdTimestamp || 0;
  return bC - aC;
}

function extractAdverts(data: any): Advert[] {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.adverts && Array.isArray(data.adverts)) return data.adverts;
  return [];
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

type Deps = {
  allAdverts: Advert[];
  applyFilteredData: (data: Advert[]) => void;
  setLoading: (v: boolean) => void;
};

export function useAdvertFilters({ allAdverts, applyFilteredData, setLoading }: Deps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---- Update single field ---- */

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ---- API-based filter search ---- */

  const applyFilters = useCallback(async () => {
    try {
      setLoading(true);

      const params: Record<string, any> = { page: 1, limit: 100 };

      if (filters.title) params.search = filters.title.trim();
      if (filters.uid) params.uid = filters.uid.trim();
      if (filters.province) {
        params.province = filters.province;
        if (filters.district) params.district = filters.district;
        if (filters.quarter) params.quarter = filters.quarter;
      }
      if (filters.type) params.type = filters.type;
      if (filters.otherType) params.otherType = filters.otherType;
      if (filters.minFee) params.minFee = Number(filters.minFee);
      if (filters.maxFee) params.maxFee = Number(filters.maxFee);
      if (filters.advisor) params.advisor = filters.advisor;
      if (filters.customer) params.customer = filters.customer;

      const hasAnyFilter = Object.keys(params).length > 2;

      const res = hasAnyFilter
        ? await api.get("/admin/adverts/search", { params })
        : await api.get("/admin/adverts", { params: { page: 1, limit: 100, active: true } });

      const results = extractAdverts(res.data)
        .filter((ad: Advert) => ad.active !== false)
        .sort(sortByNewest);

      applyFilteredData(results);

      if (results.length > 0) {
        toast.success(`${results.length} ilan bulundu.`);
      } else {
        toast.info("Aramanıza uygun ilan bulunamadı.");
      }
    } catch (error: any) {
      console.error("Filtreleme hatası:", error);

      if (error.response) {
        toast.error(
          `API hatası: ${error.response.status} - ${error.response.data?.message || "Bilinmeyen hata"}`
        );
      } else if (error.request) {
        toast.error("Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.");
      } else {
        toast.error("Filtreleme sırasında bir hata oluştu");
      }

      // Fallback to full list
      applyFilteredData(allAdverts);
    } finally {
      setLoading(false);
    }
  }, [filters, allAdverts, applyFilteredData, setLoading]);

  /* ---- Single ad fetch by UID ---- */

  const fetchSingleAd = useCallback(async () => {
    const raw = (filters.uid || "").trim();
    if (!raw) return;

    const uidNumber = Number(raw);
    if (!Number.isFinite(uidNumber) || uidNumber <= 0) {
      toast.error("Lütfen geçerli bir ilan ID (sayı) girin.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/admin/adverts/${uidNumber}`);
      const payload = res.data?.data ?? res.data;
      const singleAd = payload?.advert ?? payload;

      if (singleAd && (singleAd.uid || singleAd.uid === uidNumber)) {
        if (singleAd.active === false) {
          toast.info("Bu ilan pasif durumda.");
        }
        applyFilteredData([singleAd]);
        toast.success("İlan bulundu!");
      } else {
        toast.error("İlan bulunamadı");
        applyFilteredData([]);
      }
    } catch (error: any) {
      console.error("Tek ilan getirme hatası:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "İlan yüklenirken hata oluştu";
      toast.error(msg);
      applyFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [filters.uid, applyFilteredData, setLoading]);

  /* ---- Handle search result from FilterAdminAds modal ---- */

  const handleSearchResult = useCallback(
    (resultData: any) => {
      const results = extractAdverts(resultData)
        .filter((ad: Advert) => ad.active !== false)
        .sort(sortByNewest);

      if (results.length > 0) {
        applyFilteredData(results);
      } else {
        console.warn("Unexpected result format:", resultData);
        toast.error("Sonuçlar beklenen formatta değil");
      }
    },
    [applyFilteredData]
  );

  /* ---- Smart search: ID lookup or filter ---- */

  const handleSearch = useCallback(() => {
    if ((filters.uid || "").trim()) {
      fetchSingleAd();
    } else {
      applyFilters();
    }
  }, [filters.uid, fetchSingleAd, applyFilters]);

  /* ---- Reset ---- */

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    applyFilteredData(allAdverts);
  }, [allAdverts, applyFilteredData]);

  /* ---- Filter modal ---- */

  const openFilter = useCallback(() => setIsFilterOpen(true), []);
  const closeFilter = useCallback(() => setIsFilterOpen(false), []);

  /* ================================================================ */
  /*  Return                                                          */
  /* ================================================================ */

  return {
    filters,
    setFilters,
    updateFilter,
    applyFilters,
    fetchSingleAd,
    handleSearch,
    handleSearchResult,
    resetFilters,
    isFilterOpen,
    openFilter,
    closeFilter,
  };
}