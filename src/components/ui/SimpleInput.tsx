"use client";
import React from "react";

const SimpleInput = React.memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: Icon,
    className = "",
    ...props
  }: any) => {
    return (
      <div className={`relative ${className}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black transition-colors ${
            Icon ? "pl-11" : "pl-4"
          } placeholder-gray-400 outline-none`}
          {...props}
        />
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
      </div>
    );
  }
);

SimpleInput.displayName = "SimpleInput";

export default SimpleInput;
