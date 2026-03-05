// src/components/modals/FilterAdminAds/FeatureInput.tsx
"use client";

import React from "react";
import type { Feature, FeatureFilterValue, RangeValue } from "./types";
import { safeArr } from "./utils";

type Props = {
  feature: Feature;
  value: FeatureFilterValue;
  onChange: (value: FeatureFilterValue) => void;
};

export default React.memo(function FeatureInput({
  feature,
  value,
  onChange,
}: Props) {
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
          <label
            htmlFor={`feature-${feature._id}`}
            className="text-sm text-gray-700"
          >
            {feature.name}
          </label>
        </div>
      );
    }

    case "single_select": {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Seciniz</option>
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
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {safeArr(feature.options).map((opt) => {
              const isSelected = arr.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? arr.filter((x) => x !== opt)
                      : [...arr, opt];
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
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
    }

    case "range": {
      const current: RangeValue =
        value && typeof value === "object" && !Array.isArray(value)
          ? {
              min: (value as RangeValue).min ?? null,
              max: (value as RangeValue).max ?? null,
            }
          : { min: null, max: null };

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
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
    }
  }
});
