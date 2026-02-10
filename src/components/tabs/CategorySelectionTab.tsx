// src/components/tabs/CategorySelectionTab.tsx
"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";

import type {
  Category,
  Subcategory,
  Feature,
  FeatureValues,
} from "@/types/category";

interface CategorySelectionTabProps {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  featureValues: FeatureValues;

  onCategorySelect: (category: Category) => void;
  onSubcategorySelect: (subcategory: Subcategory) => void;
  onFeatureChange: (featureId: string, value: any) => void;
}

function safeArr<T>(v: T[] | undefined | null): T[] {
  return Array.isArray(v) ? v : [];
}

function toBool(v: any): boolean {
  return v === true || v === "Evet" || v === "true" || v === 1;
}

const CategorySelectionTab: React.FC<CategorySelectionTabProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  featureValues,
  onCategorySelect,
  onSubcategorySelect,
  onFeatureChange,
}) => {
  const cats = useMemo(() => safeArr(categories), [categories]);

  const selectedSubcats = useMemo(
    () => safeArr(selectedCategory?.subcategories),
    [selectedCategory]
  );

  const selectedFeatures = useMemo(
    () => safeArr(selectedSubcategory?.features),
    [selectedSubcategory]
  );

  const filledFeatureCount = useMemo(() => {
    const keys = Object.keys(featureValues ?? {});
    if (!keys.length) return 0;

    // “dolu” saymak için basit filtre: boş string/boş array/null ise sayma
    let count = 0;
    for (const k of keys) {
      const v = (featureValues as any)?.[k];
      if (v === null || typeof v === "undefined") continue;
      if (typeof v === "string" && v.trim() === "") continue;
      if (Array.isArray(v) && v.length === 0) continue;
      count++;
    }
    return count;
  }, [featureValues]);

  return (
    <div className="space-y-6">
      {/* Ana Kategori */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ana Kategori</h3>

          <div className="flex gap-2">
            <Link
              href="/admin/categories"
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Settings size={16} />
              Kategori Yönetimi
            </Link>

            <Link
              href="/admin/categories?action=create"
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Plus size={16} />
              Kategori Ekle
            </Link>
          </div>
        </div>

        {cats.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-500" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Henüz kategori bulunmuyor
            </h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              İlanınızı kategorilere ayırmak için önce ana kategori oluşturun.
              Kategoriler ilanlarınızı düzenli şekilde gruplamanıza yardımcı olur.
            </p>
            <Link
              href="/admin/categories?action=create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-custom-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <Plus size={18} />
              İlk Kategoriyi Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {cats.map((category) => {
              const id = (category as any)?._id ?? (category as any)?.id ?? "";
              const subCount = safeArr(category?.subcategories).length;

              return (
                <button
                  key={id || category.name}
                  type="button"
                  onClick={() => onCategorySelect(category)}
                  className={`p-4 border-2 rounded-lg text-center transition-all group relative ${
                    selectedCategory?._id === (category as any)?._id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-300 bg-white text-gray-700"
                  }`}
                >
                  <span className="font-medium text-sm">{category.name}</span>

                  {subCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {subCount}
                    </span>
                  )}
                </button>
              );
            })}

            <Link
              href="/admin/categories?action=create"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center transition-all hover:border-green-400 hover:bg-green-50 group"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus size={16} className="text-green-600" />
              </div>
              <span className="font-medium text-sm text-green-700">
                Yeni Kategori
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Alt Kategori */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alt Kategori</h3>
          </div>

          {selectedSubcats.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-gray-500" />
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">
                "{selectedCategory.name}" için alt kategori bulunmuyor
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Bu kategoriye ait alt kategoriler oluşturarak ilanlarınızı daha detaylı
                sınıflandırabilirsiniz.
              </p>
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Settings size={16} />
                Yönetim Ekranına Git
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedSubcats.map((subcategory) => {
                const sid = (subcategory as any)?._id ?? (subcategory as any)?.id ?? "";
                const featCount = safeArr(subcategory?.features).length;

                return (
                  <button
                    key={sid || subcategory.name}
                    type="button"
                    onClick={() => onSubcategorySelect(subcategory)}
                    className={`p-4 border-2 rounded-lg text-center transition-all group relative ${
                      selectedSubcategory?._id === (subcategory as any)?._id
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-green-300 bg-white text-gray-700"
                    }`}
                  >
                    <span className="font-medium text-sm">{subcategory.name}</span>

                    {featCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {featCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Özellikler */}
      {selectedSubcategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Özellikler</h3>
          </div>

          {selectedFeatures.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-gray-500" />
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">
                "{selectedSubcategory.name}" için özellik bulunmuyor
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Bu alt kategoriye özel özellikler ekleyerek ilanlarınızı daha detaylı
                tanımlayabilirsiniz.
              </p>
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Settings size={16} />
                Yönetim Ekranına Git
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedFeatures.map((feature) => {
                const fid = (feature as any)?._id ?? (feature as any)?.id ?? "";
                return (
                  <FeatureInput
                    key={fid || feature.name}
                    feature={feature}
                    value={(featureValues as any)?.[fid]}
                    onChange={(v) => onFeatureChange(fid, v)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Özet */}
      {(selectedCategory || selectedSubcategory || filledFeatureCount > 0) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Seçim Özeti:</h4>
          <div className="space-y-1 text-sm text-blue-800">
            {selectedCategory && (
              <p>
                <span className="font-medium">Ana Kategori:</span>{" "}
                {selectedCategory.name}
              </p>
            )}
            {selectedSubcategory && (
              <p>
                <span className="font-medium">Alt Kategori:</span>{" "}
                {selectedSubcategory.name}
              </p>
            )}
            {filledFeatureCount > 0 && (
              <p>
                <span className="font-medium">Doldurulan Özellikler:</span>{" "}
                {filledFeatureCount} adet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface FeatureInputProps {
  feature: Feature;
  value: any;
  onChange: (value: any) => void;
}

const FeatureInput: React.FC<FeatureInputProps> = memo(({ feature, value, onChange }) => {
  const type = (feature as any)?.type;

  if (type === "text") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={(feature as any)?.example ? `Örn: ${(feature as any).example}` : feature.name}
        />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
        <input
          type="number"
          value={typeof value === "number" ? value : value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={(feature as any)?.example ?? "Sayı giriniz"}
          inputMode="numeric"
        />
      </div>
    );
  }

  if (type === "single_select") {
    const options = safeArr((feature as any)?.options);
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Seçiniz</option>
          {options.map((opt: any, idx: number) => {
            const v = String(opt);
            return (
              <option key={`${v}-${idx}`} value={v}>
                {v}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === "multi_select") {
    const options = safeArr((feature as any)?.options).map((x) => String(x));
    const current = Array.isArray(value) ? value.map(String) : [];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {options.map((opt, idx) => {
            const checked = current.includes(opt);
            return (
              <label
                key={`${opt}-${idx}`}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...current, opt]
                      : current.filter((v) => v !== opt);
                    onChange(next);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "boolean") {
    const bool = toBool(value);

    return (
      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
        <span className="font-medium text-gray-700">{feature.name}</span>
        <button
          type="button"
          aria-pressed={bool}
          aria-label={feature.name}
          onClick={() => onChange(!bool)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            bool ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              bool ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  }

  // fallback
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{feature.name}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Değer giriniz"
      />
    </div>
  );
});
FeatureInput.displayName = "FeatureInput";

export default CategorySelectionTab;
