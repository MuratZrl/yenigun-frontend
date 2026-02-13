// src/features/admin/emlak-archived/hooks/useArchivedFilters.ts

"use client";

import { useState, useCallback } from "react";
import type { Advert, FilterState } from "../types";
import { EMPTY_FILTERS } from "../types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesFilter(ad: Advert, filters: FilterState): boolean {
  if (filters.uid && ad.uid.toString() !== filters.uid) return false;

  if (filters.title) {
    if (!normalizeString(ad.title).includes(normalizeString(filters.title))) return false;
  }

  if (filters.province) {
    if (!ad.address.province.toLowerCase().includes(filters.province.toLowerCase())) return false;
  }

  if (filters.district) {
    if (!ad.address.district.toLowerCase().includes(filters.district.toLowerCase())) return false;
  }

  if (filters.quarter) {
    if (!ad.address.quarter.toLowerCase().includes(filters.quarter.toLowerCase())) return false;
  }

  if (filters.type && filters.type !== "hepsi") {
    if (ad.steps.second !== filters.type) return false;
  }

  if (filters.otherType) {
    if (!ad.steps.first.toLowerCase().includes(filters.otherType.toLowerCase())) return false;
  }

  if (filters.minFee && ad.fee < Number(filters.minFee)) return false;
  if (filters.maxFee && ad.fee > Number(filters.maxFee)) return false;

  if (filters.advisor) {
    const fullName = `${ad.advisor.name} ${ad.advisor.surname}`;
    if (!fullName.toLowerCase().includes(filters.advisor.toLowerCase())) return false;
  }

  if (filters.customer) {
    const fullName = `${ad.customer.name} ${ad.customer.surname}`;
    if (!fullName.toLowerCase().includes(filters.customer.toLowerCase())) return false;
  }

  return true;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

type Deps = {
  allAdverts: Advert[];
  applyFilteredData: (data: Advert[]) => void;
};

export function useArchivedFilters({ allAdverts, applyFilteredData }: Deps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---- Update a single filter field ---- */

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ---- Apply current filters ---- */

  const applyFilters = useCallback(() => {
    const result = allAdverts.filter((ad) => matchesFilter(ad, filters));
    applyFilteredData(result);
  }, [allAdverts, filters, applyFilteredData]);

  /* ---- Reset filters + restore full list ---- */

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    applyFilteredData(allAdverts);
  }, [allAdverts, applyFilteredData]);

  /* ---- Open / close filter modal ---- */

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
    resetFilters,
    isFilterOpen,
    openFilter,
    closeFilter,
  };
}