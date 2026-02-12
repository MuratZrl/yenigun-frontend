// src/components/modals/FilterAdminAds.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Select from "react-select";

import JSONDATA from "../../app/data.json";
import api from "@/lib/api";

import Advisor from "@/types/advisor";
import Customer from "@/types/customers";

import {
  X,
  Filter,
  Trash2,
  MapPin,
  Tag,
  DollarSign,
  User,
  Users,
  Building,
  Home,
  Check,
  Layers,
} from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

type Id = string;

type FeatureType =
  | "boolean"
  | "text"
  | "number"
  | "single_select"
  | "multi_select"
  | "range"
  | string;

type Feature = {
  _id: Id;
  name: string;
  type: FeatureType;
  options?: string[];
  example?: string;
};

type SubcategoryNode = {
  _id: Id;
  name: string;
  subcategories?: SubcategoryNode[];
  features?: Feature[];
};

type CategoryNode = {
  _id: Id;
  name: string;
  subcategories?: SubcategoryNode[];
};

type FilterState = {
  search?: string | null;
  province?: string | null;
  district?: string | null;
  quarter?: string | null;

  type?: string | null;

  minFee?: number | null;
  maxFee?: number | null;

  advisor?: string | null;
  customer?: string | null;

  category?: string | null;
  subcategory?: string | null;
  subsubcategory?: string | null;
  categoryPath?: string | null;

  [k: string]: any;
};

type RangeValue = { min: number | null; max: number | null };

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  handleFilter?: (...args: any[]) => void;
  handleCleanFilters: () => void;

  page?: number;
  limit?: number;

  onSearchResult?: (data: any) => void;
};

type ApiAny = any;

function unwrapArray<T>(res: ApiAny): T[] {
  const root = res?.data ?? res;
  const maybe =
    root?.data?.data ??
    root?.data ??
    root?.items ??
    root?.categories ??
    root;

  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function normalizeCategoryPath(parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(" > ");
}

function countTruthy(obj: Record<string, any>) {
  return Object.values(obj).filter(Boolean).length;
}

function isMeaningfulFeatureValue(v: any) {
  if (v === undefined || v === null) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    const minOk = v.min !== undefined && v.min !== null;
    const maxOk = v.max !== undefined && v.max !== null;
    return minOk || maxOk;
  }
  // boolean false'ı “filtre yok” kabul ediyoruz (mevcut davranış)
  if (v === false) return false;
  return true;
}

