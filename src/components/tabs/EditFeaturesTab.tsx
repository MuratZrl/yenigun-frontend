// src/components/tabs/EditFeaturesTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import api from "@/lib/api";
import type { StepState } from "@/types/property";
import type {
  FeatureValues,
  Category,
  Subcategory,
  Feature,
} from "@/types/category";

interface EditFeaturesTabProps {
  fourthStep: any;

  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;

  featuresStep: StepState;
  setFeaturesStep: React.Dispatch<React.SetStateAction<StepState>>;

  onElevatorToggle: (value: string) => void;
  onInSiteToggle: (value: string) => void;
  onBalconyToggle: (value: string) => void;
  onIsFurnishedToggle: (value: string) => void;

  onHeatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeedStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWhichSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onZoningStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  heatingOptions: any[];
  deedStatusOptions: any[];
  directionOptions: any[];
  zoningStatusOptions: any[];

  featureValues: FeatureValues;
    setFeatureValues: React.Dispatch<React.SetStateAction<FeatureValues>>;

  categories: Category[];
  categoryId: string;
  subcategoryId: string;
}

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

function unwrapFeatures(res: ApiAny): Feature[] {
  const root = res?.data ?? res;

  const direct =
    root?.data?.data?.features ??
    root?.data?.features ??
    root?.features ??
    null;

  if (Array.isArray(direct)) return direct as Feature[];

  // Bazı backendler subcategory objesi döndürür: [{..., features:[...] }]
  const arr = unwrapArray<any>(res);
  const maybe = arr?.[0]?.features;
  return Array.isArray(maybe) ? (maybe as Feature[]) : [];
}

function normalizeOptions(options: any[]) {
  return (options ?? []).map((opt) => {
    if (opt && typeof opt === "object") {
      return { value: opt.value ?? opt.label ?? String(opt), label: opt.label ?? opt.value ?? String(opt) };
    }
    return { value: String(opt), label: String(opt) };
  });
}

