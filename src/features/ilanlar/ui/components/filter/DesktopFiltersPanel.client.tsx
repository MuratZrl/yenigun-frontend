// src/features/ilanlar/ui/components/filter/DesktopFiltersPanel.client.tsx
"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { FILTER_DEFAULT_OPEN } from "./filterOpenDefaults";

import CategoryOptionsBox from "./CategoryOptionBox.client";
import MapPreview from "./MapPreview.client";
import AddressBox from "./AddressBox.client";
import PriceBox from "./PriceBox.client";
import AreaBox from "./AreaBox.client";
import RoomCountBox from "./RoomCountBox.client";
import BuildingAgeBox from "./BuildingAgeBox.client";
import FloorBox from "./FloorBox.client";
import TotalFloorsBox from "./TotalFloorsBox.client";
import HeatingBox from "./HeatingBox.client";
import BathroomCountBox from "./BathroomCountBox.client";
import KitchenTypeBox from "./KitchenTypeBox.client";
import ParkingBox from "./ParkingBox.client";
import FurnishedBox from "./FurnishedBox.client";
import BalconyBox from "./BalconyBox.client";
import ElevatorBox from "./ElevatorBox.client";
import UsageStatusBox from "./UsageFilterBox.client";
import InSiteBox from "./InSiteBox.client";
import CreditEligibleBox from "./CreditBoxEligble.client";
import DeedStatusBox from "./DeedStatusBox.client";
import FromWhoBox from "./FromWhoBox.client";
import SwapBox from "./SwapBox.client";
// import ListingDateBox from "./ListingDateBox.client";
// import MediaFilterBox from "./MediaFilterBox.client";
// import MapFilterBox from "./MapFilterBox.client";
import KeywordFilterBox from "./KeywordFilterBox.client";
import MoreOptionsModal from "./MoreOptionsModal.client";
import FilterActions from "./FilterActions.client";

import type { Category, FilterState, Subcategory } from "@/types/advert";

interface CityData {
  province: string;
  districts: Array<{ district: string; quarters: string[] }>;
}

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;

  categories: Category[];
  loadingCategories: boolean;

  availableSubcategories: Subcategory[];
  availableSubSubcategories: Subcategory[];

  citiesData: CityData[];

  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;

  totalItems: number;
  handleFilter: () => Promise<void>;
  clearFilters: () => Promise<void>;

  handleSortChangeDesktop?: (sortBy: "date" | "price", sortOrder: "asc" | "desc") => Promise<void>;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;

  onCategorySelect: (category: Category | null) => void;
  onSubcategorySelect: (subcategory: Subcategory | null) => void;
  onSubSubcategorySelect: (subsub: Subcategory | null) => void;

  featureFilters?: Record<string, any>;

  // ✅ controller'dan gelen tek kaynak
  autoApply: boolean;
  setAutoApply: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Checks if any filter is actively applied.
 * Returns true when at least one filter differs from its default/empty state.
 */
function hasActiveFilters(
  filters: FilterState,
  selectedCategory: Category | null,
  featureFilters?: Record<string, any>,
): boolean {
  const f = filters as any;

  // Category selected
  if (selectedCategory) return true;

  // Location
  if (f.location && f.location !== "Hepsi" && f.location !== "") return true;
  if (f.district && f.district !== "Hepsi" && f.district !== "") return true;
  if (f.quarter && f.quarter !== "Hepsi" && f.quarter !== "") return true;

  // Price
  if (f.minPrice != null && f.minPrice !== "") return true;
  if (f.maxPrice != null && f.maxPrice !== "") return true;
  if (f.priceCurrency && f.priceCurrency !== "TL" && f.priceCurrency !== "") return true;

  // Area
  if (f.minArea != null && f.minArea !== "") return true;
  if (f.maxArea != null && f.maxArea !== "") return true;
  if (f.minNetArea != null && f.minNetArea !== "") return true;
  if (f.maxNetArea != null && f.maxNetArea !== "") return true;

  // Room, building age, floor
  if (f.roomCount && f.roomCount !== "" && f.roomCount !== "Hepsi") return true;
  if (f.buildingAge && f.buildingAge !== "" && f.buildingAge !== "Hepsi") return true;
  if (f.floor && f.floor !== "" && f.floor !== "Hepsi") return true;
  if (f.totalFloors && f.totalFloors !== "" && f.totalFloors !== "Hepsi") return true;

  // Heating, bathroom, kitchen
  if (f.heating && f.heating !== "" && f.heating !== "Hepsi") return true;
  if (f.bathroomCount && f.bathroomCount !== "" && f.bathroomCount !== "Hepsi") return true;
  if (f.kitchenType && f.kitchenType !== "" && f.kitchenType !== "Hepsi") return true;

  // Boolean filters
  if (f.balcony && f.balcony !== "" && f.balcony !== "Hepsi") return true;
  if (f.elevator && f.elevator !== "" && f.elevator !== "Hepsi") return true;
  if (f.parking && f.parking !== "" && f.parking !== "Hepsi") return true;
  if (f.furnished && f.furnished !== "" && f.furnished !== "Hepsi") return true;
  if (f.usageStatus && f.usageStatus !== "" && f.usageStatus !== "Hepsi") return true;
  if (f.inSite && f.inSite !== "" && f.inSite !== "Hepsi") return true;
  if (f.creditEligible && f.creditEligible !== "" && f.creditEligible !== "Hepsi") return true;
  if (f.deedStatus && f.deedStatus !== "" && f.deedStatus !== "Hepsi") return true;
  if (f.fromWho && f.fromWho !== "" && f.fromWho !== "Hepsi") return true;
  if (f.swap && f.swap !== "" && f.swap !== "Hepsi") return true;

  // Type (category path)
  if (f.type && f.type !== "" && f.type !== "Hepsi") return true;

  // Keyword
  if (f.keyword && f.keyword.trim() !== "") return true;

  // Feature filters
  if (featureFilters && Object.keys(featureFilters).length > 0) {
    for (const val of Object.values(featureFilters)) {
      if (val === null || val === undefined || val === "" || val === false) continue;
      if (Array.isArray(val) && val.length === 0) continue;
      if (typeof val === "object" && !Array.isArray(val)) {
        if ((val.min == null || val.min === "") && (val.max == null || val.max === "")) continue;
        return true;
      }
      return true;
    }
  }

  return false;
}

