// src/features/category-detail/ui/components/DynamicSearch/FeatureFilters.tsx
"use client";

import React from "react";
import type { Feature } from "./types";

interface FeatureFiltersProps {
  features: Feature[];
  onFeatureChange: (
    featureName: string,
    value: string | string[] | boolean | Record<string, string>,
  ) => void;
}

export default function FeatureFilters({
  features,
  onFeatureChange,
}: FeatureFiltersProps) {
  if (features.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-gray-700">
        Di\u011fer \u00d6zellikler
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.slice(0, 4).map((feature: Feature) => (
          <div key={feature._id} className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 truncate">
              {feature.name}
            </label>

            {feature.type === "single_select" ? (
              <select
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                onChange={(e) =>
                  onFeatureChange(feature.name, e.target.value)
                }
              >
                <option value="">Se\u00e7iniz</option>
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
                    (option) => option.value,
                  );
                  onFeatureChange(feature.name, selected);
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
                  onFeatureChange(feature.name, e.target.value)
                }
              />
            ) : feature.type === "text" ? (
              <input
                type="text"
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                onChange={(e) =>
                  onFeatureChange(feature.name, e.target.value)
                }
              />
            ) : feature.type === "boolean" ? (
              <select
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                onChange={(e) =>
                  onFeatureChange(
                    feature.name,
                    e.target.value === "true",
                  )
                }
              >
                <option value="">Se\u00e7iniz</option>
                <option value="true">Var</option>
                <option value="false">Yok</option>
              </select>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
