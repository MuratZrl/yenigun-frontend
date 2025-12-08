import React, { useState, useEffect } from "react";
import axios from "axios";
import JSONDATA from "../../data.json";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Select from "react-select";
import { useCookies } from "react-cookie";
import api from "@/app/lib/api";
import Advisor from "@/app/types/advisor";
import Customer from "@/app/types/customers";
import {
  X,
  Filter,
  Trash2,
  Search,
  MapPin,
  Tag,
  DollarSign,
  User,
  Users,
  Building,
  Home,
  Check,
  Layers,
  Bed,
  Bath,
  Car,
  Ruler,
  Thermometer,
} from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const FeatureInput = ({
  feature,
  value,
  onChange,
}: {
  feature: any;
  value: any;
  onChange: (value: any) => void;
}) => {
  switch (feature.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`feature-${feature._id}`}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor={`feature-${feature._id}`}
            className="text-sm text-gray-700"
          >
            {feature.name}
          </label>
        </div>
      );

    case "single_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {feature.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {feature.options?.map((option: string, index: number) => {
              const isSelected = value?.includes(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const newValue = isSelected
                      ? value.filter((v: string) => v !== option)
                      : [...(value || []), option];
                    onChange(newValue);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );

    case "range":
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={value?.min || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    min: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={value?.max || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    max: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
  }
};