const FeatureToggle = React.memo(
  ({
    label,
    value,
    onChange,
    className = "",
  }: {
    label: string;
    value: "Evet" | "Hayır";
    onChange: (v: "Evet" | "Hayır") => void;
    className?: string;
  }) => (
    <div
      className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200 ${className}`}
    >
      <span className="font-medium text-gray-900">{label}</span>
      <button
        type="button"
        onClick={() => onChange(value === "Evet" ? "Hayır" : "Evet")}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          value === "Evet" ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            value === "Evet" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);
FeatureToggle.displayName = "FeatureToggle";

const SimpleSelect = React.memo(
  ({
    label,
    value,
    onChange,
    options,
    className = "",
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    className?: string;
  }) => {
    return (
      <div className={`relative ${className}`}>
        <select
          value={value || ""}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black appearance-none transition-colors outline-none cursor-pointer"
        >
          <option value="">Seçiniz</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    );
  }
);
SimpleSelect.displayName = "SimpleSelect";

const DynamicFeatureInput = React.memo(
  ({
    feature,
    value,
    onChange,
  }: {
    feature: Feature & {
      placeholder?: string;
      min?: number;
      max?: number;
      required?: boolean;
      description?: string;
      options?: string[];
    };
    value: any;
    onChange: (v: any) => void;
  }) => {
    const type = (feature as any)?.type;

    const renderInput = () => {
      switch (type) {
        case "boolean":
          return (
            <FeatureToggle
              label={feature.name}
              value={value === true || value === "Evet" ? "Evet" : "Hayır"}
              onChange={(toggleValue) => onChange(toggleValue === "Evet")}
            />
          );

        case "text":
          return (
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={(feature as any).placeholder || ""}
            />
          );

        case "number":
          return (
            <input
              type="number"
              value={typeof value === "number" ? value : value || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={(feature as any).placeholder || ""}
              min={(feature as any).min}
              max={(feature as any).max}
            />
          );

        case "select":
        case "single_select":
          return (
            <select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Seçiniz</option>
              {(feature.options ?? []).map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );

        case "multi_select":
          return (
            <select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (o) => o.value);
                onChange(selectedOptions);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 bg-white"
            >
              {(feature.options ?? []).map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );

        default:
          return (
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={(feature as any).placeholder || ""}
            />
          );
      }
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {feature.name}
          {(feature as any).required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderInput()}
        {(feature as any).description && (
          <p className="text-xs text-gray-500">{(feature as any).description}</p>
        )}
      </div>
    );
  }
);
DynamicFeatureInput.displayName = "DynamicFeatureInput";

const EditFeaturesTab: React.FC<EditFeaturesTabProps> = ({
  fourthStep,

  featuresStep,
  setFeaturesStep,

  onElevatorToggle,
  onInSiteToggle,
  onBalconyToggle,
  onIsFurnishedToggle,

  onHeatingChange,
  onDeedStatusChange,
  onWhichSideChange,
  onZoningStatusChange,

  heatingOptions,
  deedStatusOptions,
  directionOptions,
  zoningStatusOptions,

  featureValues,
  setFeatureValues,

  categories,
  categoryId,
  subcategoryId,
}) => {
  const [apiFeatures, setApiFeatures] = useState<Feature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [featureError, setFeatureError] = useState<string | null>(null);

  const { selectedCategory, selectedSubcategory } = useMemo(() => {
    const category = categories?.find((cat: any) => cat?._id === categoryId) ?? null;
    const subcategory =
      category?.subcategories?.find((sub: any) => sub?._id === subcategoryId) ?? null;

    return { selectedCategory: category, selectedSubcategory: subcategory };
  }, [categories, categoryId, subcategoryId]);

  const allFeatures = useMemo(() => {
    // API’den geldiyse onu kullan, yoksa props içinden subcategory.features fallback.
    return apiFeatures.length > 0 ? apiFeatures : (selectedSubcategory?.features ?? []);
  }, [apiFeatures, selectedSubcategory]);

  useEffect(() => {
    if (!categoryId || !subcategoryId) return;

    let cancelled = false;

    const fetchFeaturesFromApi = async () => {
      try {
        setIsLoadingFeatures(true);
        setFeatureError(null);

        // ✅ En mantıklı endpoint: subcategory features
        let features: Feature[] = [];
        try {
          const res1 = await api.get(
            `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features`
          );
          features = unwrapArray<Feature>(res1);
          if (!features.length) features = unwrapFeatures(res1);
        } catch (e: any) {
          // 404 vs. durumunda fallback
          const status = e?.response?.status;
          if (status !== 404) throw e;
        }

        // Fallback: senin eski kullandığın yapı (subcategory objesi içinden features çekme)
        if (!features.length) {
          const res2 = await api.get(
            `/admin/categories/${categoryId}/subcategories`,
            { params: { parentSubcategoryId: subcategoryId } }
          );
          features = unwrapFeatures(res2);
        }

        if (cancelled) return;

        setApiFeatures(features);

        // featureValues içinde olmayanlara default değer bas (stale closure yok, functional update)
        if (features?.length) {
          setFeatureValues((prev) => {
            const next: FeatureValues = { ...(prev ?? {}) };
            let changed = false;

            for (const f of features) {
              const id = (f as any)._id;
              if (!id) continue;
              if (Object.prototype.hasOwnProperty.call(next, id)) continue;

              const t = (f as any).type;
              if (t === "boolean") next[id] = false;
              else if (t === "number") next[id] = 0;
              else if (t === "multi_select") next[id] = [];
              else next[id] = "";

              changed = true;
            }

            return changed ? next : prev;
          });
        }
      } catch (e: any) {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 401) setFeatureError("Yetkisiz (401). Token/login sorunu var.");
        else if (status === 404) setFeatureError("Endpoint bulunamadı (404). Route yanlış.");
        else setFeatureError("Feature'lar yüklenemedi");
        setApiFeatures([]);
      } finally {
        if (!cancelled) setIsLoadingFeatures(false);
      }
    };

    fetchFeaturesFromApi();

    return () => {
      cancelled = true;
    };
  }, [categoryId, subcategoryId, setFeatureValues]);

  const handleFeatureChange = useCallback(
    (featureId: string, value: any, featureType?: string) => {
      // FeatureValues güncelle (functional update)
      setFeatureValues((prev) => ({
        ...(prev ?? {}),
        [featureId]: value,
      }));

      // StepState selections güncelle (functional update)
      setFeaturesStep((prev: any) => ({
        ...prev,
        selections: {
          ...(prev?.selections ?? {}),
          [featureId]: {
            featureId,
            value,
            featureType: featureType || "text",
          },
        },
      }));
    },
    [setFeatureValues, setFeaturesStep]
  );

  const featureGroups = useMemo(() => {
    const feats = allFeatures ?? [];
    return {
      booleanFeatures: feats.filter((f: any) => f?.type === "boolean"),
      selectFeatures: feats.filter((f: any) => f?.type === "single_select" || f?.type === "select"),
      multiSelectFeatures: feats.filter((f: any) => f?.type === "multi_select"),
      textFeatures: feats.filter((f: any) => f?.type === "text"),
      numberFeatures: feats.filter((f: any) => f?.type === "number"),
      dynamicFeatures: feats,
    };
  }, [allFeatures]);

  const {
    booleanFeatures,
    selectFeatures,
    multiSelectFeatures,
    textFeatures,
    numberFeatures,
    dynamicFeatures,
  } = featureGroups;

  const heatingOpts = useMemo(() => normalizeOptions(heatingOptions), [heatingOptions]);
  const deedOpts = useMemo(() => normalizeOptions(deedStatusOptions), [deedStatusOptions]);
  const dirOpts = useMemo(() => normalizeOptions(directionOptions), [directionOptions]);
  const zoningOpts = useMemo(() => normalizeOptions(zoningStatusOptions), [zoningStatusOptions]);

  if (isLoadingFeatures) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Özellikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (featureError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Hata</h3>
        <p className="text-red-600">{featureError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {(booleanFeatures.length > 0 ||
        fourthStep?.elevator ||
        fourthStep?.inSite ||
        fourthStep?.balcony ||
        fourthStep?.isFurnished) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Temel Özellikler</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Static toggles (backend feature değil, senin form state’in) */}
            {"elevator" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Asansör"
                value={fourthStep?.elevator === "Evet" ? "Evet" : "Hayır"}
                onChange={onElevatorToggle}
              />
            )}
            {"inSite" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Site İçinde"
                value={fourthStep?.inSite === "Evet" ? "Evet" : "Hayır"}
                onChange={onInSiteToggle}
              />
            )}
            {"balcony" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Balkon"
                value={fourthStep?.balcony === "Evet" ? "Evet" : "Hayır"}
                onChange={onBalconyToggle}
              />
            )}
            {"isFurnished" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Eşyalı"
                value={fourthStep?.isFurnished === "Evet" ? "Evet" : "Hayır"}
                onChange={onIsFurnishedToggle}
              />
            )}

            {/* Dynamic boolean features */}
            {booleanFeatures.map((feature: any) => (
              <FeatureToggle
                key={feature._id}
                label={feature.name}
                value={featureValues?.[feature._id] === true ? "Evet" : "Hayır"}
                onChange={(v) => handleFeatureChange(feature._id, v === "Evet", "boolean")}
              />
            ))}
          </div>
        </div>
      )}

      {(selectFeatures.length > 0 ||
        heatingOpts.length > 0 ||
        deedOpts.length > 0 ||
        dirOpts.length > 0 ||
        zoningOpts.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Seçim Özellikleri</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Static selects */}
            {heatingOpts.length > 0 && (
              <SimpleSelect
                label="Isıtma"
                value={String(fourthStep?.heating ?? "")}
                onChange={onHeatingChange}
                options={heatingOpts}
              />
            )}
            {deedOpts.length > 0 && (
              <SimpleSelect
                label="Tapu Durumu"
                value={String(fourthStep?.deedStatus ?? "")}
                onChange={onDeedStatusChange}
                options={deedOpts}
              />
            )}
            {dirOpts.length > 0 && (
              <SimpleSelect
                label="Cephe"
                value={String(fourthStep?.whichSide ?? "")}
                onChange={onWhichSideChange}
                options={dirOpts}
              />
            )}
            {zoningOpts.length > 0 && (
              <SimpleSelect
                label="İmar Durumu"
                value={String(fourthStep?.zoningStatus ?? "")}
                onChange={onZoningStatusChange}
                options={zoningOpts}
              />
            )}

            {/* Dynamic single selects */}
            {selectFeatures.map((feature: any) => (
              <SimpleSelect
                key={feature._id}
                label={feature.name}
                value={String(featureValues?.[feature._id] ?? "")}
                onChange={(e) => handleFeatureChange(feature._id, e.target.value, "single_select")}
                options={normalizeOptions((feature.options ?? []).map((x: any) => x))}
              />
            ))}
          </div>
        </div>
      )}

      {multiSelectFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Çoklu Seçim Özellikleri</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiSelectFeatures.map((feature: any) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={featureValues?.[feature._id] ?? []}
                onChange={(v) => handleFeatureChange(feature._id, v, "multi_select")}
              />
            ))}
          </div>
        </div>
      )}

      {(textFeatures.length > 0 || numberFeatures.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Diğer Özellikler</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textFeatures.map((feature: any) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={featureValues?.[feature._id] ?? ""}
                onChange={(v) => handleFeatureChange(feature._id, v, "text")}
              />
            ))}

            {numberFeatures.map((feature: any) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={featureValues?.[feature._id] ?? 0}
                onChange={(v) => handleFeatureChange(feature._id, v, "number")}
              />
            ))}
          </div>
        </div>
      )}

      {dynamicFeatures.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Bu kategori için tanımlanmış özellik bulunamadı.
          <div className="mt-2 text-sm">
            <p>Kategori: {selectedCategory?.name ?? "-"}</p>
            <p>Alt Kategori: {selectedSubcategory?.name ?? "-"}</p>
            <p>Feature Values: {Object.keys(featureValues ?? {}).length} adet</p>
            <p>API Feature'ları: {apiFeatures.length} adet</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EditFeaturesTab;
