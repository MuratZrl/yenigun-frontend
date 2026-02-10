"use client";
import { Feature } from "@/types/property";

interface DynamicFeatureInputProps {
  feature: Feature;
  value: string | number | boolean | string[];
  onChange: (value: string | number | boolean | string[]) => void;
}

export default function DynamicFeatureInput({
  feature,
  value,
  onChange,
}: DynamicFeatureInputProps) {
  const renderInput = () => {
    switch (feature.type) {
      case "text":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {feature.name}
              {feature.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={feature.placeholder || feature.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {feature.name}
              {feature.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={value as number}
                onChange={(e) => onChange(Number(e.target.value))}
                placeholder={feature.placeholder || feature.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {feature.unit && (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {feature.unit}
                </span>
              )}
            </div>
          </div>
        );

      case "single_select":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {feature.name}
              {feature.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              {feature.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "multi_select":
        const currentValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {feature.name}
              {feature.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {feature.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentValues.includes(option)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      onChange(newValue);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderInput();
}
