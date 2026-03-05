// src/features/category-detail/ui/components/DynamicSearch/DynamicSearch.tsx
"use client";

import React from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Home,
  Filter,
  Building,
  FolderTree,
} from "lucide-react";

import type { DynamicSearchProps, Subcategory, TurkeyCity } from "./types";
import { useDynamicSearch } from "./useDynamicSearch";
import FeatureFilters from "./FeatureFilters";

export default function DynamicSearch({
  categoryName,
  categoryData,
  onSearch,
  initialFilters = {},
  adverts = [],
}: DynamicSearchProps) {
  const {
    showMoreFilters,
    setShowMoreFilters,
    features,
    filterValues,
    subcategories,
    provinces,
    currentDistricts,
    currentNeighborhoods,
    isProvinceSelected,
    isDistrictSelected,
    handleProvinceChange,
    handleDistrictChange,
    handleSubcategoryChange,
    handleInputChange,
    handleFeatureChange,
    handleSubmit,
    handleReset,
    handleShowOnMap,
  } = useDynamicSearch({ categoryData, onSearch, initialFilters, adverts });

  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=50')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/70 to-purple-900/70" />
      </div>

      <div className="relative z-10 p-3 sm:p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div className="text-white flex-1">
            <div className="flex items-center gap-1 mb-1">
              <Home size={14} className="text-white/80" />
              <span className="text-xs font-medium text-white/80">
                Kategori
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold truncate">
              {categoryName}
            </h1>
          </div>

          {adverts.length > 0 && (
            <button
              type="button"
              onClick={handleShowOnMap}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
              title="T\u00fcm ilanlar\u0131 haritada g\u00f6r\u00fcnt\u00fcle"
            >
              <MapPin size={16} />
              <span className="hidden sm:inline">Haritada G\u00f6ster</span>
              <span className="inline sm:hidden">Harita</span>
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                {adverts.length}
              </span>
            </button>
          )}
        </div>

        {/* Filter form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm">
            {/* Main filter row */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-12 gap-2 mb-3">
              {/* Price */}
              <div className="xs:col-span-2 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Fiyat
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={filterValues.minPrice}
                    onChange={(e) =>
                      handleInputChange("minPrice", e.target.value)
                    }
                    placeholder="Min TL"
                    className="w-1/2 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    value={filterValues.maxPrice}
                    onChange={(e) =>
                      handleInputChange("maxPrice", e.target.value)
                    }
                    placeholder="Max TL"
                    className="w-1/2 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Subcategory */}
              {subcategories.length > 0 && (
                <div className="xs:col-span-1 sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                    <FolderTree size={10} />
                    <span className="truncate">Alt Kategori</span>
                  </label>
                  <select
                    value={filterValues.subcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">T\u00fcm\u00fc</option>
                    {subcategories.map((subcat: Subcategory) => (
                      <option key={subcat._id} value={subcat.name}>
                        {subcat.name.length > 20
                          ? `${subcat.name.substring(0, 20)}...`
                          : subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Province */}
              <div className="xs:col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                  <Building size={10} />
                  <span className="truncate">\u0130l</span>
                </label>
                <select
                  value={filterValues.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">\u0130l se\u00e7in</option>
                  {provinces.map((province: string, index: number) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="xs:col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                  <MapPin size={10} />
                  <span className="truncate">\u0130l\u00e7e</span>
                </label>
                <select
                  value={filterValues.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={!isProvinceSelected}
                >
                  <option value="">\u0130l\u00e7e se\u00e7in</option>
                  {currentDistricts.map(
                    (
                      district: { district: string; quarters: string[] },
                      index: number,
                    ) => (
                      <option key={index} value={district.district}>
                        {district.district}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Neighborhood */}
              <div className="xs:col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                  <MapPin size={10} />
                  <span className="truncate">Mahalle</span>
                </label>
                <select
                  value={filterValues.neighborhood}
                  onChange={(e) =>
                    handleInputChange("neighborhood", e.target.value)
                  }
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={!isDistrictSelected}
                >
                  <option value="">Mahalle se\u00e7in</option>
                  {currentNeighborhoods.map(
                    (neighborhood: string, index: number) => (
                      <option key={index} value={neighborhood}>
                        {neighborhood.length > 15
                          ? `${neighborhood.substring(0, 15)}...`
                          : neighborhood}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Search button */}
              <div className="xs:col-span-1 sm:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full px-2 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  title="Ara"
                >
                  <Search size={12} />
                  <span className="hidden xs:inline">Ara</span>
                </button>
              </div>
            </div>

            {/* Expandable filters */}
            <div className="pt-2 border-t border-gray-200/30">
              <button
                type="button"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1"
              >
                <Filter size={12} />
                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    showMoreFilters ? "rotate-180" : ""
                  }`}
                />
                <span className="truncate">
                  {showMoreFilters ? "Daha az" : "Daha fazla"}
                </span>
              </button>

              {showMoreFilters && (
                <div className="mt-2 p-2 border border-gray-200 rounded bg-white/80">
                  <FeatureFilters
                    features={features}
                    onFeatureChange={handleFeatureChange}
                  />

                  <div className="mt-2 space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      Di\u011fer Filtreler
                    </h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 truncate">
                          m\u00b2
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded"
                            onChange={(e) =>
                              handleFeatureChange("metrekare", {
                                min: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded"
                            onChange={(e) =>
                              handleFeatureChange("metrekare", {
                                max: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 truncate">
                          Tarih
                        </label>
                        <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded">
                          <option value="">T\u00fcm\u00fc</option>
                          <option value="today">Bug\u00fcn</option>
                          <option value="week">Bu Hafta</option>
                        </select>
                      </div>
                      <div className="xs:col-span-2 sm:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 truncate">
                          Oda Say\u0131s\u0131
                        </label>
                        <select
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          onChange={(e) =>
                            handleFeatureChange("roomCount", e.target.value)
                          }
                        >
                          <option value="">Se\u00e7</option>
                          <option value="1">1+1</option>
                          <option value="2">2+1</option>
                          <option value="3">3+1</option>
                          <option value="4">4+1</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset */}
            <div className="mt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors truncate"
                title="Filtreleri Temizle"
              >
                Temizle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
