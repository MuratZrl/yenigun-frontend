"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronRight,
  Home,
  Key,
  Hotel,
  Building2,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";

interface ApiSubcategory {
  _id: string;
  name: string;
  features: any[];
  subcategories?: ApiSubcategory[];
}

interface SubCategorySidebarProps {
  categoryId: string;
  categoryName: string;
  categoryData?: any;
  selectedSubcategoryId?: string;
  onSubcategorySelect?: (
    subcategoryId: string,
    subcategoryName: string
  ) => void;
  onBack?: () => void;
}

const SubCategorySidebar = ({
  categoryId,
  categoryName,
  categoryData,
  selectedSubcategoryId,
  onSubcategorySelect,
  onBack,
}: SubCategorySidebarProps) => {
  const [subcategories, setSubcategories] = useState<ApiSubcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Record<string, boolean>
  >({});

  const getSubcategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("satılık")) return <Home className="w-4 h-4" />;
    if (lowerName.includes("kiralık")) return <Key className="w-4 h-4" />;
    if (lowerName.includes("günlük")) return <Hotel className="w-4 h-4" />;
    if (lowerName.includes("devren")) return <Building2 className="w-4 h-4" />;

    return <ChevronRight className="w-4 h-4" />;
  };

  useEffect(() => {
    if (!categoryId || !categoryData) {
      setSubcategories([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (categoryData && categoryData.subcategories) {
        setSubcategories(categoryData.subcategories);
      } else {
        setSubcategories([]);
      }
    } catch (err: any) {
      console.error("Alt kategoriler yüklenirken hata:", err);
      setError("Alt kategoriler yüklenemedi");
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryData]);

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId],
    }));
  };

  const handleSubcategorySelect = (
    subcategoryId: string,
    subcategoryName: string
  ) => {
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategoryId, subcategoryName);
    }
  };

  const handleClearSelection = () => {
    if (onSubcategorySelect) {
      onSubcategorySelect("", "");
    }
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <motion.aside
        initial="hidden"
        animate="visible"
        className="w-full bg-white rounded-2xl shadow-lg p-6 sticky top-6 h-fit"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Alt kategoriler yükleniyor...</p>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      className="w-full bg-white rounded-2xl shadow-lg p-6 sticky top-6 h-fit"
    >
      {/* Başlık ve Geri Butonu */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Kategorilere Dön</span>
            </button>
          )}

          {selectedSubcategoryId && (
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <X className="w-3 h-3" />
              <span>Seçimi Temizle</span>
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          {categoryName}
        </h2>
        <p className="text-sm text-gray-600">
          {subcategories.length} alt kategori
        </p>
      </div>

      {error ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : subcategories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Bu kategoride alt kategori bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {subcategories.map((subcategory) => {
            const isExpanded = expandedSubcategories[subcategory._id];
            const isSelected = selectedSubcategoryId === subcategory._id;
            const hasNested =
              subcategory.subcategories && subcategory.subcategories.length > 0;

            return (
              <div key={subcategory._id} className="space-y-1">
                {/* Ana Alt Kategori */}
                <div className="flex flex-col">
                  <button
                    onClick={() =>
                      handleSubcategorySelect(subcategory._id, subcategory.name)
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded ${
                          isSelected ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        {getSubcategoryIcon(subcategory.name)}
                      </div>
                      <span className="font-medium">{subcategory.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                      {hasNested && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  </button>

                  {/* İç içe alt kategoriler */}
                  {isExpanded && hasNested && subcategory.subcategories && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-1 space-y-1"
                    >
                      {subcategory.subcategories.map((nested) => {
                        const isNestedSelected =
                          selectedSubcategoryId === nested._id;

                        return (
                          <button
                            key={nested._id}
                            onClick={() =>
                              handleSubcategorySelect(
                                nested._id,
                                `${subcategory.name} - ${nested.name}`
                              )
                            }
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                              isNestedSelected
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              {nested.name}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* İç içe alt kategoriler için toggle butonu */}
                {hasNested && (
                  <button
                    onClick={() => toggleSubcategory(subcategory._id)}
                    className="text-xs text-blue-600 hover:text-blue-800 ml-12 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    {isExpanded ? "Daha az göster" : "Alt kategorileri göster"}
                    <ChevronRight
                      className={`w-3 h-3 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Alt Kategori İstatistikleri */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">
          Alt Kategori Bilgisi
        </h3>
        <p className="text-2xl font-bold text-blue-700">
          {subcategories.length}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {subcategories.reduce(
            (acc, subcat) => acc + (subcat.subcategories?.length || 0),
            0
          )}{" "}
          iç içe alt kategori
        </p>
      </div>

      {/* Tüm Alt Kategorileri Seç */}
      <div className="mt-6">
        <button
          onClick={() =>
            onSubcategorySelect &&
            onSubcategorySelect("", "Tüm Alt Kategoriler")
          }
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedSubcategoryId === ""
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tüm Alt Kategoriler
        </button>
      </div>
    </motion.aside>
  );
};

export default SubCategorySidebar;
