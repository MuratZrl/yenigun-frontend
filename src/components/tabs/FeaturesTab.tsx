// src/components/tabs/FeaturesTab.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { StepState, Feature, SelectedItem } from "@/types/property";
import FeatureToggle from "@/components/ui/FeatureToggle";
import SimpleSelect from "@/components/ui/SimpleSelect";
import DynamicFeatureInput from "@/components/ui/DynamicFeatureInput";

/* ------------------------------------------------------------------ */
/*  Local types for tree node shapes from the backend                  */
/* ------------------------------------------------------------------ */

interface AttributeNode {
  id?: string;
  _id?: string;
  name?: string;
  type?: string;
  options?: string[];
  order?: number;
}

interface FacilityGroup {
  title?: string;
  features?: string[];
}

interface TreeNode {
  uid?: number | string;
  _id?: string;
  name?: string;
  attributes?: AttributeNode[];
  facilities?: FacilityGroup[];
  children?: TreeNode[];
  subcategories?: TreeNode[];
}

interface SelectOption {
  value: string;
  label: string;
}

interface FeatureSelectionEntry {
  featureId: string;
  value: string | number | boolean | string[];
  featureType: Feature["type"];
}

type FeaturesSelections = Record<string, FeatureSelectionEntry>;

/* ------------------------------------------------------------------ */
/*  props                                                              */
/* ------------------------------------------------------------------ */

interface FeaturesTabProps {
  fourthStep: unknown; // not used in this component but declared in interface
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;

  featuresStep: StepState;
  setFeaturesStep: (step: StepState) => void;

  onElevatorToggle: (value: string) => void;
  onInSiteToggle: (value: string) => void;
  onBalconyToggle: (value: string) => void;
  onIsFurnishedToggle: (value: string) => void;
  onHeatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeedStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWhichSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onZoningStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  heatingOptions: SelectOption[];
  deedStatusOptions: SelectOption[];
  directionOptions: SelectOption[];
  zoningStatusOptions: SelectOption[];
}

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */

const FeatureAccordion = ({
  title,
  isOpen,
  onToggle,
  children,
  subtitle,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  subtitle?: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left active:opacity-90"
      >
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 leading-6 truncate">
            {title}
          </div>
          {subtitle ? (
            <div className="text-xs text-gray-500 mt-1 leading-5">{subtitle}</div>
          ) : null}
        </div>

        <ChevronDown
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          size={18}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="px-4"
        style={{ overflow: "hidden" }}
      >
        <div className="pb-4 pt-2">{children}</div>
      </motion.div>
    </div>
  );
};

const shouldAccordion = (feature: Feature) => (feature.options?.length || 0) >= 6;

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
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

function mapBackendTypeToUiType(t: string | null | undefined): Feature["type"] {
  const up = String(t || "").toUpperCase();
  if (up === "TEXT") return "text";
  if (up === "NUMBER") return "number";
  if (up === "SELECT") return "single_select";
  if (up === "MULTI_SELECT" || up === "MULTISELECT") return "multi_select";
  if (up === "BOOLEAN" || up === "BOOL") return "boolean";
  return "text";
}

function getDefaultFeatureValue(type: Feature["type"]): string | number | string[] {
  switch (type) {
    case "text":
      return "";
    case "number":
      return 0;
    case "boolean":
      return "no";
    case "single_select":
      return "";
    case "multi_select":
      return [];
    default:
      return "";
  }
}

/** Helper to safely read selections from StepState */
function getSelections(step: StepState): FeaturesSelections {
  return (step?.selections ?? {}) as FeaturesSelections;
}