const FeatureInput = React.memo(function FeatureInput({
  feature,
  value,
  onChange,
}: {
  feature: Feature;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (feature.type) {
    case "boolean": {
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`feature-${feature._id}`}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor={`feature-${feature._id}`} className="text-sm text-gray-700">
            {feature.name}
          </label>
        </div>
      );
    }

    case "single_select": {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Seçiniz</option>
            {safeArr(feature.options).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "multi_select": {
      const arr = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
          <div className="flex flex-wrap gap-2">
            {safeArr(feature.options).map((opt) => {
              const isSelected = arr.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const next = isSelected ? arr.filter((x) => x !== opt) : [...arr, opt];
                    onChange(next);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case "number": {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
    }

    case "range": {
      const current: RangeValue =
        value && typeof value === "object"
          ? { min: value.min ?? null, max: value.max ?? null }
          : { min: null, max: null };

      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={current.min ?? ""}
                onChange={(e) =>
                  onChange({
                    ...current,
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
                value={current.max ?? ""}
                onChange={(e) =>
                  onChange({
                    ...current,
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
    }

    default: {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
    }
  }
});

export default function FilterAdminAds({
  open,
  setOpen,
  filters,
  setFilters,
  handleCleanFilters,
  page = 1,
  limit = 25,
  onSearchResult,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryNode | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<SubcategoryNode | null>(null);

  const [featureFilters, setFeatureFilters] = useState<Record<string, any>>({});

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const turkeyCities = useMemo(() => {
    return (JSONDATA as any[]).map((city: any) => {
      return {
        province: city.name,
        districts: (city.towns ?? []).map((town: any) => {
          return {
            district: town.name,
            quarters: (town.districts ?? []).reduce((acc: string[], d: any) => {
              const names = (d.quarters ?? []).map((q: any) => q.name);
              return acc.concat(names);
            }, []),
          };
        }),
      };
    });
  }, []);

  const availableSubcategories = useMemo(
    () => safeArr(selectedCategory?.subcategories),
    [selectedCategory]
  );

  const availableSubSubcategories = useMemo(
    () => safeArr(selectedSubcategory?.subcategories),
    [selectedSubcategory]
  );

  const currentFeatures = useMemo<Feature[]>(() => {
    const fromSubSub = safeArr(selectedSubSubcategory?.features);
    if (fromSubSub.length) return fromSubSub;
    const fromSub = safeArr(selectedSubcategory?.features);
    return fromSub;
  }, [selectedSubcategory, selectedSubSubcategory]);

  const fetchCustomers = useCallback(async () => {
    const res = await api.get("/admin/customers");
    // bazı endpointler {data:{data:[...]}} / bazıları direkt data: [...]
    const items = unwrapArray<Customer>(res);
    setCustomers(items);
  }, []);

  const fetchAdvisors = useCallback(async () => {
    const res = await api.get("/admin/users");
    const items = unwrapArray<Advisor>(res);
    setAdvisors(items);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      // projede başka yerde /admin/categories kullanmışsın; burada da onu tercih etmek daha tutarlı
      const res = await api.get("/admin/categories/tree");
      const items = unwrapArray<CategoryNode>(res);
      setCategories(items);
    } catch (e) {
      console.error("Kategoriler yüklenirken hata:", e);
      toast.error("Kategoriler yüklenemedi");
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
      } catch (e) {
        if (cancelled) return;
        toast.error("Bir hata oluştu.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchAdvisors, fetchCategories, fetchCustomers]);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const initFeatureFiltersFor = useCallback((features: Feature[]) => {
    const next: Record<string, any> = {};
    for (const f of features) {
      if (f.type === "multi_select") next[f._id] = [];
      else if (f.type === "range") next[f._id] = { min: null, max: null };
      // boolean/number/text için default set etmiyoruz, “dokunulmadıysa yok” kalsın
    }
    setFeatureFilters(next);
  }, []);

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
    [setFilters]
  );

  const handleSubcategorySelect = useCallback(
    (sub: SubcategoryNode | null) => {
      setSelectedSubcategory(sub);
      setSelectedSubSubcategory(null);
      setFeatureFilters({});

      if (sub) initFeatureFiltersFor(safeArr(sub.features));

      const path = normalizeCategoryPath([selectedCategory?.name ?? null, sub?.name ?? null]);
      setFilters((prev) => ({
        ...prev,
        subcategory: sub?.name ?? null,
        subsubcategory: null,
        categoryPath: path || (selectedCategory?.name ?? null),
      }));
    },
    [initFeatureFiltersFor, selectedCategory?.name, setFilters]
  );

  const handleSubSubcategorySelect = useCallback(
    (subsub: SubcategoryNode | null) => {
      setSelectedSubSubcategory(subsub);
      setFeatureFilters({});

      if (subsub) initFeatureFiltersFor(safeArr(subsub.features));

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
    [initFeatureFiltersFor, selectedCategory?.name, selectedSubcategory?.name, setFilters]
  );

  const handleFeatureFilterChange = useCallback((featureId: string, value: any) => {
    setFeatureFilters((prev) => ({ ...prev, [featureId]: value }));
  }, []);

  const prepareSearchParams = useCallback(() => {
    const params: Record<string, any> = { page, limit };

    if (filters.search) params.search = filters.search;
    if (filters.province) params.province = filters.province;
    if (filters.district) params.district = filters.district;
    if (filters.quarter) params.quarter = filters.quarter;

    if (filters.type && filters.type !== "Hepsi" && filters.type !== "") params.type = filters.type;

    if (filters.minFee !== null && filters.minFee !== undefined) params.minPrice = filters.minFee;
    if (filters.maxFee !== null && filters.maxFee !== undefined) params.maxPrice = filters.maxFee;

    if (filters.advisor) {
      const adv = advisors.find((a: any) => `${a.name} ${a.surname}` === filters.advisor);
      if (adv) params.advisorUid = (adv as any).uid;
    }

    if (filters.customer) {
      const cust = customers.find((c: any) => `${c.name} ${c.surname}` === filters.customer);
      if (cust) params.customerUid = (cust as any).uid;
    }

    if (filters.categoryPath) {
      const last = filters.categoryPath.split(" > ").pop();
      params.category = last || filters.categoryPath;
    }

    // Feature filtreleri
    for (const feature of currentFeatures) {
      const v = featureFilters[feature._id];
      if (!isMeaningfulFeatureValue(v)) continue;

      // NOT: Backend bu key formatını feature.name ile bekliyorsa aynı bırakıyoruz.
      // Eğer feature.name boşluk/özel karakter içeriyorsa backend tarafı sıkıntılı olabilir.
      const keyBase = `features.${feature.name}`;

      if (Array.isArray(v)) {
        params[keyBase] = v.join(",");
      } else if (typeof v === "object" && v !== null) {
        if (v.min !== undefined && v.min !== null) params[`${keyBase}.min`] = v.min;
        if (v.max !== undefined && v.max !== null) params[`${keyBase}.max`] = v.max;
      } else {
        params[keyBase] = v;
      }
    }

    // temizle
    for (const k of Object.keys(params)) {
      const v = params[k];
      if (v === undefined || v === null) delete params[k];
      else if (typeof v === "string" && v.trim() === "") delete params[k];
    }

    return params;
  }, [advisors, customers, currentFeatures, featureFilters, filters, limit, page]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const params = prepareSearchParams();
        const res = await api.get("/admin/adverts/search", { params });

        const data = res?.data?.data ?? res?.data;
        if (onSearchResult) onSearchResult(data);

        toast.success("Filtreleme başarılı!");
        setOpen(false);
      } catch (err: any) {
        console.error("Filtreleme hatası:", err);
        toast.error(err?.response?.data?.message || "Filtreleme sırasında bir hata oluştu");
      } finally {
        setLoading(false);
      }
    },
    [onSearchResult, prepareSearchParams, setOpen]
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
          const res = await api.get("/admin/adverts/search", { params: { page, limit } });
          onSearchResult(res?.data?.data ?? res?.data);
        } catch {
          toast.error("Sıfırlama sırasında bir hata oluştu");
        }
      }
    },
    [handleCleanFilters, limit, onSearchResult, page, setOpen]
  );

  const activeCount = useMemo(() => {
    const base = countTruthy(filters);
    const feat = Object.values(featureFilters).filter(isMeaningfulFeatureValue).length;
    return base + feat;
  }, [featureFilters, filters]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden"
          style={PoppinsFont.style}
        >
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

          <div className="max-h-[70vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* İl */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline mr-2" size={16} />
                  İl
                </label>
                <Select
                  classNamePrefix="select"
                  options={turkeyCities.map((c: any) => ({ value: c.province, label: c.province }))}
                  value={
                    filters.province ? { value: filters.province, label: filters.province } : null
                  }
                  placeholder="İl seçin"
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
                  }}
                  onChange={(opt: any) => {
                    setFilters((prev) => ({
                      ...prev,
                      province: opt?.value ?? null,
                      district: null,
                      quarter: null,
                    }));
                  }}
                />
              </div>

              {/* İlçe */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">İlçe</label>
                <Select
                  classNamePrefix="select"
                  options={
                    turkeyCities
                      .find((c: any) => c.province === filters.province)
                      ?.districts.map((d: any) => ({ value: d.district, label: d.district })) || []
                  }
                  value={
                    filters.district ? { value: filters.district, label: filters.district } : null
                  }
                  placeholder="İlçe seçin"
                  isDisabled={!filters.province}
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      backgroundColor: !filters.province ? "#f9fafb" : "white",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  onChange={(opt: any) => {
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
                <label className="block text-sm font-semibold text-gray-700">Mahalle</label>
                <Select
                  classNamePrefix="select"
                  options={(() => {
                    if (!filters.province || !filters.district) return [];
                    const city = turkeyCities.find((c: any) => c.province === filters.province);
                    const dist = city?.districts.find((d: any) => d.district === filters.district);
                    return (dist?.quarters ?? []).map((q: any) => ({ value: q, label: q }));
                  })()}
                  value={
                    filters.quarter ? { value: filters.quarter, label: filters.quarter } : null
                  }
                  placeholder="Mahalle seçin"
                  isDisabled={!filters.province || !filters.district}
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      backgroundColor:
                        !filters.province || !filters.district ? "#f9fafb" : "white",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  onChange={(opt: any) => {
                    setFilters((prev) => ({ ...prev, quarter: opt?.value ?? null }));
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
                  classNamePrefix="select"
                  options={[
                    { value: "", label: "Hepsi", color: "#6b7280" },
                    { value: "Kiralık", label: "Kiralık", color: "#3b82f6" },
                    { value: "Devren Kiralık", label: "Devren Kiralık", color: "#8b5cf6" },
                    { value: "Günlük Kiralık", label: "Günlük Kiralık", color: "#10b981" },
                    { value: "Satılık", label: "Satılık", color: "#ef4444" },
                    { value: "Devren Satılık", label: "Devren Satılık", color: "#f59e0b" },
                  ]}
                  value={filters.type ? { value: filters.type, label: filters.type } : { value: "", label: "Hepsi" }}
                  placeholder="İlan Türü"
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    option: (base, { data }: any) => ({ ...base, color: data.color || "#374151", fontWeight: "500" }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  onChange={(opt: any) => {
                    setFilters((prev) => ({ ...prev, type: opt?.value ?? null }));
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
                  classNamePrefix="select"
                  options={customers.map((c: any) => ({
                    value: `${c.name} ${c.surname}`,
                    label: (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{c.name} {c.surname}</div>
                          <div className="text-xs text-gray-500">{c.phones?.[0]?.number}</div>
                        </div>
                      </div>
                    ),
                  }))}
                  value={filters.customer ? { value: filters.customer, label: filters.customer } : null}
                  placeholder="Müşteri seçin"
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      marginTop: "4px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }),
                  }}
                  onChange={(opt: any) => setFilters((prev) => ({ ...prev, customer: opt?.value ?? null }))}
                />
              </div>

              {/* Danışman */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Users className="inline mr-2" size={16} />
                  Danışman
                </label>
                <Select
                  classNamePrefix="select"
                  options={advisors.map((a: any) => ({
                    value: `${a.name} ${a.surname}`,
                    label: (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Users size={14} className="text-purple-600" />
                        </div>
                        <div className="font-medium">{a.name} {a.surname}</div>
                      </div>
                    ),
                  }))}
                  value={filters.advisor ? { value: filters.advisor, label: filters.advisor } : null}
                  placeholder="Danışman seçin"
                  menuPortalTarget={portalTarget ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "52px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      marginTop: "4px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }),
                  }}
                  onChange={(opt: any) => setFilters((prev) => ({ ...prev, advisor: opt?.value ?? null }))}
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
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                      <input
                        type="number"
                        placeholder="Minimum Fiyat"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={filters.minFee ?? ""}
                        onChange={(e) => {
                          const v = e.target.value ? parseInt(e.target.value, 10) : null;
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
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                      <input
                        type="number"
                        placeholder="Maksimum Fiyat"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={filters.maxFee ?? ""}
                        onChange={(e) => {
                          const v = e.target.value ? parseInt(e.target.value, 10) : null;
                          setFilters((prev) => ({ ...prev, maxFee: v }));
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
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
                    <span className="ml-3 text-gray-600">Kategoriler yükleniyor...</span>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-800">Seçilen Kategori:</span>
                        <div className="flex-1">
                          <span className="text-blue-700">{filters.categoryPath || "Tüm Kategoriler"}</span>
                        </div>

                        {(selectedCategory || selectedSubcategory || selectedSubSubcategory) && (
                          <button
                            type="button"
                            onClick={() => {
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
                            }}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Temizle
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Ana Kategoriler */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">Ana Kategori</h4>

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

                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => handleCategorySelect(cat)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedCategory?._id === cat._id
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Building size={16} />
                                <span className="font-medium">{cat.name}</span>
                              </div>
                              {selectedCategory?._id === cat._id && <Check size={16} className="text-blue-600" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Alt Kategoriler */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">Alt Kategori</h4>
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

                            {availableSubcategories.map((sub) => (
                              <button
                                key={sub._id}
                                type="button"
                                onClick={() => handleSubcategorySelect(sub)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  selectedSubcategory?._id === sub._id
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{sub.name}</span>
                                  {selectedSubcategory?._id === sub._id && <Check size={16} className="text-blue-600" />}
                                </div>
                              </button>
                            ))}
                          </>
                        ) : (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">Önce ana kategori seçin</div>
                        )}
                      </div>

                      {/* Detay */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">Detay</h4>
                        {selectedSubcategory ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSubSubcategorySelect(null)}
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

                            {availableSubSubcategories.map((subsub) => (
                              <button
                                key={subsub._id}
                                type="button"
                                onClick={() => handleSubSubcategorySelect(subsub)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  selectedSubSubcategory?._id === subsub._id
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{subsub.name}</span>
                                  {selectedSubSubcategory?._id === subsub._id && (
                                    <Check size={16} className="text-blue-600" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </>
                        ) : (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                            {selectedCategory ? "Önce alt kategori seçin" : "Önce kategori seçin"}
                          </div>
                        )}
                      </div>
                    </div>

                    {currentFeatures.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Özellik Filtreleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentFeatures.map((f) => (
                            <div key={f._id} className="space-y-3">
                              <FeatureInput
                                feature={f}
                                value={featureFilters[f._id]}
                                onChange={(v) => handleFeatureFilterChange(f._id, v)}
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
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Filter size={18} />
                    Filtrele ({activeCount})
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
