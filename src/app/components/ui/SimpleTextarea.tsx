"use client";
import React from "react";

const SimpleTextarea = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    className = "",
    rows = 4,
    ...props
  }: any) => {
    return (
      <div className={`relative ${className}`}>
        <textarea
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black resize-none transition-colors placeholder-gray-400 outline-none`}
          {...props}
        />
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
      </div>
    );
  }
);

SimpleTextarea.displayName = "SimpleTextarea";

export default SimpleTextarea;
