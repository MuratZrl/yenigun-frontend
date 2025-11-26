import React, { useState } from "react";
import {
  Category,
  Subcategory,
  Feature,
  FeatureValues,
} from "@/app/types/category";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";

interface CategorySelectionTabProps {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  featureValues: FeatureValues;
  onCategorySelect: (category: Category) => void;
  onSubcategorySelect: (subcategory: Subcategory) => void;
  onFeatureChange: (featureId: string, value: any) => void;
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
  const [showEmptyState, setShowEmptyState] = useState(false);

  return (
    <div className="space-y-6">
      {/* Ana Kategori Seçimi */}
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

        {categories.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-500" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Henüz kategori bulunmuyor
            </h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              İlanınızı kategorilere ayırmak için önce ana kategori oluşturun.
              Kategoriler ilanlarınızı düzenli şekilde gruplamanıza yardımcı
              olur.
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
            {categories.map((category) => (
              <button
                key={category._id || category._id}
                type="button"
                onClick={() => onCategorySelect(category)}
                className={`p-4 border-2 rounded-lg text-center transition-all group relative ${
                  selectedCategory?._id === category._id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-blue-300 bg-white text-gray-700"
                }`}
              >
                <span className="font-medium text-sm">{category.name}</span>
                {category.subcategories.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {category.subcategories.length}
                  </span>
                )}
              </button>
            ))}

            {/* Yeni Kategori Ekle Butonu */}
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

      {/* Alt Kategori Seçimi */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Alt Kategori
            </h3>
            <Link
              href={`/admin/categories/${selectedCategory._id}?action=create-subcategory`}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Plus size={16} />
              Alt Kategori Ekle
            </Link>
          </div>

          {selectedCategory.subcategories.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-gray-500" />
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">
                "{selectedCategory.name}" için alt kategori bulunmuyor
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Bu kategoriye ait alt kategoriler oluşturarak ilanlarınızı daha
                detaylı sınıflandırabilirsiniz.
              </p>
              <Link
                href={`/admin/categories/${selectedCategory._id}?action=create-subcategory`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <Plus size={16} />
                Alt Kategori Ekle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory._id || subcategory._id}
                  type="button"
                  onClick={() => onSubcategorySelect(subcategory)}
                  className={`p-4 border-2 rounded-lg text-center transition-all group relative ${
                    selectedSubcategory?._id === subcategory._id
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-green-300 bg-white text-gray-700"
                  }`}
                >
                  <span className="font-medium text-sm">
                    {subcategory.name}
                  </span>
                  {subcategory.features.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {subcategory.features.length}
                    </span>
                  )}
                </button>
              ))}

              {/* Yeni Alt Kategori Ekle Butonu */}
              <Link
                href={`/admin/categories/${selectedCategory._id}?action=create-subcategory`}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center transition-all hover:border-green-400 hover:bg-green-50 group"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus size={16} className="text-green-600" />
                </div>
                <span className="font-medium text-sm text-green-700">
                  Yeni Alt Kategori
                </span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Özellikler Formu */}
      {selectedSubcategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Özellikler</h3>
            <Link
              href={`/admin/categories/${selectedCategory?._id}/subcategories/${selectedSubcategory._id}?action=create-feature`}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Plus size={16} />
              Özellik Ekle
            </Link>
          </div>

          {selectedSubcategory.features.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-gray-500" />
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">
                "{selectedSubcategory.name}" için özellik bulunmuyor
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Bu alt kategoriye özel özellikler ekleyerek ilanlarınızı daha
                detaylı tanımlayabilirsiniz.
              </p>
              <Link
                href={`/admin/categories/${selectedCategory?._id}/subcategories/${selectedSubcategory._id}?action=create-feature`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                <Plus size={16} />
                Özellik Ekle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSubcategory.features.map((feature) => (
                <FeatureInput
                  key={feature._id || feature._id}
                  feature={feature}
                  value={featureValues[feature._id]}
                  onChange={(value) => onFeatureChange(feature._id, value)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seçim Özeti */}
      {(selectedCategory ||
        selectedSubcategory ||
        Object.keys(featureValues).length > 0) && (
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
            {Object.keys(featureValues).length > 0 && (
              <p>
                <span className="font-medium">Doldurulan Özellikler:</span>{" "}
                {Object.keys(featureValues).length} adet
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

const FeatureInput: React.FC<FeatureInputProps> = ({
  feature,
  value,
  onChange,
}) => {
  switch (feature.type) {
    case "text":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              feature.example ? `Örn: ${feature.example}` : feature.name
            }
          />
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={feature.example || "Sayı giriniz"}
          />
        </div>
      );

    case "single_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seçiniz</option>
            {feature.options?.map((option, index) => (
              <option key={`${option}-${index}`} value={option}>
                {" "}
                {/* KEY EKLENDİ */}
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {feature.options?.map((option, index) => (
              <label
                key={`${option}-${index}`}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValue = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    onChange(newValue);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
          <span className="font-medium text-gray-700">{feature.name}</span>
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Değer giriniz"
          />
        </div>
      );
  }
};

export default CategorySelectionTab;
