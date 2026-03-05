// src/components/tabs/CategoriesTab/CategoryColumn.tsx
"use client";

import React from "react";
import type { NestedSubCategory } from "./types";

interface CategoryColumnProps {
  items: NestedSubCategory[];
  selectedId: string;
  onSelect: (item: NestedSubCategory) => void;
  emptyText?: string;
  showEmpty?: boolean;
}

export default function CategoryColumn({
  items,
  selectedId,
  onSelect,
  emptyText = "Alt kategori yok",
  showEmpty = false,
}: CategoryColumnProps) {
  if (items.length > 0) {
    return (
      <>
        {items.map((item) => {
          const active = selectedId === item._id;
          return (
            <button
              key={item._id}
              type="button"
              onClick={() => onSelect(item)}
              className={[
                "w-full text-left px-3 py-[6px] text-[13px] border-b border-gray-100 transition-colors",
                active
                  ? "bg-[#e8f0fe] font-semibold text-gray-900"
                  : "text-blue-700 hover:bg-gray-50",
              ].join(" ")}
            >
              {item.name}
            </button>
          );
        })}
      </>
    );
  }

  if (showEmpty) {
    return <div className="p-3 text-[12px] text-gray-400">{emptyText}</div>;
  }

  return null;
}