const FilterAdminAds = ({
  open,
  setOpen,
  filters,
  setFilters,
  handleFilter,
  handleCleanFilters,
  page = 1,
  limit = 25,
  onSearchResult,
}: any) => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<any>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>(
    []
  );
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState<
    any[]
  >([]);

  const [featureFilters, setFeatureFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    api
      .get("/admin/customers")
      .then((res) => {
        setCustomers(res.data.data);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
        setTimeout(() => {
          window.location.href = "/admin/emlak";
        }, 2000);
      });

    api
      .get("/admin/users")
      .then((res) => {
        setAdvisors(res.data.data);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
      });

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get("/admin/categories");
      if (response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
      toast.error("Kategoriler yüklenemedi");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const turkeyCities = JSONDATA.map((city: any) => {
    return {
      province: city.name,
      districts: city.towns.map((district: any) => {
        return {
          district: district.name,
          quarters: district.districts.reduce((acc: any, district: any) => {
            const quarterNames = district.quarters.map(
              (quarter: any) => quarter.name
            );
            return acc.concat(quarterNames);
          }, []),
        };
      }),
    };
  });

  const handleCategorySelect = (category: any | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});

    if (category) {
      setAvailableSubcategories(category.subcategories || []);
      setFilters((prev: any) => ({
        ...prev,
        category: category.name,
        subcategory: null,
        subsubcategory: null,
      }));
    } else {
      setAvailableSubcategories([]);
      setAvailableSubSubcategories([]);
      setFilters((prev: any) => ({
        ...prev,
        category: null,
        subcategory: null,
        subsubcategory: null,
      }));
    }
  };

  const handleSubcategorySelect = (subcategory: any | null) => {
    setSelectedSubcategory(subcategory);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});

    if (subcategory) {
      setAvailableSubSubcategories(subcategory.subcategories || []);

      if (subcategory.features && subcategory.features.length > 0) {
        const initialFilters: Record<string, any> = {};
        subcategory.features.forEach((feature: any) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          }
        });
        setFeatureFilters(initialFilters);
      }

      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${subcategory.name}`
        : subcategory.name;
      setFilters((prev: any) => ({
        ...prev,
        subcategory: subcategory.name,
        subsubcategory: null,
        categoryPath: categoryPath,
      }));
    } else {
      setAvailableSubSubcategories([]);
      if (selectedCategory) {
        setFilters((prev: any) => ({
          ...prev,
          subcategory: null,
          subsubcategory: null,
          categoryPath: selectedCategory.name,
        }));
      }
    }
  };

  const handleSubSubcategorySelect = (subsubcategory: any | null) => {
    setSelectedSubSubcategory(subsubcategory);
    setFeatureFilters({});

    if (subsubcategory) {
      if (subsubcategory.features && subsubcategory.features.length > 0) {
        const initialFilters: Record<string, any> = {};
        subsubcategory.features.forEach((feature: any) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          }
        });
        setFeatureFilters(initialFilters);
      }

      const categoryPath =
        selectedCategory && selectedSubcategory
          ? `${selectedCategory.name} > ${selectedSubcategory.name} > ${subsubcategory.name}`
          : subsubcategory.name;
      setFilters((prev: any) => ({
        ...prev,
        subsubcategory: subsubcategory.name,
        categoryPath: categoryPath,
      }));
    } else if (selectedSubcategory) {
      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${selectedSubcategory.name}`
        : selectedSubcategory.name;
      setFilters((prev: any) => ({
        ...prev,
        subsubcategory: null,
        categoryPath: categoryPath,
      }));
    }
  };

  const handleFeatureFilterChange = (featureId: string, value: any) => {
    setFeatureFilters((prev) => ({
      ...prev,
      [featureId]: value,
    }));
  };

  const getCurrentFeatures = (): any[] => {
    if (selectedSubSubcategory?.features) {
      return selectedSubSubcategory.features;
    }
    if (selectedSubcategory?.features) {
      return selectedSubcategory.features;
    }
    return [];
  };

  const prepareSearchParams = () => {
    const params: any = {
      page,
      limit,
    };

    if (filters.search) params.search = filters.search;
    if (filters.province) params.province = filters.province;
    if (filters.district) params.district = filters.district;
    if (filters.quarter) params.quarter = filters.quarter;
    if (filters.type && filters.type !== "Hepsi" && filters.type !== "")
      params.type = filters.type;
    if (filters.minFee) params.minPrice = filters.minFee;
    if (filters.maxFee) params.maxPrice = filters.maxFee;

    if (filters.advisor) {
      const advisor = advisors.find(
        (a: any) => `${a.name} ${a.surname}` === filters.advisor
      );
      if (advisor) params.advisorUid = advisor.uid;
    }

    if (filters.customer) {
      const customer = customers.find(
        (c: any) => `${c.name} ${c.surname}` === filters.customer
      );
      if (customer) params.customerUid = customer.uid;
    }

    if (filters.categoryPath) {
      const lastCategory = filters.categoryPath.split(" > ").pop();
      params.category = lastCategory || filters.categoryPath;
    }

    const features = getCurrentFeatures();
    features.forEach((feature) => {
      const filterValue = featureFilters[feature._id];
      if (
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== ""
      ) {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          params[`features.${feature.name}`] = filterValue.join(",");
        } else if (typeof filterValue === "object" && filterValue !== null) {
          if (filterValue.min !== undefined && filterValue.min !== null) {
            params[`features.${feature.name}.min`] = filterValue.min;
          }
          if (filterValue.max !== undefined && filterValue.max !== null) {
            params[`features.${feature.name}.max`] = filterValue.max;
          }
        } else if (filterValue !== false) {
          params[`features.${feature.name}`] = filterValue;
        }
      }
    });

    Object.keys(params).forEach((key) => {
      if (
        params[key] === undefined ||
        params[key] === null ||
        params[key] === "" ||
        (typeof params[key] === "string" && params[key].trim() === "")
      ) {
        delete params[key];
      }
    });

    console.log("Search Params:", params);
    return params;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const searchParams = prepareSearchParams();

      const response = await api.get("/admin/adverts/search", {
        params: searchParams,
      });

      if (onSearchResult) {
        onSearchResult(response.data.data || response.data);
      }

      toast.success("Filtreleme başarılı!");
      setOpen(false);
    } catch (error: any) {
      console.error("Filtreleme hatası:", error);
      toast.error(
        error.response?.data?.message || "Filtreleme sırasında bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClean = (e: React.FormEvent) => {
    e.preventDefault();
    handleCleanFilters();
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setAvailableSubcategories([]);
    setAvailableSubSubcategories([]);
    setFeatureFilters({});
    setOpen(false);

    if (onSearchResult) {
      api
        .get("/admin/adverts/search", { params: { page, limit } })
        .then((response) => onSearchResult(response.data))
        .catch((error) => toast.error("Sıfırlama sırasında bir hata oluştu"));
    }
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <form
              onSubmit={handleSubmit}
              className="relative w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden"
              style={PoppinsFont.style}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Gelişmiş Filtreleme</h2>
                    <p className="text-gray-300 text-sm mt-1">
                      İlanları detaylı bir şekilde filtreleyin
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* İl */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <MapPin className="inline mr-2" size={16} />
                      İl
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={turkeyCities.map((city: any) => ({
                        value: city.province,
                        label: city.province,
                      }))}
                      value={
                        filters.province
                          ? {
                              value: filters.province,
                              label: filters.province,
                            }
                          : null
                      }
                      placeholder="İl seçin"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af",
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          province: selectedOption?.value || null,
                          district: null,
                          quarter: null,
                        });
                      }}
                    />
                  </div>

                  {/* İlçe */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      İlçe
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={
                        turkeyCities
                          .find(
                            (city: any) => city.province === filters.province
                          )
                          ?.districts.map((district: any) => ({
                            value: district.district,
                            label: district.district,
                          })) || []
                      }
                      value={
                        filters.district
                          ? {
                              value: filters.district,
                              label: filters.district,
                            }
                          : null
                      }
                      placeholder="İlçe seçin"
                      isDisabled={!filters.province}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          backgroundColor: !filters.province
                            ? "#f9fafb"
                            : "white",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          district: selectedOption?.value || null,
                          quarter: null,
                        });
                      }}
                    />
                  </div>

                  {/* Mahalle */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mahalle
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={(() => {
                        if (!filters.province || !filters.district) return [];
                        const city = turkeyCities.find(
                          (c: any) => c.province === filters.province
                        );
                        if (!city) return [];
                        const district = city.districts.find(
                          (d: any) => d.district === filters.district
                        );
                        return (
                          district?.quarters?.map((quarter: any) => ({
                            value: quarter,
                            label: quarter,
                          })) || []
                        );
                      })()}
                      value={
                        filters.quarter
                          ? {
                              value: filters.quarter,
                              label: filters.quarter,
                            }
                          : null
                      }
                      placeholder="Mahalle seçin"
                      isDisabled={!filters.province || !filters.district}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          backgroundColor:
                            !filters.province || !filters.district
                              ? "#f9fafb"
                              : "white",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          quarter: selectedOption?.value || null,
                        });
                      }}
                    />
                  </div>

                  {/* İlan Türü */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Tag className="inline mr-2" size={16} />
                      İlan Türü
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={[
                        { value: "", label: "Hepsi", color: "#6b7280" },
                        {
                          value: "Kiralık",
                          label: "Kiralık",
                          color: "#3b82f6",
                        },
                        {
                          value: "Devren Kiralık",
                          label: "Devren Kiralık",
                          color: "#8b5cf6",
                        },
                        {
                          value: "Günlük Kiralık",
                          label: "Günlük Kiralık",
                          color: "#10b981",
                        },
                        {
                          value: "Satılık",
                          label: "Satılık",
                          color: "#ef4444",
                        },
                        {
                          value: "Devren Satılık",
                          label: "Devren Satılık",
                          color: "#f59e0b",
                        },
                      ]}
                      value={
                        filters.type
                          ? {
                              value: filters.type,
                              label: filters.type,
                            }
                          : { value: "", label: "Hepsi" }
                      }
                      placeholder="İlan Türü"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                        option: (base, { data }: any) => ({
                          ...base,
                          color: data.color || "#374151",
                          fontWeight: "500",
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          type: selectedOption?.value || null,
                        });
                      }}
                    />
                  </div>

                  {/* Müşteri */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <User className="inline mr-2" size={16} />
                      Müşteri
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={customers.map((customer: any) => ({
                        value: customer.name + " " + customer.surname,
                        label: (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {customer.name} {customer.surname}
                              </div>
                              <div className="text-xs text-gray-500">
                                {customer.phones[0]?.number}
                              </div>
                            </div>
                          </div>
                        ),
                      }))}
                      value={
                        filters.customer
                          ? {
                              value: filters.customer,
                              label: filters.customer,
                            }
                          : null
                      }
                      placeholder="Müşteri seçin"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                          marginTop: "4px",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          customer: selectedOption?.value || null,
                        });
                      }}
                    />
                  </div>

                  {/* Danışman */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Users className="inline mr-2" size={16} />
                      Danışman
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={advisors.map((advisor: any) => ({
                        value: advisor.name + " " + advisor.surname,
                        label: (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <Users size={14} className="text-purple-600" />
                            </div>
                            <div className="font-medium">
                              {advisor.name} {advisor.surname}
                            </div>
                          </div>
                        ),
                      }))}
                      value={
                        filters.advisor
                          ? {
                              value: filters.advisor,
                              label: filters.advisor,
                            }
                          : null
                      }
                      placeholder="Danışman seçin"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "52px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                          marginTop: "4px",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }),
                      }}
                      onChange={(selectedOption: any) => {
                        setFilters({
                          ...filters,
                          advisor: selectedOption?.value || null,
                        });
                      }}
                    />
                  </div>

                  {/* Fiyat Aralığı */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <DollarSign className="inline mr-2" size={16} />
                      Fiyat Aralığı
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₺
                          </span>
                          <input
                            type="number"
                            placeholder="Minimum Fiyat"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={filters.minFee || ""}
                            onChange={(e) => {
                              setFilters({
                                ...filters,
                                minFee: e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-px bg-gray-300"></div>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₺
                          </span>
                          <input
                            type="number"
                            placeholder="Maksimum Fiyat"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={filters.maxFee || ""}
                            onChange={(e) => {
                              setFilters({
                                ...filters,
                                maxFee: e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kategori Filtreleme */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Building className="inline mr-2" size={16} />
                      Kategori Filtreleme
                    </label>

                    {loadingCategories ? (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">
                          Kategoriler yükleniyor...
                        </span>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        {/* Seçim Yolu */}
                        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={16} className="text-blue-600" />
                            <span className="font-medium text-blue-800">
                              Seçilen Kategori:
                            </span>
                            <div className="flex-1">
                              <span className="text-blue-700">
                                {filters.categoryPath || "Tüm Kategoriler"}
                              </span>
                            </div>
                            {(selectedCategory ||
                              selectedSubcategory ||
                              selectedSubSubcategory) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(null);
                                  setSelectedSubcategory(null);
                                  setSelectedSubSubcategory(null);
                                  setAvailableSubcategories([]);
                                  setAvailableSubSubcategories([]);
                                  setFeatureFilters({});
                                  setFilters((prev: any) => ({
                                    ...prev,
                                    category: null,
                                    subcategory: null,
                                    subsubcategory: null,
                                    categoryPath: null,
                                  }));
                                }}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 size={12} />
                                Temizle
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Kategori Seçim Grid'i */}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Ana Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Ana Kategori
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(null)}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                !selectedCategory
                                  ? "bg-blue-100 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Home size={16} />
                                <span className="font-medium">Tümü</span>
                              </div>
                            </button>
                            {categories.map((category) => (
                              <button
                                key={category._id}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  selectedCategory?._id === category._id
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Building size={16} />
                                    <span className="font-medium">
                                      {category.name}
                                    </span>
                                  </div>
                                  {selectedCategory?._id === category._id && (
                                    <Check
                                      size={16}
                                      className="text-blue-600"
                                    />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Alt Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Alt Kategori
                            </h4>
                            {selectedCategory ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSubcategorySelect(null)}
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    !selectedSubcategory
                                      ? "bg-blue-100 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Layers size={16} />
                                    <span className="font-medium">Tümü</span>
                                  </div>
                                </button>
                                {availableSubcategories.map((subcategory) => (
                                  <button
                                    key={subcategory._id}
                                    type="button"
                                    onClick={() =>
                                      handleSubcategorySelect(subcategory)
                                    }
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                                      selectedSubcategory?._id ===
                                      subcategory._id
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {subcategory.name}
                                      </span>
                                      {selectedSubcategory?._id ===
                                        subcategory._id && (
                                        <Check
                                          size={16}
                                          className="text-blue-600"
                                        />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </>
                            ) : (
                              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                Önce ana kategori seçin
                              </div>
                            )}
                          </div>

                          {/* Alt Alt Kategoriler */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
                              Detay
                            </h4>
                            {selectedSubcategory ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSubSubcategorySelect(null)
                                  }
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    !selectedSubSubcategory
                                      ? "bg-blue-100 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Layers size={16} />
                                    <span className="font-medium">Tümü</span>
                                  </div>
                                </button>
                                {availableSubSubcategories.map(
                                  (subsubcategory) => (
                                    <button
                                      key={subsubcategory._id}
                                      type="button"
                                      onClick={() =>
                                        handleSubSubcategorySelect(
                                          subsubcategory
                                        )
                                      }
                                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        selectedSubSubcategory?._id ===
                                        subsubcategory._id
                                          ? "bg-blue-100 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          {subsubcategory.name}
                                        </span>
                                        {selectedSubSubcategory?._id ===
                                          subsubcategory._id && (
                                          <Check
                                            size={16}
                                            className="text-blue-600"
                                          />
                                        )}
                                      </div>
                                    </button>
                                  )
                                )}
                              </>
                            ) : (
                              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                {selectedCategory
                                  ? "Önce alt kategori seçin"
                                  : "Önce kategori seçin"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Özellik Filtreleri */}
                        {getCurrentFeatures().length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              Özellik Filtreleri
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {getCurrentFeatures().map((feature) => (
                                <div key={feature._id} className="space-y-3">
                                  <FeatureInput
                                    feature={feature}
                                    value={featureFilters[feature._id]}
                                    onChange={(value) =>
                                      handleFeatureFilterChange(
                                        feature._id,
                                        value
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleClean}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                    Tümünü Temizle
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <Filter size={18} />
                        Filtrele (
                        {Object.values(filters).filter(Boolean).length +
                          Object.values(featureFilters).filter(
                            (v) =>
                              v !== null &&
                              v !== undefined &&
                              v !== "" &&
                              (!Array.isArray(v) || v.length > 0) &&
                              (typeof v !== "object" ||
                                v.min !== undefined ||
                                v.max !== undefined)
                          ).length}
                        )
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterAdminAds;
