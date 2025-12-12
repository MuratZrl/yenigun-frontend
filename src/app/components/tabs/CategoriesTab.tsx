"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, X } from "lucide-react";
import { StepState, Category, SubCategory } from "@/app/types/property";
import api from "@/app/lib/api";

interface CombinedCategoryTabProps {
  firstStep: StepState;
  setFirstStep: (step: StepState) => void;
  secondStep: StepState;
  setSecondStep: (step: StepState) => void;
  thirdStep: StepState;
  setThirdStep: (step: StepState) => void;
  onNext?: () => void;
}

export default function CombinedCategoryTab({
  firstStep,
  setFirstStep,
  secondStep,
  setSecondStep,
  thirdStep,
  setThirdStep,
  onNext,
}: CombinedCategoryTabProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/categories");
        console.log("API Response:", response.data);

        let categoriesData: Category[] = [];

        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data && Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (response.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (response.data && Array.isArray(response.data.items)) {
          categoriesData = response.data.items;
        } else {
          console.warn("Unexpected API response structure:", response.data);
          setError("Kategoriler beklenen formatta değil");
        }

        const normalizedCategories = categoriesData.map((category) => ({
          ...category,
          value: category.name.toLowerCase().replace(/\s+/g, "-"),
        }));

        setCategories(normalizedCategories);

        if (normalizedCategories.length === 0) {
          setError("Hiç kategori bulunamadı");
        }
      } catch (err) {
        console.error("Kategoriler yüklenirken hata:", err);
        setError("Kategoriler yüklenemedi");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMainCategorySelect = (category: Category) => {
    setFirstStep({
      ...firstStep,
      selected: {
        isSelect: true,
        value: category.name,
        id: category._id,
        name: category.name,
        categoryData: category,
      },
    });

    // Alt kategorileri sıfırla
    setSecondStep({
      ...secondStep,
      selected: {
        isSelect: false,
        value: "",
        id: "",
        subcategoryData: null,
      },
    });

    // Alt-alt kategorileri sıfırla
    setThirdStep({
      ...thirdStep,
      selected: {
        isSelect: false,
        value: "",
        id: "",
        subcategoryData: null,
      },
    });
  };

  const handleSubCategorySelect = (subcategory: SubCategory) => {
    setSecondStep({
      ...secondStep,
      selected: {
        isSelect: true,
        value: subcategory.name,
        id: subcategory._id,
        subcategoryData: subcategory,
      },
    });

    // Alt-alt kategorileri sıfırla
    setThirdStep({
      ...thirdStep,
      selected: {
        isSelect: false,
        value: "",
        id: "",
        subcategoryData: null,
      },
    });
  };

  const handleNestedSubCategorySelect = (nestedSubcategory: SubCategory) => {
    setThirdStep({
      ...thirdStep,
      selected: {
        isSelect: true,
        value: nestedSubcategory.name,
        id: nestedSubcategory._id,
        subcategoryData: nestedSubcategory,
      },
    });

    // Eğer alt-alt kategori seçildiyse ve onNext varsa, tamamla
    if (onNext && thirdStep.selected.isSelect) {
      onNext();
    }
  };

  const handleFinish = () => {
    if (onNext) {
      onNext();
    }
  };

  const clearSelection = (step: "first" | "second" | "third") => {
    if (step === "first") {
      setFirstStep({
        ...firstStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          name: "",
          categoryData: null,
        },
      });
      // Diğer step'leri de sıfırla
      setSecondStep({
        ...secondStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          subcategoryData: null,
        },
      });
      setThirdStep({
        ...thirdStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          subcategoryData: null,
        },
      });
    } else if (step === "second") {
      setSecondStep({
        ...secondStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          subcategoryData: null,
        },
      });
      setThirdStep({
        ...thirdStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          subcategoryData: null,
        },
      });
    } else if (step === "third") {
      setThirdStep({
        ...thirdStep,
        selected: {
          isSelect: false,
          value: "",
          id: "",
          subcategoryData: null,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(firstStep.selected.isSelect ||
        secondStep.selected.isSelect ||
        thirdStep.selected.isSelect) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white  p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Check size={18} className="text-blue-600" />
              Seçilen Kategoriler
            </h4>
            <button
              type="button"
              onClick={() => clearSelection("first")}
              className="text-sm text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <X size={14} />
              Temizle
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {firstStep.selected.isSelect && (
              <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-blue-800">
                  {firstStep.selected.value}
                </span>
                <button
                  type="button"
                  onClick={() => clearSelection("first")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {secondStep.selected.isSelect && (
              <>
                <ArrowRight size={14} className="text-blue-400" />
                <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-800">
                    {secondStep.selected.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => clearSelection("second")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            )}

            {thirdStep.selected.isSelect && (
              <>
                <ArrowRight size={14} className="text-blue-400" />
                <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-800">
                    {thirdStep.selected.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => clearSelection("third")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex gap-6 min-h-[400px]">
        <div className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              Ana Kategoriler
            </h4>
          </div>
          <div className="overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li key={category._id}>
                  <button
                    type="button"
                    onClick={() => handleMainCategorySelect(category)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      firstStep.selected.isSelect &&
                      firstStep.selected.id === category._id
                        ? "bg-blue-50 border-r-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {firstStep.selected.isSelect &&
                        firstStep.selected.id === category._id ? (
                          <Check size={16} className="text-blue-500" />
                        ) : (
                          <span className="text-gray-400"></span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.subcategories?.length || 0} alt kategori
                        </div>
                      </div>
                    </div>
                    {category.subcategories &&
                      category.subcategories.length > 0 && (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {firstStep.selected.isSelect && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                Alt Kategoriler
              </h4>
            </div>
            <div className="overflow-y-auto max-h-[350px]">
              {firstStep.selected.categoryData?.subcategories && (
                <ul className="divide-y divide-gray-100">
                  {firstStep.selected.categoryData.subcategories.map(
                    (subcategory: any) => (
                      <li key={subcategory._id}>
                        <button
                          type="button"
                          onClick={() => handleSubCategorySelect(subcategory)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            secondStep.selected.isSelect &&
                            secondStep.selected.id === subcategory._id
                              ? "bg-blue-50 border-r-4 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              {secondStep.selected.isSelect &&
                              secondStep.selected.id === subcategory._id ? (
                                <Check size={16} className="text-blue-500" />
                              ) : (
                                <span className="text-gray-400"></span>
                              )}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">
                                {subcategory.name}
                              </div>
                              {subcategory.subcategories && (
                                <div className="text-xs text-gray-500">
                                  {subcategory.subcategories.length} detay
                                  kategori
                                </div>
                              )}
                            </div>
                          </div>
                          {subcategory.subcategories &&
                            subcategory.subcategories.length > 0 && (
                              <ChevronRight
                                size={16}
                                className="text-gray-400"
                              />
                            )}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {firstStep.selected.isSelect &&
          secondStep.selected.isSelect &&
          secondStep.selected.subcategoryData?.subcategories &&
          secondStep.selected.subcategoryData.subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-1/4 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  Detay Kategoriler
                </h4>
              </div>
              <div className="overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <ul className="divide-y divide-gray-100">
                  {secondStep.selected.subcategoryData.subcategories.map(
                    (nestedSubcategory: any) => (
                      <li key={nestedSubcategory._id}>
                        <button
                          type="button"
                          onClick={() =>
                            handleNestedSubCategorySelect(nestedSubcategory)
                          }
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                            thirdStep.selected.isSelect &&
                            thirdStep.selected.id === nestedSubcategory._id
                              ? "bg-blue-50 border-r-4 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            {thirdStep.selected.isSelect &&
                            thirdStep.selected.id === nestedSubcategory._id ? (
                              <Check size={16} className="text-blue-500" />
                            ) : (
                              <span className="text-gray-400"></span>
                            )}
                          </div>
                          <div className="font-medium text-gray-900">
                            {nestedSubcategory.name}
                          </div>
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </motion.div>
          )}

        {!firstStep.selected.isSelect && (
          <>
            <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none"></div>
            <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none"></div>
          </>
        )}
        {firstStep.selected.isSelect && !secondStep.selected.isSelect && (
          <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}
