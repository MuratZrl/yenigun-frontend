"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FeatureValues,
  Category,
  Subcategory,
  Feature,
} from "@/app/types/category";
import { StepState } from "@/app/types/property";
import { ChevronDown } from "lucide-react";
import api from "@/app/lib/api";

interface EditFeaturesTabProps {
  fourthStep: any;
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
  featureValues: FeatureValues;
  setFeatureValues: (values: FeatureValues) => void;
  categories: Category[];
  categoryId: string;
  subcategoryId: string;
}

const FeatureToggle = React.memo(
  ({ label, value, onChange, className = "" }: any) => (
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
  ({ label, value, onChange, options, icon: Icon, className = "" }: any) => {
    return (
      <div className={`relative ${className}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">
            <Icon size={20} />
          </div>
        )}
        <select
          value={value || ""}
          onChange={onChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black appearance-none transition-colors ${
            Icon ? "pl-11" : "pl-4"
          } outline-none cursor-pointer`}
        >
          <option value="">Seçiniz</option>
          {options.map((option: any) => (
            <option
              key={option.value || option}
              value={option.value || option}
              className="text-black"
            >
              {option.label || option}
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

const DynamicFeatureInput = React.memo(({ feature, value, onChange }: any) => {
  const renderInput = () => {
    switch (feature.type) {
      case "boolean":
        return (
          <FeatureToggle
            label={feature.name}
            value={value === true || value === "Evet" ? "Evet" : "Hayır"}
            onChange={(toggleValue: string) => onChange(toggleValue === "Evet")}
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
            value={value || 0}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seçiniz</option>
            {feature.options?.map((option: string) => (
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
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              onChange(selectedOptions);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          >
            {feature.options?.map((option: string) => (
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
            placeholder={feature.placeholder || ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {feature.name}
        {feature.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {feature.description && (
        <p className="text-xs text-gray-500">{feature.description}</p>
      )}
    </div>
  );
});

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

  useEffect(() => {
    const fetchFeaturesFromApi = async () => {
      if (!categoryId || !subcategoryId) return;

      try {
        setIsLoadingFeatures(true);

        const response = await api.get(
          `admin/categories/${categoryId}/subcategories?parentSubcategoryId=${subcategoryId}`
        );

        let features = [];

        if (response.data?.data?.features) {
          features = response.data.data.features;
        } else if (response.data?.features) {
          features = response.data.features;
        } else if (response.data?.data?.[0]?.features) {
          features = response.data.data[0].features;
        }

        setApiFeatures(features);

        if (features.length > 0) {
          const updatedFeatureValues = { ...featureValues };
          features.forEach((feature: Feature) => {
            if (!(feature._id in updatedFeatureValues)) {
              if (feature.type === "boolean")
                updatedFeatureValues[feature._id] = false;
              else if (feature.type === "number")
                updatedFeatureValues[feature._id] = 0;
              else if (feature.type === "multi_select")
                updatedFeatureValues[feature._id] = [];
              else updatedFeatureValues[feature._id] = "";
            }
          });
          setFeatureValues(updatedFeatureValues);
        }
      } catch (error) {
        setFeatureError("Feature'lar yüklenemedi");
      } finally {
        setIsLoadingFeatures(false);
      }
    };

    fetchFeaturesFromApi();
  }, [categoryId, subcategoryId, setFeatureValues]);

  const { selectedCategory, selectedSubcategory } = useMemo(() => {
    const category = categories.find((cat: Category) => cat._id === categoryId);
    const subcategory = category?.subcategories?.find(
      (sub: Subcategory) => sub._id === subcategoryId
    );

    return {
      selectedCategory: category || null,
      selectedSubcategory: subcategory || null,
    };
  }, [categories, categoryId, subcategoryId]);

  const allFeatures = useMemo(() => {
    const features =
      apiFeatures.length > 0
        ? apiFeatures
        : selectedSubcategory?.features || [];

    return features;
  }, [apiFeatures, selectedSubcategory]);

  const handleFeatureChange = (
    featureId: string,
    value: any,
    featureType?: string
  ) => {
    const updatedValues = {
      ...featureValues,
      [featureId]: value,
    };
    setFeatureValues(updatedValues);

    setFeaturesStep({
      ...featuresStep,
      selections: {
        ...featuresStep.selections,
        [featureId]: {
          featureId,
          value: value,
          featureType: featureType || "text",
        },
      },
    });
  };

  const handleFeatureToggleChange =
    (featureId: string, featureType: string) => (value: string) => {
      handleFeatureChange(featureId, value === "Evet", featureType);
    };

  const handleSimpleSelectChange =
    (featureId: string, featureType: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleFeatureChange(featureId, e.target.value, featureType);
    };

  const featureGroups = useMemo(() => {
    if (!allFeatures || allFeatures.length === 0) {
      return {
        booleanFeatures: [],
        selectFeatures: [],
        multiSelectFeatures: [],
        textFeatures: [],
        numberFeatures: [],
        dynamicFeatures: [],
      };
    }

    const groups = {
      booleanFeatures: allFeatures.filter((f: Feature) => f.type === "boolean"),
      selectFeatures: allFeatures.filter(
        (f: Feature) => f.type === "single_select"
      ),
      multiSelectFeatures: allFeatures.filter(
        (f: Feature) => f.type === "multi_select"
      ),
      textFeatures: allFeatures.filter((f: Feature) => f.type === "text"),
      numberFeatures: allFeatures.filter((f: Feature) => f.type === "number"),
      dynamicFeatures: allFeatures,
    };

    return groups;
  }, [allFeatures]);

  const {
    booleanFeatures,
    selectFeatures,
    multiSelectFeatures,
    textFeatures,
    numberFeatures,
    dynamicFeatures,
  } = featureGroups;
  useEffect(() => {}, [
    featureValues,
    selectedCategory,
    selectedSubcategory,
    apiFeatures,
    dynamicFeatures.length,
    featureGroups,
  ]);

  if (isLoadingFeatures) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
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
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {(booleanFeatures.length > 0 ||
        fourthStep.elevator ||
        fourthStep.inSite ||
        fourthStep.balcony ||
        fourthStep.isFurnished) && (
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
                  featureValues[feature._id] === true ||
                  featureValues[feature._id] === "Evet"
                    ? "Evet"
                    : "Hayır"
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
            {selectFeatures.map((feature) => (
              <SimpleSelect
                key={feature._id}
                label={feature.name}
                value={featureValues[feature._id] || ""}
                onChange={handleSimpleSelectChange(feature._id, "select")}
                options={
                  feature.options?.map((opt: string) => ({
                    value: opt,
                    label: opt,
                  })) || []
                }
              />
            ))}
          </div>
        </div>
      )}

      {multiSelectFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Çoklu Seçim Özellikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiSelectFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={featureValues[feature._id] || []}
                onChange={(value: string | number | boolean | string[]) =>
                  handleFeatureChange(feature._id, value, "multi_select")
                }
              />
            ))}
          </div>
        </div>
      )}

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
                value={featureValues[feature._id] || ""}
                onChange={(value: string | number | boolean | string[]) =>
                  handleFeatureChange(feature._id, value, "text")
                }
              />
            ))}
            {numberFeatures.map((feature) => (
              <DynamicFeatureInput
                key={feature._id}
                feature={feature}
                value={featureValues[feature._id] || 0}
                onChange={(value: string | number | boolean | string[]) =>
                  handleFeatureChange(feature._id, value, "number")
                }
              />
            ))}
          </div>
        </div>
      )}

      {dynamicFeatures.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Bu kategori için tanımlanmış özellik bulunamadı.
          <div className="mt-2 text-sm">
            <p>Kategori: {selectedCategory?.name}</p>
            <p>Alt Kategori: {selectedSubcategory?.name}</p>
            <p>Feature Values: {Object.keys(featureValues).length} adet</p>
            <p>API Feature'ları: {apiFeatures.length} adet</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EditFeaturesTab;
