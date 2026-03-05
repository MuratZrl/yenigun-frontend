// src/features/category-detail/ui/components/DynamicSearch/useDynamicSearch.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import type { Advert } from "@/types/search";
import type {
  FilterValues,
  Feature,
  Subcategory,
  Category,
  TurkeyCity,
  SearchFilters,
} from "./types";
import { turkeyCities, cleanAdvertData } from "./utils";

interface UseDynamicSearchParams {
  categoryData?: Category;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<FilterValues>;
  adverts: Advert[];
}

const DEFAULT_FILTER_VALUES: FilterValues = {
  minPrice: "",
  maxPrice: "",
  province: "",
  district: "",
  neighborhood: "",
  search: "",
  subcategory: "",
};

export function useDynamicSearch({
  categoryData,
  onSearch,
  initialFilters = {},
  adverts,
}: UseDynamicSearchParams) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [features] = useState<Feature[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>(() => {
    const merged = { ...DEFAULT_FILTER_VALUES };
    for (const [key, value] of Object.entries(initialFilters)) {
      if (value !== undefined) {
        merged[key] = value;
      }
    }
    return merged;
  });

  /* ── Subcategories (recursive collect) ── */
  const subcategories = useMemo<Subcategory[]>(() => {
    if (!categoryData?.subcategories) return [];

    const all: Subcategory[] = [];
    const collect = (subcats: Subcategory[]): void => {
      subcats.forEach((subcat) => {
        all.push(subcat);
        if (subcat.subcategories && subcat.subcategories.length > 0) {
          collect(subcat.subcategories);
        }
      });
    };
    collect(categoryData.subcategories);
    return all;
  }, [categoryData]);

  /* ── Provinces / districts / neighborhoods ── */
  const provinces = useMemo(
    () => turkeyCities.map((city: TurkeyCity) => city.province),
    [],
  );

  const currentDistricts = useMemo(
    () =>
      filterValues.province
        ? turkeyCities.find(
            (city: TurkeyCity) => city.province === filterValues.province,
          )?.districts || []
        : [],
    [filterValues.province],
  );

  const currentNeighborhoods = useMemo(
    () =>
      filterValues.district && filterValues.province
        ? currentDistricts.find(
            (dist) => dist.district === filterValues.district,
          )?.quarters || []
        : [],
    [filterValues.district, filterValues.province, currentDistricts],
  );

  const isProvinceSelected = filterValues.province !== "";
  const isDistrictSelected = filterValues.district !== "";

  /* ── Handlers ── */
  const handleProvinceChange = useCallback((value: string): void => {
    setFilterValues((prev) => ({
      ...prev,
      province: value,
      district: "",
      neighborhood: "",
    }));
  }, []);

  const handleDistrictChange = useCallback((value: string): void => {
    setFilterValues((prev) => ({
      ...prev,
      district: value,
      neighborhood: "",
    }));
  }, []);

  const handleSubcategoryChange = useCallback((value: string): void => {
    setFilterValues((prev) => ({
      ...prev,
      subcategory: value,
    }));
  }, []);

  const handleInputChange = useCallback(
    (key: string, value: string): void => {
      setFilterValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleFeatureChange = useCallback(
    (
      featureName: string,
      value: string | string[] | boolean | Record<string, string>,
    ): void => {
      setFilterValues((prev) => ({
        ...prev,
        [`features.${featureName}`]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();

      const cleanFilters: Record<string, unknown> = {};
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (typeof value === "object" && !Array.isArray(value)) {
            const hasValue = Object.values(value).some(
              (v) => v !== "" && v !== null && v !== undefined,
            );
            if (hasValue) {
              cleanFilters[key] = value;
            }
          } else {
            cleanFilters[key] = value;
          }
        }
      });

      if (cleanFilters.subcategory) {
        const selectedSubcat = subcategories.find(
          (subcat) => subcat.name === cleanFilters.subcategory,
        );
        if (selectedSubcat) {
          cleanFilters.subcategoryId = selectedSubcat._id;
          cleanFilters.subcategoryName = selectedSubcat.name;
        }
      }

      onSearch(cleanFilters);
    },
    [filterValues, subcategories, onSearch],
  );

  const handleReset = useCallback((): void => {
    setFilterValues({ ...DEFAULT_FILTER_VALUES });
    onSearch({});
  }, [onSearch]);

  /* ── Show on map ── */
  const handleShowOnMap = useCallback((): void => {
    if (adverts.length === 0) {
      alert("Haritada g\u00f6sterilecek ilan bulunamad\u0131.");
      return;
    }

    const cleanedAdverts = adverts.map(cleanAdvertData);
    const validAdverts = cleanedAdverts.filter(
      (advert) =>
        advert.address?.mapCoordinates?.lat &&
        advert.address?.mapCoordinates?.lng,
    );

    if (validAdverts.length === 0) {
      alert("Koordinat bilgisi olan ilan bulunamad\u0131.");
      return;
    }

    localStorage.setItem("haritaAdverts", JSON.stringify(validAdverts));

    const firstAdvert = validAdverts[0];
    const province = firstAdvert.address?.province || "";
    const district = firstAdvert.address?.district || "";

    const params = new URLSearchParams();
    if (province) params.append("province", province);
    if (district) params.append("district", district);

    const url = `/Harita${params.toString() ? `?${params.toString()}` : ""}`;
    window.open(url, "_blank");
  }, [adverts]);

  return {
    /* state */
    showMoreFilters,
    setShowMoreFilters,
    features,
    filterValues,

    /* derived */
    subcategories,
    provinces,
    currentDistricts,
    currentNeighborhoods,
    isProvinceSelected,
    isDistrictSelected,

    /* handlers */
    handleProvinceChange,
    handleDistrictChange,
    handleSubcategoryChange,
    handleInputChange,
    handleFeatureChange,
    handleSubmit,
    handleReset,
    handleShowOnMap,
  };
}
