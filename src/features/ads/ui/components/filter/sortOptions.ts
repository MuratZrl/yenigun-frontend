// src/features/ads/ui/components/filter-sidebar/sortOptions.ts
import type { FilterState } from "@/types/advert";

export type SortBy = "date" | "price";
export type SortOrder = "asc" | "desc";

export type SortOption = {
  id: "date_desc" | "date_asc" | "price_asc" | "price_desc";
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export const SORT_OPTIONS: SortOption[] = [
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
];

export function getActiveSortOption(
  filters: Pick<FilterState, "sortBy" | "sortOrder">,
): SortOption {
  return (
    SORT_OPTIONS.find(
      (o) => o.sortBy === filters.sortBy && o.sortOrder === filters.sortOrder,
    ) ?? SORT_OPTIONS[0]
  );
}

export function toSortValue(filters: Pick<FilterState, "sortBy" | "sortOrder">) {
  return `${filters.sortBy}_${filters.sortOrder}` as const;
}