export default function DesktopFiltersPanel({
  filters,
  setFilters,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  categories,
  loadingCategories,
  availableSubcategories,
  availableSubSubcategories,
  citiesData,
  totalItems,
  handleFilter,
  clearFilters,
  setCurrentPage,
  onCategorySelect,
  onSubcategorySelect,
  onSubSubcategorySelect,
  featureFilters,
  autoApply,
  setAutoApply,
}: Props) {
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isDisabled = !hasActiveFilters(filters, selectedCategory, featureFilters);

  return (
    <div className="hidden md:block w-55 shrink-0 bg-white">
      <div className="px-0 py-0">
        <div className="mb-2 px-1">
          <button
            type="button"
            onClick={() => void clearFilters()}
            disabled={isDisabled}
            className={[
              "w-full py-2 flex items-center justify-center gap-2 border rounded text-[13px] font-medium transition-colors",
              isDisabled
                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                : "border-red-200 text-red-600 hover:bg-red-50 cursor-pointer",
            ].join(" ")}
          >
            <Trash2 size={15} />
            Filtreleri Temizle
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-2">
          <CategoryOptionsBox
            filters={filters}
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            selectedSubSubcategory={selectedSubSubcategory}
            onCategorySelect={onCategorySelect}
            onSubcategorySelect={onSubcategorySelect}
            onSubSubcategorySelect={onSubSubcategorySelect}
          />
        </div>

        <div className="mt-3 bg-white">
          <MapPreview filters={filters} href="/ilanlar?view=map" />
        </div>

        <div className="mt-3">
          <AddressBox filters={filters} setFilters={setFilters} citiesData={citiesData} />
        </div>

        <div className="mt-3">
          <PriceBox filters={filters} setFilters={setFilters} />
        </div>

        <div className="mt-3">
          <AreaBox filters={filters} setFilters={setFilters} />
        </div>

        <div className="mt-3">
          <RoomCountBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.roomCount} />
        </div>

        <div className="mt-3">
          <BuildingAgeBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.buildingAge} />
        </div>

        <div className="mt-3">
          <FloorBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.floor} />
        </div>

        <div className="mt-3">
          <TotalFloorsBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.totalFloors} />
        </div>

        <div className="mt-3">
          <HeatingBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.heating} />
        </div>

        <div className="mt-3">
          <BathroomCountBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.bathroomCount} />
        </div>

        <div className="mt-3">
          <KitchenTypeBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.kitchenType} />
        </div>

        <div className="mt-3">
          <BalconyBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.balcony} />
        </div>

        <div className="mt-3">
          <ElevatorBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.elevator} />
        </div>

        <div className="mt-3">
          <ParkingBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.parking} />
        </div>

        <div className="mt-3">
          <FurnishedBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.furnished} />
        </div>

        <div className="mt-3">
          <UsageStatusBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.usageStatus} />
        </div>

        <div className="mt-3">
          <InSiteBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.inSite} />
        </div>

        <div className="mt-3">
          <CreditEligibleBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.creditEligible} />
        </div>

        <div className="mt-3">
          <DeedStatusBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.deedStatus} />
        </div>

        <div className="mt-3">
          <FromWhoBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.fromWho} />
        </div>

        <div className="mt-3">
          <SwapBox filters={filters} setFilters={setFilters} defaultOpen={FILTER_DEFAULT_OPEN.swap} />
        </div>

        {/* <div className="mt-3">
          <ListingDateBox filters={filters} setFilters={setFilters} />
        </div>

        <div className="mt-3">
          <MediaFilterBox filters={filters} setFilters={setFilters} />
        </div>

        <div className="mt-3">
          <MapFilterBox filters={filters} setFilters={setFilters} />
        </div> */}

        <div className="mt-3">
          <KeywordFilterBox filters={filters} setFilters={setFilters} />
        </div>

        <div className="mt-3 px-3">
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="text-[13px] text-blue-700 hover:underline"
          >
            Daha fazla seçenek göster
          </button>
        </div>

        {/* ✅ Artık debounce/effect burada yok. Sadece UI kontrol. */}
        <FilterActions
          totalItems={totalItems}
          onFilter={handleFilter}
          autoApply={autoApply}
          setAutoApply={setAutoApply}
        />
      </div>

      <MoreOptionsModal
        open={moreOpen}
        initialFilters={filters}
        onClose={() => setMoreOpen(false)}
        onApply={(next) => {
          setFilters(next as any);
          if (setCurrentPage) setCurrentPage(1);
          void handleFilter();
        }}
      />
    </div>
  );
}