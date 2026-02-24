"use client";
import React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  label?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: (SelectOption | string)[];
  icon?: LucideIcon;
  className?: string;
}

const SimpleSelect = React.memo(
  ({ label, value, onChange, options, icon: Icon, className = "" }: SimpleSelectProps) => {
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
          {options.map((option) => {
            const optValue = typeof option === "string" ? option : option.value;
            const optLabel = typeof option === "string" ? option : option.label;
            return (
            <option
              key={optValue}
              value={optValue}
              className="text-black"
            >
              {optLabel}
            </option>
            );
          })}
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

export default SimpleSelect;
