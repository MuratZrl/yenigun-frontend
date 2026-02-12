// src/components/tabs/EditFeaturesTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { StepState } from "@/types/property";
import type {
  FeatureValues,
  Category,
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

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */

function safeArr<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

/** Read .value from a SelectionItem or plain string */
function selVal(x: any): string {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object" && "value" in x) return String(x.value ?? "");
  return String(x);
}

function slugifyTR(input: string) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Backend type → UI type */
function mapType(t: any): string {
  const up = String(t || "").toUpperCase();
  if (up === "TEXT") return "text";
  if (up === "NUMBER") return "number";
  if (up === "SELECT") return "single_select";
  if (up === "MULTI_SELECT" || up === "MULTISELECT") return "multi_select";
  if (up === "BOOLEAN" || up === "BOOL") return "boolean";
  return "text";
}

function findNodeInTree(nodes: any[], id: string | number | undefined): any | null {
  if (!id && id !== 0) return null;
  const strId = String(id);

  for (const node of nodes) {
    const nodeUid = String(node?.uid ?? "");
    const nodeId = String(node?._id ?? "");

    if (nodeUid === strId || nodeId === strId) return node;

    const kids = safeArr<any>(node?.children ?? node?.subcategories);
    if (kids.length) {
      const found = findNodeInTree(kids, id);
      if (found) return found;
    }
  }
  return null;
}

function collectChainToNode(
  nodes: any[],
  targetId: string | number | undefined,
  chain: any[] = []
): any[] | null {
  if (!targetId && targetId !== 0) return null;
  const strId = String(targetId);

  for (const node of nodes) {
    const nodeUid = String(node?.uid ?? "");
    const nodeId = String(node?._id ?? "");

    if (nodeUid === strId || nodeId === strId) {
      return [...chain, node];
    }

    const kids = safeArr<any>(node?.children ?? node?.subcategories);
    if (kids.length) {
      const result = collectChainToNode(kids, targetId, [...chain, node]);
      if (result) return result;
    }
  }
  return null;
}

function normalizeOptions(options: any[]) {
  return (options ?? []).map((opt) => {
    if (opt && typeof opt === "object") {
      return {
        value: opt.value ?? opt.label ?? String(opt),
        label: opt.label ?? opt.value ?? String(opt),
      };
    }
    return { value: String(opt), label: String(opt) };
  });
}

/* ------------------------------------------------------------------ */
/*  sub-components (no React.memo — must re-render on parent change)  */
/* ------------------------------------------------------------------ */

function FeatureToggle({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: "Evet" | "Hayır";
  onChange: (v: "Evet" | "Hayır") => void;
  className?: string;
}) {
  return (
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
  );
}

function SimpleSelect({
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
}) {
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

function DynamicFeatureInput({
  feature,
  value,
  onChange,
}: {
  feature: any;
  value: any;
  onChange: (v: any) => void;
}) {
  const type = feature?.type;

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
            placeholder={feature.placeholder || ""}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={typeof value === "number" ? value : value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={feature.placeholder || ""}
            min={feature.min}
            max={feature.max}
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
          <div className="space-y-2">
            {(feature.options ?? []).map((option: string) => {
              const selected = Array.isArray(value) ? value : [];
              const isChecked = selected.includes(option);
              return (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const next = isChecked
                        ? selected.filter((v: string) => v !== option)
                        : [...selected, option];
                      onChange(next);
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={feature.placeholder || ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {feature.name}
      </label>
      {renderInput()}
      {feature.description && (
        <p className="text-xs text-gray-500">{feature.description}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  main component                                                    */
/* ------------------------------------------------------------------ */

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
  const allFeatures = useMemo(() => {
    if (!categories?.length) return [];

    const targetId = subcategoryId || categoryId;
    if (!targetId) return [];

    const chain = collectChainToNode(categories, targetId);
    if (!chain?.length) {
      const node = findNodeInTree(categories, targetId);
      if (!node) return [];
      return buildFeaturesFromChain([node]);
    }

    return buildFeaturesFromChain(chain);
  }, [categories, categoryId, subcategoryId]);

  useEffect(() => {
    if (!allFeatures.length) return;

    setFeatureValues((prev) => {
      const next: FeatureValues = { ...(prev ?? {}) };
      let changed = false;

      for (const f of allFeatures) {
        const id = f._id;
        if (!id) continue;
        if (Object.prototype.hasOwnProperty.call(next, id)) continue;

        const t = f.type;
        if (t === "boolean") next[id] = false;
        else if (t === "number") next[id] = 0;
        else if (t === "multi_select") next[id] = [];
        else next[id] = "";
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [allFeatures, setFeatureValues]);

  const handleFeatureChange = useCallback(
    (featureId: string, value: any, featureType?: string) => {
      setFeatureValues((prev) => ({
        ...(prev ?? {}),
        [featureId]: value,
      }));

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
      booleanFeatures: feats.filter((f) => f.type === "boolean"),
      selectFeatures: feats.filter((f) => f.type === "single_select" || f.type === "select"),
      multiSelectFeatures: feats.filter((f) => f.type === "multi_select"),
      textFeatures: feats.filter((f) => f.type === "text"),
      numberFeatures: feats.filter((f) => f.type === "number"),
    };
  }, [allFeatures]);

  const {
    booleanFeatures,
    selectFeatures,
    multiSelectFeatures,
    textFeatures,
    numberFeatures,
  } = featureGroups;

  const heatingOpts = useMemo(() => normalizeOptions(heatingOptions), [heatingOptions]);
  const deedOpts = useMemo(() => normalizeOptions(deedStatusOptions), [deedStatusOptions]);
  const dirOpts = useMemo(() => normalizeOptions(directionOptions), [directionOptions]);
  const zoningOpts = useMemo(() => normalizeOptions(zoningStatusOptions), [zoningStatusOptions]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* ---- Temel Özellikler (toggles) ---- */}
      {(booleanFeatures.length > 0 ||
        fourthStep?.elevator ||
        fourthStep?.inSite ||
        fourthStep?.balcony ||
        fourthStep?.isFurnished) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Temel Özellikler</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {"elevator" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Asansör"
                value={selVal(fourthStep?.elevator) === "Evet" ? "Evet" : "Hayır"}
                onChange={onElevatorToggle}
              />
            )}
            {"inSite" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Site İçinde"
                value={selVal(fourthStep?.inSite) === "Evet" ? "Evet" : "Hayır"}
                onChange={onInSiteToggle}
              />
            )}
            {"balcony" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Balkon"
                value={selVal(fourthStep?.balcony) === "Evet" ? "Evet" : "Hayır"}
                onChange={onBalconyToggle}
              />
            )}
            {"isFurnished" in (fourthStep ?? {}) && (
              <FeatureToggle
                label="Eşyalı"
                value={selVal(fourthStep?.isFurnished) === "Evet" ? "Evet" : "Hayır"}
                onChange={onIsFurnishedToggle}
              />
            )}

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

      {/* ---- Seçim Özellikleri (selects) ---- */}
      {(selectFeatures.length > 0 ||
        heatingOpts.length > 0 ||
        deedOpts.length > 0 ||
        dirOpts.length > 0 ||
        zoningOpts.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Seçim Özellikleri</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heatingOpts.length > 0 && (
              <SimpleSelect
                label="Isıtma"
                value={selVal(fourthStep?.heating)}
                onChange={onHeatingChange}
                options={heatingOpts}
              />
            )}
            {deedOpts.length > 0 && (
              <SimpleSelect
                label="Tapu Durumu"
                value={selVal(fourthStep?.deedStatus)}
                onChange={onDeedStatusChange}
                options={deedOpts}
              />
            )}
            {dirOpts.length > 0 && (
              <SimpleSelect
                label="Cephe"
                value={selVal(fourthStep?.whichSide)}
                onChange={onWhichSideChange}
                options={dirOpts}
              />
            )}
            {zoningOpts.length > 0 && (
              <SimpleSelect
                label="İmar Durumu"
                value={selVal(fourthStep?.zoningStatus)}
                onChange={onZoningStatusChange}
                options={zoningOpts}
              />
            )}

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

      {/* ---- Çoklu Seçim ---- */}
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

      {/* ---- Text / Number ---- */}
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

      {allFeatures.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Bu kategori için tanımlanmış özellik bulunamadı.
        </div>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Build Feature[] from a chain of tree nodes                        */
/* ------------------------------------------------------------------ */

function buildFeaturesFromChain(chain: any[]): any[] {
  const attrMap = new Map<string, any>();
  for (const node of chain) {
    for (const a of safeArr<any>(node?.attributes)) {
      const key = String(a?.id ?? a?._id ?? "");
      if (!key) continue;
      attrMap.set(key, a);
    }
  }

  const facMap = new Map<string, Set<string>>();
  for (const node of chain) {
    for (const g of safeArr<any>(node?.facilities)) {
      const title = String(g?.title ?? "");
      const feats = safeArr<string>(g?.features);
      if (!title || feats.length === 0) continue;
      if (!facMap.has(title)) facMap.set(title, new Set<string>());
      const set = facMap.get(title)!;
      feats.forEach((x) => set.add(String(x)));
    }
  }

  const attrFeatures = Array.from(attrMap.values())
    .map((a: any) => {
      const _id = String(a?.id ?? a?._id ?? "");
      const name = String(a?.name ?? "");
      if (!_id || !name) return null;
      return {
        _id,
        name,
        type: mapType(a?.type),
        options: safeArr<string>(a?.options),
        required: false,
        order: typeof a?.order === "number" ? a.order : undefined,
      };
    })
    .filter(Boolean);

  const facilityFeatures = Array.from(facMap.entries()).map(([title, set]) => ({
    _id: `fac_${slugifyTR(title)}`,
    name: title,
    type: "multi_select",
    options: Array.from(set.values()),
    required: false,
  }));

  return [...attrFeatures, ...facilityFeatures].sort((a: any, b: any) => {
    const ao = typeof a?.order === "number" ? a.order : 9999;
    const bo = typeof b?.order === "number" ? b.order : 9999;
    return ao - bo;
  });
}

export default EditFeaturesTab;