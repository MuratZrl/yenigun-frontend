"use client";
import React from "react";

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

export default FeatureToggle;
