// src/features/ads/ui/components/filter/FeatureInput.client.tsx
"use client";

import React from "react";
import type { Feature } from "@/types/advert";

export interface FeatureInputProps {
  feature: Feature;
  value: any;
  onChange: (value: any) => void;
}

export const FeatureInput: React.FC<FeatureInputProps> = ({
  feature,
  value,
  onChange,
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

    case "multi_select": {
      const safeValue = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {feature.options?.map((option: string, index: number) => {
              const isSelected = safeValue.includes(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const newValue = isSelected
                      ? safeValue.filter((v: string) => v !== option)
                      : [...safeValue, option];
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
    }

    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={value ?? ""}
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
                value={value?.min ?? ""}
                onChange={(e) =>
                  onChange({
                    ...(value ?? { min: null, max: null }),
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
                value={value?.max ?? ""}
                onChange={(e) =>
                  onChange({
                    ...(value ?? { min: null, max: null }),
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
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
  }
};

export default FeatureInput;
