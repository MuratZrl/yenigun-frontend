// src/components/modals/FilterAdminAds/FilterAdminAds.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import Select, { type SingleValue } from "react-select";
import {
  X,
  Filter,
  Trash2,
  MapPin,
  Tag,
  DollarSign,
  User,
  Users,
} from "lucide-react";

import type { FilterAdminAdsProps, ReactSelectOption } from "./types";
import useFilterAdminAds from "./useFilterAdminAds";
import CategorySection from "./CategorySection";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const controlStyle = (disabled?: boolean) => ({
  minHeight: "52px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  backgroundColor: disabled ? "#f9fafb" : "white",
  "&:hover": { borderColor: "#3b82f6" },
});

const portalStyle = { zIndex: 9999 };

const menuStyle = {
  zIndex: 9999,
  marginTop: "4px",
  borderRadius: "12px",
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export default function FilterAdminAds({
  open,
  setOpen,
  filters,
  setFilters,
  handleCleanFilters,
  page = 1,
  limit = 25,
  onSearchResult,
}: FilterAdminAdsProps) {
  const hook = useFilterAdminAds({
    setOpen,
    filters,
    setFilters,
    handleCleanFilters,
    page,
    limit,
    onSearchResult,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={hook.handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={hook.handleSubmit}
          className="relative w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden"
          style={PoppinsFont.style}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gelismis Filtreleme</h2>
                <p className="text-gray-300 text-sm mt-1">
                  Ilanlari detayli bir sekilde filtreleyin
                </p>
              </div>
              <button
                type="button"
                onClick={hook.handleClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Il */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline mr-2" size={16} />
                  Il
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={hook.turkeyCities.map((c) => ({
                    value: c.province,
                    label: c.province,
                  }))}
                  value={
                    filters.province
                      ? { value: filters.province, label: filters.province }
                      : null
                  }
                  placeholder="Il secin"
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({ ...base, ...controlStyle() }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) => {
                    setFilters((prev) => ({
                      ...prev,
                      province: opt?.value ?? null,
                      district: null,
                      quarter: null,
                    }));
                  }}
                />
              </div>

              {/* Ilce */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Ilce
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={
                    hook.turkeyCities
                      .find((c) => c.province === filters.province)
                      ?.districts.map((d) => ({
                        value: d.district,
                        label: d.district,
                      })) || []
                  }
                  value={
                    filters.district
                      ? { value: filters.district, label: filters.district }
                      : null
                  }
                  placeholder="Ilce secin"
                  isDisabled={!filters.province}
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      ...controlStyle(!filters.province),
                    }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) => {
                    setFilters((prev) => ({
                      ...prev,
                      district: opt?.value ?? null,
                      quarter: null,
                    }));
                  }}
                />
              </div>

              {/* Mahalle */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mahalle
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={(() => {
                    if (!filters.province || !filters.district) return [];
                    const city = hook.turkeyCities.find(
                      (c) => c.province === filters.province,
                    );
                    const dist = city?.districts.find(
                      (d) => d.district === filters.district,
                    );
                    return (dist?.quarters ?? []).map((q) => ({
                      value: q,
                      label: q,
                    }));
                  })()}
                  value={
                    filters.quarter
                      ? { value: filters.quarter, label: filters.quarter }
                      : null
                  }
                  placeholder="Mahalle secin"
                  isDisabled={!filters.province || !filters.district}
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      ...controlStyle(
                        !filters.province || !filters.district,
                      ),
                    }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) => {
                    setFilters((prev) => ({
                      ...prev,
                      quarter: opt?.value ?? null,
                    }));
                  }}
                />
              </div>

              {/* Ilan Turu */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Tag className="inline mr-2" size={16} />
                  Ilan Turu
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={[
                    { value: "", label: "Hepsi", color: "#6b7280" },
                    { value: "Kiralik", label: "Kiralik", color: "#3b82f6" },
                    {
                      value: "Devren Kiralik",
                      label: "Devren Kiralik",
                      color: "#8b5cf6",
                    },
                    {
                      value: "Gunluk Kiralik",
                      label: "Gunluk Kiralik",
                      color: "#10b981",
                    },
                    { value: "Satilik", label: "Satilik", color: "#ef4444" },
                    {
                      value: "Devren Satilik",
                      label: "Devren Satilik",
                      color: "#f59e0b",
                    },
                  ]}
                  value={
                    filters.type
                      ? { value: filters.type, label: filters.type }
                      : { value: "", label: "Hepsi" }
                  }
                  placeholder="Ilan Turu"
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({ ...base, ...controlStyle() }),
                    option: (base, { data }) => ({
                      ...base,
                      color: data.color || "#374151",
                      fontWeight: "500",
                    }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) => {
                    setFilters((prev) => ({
                      ...prev,
                      type: opt?.value ?? null,
                    }));
                  }}
                />
              </div>

              {/* Musteri */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <User className="inline mr-2" size={16} />
                  Musteri
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={hook.customers.map((c) => ({
                    value: `${c.name} ${c.surname}`,
                    label: `${c.name} ${c.surname}`,
                  }))}
                  formatOptionLabel={(option) => {
                    const cust = hook.customers.find(
                      (c) => `${c.name} ${c.surname}` === option.value,
                    );
                    return (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">
                            {cust?.phones?.[0]?.number}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  value={
                    filters.customer
                      ? { value: filters.customer, label: filters.customer }
                      : null
                  }
                  placeholder="Musteri secin"
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({ ...base, ...controlStyle() }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                    menu: (base) => ({ ...base, ...menuStyle }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) =>
                    setFilters((prev) => ({
                      ...prev,
                      customer: opt?.value ?? null,
                    }))
                  }
                />
              </div>

              {/* Danisman */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Users className="inline mr-2" size={16} />
                  Danisman
                </label>
                <Select<ReactSelectOption>
                  classNamePrefix="select"
                  options={hook.advisors.map((a) => ({
                    value: `${a.name} ${a.surname}`,
                    label: `${a.name} ${a.surname}`,
                  }))}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <Users size={14} className="text-purple-600" />
                      </div>
                      <div className="font-medium">{option.label}</div>
                    </div>
                  )}
                  value={
                    filters.advisor
                      ? { value: filters.advisor, label: filters.advisor }
                      : null
                  }
                  placeholder="Danisman secin"
                  menuPortalTarget={hook.portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({ ...base, ...controlStyle() }),
                    menuPortal: (base) => ({ ...base, ...portalStyle }),
                    menu: (base) => ({ ...base, ...menuStyle }),
                  }}
                  onChange={(opt: SingleValue<ReactSelectOption>) =>
                    setFilters((prev) => ({
                      ...prev,
                      advisor: opt?.value ?? null,
                    }))
                  }
                />
              </div>

              {/* Fiyat Araligi */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <DollarSign className="inline mr-2" size={16} />
                  Fiyat Araligi
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₺
                      </span>
                      <input
                        type="number"
                        placeholder="Minimum Fiyat"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={filters.minFee ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                            ? parseInt(e.target.value, 10)
                            : null;
                          setFilters((prev) => ({ ...prev, minFee: v }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-6 h-px bg-gray-300" />
                  </div>

                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₺
                      </span>
                      <input
                        type="number"
                        placeholder="Maksimum Fiyat"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={filters.maxFee ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                            ? parseInt(e.target.value, 10)
                            : null;
                          setFilters((prev) => ({ ...prev, maxFee: v }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <CategorySection
                categories={hook.categories}
                loadingCategories={hook.loadingCategories}
                selectedCategory={hook.selectedCategory}
                selectedSubcategory={hook.selectedSubcategory}
                selectedSubSubcategory={hook.selectedSubSubcategory}
                availableSubcategories={hook.availableSubcategories}
                availableSubSubcategories={hook.availableSubSubcategories}
                currentFeatures={hook.currentFeatures}
                featureFilters={hook.featureFilters}
                categoryPath={filters.categoryPath}
                onSelectCategory={hook.handleCategorySelect}
                onSelectSubcategory={hook.handleSubcategorySelect}
                onSelectSubSubcategory={hook.handleSubSubcategorySelect}
                onFeatureFilterChange={hook.handleFeatureFilterChange}
                onClearCategory={hook.handleClearCategory}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={hook.handleClean}
                disabled={hook.loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
                Tumunu Temizle
              </button>

              <button
                type="submit"
                disabled={hook.loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hook.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    Isleniyor...
                  </>
                ) : (
                  <>
                    <Filter size={18} />
                    Filtrele ({hook.activeCount})
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
