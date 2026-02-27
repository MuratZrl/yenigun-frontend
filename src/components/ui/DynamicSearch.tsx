"use client";
import { Advert } from "@/types/search";
import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Home,
  Filter,
  Building,
  FolderTree,
} from "lucide-react";
import JSONDATA from "../../app/data.json";

interface TurkeyCity {
  province: string;
  districts: {
    district: string;
    quarters: string[];
  }[];
}

interface Subcategory {
  _id: string;
  name: string;
  features: any[];
  subcategories?: Subcategory[];
}

interface DynamicSearchProps {
  categoryId: string;
  categoryName: string;
  categoryData?: any;
  onSearch: (filters: any) => void;
  initialFilters?: any;
  adverts?: Advert[];
}

interface FilterValues {
  minPrice: string;
  maxPrice: string;
  province: string;
  district: string;
  neighborhood: string;
  search: string;
  subcategory: string;
  [key: string]: any;
}

const turkeyCities: TurkeyCity[] = JSONDATA.map((city: any) => {
  return {
    province: city.name,
    districts: city.towns.map((district: any) => {
      return {
        district: district.name,
        quarters: district.districts.reduce((acc: any, districtItem: any) => {
          const quarterNames = districtItem.quarters.map(
            (quarter: any) => quarter.name
          );
          return acc.concat(quarterNames);
        }, []),
      };
    }),
  };
});

const cleanAddressData = (address: any): any => {
  if (!address || typeof address !== "object") return address;

  const cleaned = { ...address };

  if (cleaned.full_address && typeof cleaned.full_address === "object") {
    cleaned.full_address =
      cleaned.full_address.full_address ||
      `${cleaned.province || ""}, ${cleaned.district || ""}, ${
        cleaned.quarter || ""
      }`;
  }

  return cleaned;
};

const cleanAdvertData = (advert: Advert): Advert => {
  if (!advert.address) return advert;

  return {
    ...advert,
    address: cleanAddressData(advert.address),
  };
};

