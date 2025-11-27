"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderOpen, ChevronRight, Layers, Info } from "lucide-react";
import { useCookies } from "react-cookie";

interface FeatureValue {
  featureId: string;
  value: any;
}

interface Feature {
  _id: string;
  name: string;
  type: string;
  options: any[];
}

interface Subcategory {
  _id: string;
  name: string;
  features: Feature[];
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Props {
  categoryId?: string | null;
  subcategoryId?: string | null;
  featureValues?: FeatureValue[];
}

const PremiumCategorySection: React.FC<Props> = ({
  categoryId,
  subcategoryId,
  featureValues,
}) => {
  const [cookies] = useCookies(["token"]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cookies.token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/categories`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .finally(() => setLoading(false));
  }, [cookies.token]);

  const getCategoryName = (id: string) =>
    categories.find((c) => c._id === id)?.name || id;

  const getSubcategoryName = (catId: string, subId: string) =>
    categories
      .find((c) => c._id === catId)
      ?.subcategories?.find((s) => s._id === subId)?.name || subId;

  const getFeatureName = (catId: string, subId: string, featureId: string) =>
    categories
      .find((c) => c._id === catId)
      ?.subcategories?.find((s) => s._id === subId)
      ?.features?.find((f) => f._id === featureId)?.name || featureId;

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "boolean") return value ? "Evet" : "Hayır";
    if (Array.isArray(value)) return value.length ? value.join(", ") : null;
    return String(value);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-100 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const validFeatures =
    featureValues?.filter((feat) => {
      const formattedValue = formatValue(feat.value);
      return (
        formattedValue &&
        formattedValue !== "null" &&
        formattedValue !== "undefined"
      );
    }) || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-gray-900">İlan Detayları</h3>

        {/* Category Breadcrumb */}
        {categoryId && subcategoryId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{getCategoryName(categoryId)}</span>
            </div>

            <ChevronRight className="w-4 h-4" />

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>{getSubcategoryName(categoryId, subcategoryId)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      {validFeatures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {validFeatures.map((feat) => {
            const featureName = getFeatureName(
              categoryId!,
              subcategoryId!,
              feat.featureId
            );

            const formattedValue = formatValue(feat.value);

            return (
              <div
                key={feat.featureId}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow duration-200"
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {featureName}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {formattedValue}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Info className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">Özellik bilgisi bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default PremiumCategorySection;
