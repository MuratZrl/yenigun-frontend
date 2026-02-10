"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

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

export default SimpleSelect;