const DynamicSearch = ({
  categoryName,
  categoryData,
  onSearch,
  initialFilters = {},
  adverts = [],
}: DynamicSearchProps) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [features, setFeatures] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    minPrice: "",
    maxPrice: "",
    province: "",
    district: "",
    neighborhood: "",
    search: "",
    subcategory: "",
    ...initialFilters,
  });

  const handleShowOnMap = (): void => {
    if (adverts.length === 0) {
      alert("Haritada gösterilecek ilan bulunamadı.");
      return;
    }

    const cleanedAdverts = adverts.map(cleanAdvertData);

    const validAdverts = cleanedAdverts.filter(
      (advert) =>
        advert.address?.mapCoordinates?.lat &&
        advert.address?.mapCoordinates?.lng
    );

    if (validAdverts.length === 0) {
      alert("Koordinat bilgisi olan ilan bulunamadı.");
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
  };

  const getAllSubcategories = (): Subcategory[] => {
    if (!categoryData?.subcategories) return [];

    const allSubcategories: Subcategory[] = [];

    const collectSubcategories = (subcats: Subcategory[]): void => {
      subcats.forEach((subcat) => {
        allSubcategories.push(subcat);
        if (subcat.subcategories && subcat.subcategories.length > 0) {
          collectSubcategories(subcat.subcategories);
        }
      });
    };

    collectSubcategories(categoryData.subcategories);
    return allSubcategories;
  };

  const subcategories = getAllSubcategories();

  const handleProvinceChange = (value: string): void => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      province: value,
      district: "",
      neighborhood: "",
    }));
  };

  const handleDistrictChange = (value: string): void => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      district: value,
      neighborhood: "",
    }));
  };

  const handleSubcategoryChange = (value: string): void => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      subcategory: value,
    }));
  };

  const isProvinceSelected = filterValues.province !== "";
  const isDistrictSelected = filterValues.district !== "";

  const currentDistricts = filterValues.province
    ? turkeyCities.find(
        (city: TurkeyCity) => city.province === filterValues.province
      )?.districts || []
    : [];

  const currentNeighborhoods =
    filterValues.district && filterValues.province
      ? currentDistricts.find(
          (dist: { district: string; quarters: string[] }) =>
            dist.district === filterValues.district
        )?.quarters || []
      : [];

  const handleInputChange = (key: string, value: any): void => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFeatureChange = (featureName: string, value: any): void => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      [`features.${featureName}`]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const cleanFilters: any = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (typeof value === "object") {
          const hasValue = Object.values(value).some(
            (v) => v !== "" && v !== null && v !== undefined
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
        (subcat) => subcat.name === cleanFilters.subcategory
      );
      if (selectedSubcat) {
        cleanFilters.subcategoryId = selectedSubcat._id;
        cleanFilters.subcategoryName = selectedSubcat.name;
      }
    }

    onSearch(cleanFilters);
  };

  const handleReset = (): void => {
    setFilterValues({
      minPrice: "",
      maxPrice: "",
      province: "",
      district: "",
      neighborhood: "",
      search: "",
      subcategory: "",
    });
    onSearch({});
  };

  const renderApiFeatures = () => {
    if (features.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Diğer Özellikler</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {features.slice(0, 4).map((feature: any) => (
            <div key={feature._id} className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 truncate">
                {feature.name}
              </label>
              {feature.type === "single_select" ? (
                <select
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  onChange={(e) =>
                    handleFeatureChange(feature.name, e.target.value)
                  }
                >
                  <option value="">Seçiniz</option>
                  {feature.options
                    ?.slice(0, 5)
                    .map((option: string, idx: number) => (
                      <option key={idx} value={option}>
                        {option.length > 20
                          ? `${option.substring(0, 20)}...`
                          : option}
                      </option>
                    ))}
                </select>
              ) : feature.type === "multi_select" ? (
                <select
                  multiple
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none h-16 bg-white"
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    handleFeatureChange(feature.name, selected);
                  }}
                >
                  {feature.options
                    ?.slice(0, 4)
                    .map((option: string, idx: number) => (
                      <option key={idx} value={option}>
                        {option.length > 20
                          ? `${option.substring(0, 20)}...`
                          : option}
                      </option>
                    ))}
                </select>
              ) : feature.type === "number" ? (
                <input
                  type="number"
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  onChange={(e) =>
                    handleFeatureChange(feature.name, e.target.value)
                  }
                />
              ) : feature.type === "text" ? (
                <input
                  type="text"
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  onChange={(e) =>
                    handleFeatureChange(feature.name, e.target.value)
                  }
                />
              ) : feature.type === "boolean" ? (
                <select
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  onChange={(e) =>
                    handleFeatureChange(feature.name, e.target.value === "true")
                  }
                >
                  <option value="">Seçiniz</option>
                  <option value="true">Var</option>
                  <option value="false">Yok</option>
                </select>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const provinces = turkeyCities.map((city: TurkeyCity) => city.province);

  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=50')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/70 to-purple-900/70"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4">
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
              title="Tüm ilanları haritada görüntüle"
            >
              <MapPin size={16} />
              <span className="hidden sm:inline">Haritada Göster</span>
              <span className="inline sm:hidden">Harita</span>
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                {adverts.length}
              </span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-12 gap-2 mb-3">
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
                    <option value="">Tümü</option>
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

              <div className="xs:col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                  <Building size={10} />
                  <span className="truncate">İl</span>
                </label>
                <select
                  value={filterValues.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">İl seçin</option>
                  {provinces.map((province: string, index: number) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="xs:col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                  <MapPin size={10} />
                  <span className="truncate">İlçe</span>
                </label>
                <select
                  value={filterValues.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={!isProvinceSelected}
                >
                  <option value="">İlçe seçin</option>
                  {currentDistricts.map(
                    (
                      district: { district: string; quarters: string[] },
                      index: number
                    ) => (
                      <option key={index} value={district.district}>
                        {district.district}
                      </option>
                    )
                  )}
                </select>
              </div>

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
                  <option value="">Mahalle seçin</option>
                  {currentNeighborhoods.map(
                    (neighborhood: string, index: number) => (
                      <option key={index} value={neighborhood}>
                        {neighborhood.length > 15
                          ? `${neighborhood.substring(0, 15)}...`
                          : neighborhood}
                      </option>
                    )
                  )}
                </select>
              </div>

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
                  {renderApiFeatures()}

                  <div className="mt-2 space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      Diğer Filtreler
                    </h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 truncate">
                          m²
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
                          <option value="">Tümü</option>
                          <option value="today">Bugün</option>
                          <option value="week">Bu Hafta</option>
                        </select>
                      </div>
                      <div className="xs:col-span-2 sm:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 truncate">
                          Oda Sayısı
                        </label>
                        <select
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          onChange={(e) =>
                            handleFeatureChange("roomCount", e.target.value)
                          }
                        >
                          <option value="">Seç</option>
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
};

export default DynamicSearch;
