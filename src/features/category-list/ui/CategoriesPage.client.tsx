// src/features/category-list/ui/CategoriesPage.client.tsx
"use client";

import React from "react";
import useCategoryList from "../hooks/useCategoryList";

export default function CategoriesPage() {
  const { data } = useCategoryList();

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 pt-6 ">
        Kategoriler
      </h1>

      <div className="mt-12 p-6 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((cat) => (
            <div key={cat._id} className="  p-4  bg-white">
              <h3 className="text-lg font-bold mb-2 border-b border-gray-300">
                {cat.name}
              </h3>
              <ul className="space-y-1">
                {cat.subcategories?.map((sub) => (
                  <li key={sub._id} className="font-medium text-blue-900">
                    {sub.name}
                    {sub.subcategories && sub.subcategories.length > 0 && (
                      <ul className="ml-4 mt-1 list-disc text-gray-700">
                        {sub.subcategories.map((s) => (
                          <li key={s._id} className="text-sm">
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
