"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { FormData, StepState, Feature } from "@/app/types/property";
import FeatureToggle from "@/app/components/ui/FeatureToggle";
import SimpleSelect from "@/app/components/ui/SimpleSelect";
import DynamicFeatureInput from "@/app/components/ui/DynamicFeatureInput";

interface FeaturesTabProps {
  fourthStep: FormData;
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
  heatingOptions: any[];
  deedStatusOptions: any[];
  directionOptions: any[];
  zoningStatusOptions: any[];
}

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
        {/* pt-4 KALDIRILDI */}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 leading-6 truncate">
            {title}
          </div>
          {subtitle ? (
            <div className="text-xs text-gray-500 mt-1 leading-5">
              {subtitle}
            </div>
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

const shouldAccordion = (feature: Feature) =>
  (feature.options?.length || 0) >= 6;

export default function FeaturesTab({
  firstStep,
  secondStep,
  thirdStep,
  featuresStep,
  setFeaturesStep,
  heatingOptions,
  deedStatusOptions,
  directionOptions,
  zoningStatusOptions,
}: FeaturesTabProps) {
  const [dynamicFeatures, setDynamicFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);

        let features: Feature[] = [];

        if (thirdStep.selected.subcategoryData?.features) {
          features = thirdStep.selected.subcategoryData.features;
        } else if (secondStep.selected.subcategoryData?.features) {
          features = secondStep.selected.subcategoryData.features;
        } else if (firstStep.selected.categoryData?.features) {
          features = firstStep.selected.categoryData.features;
        }

        console.log("Loaded features:", features);
        setDynamicFeatures(features);

        const initialFeatureState: StepState = {
          selected: {
            isSelect: false,
            value: "",
            featureData: null,
          },
          selections: {},
        };

        features.forEach((feature) => {
          initialFeatureState.selections[feature._id] = {
            featureId: feature._id,
            value: getDefaultFeatureValue(feature.type),
            featureType: feature.type,
          };
        });

        setFeaturesStep(initialFeatureState);

        setOpenGroups({});
      } catch (error) {
        console.error("Feature'lar yüklenirken hata:", error);
        setDynamicFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    if (firstStep.selected.categoryData) {
      fetchFeatures();
    }
  }, [firstStep, secondStep, thirdStep, setFeaturesStep]);

  function getDefaultFeatureValue(
    type: Feature["type"],
  ): string | number | string[] {
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

  const handleFeatureChange = (
    featureId: string,
    value: string | number | boolean | string[],
    featureType: Feature["type"],
  ) => {
    const updatedSelections = {
      ...featuresStep.selections,
      [featureId]: {
        featureId,
        value,
        featureType,
      },
    };

    setFeaturesStep({
      ...featuresStep,
      selections: updatedSelections,
    });
  };

  const handleSimpleSelectChange =
    (featureId: string, featureType: Feature["type"]) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleFeatureChange(featureId, e.target.value, featureType);
    };

  const handleFeatureToggleChange =
    (featureId: string, featureType: Feature["type"]) => (value: string) => {
      handleFeatureChange(featureId, value, featureType);
    };

  const booleanFeatures = dynamicFeatures.filter((f) => f.type === "boolean");
  const selectFeatures = dynamicFeatures.filter(
    (f) => f.type === "single_select",
  );
  const multiSelectFeatures = dynamicFeatures.filter(
    (f) => f.type === "multi_select",
  );
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
      {/* Boolean */}
      {booleanFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Temel Özellikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {booleanFeatures.map((feature) => (
              <FeatureToggle
                key={feature._id}
                label={feature.name}
                value={
                  (featuresStep.selections[feature._id]?.value as string) ||
                  "no"
                }
                onChange={handleFeatureToggleChange(feature._id, "boolean")}
              />
            ))}
          </div>
        </div>
      )}

      {(selectFeatures.length > 0 ||
        heatingOptions.length > 0 ||
        deedStatusOptions.length > 0 ||
        directionOptions.length > 0 ||
        zoningStatusOptions.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Seçim Özellikleri
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectFeatures.map((feature) => {
              const opts =
                feature.options?.map((opt) => ({ value: opt, label: opt })) ||
                [];

              const selected =
                (featuresStep.selections[feature._id]?.value as string) || "";

              if (!shouldAccordion(feature)) {
                return (
                  <SimpleSelect
                    key={feature._id}
                    label={feature.name}
                    value={selected}
                    onChange={handleSimpleSelectChange(
                      feature._id,
                      "single_select",
                    )}
                    options={opts}
                  />
                );
              }

              return (
                <FeatureAccordion
                  key={feature._id}
                  title={feature.name}
                  subtitle={selected ? `Seçili: ${selected}` : ` `}
                  isOpen={!!openGroups[feature._id]}
                  onToggle={() => toggleGroup(feature._id)}
                >
                  <SimpleSelect
                    label={feature.name}
                    value={selected}
                    onChange={handleSimpleSelectChange(
                      feature._id,
                      "single_select",
                    )}
                    options={opts}
                  />
                </FeatureAccordion>
              );
            })}
          </div>
        </div>
      )}

      {/* Multi Select */}
      {multiSelectFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Çoklu Seçim Özellikleri
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiSelectFeatures.map((feature) => {
              const selectedArr =
                (featuresStep.selections[feature._id]?.value as string[]) || [];

              if (!shouldAccordion(feature)) {
                return (
                  <DynamicFeatureInput
                    key={feature._id}
                    feature={feature}
                    value={selectedArr}
                    onChange={(value: string | number | boolean | string[]) =>
                      handleFeatureChange(feature._id, value, "multi_select")
                    }
                  />
                );
              }

              return (
                <FeatureAccordion
                  key={feature._id}
                  title={feature.name}
                  subtitle={
                    selectedArr.length > 0
                      ? `Seçili: ${selectedArr.length}`
                      : ` `
                  }
                  isOpen={!!openGroups[feature._id]}
                  onToggle={() => toggleGroup(feature._id)}
                >
                  <DynamicFeatureInput
                    feature={feature}
                    value={selectedArr}
                    onChange={(value: string | number | boolean | string[]) =>
                      handleFeatureChange(feature._id, value, "multi_select")
                    }
                  />
                </FeatureAccordion>
              );
            })}
          </div>
        </div>
      )}

      {/* Text + Number */}
      {(textFeatures.length > 0 || numberFeatures.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Diğer Özellikler
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={
                  (featuresStep.selections[feature._id]?.value as string) || ""
                }
                onChange={(value: string | number | boolean | string[]) =>
                  handleFeatureChange(feature._id, value, "text")
                }
              />
            ))}

            {numberFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={
                  (featuresStep.selections[feature._id]?.value as number) || 0
                }
                onChange={(value: string | number | boolean | string[]) =>
                  handleFeatureChange(feature._id, value, "number")
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {dynamicFeatures.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Bu kategori için tanımlanmış özellik bulunamadı.
        </div>
      )}
    </motion.div>
  );
}
