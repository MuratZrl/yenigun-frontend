
// src/components/tabs/CategoriesTab/CategoriesTab.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

import type { CombinedCategoryTabProps } from "./types";
import { useCategoryTab } from "./useCategoryTab";
import CategoryColumn from "./CategoryColumn";

export default function CombinedCategoryTab({
  firstStep,
  setFirstStep,
  secondStep,
  setSecondStep,
  thirdStep,
  setThirdStep,
  onNext,
}: CombinedCategoryTabProps) {
  const c = useCategoryTab({
    firstStep,
    setFirstStep,
    secondStep,
    setSecondStep,
    thirdStep,
    setThirdStep,
  });

  /* ── Loading ── */
  if (c.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[14px] text-gray-500">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  /* ── Error ── */
  if (c.error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-[14px] text-red-600 text-center">{c.error}</div>
        <button
          type="button"
          onClick={c.loadCategories}
          className="px-4 py-1.5 border border-gray-300 text-[13px] hover:bg-gray-50"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  /* ── Empty ── */
  if (!c.categories.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-[14px] text-gray-700">Kategori bulunamadı.</div>
        <button
          type="button"
          onClick={c.loadCategories}
          className="px-4 py-1.5 border border-gray-300 text-[13px] hover:bg-gray-50"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Adım Adım Kategori Seç</h3>
        {c.firstSelected && (
          <button
            type="button"
            onClick={c.clearAll}
            className="text-[12px] text-blue-700 hover:underline"
          >
            Temizle
          </button>
        )}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="mb-3 flex items-center gap-1 text-[13px]">
        {c.breadcrumb.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}
            <span
              className={
                i === c.breadcrumb.length - 1 && c.breadcrumb.length > 1
                  ? "text-gray-900 font-medium"
                  : "text-blue-700"
              }
            >
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* ── Columns ── */}
      <div className="flex border border-gray-300 bg-white min-h-[320px]">
        {/* Column 1 — Main categories */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          <CategoryColumn
            items={c.categories}
            selectedId={c.firstSelected ? String(c.firstSel?.id ?? "") : ""}
            onSelect={c.handleMainSelect}
          />
        </div>

        {/* Column 2 — Subcategories */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          {c.firstSelected && (
            <CategoryColumn
              items={c.mainSubs}
              selectedId={c.secondSelected ? String(c.secondSel?.id ?? "") : ""}
              onSelect={c.handleSubSelect}
              emptyText="Alt kategori yok"
              showEmpty={c.mainSubs.length === 0}
            />
          )}
        </div>

        {/* Column 3 — Nested subcategories */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          {c.firstSelected && c.secondSelected && (
            <CategoryColumn
              items={c.nestedSubs}
              selectedId={c.thirdSelected ? String(c.thirdSel?.id ?? "") : ""}
              onSelect={c.handleNestedSelect}
              emptyText="Detay kategori yok"
              showEmpty={c.nestedSubs.length === 0}
            />
          )}
        </div>

        {/* Column 4 — Completion status */}
        <div className="w-1/4 flex items-center justify-center p-4">
          {c.isComplete ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                Kategori seçimi
                <br />
                tamamlanmıştır.
              </p>
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-6 py-2 bg-blue-600 text-white text-[14px] font-semibold rounded hover:bg-blue-700 transition-colors"
                >
                  Devam
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-[12px] text-gray-400 leading-relaxed">
              Lütfen kategori seçiminizi
              <br />
              tamamlayın.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
