// src/features/admin/emlak-archived-detail/ui/DescriptionSection.tsx

import React from "react";

type Props = {
  thoughts: string;
};

export default function DescriptionSection({ thoughts }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
      <div
        className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: thoughts }}
      />
    </div>
  );
}