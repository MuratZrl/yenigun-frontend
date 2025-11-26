"use client";
import React from "react";

const QuestionToggle = React.memo(
  ({ label, value, onChange, className = "" }: any) => (
    <div
      className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-green-400 transition-colors duration-200 ${className}`}
    >
      <span className="font-medium text-gray-900 text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(value === "Evet" ? "Hayır" : "Evet")}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
          value === "Evet" ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
            value === "Evet" ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);

QuestionToggle.displayName = "QuestionToggle";

export default QuestionToggle;
