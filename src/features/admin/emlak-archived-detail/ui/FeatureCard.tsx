// src/features/admin/emlak-archived-detail/ui/FeatureCard.tsx

import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
};

export default function FeatureCard({ icon, label, value }: Props) {
  const str = value == null ? "" : String(value);
  if (!str || str === "0" || str === "0 m²") return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-blue-600 text-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{str}</p>
      </div>
    </div>
  );
}