export default function FeaturesTab({
  firstStep,
  secondStep,
  thirdStep,
  featuresStep,
  setFeaturesStep,
}: FeaturesTabProps) {
  const [dynamicFeatures, setDynamicFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedChain = useMemo(() => {
    const c1 = (firstStep?.selected as SelectedItem)?.categoryData ?? null;
    const c2 = (secondStep?.selected as SelectedItem)?.subcategoryData ?? null;
    const c3 = (thirdStep?.selected as SelectedItem)?.subcategoryData ?? null;

    // sıra önemli: root -> leaf
    return [c1, c2, c3].filter(Boolean) as TreeNode[];
  }, [firstStep, secondStep, thirdStep]);

  useEffect(() => {
    const buildFeatures = () => {
      setLoading(true);

      // 1) attributes: id'ye göre dedupe, leaf override etsin diye root->leaf set ediyoruz
      const attrMap = new Map<string, AttributeNode>();
      for (const node of selectedChain) {
        for (const a of safeArr((node as TreeNode)?.attributes)) {
          const key = String(a?.id ?? a?._id ?? "");
          if (!key) continue;
          attrMap.set(key, a);
        }
      }
      const attrs = Array.from(attrMap.values());

      // 2) facilities: title'a göre merge (features union)
      const facMap = new Map<string, Set<string>>();
      for (const node of selectedChain) {
        for (const g of safeArr((node as TreeNode)?.facilities)) {
          const title = String(g?.title ?? "");
          const feats = safeArr(g?.features);
          if (!title || feats.length === 0) continue;

          if (!facMap.has(title)) facMap.set(title, new Set<string>());
          const set = facMap.get(title)!;
          feats.forEach((x) => set.add(String(x)));
        }
      }

      const attrFeatures: Feature[] = attrs
        .map((a) => {
          const _id = String(a?.id ?? a?._id ?? "");
          const name = String(a?.name ?? "");
          if (!_id || !name) return null;

          return {
            _id,
            name,
            type: mapBackendTypeToUiType(a?.type),
            options: safeArr(a?.options),
            required: false,
          } as Feature;
        })
        .filter((f): f is Feature => f !== null);

      const facilityFeatures: Feature[] = Array.from(facMap.entries())
        .map(([title, set]) => {
          const options = Array.from(set.values());
          return {
            _id: `fac_${slugifyTR(title)}`,
            name: title,
            type: "multi_select" as Feature["type"],
            options,
            required: false,
          };
        });

      const merged = [...attrFeatures, ...facilityFeatures];

      setDynamicFeatures(merged);

      const selections: FeaturesSelections = {};
      merged.forEach((feature) => {
        selections[feature._id] = {
          featureId: feature._id,
          value: getDefaultFeatureValue(feature.type),
          featureType: feature.type,
        };
      });

      const initialFeatureState: StepState = {
        selected: { isSelect: false, value: "", featureData: null },
        selections: selections as unknown as Record<string, unknown>,
      };

      setFeaturesStep(initialFeatureState);
      setOpenGroups({});
      setLoading(false);
    };

    if (selectedChain.length > 0) buildFeatures();
    else {
      setDynamicFeatures([]);
      setLoading(false);
    }
  }, [selectedChain, setFeaturesStep]);

  const handleFeatureChange = (
    featureId: string,
    value: string | number | boolean | string[],
    featureType: Feature["type"]
  ) => {
    const currentSelections = getSelections(featuresStep);
    const updatedSelections: FeaturesSelections = {
      ...currentSelections,
      [featureId]: { featureId, value, featureType },
    };

    setFeaturesStep({
      ...featuresStep,
      selections: updatedSelections as unknown as Record<string, unknown>,
    });
  };

  const handleSimpleSelectChange =
    (featureId: string, featureType: Feature["type"]) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleFeatureChange(featureId, e.target.value, featureType);
    };

  const handleFeatureToggleChange =
    (featureId: string, featureType: Feature["type"]) =>
    (value: string) => {
      handleFeatureChange(featureId, value, featureType);
    };

  const selections = getSelections(featuresStep);

  const booleanFeatures = dynamicFeatures.filter((f) => f.type === "boolean");
  const selectFeatures = dynamicFeatures.filter((f) => f.type === "single_select");
  const multiSelectFeatures = dynamicFeatures.filter((f) => f.type === "multi_select");
  const textFeatures = dynamicFeatures.filter((f) => f.type === "text");
  const numberFeatures = dynamicFeatures.filter((f) => f.type === "number");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-lg text-gray-600">Özellikler yükleniyor...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {booleanFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Temel Özellikler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {booleanFeatures.map((feature) => (
              <FeatureToggle
                key={feature._id}
                label={feature.name}
                value={(selections[feature._id]?.value as string) || "no"}
                onChange={handleFeatureToggleChange(feature._id, "boolean")}
              />
            ))}
          </div>
        </div>
      )}

      {selectFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Seçim Özellikleri</h3>
          <div className="columns-1 md:columns-2 gap-4">
            {selectFeatures.map((feature) => {
              const opts = feature.options?.map((opt) => ({ value: opt, label: opt })) || [];
              const selected = (selections[feature._id]?.value as string) || "";

              return (
                <div key={feature._id} className="mb-4 break-inside-avoid">
                  {!shouldAccordion(feature) ? (
                    <SimpleSelect
                      label={feature.name}
                      value={selected}
                      onChange={handleSimpleSelectChange(feature._id, "single_select")}
                      options={opts}
                    />
                  ) : (
                    <FeatureAccordion
                      title={feature.name}
                      subtitle={selected ? `Seçili: ${selected}` : " "}
                      isOpen={!!openGroups[feature._id]}
                      onToggle={() => toggleGroup(feature._id)}
                    >
                      <SimpleSelect
                        label={feature.name}
                        value={selected}
                        onChange={handleSimpleSelectChange(feature._id, "single_select")}
                        options={opts}
                      />
                    </FeatureAccordion>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {multiSelectFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Çoklu Seçim Özellikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiSelectFeatures.map((feature) => {
              const selectedArr =
                (selections[feature._id]?.value as string[]) || [];

              if (!shouldAccordion(feature)) {
                return (
                  <DynamicFeatureInput
                    key={feature._id}
                    feature={feature}
                    value={selectedArr}
                    onChange={(value: string | number | boolean | string[]) => handleFeatureChange(feature._id, value, "multi_select")}
                  />
                );
              }

              return (
                <FeatureAccordion
                  key={feature._id}
                  title={feature.name}
                  subtitle={selectedArr.length > 0 ? `Seçili: ${selectedArr.length}` : " "}
                  isOpen={!!openGroups[feature._id]}
                  onToggle={() => toggleGroup(feature._id)}
                >
                  <DynamicFeatureInput
                    feature={feature}
                    value={selectedArr}
                    onChange={(value: string | number | boolean | string[]) => handleFeatureChange(feature._id, value, "multi_select")}
                  />
                </FeatureAccordion>
              );
            })}
          </div>
        </div>
      )}

      {(textFeatures.length > 0 || numberFeatures.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Diğer Özellikler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={(selections[feature._id]?.value as string) ?? ""}
                onChange={(value: string | number | boolean | string[]) => handleFeatureChange(feature._id, value, "text")}
              />
            ))}

            {numberFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={(selections[feature._id]?.value as number) ?? 0}
                onChange={(value: string | number | boolean | string[]) => handleFeatureChange(feature._id, value, "number")}
              />
            ))}
          </div>
        </div>
      )}

      {dynamicFeatures.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Bu kategori için tanımlanmış özellik bulunamadı.
        </div>
      )}
    </motion.div>
  );
}
