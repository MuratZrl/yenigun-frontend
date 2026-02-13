// src/features/admin/customer-detail/ui/components/StatBox.tsx
"use client";

import React from "react";

type Props = {
  value: number;
  label: string;
  color?: "primary" | "success" | "error";
};

const colorClasses = {
  primary: "bg-blue-100 text-blue-800 border-blue-200",
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
};

export default function StatBox({ value, label, color = "primary" }: Props) {
  return (
    <div className={`text-center p-3 border rounded-lg ${colorClasses[color]}`}>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}