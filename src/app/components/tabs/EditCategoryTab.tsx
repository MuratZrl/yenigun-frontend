"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StepState, SubCategory } from "@/app/types/property";

interface CategoryTabProps {
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  setThirdStep: (step: StepState) => void;
  onBack: () => void;
  onNext?: () => void;
}

export default function CategoryTab({
  firstStep,
  secondStep,
  thirdStep,
  setThirdStep,
  onBack,
  onNext,
}: CategoryTabProps) {
  const getNestedSubcategories = (): SubCategory[] => {
    if (!secondStep.selected.subcategoryData) {
      return [];
    }

    const nestedSubcategories =
      secondStep.selected.subcategoryData.subcategories || [];

    return nestedSubcategories;
  };

  const handleCategorySelect = (nestedSubcategory: SubCategory) => {
    setThirdStep({
      ...thirdStep,
      selected: {
        isSelect: true,
        value: nestedSubcategory.name,
        id: nestedSubcategory._id,
        subcategoryData: nestedSubcategory,
      },
    });

    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 300);
  };

  const nestedSubcategories = getNestedSubcategories();

  const allNestedSubcategories = React.useMemo(() => {
    const categories = [...nestedSubcategories];

    if (thirdStep.selected.id && thirdStep.selected.value) {
      const alreadyExists = categories.some(
        (cat) => cat._id === thirdStep.selected.id
      );
      if (!alreadyExists && thirdStep.selected.subcategoryData) {
        categories.push(thirdStep.selected.subcategoryData);
      }
    }

    return categories;
  }, [nestedSubcategories, thirdStep]);

  const shouldSkipToFeatures =
    allNestedSubcategories.length === 0 && secondStep.selected.subcategoryData;

  React.useEffect(() => {
    if (shouldSkipToFeatures && onNext) {
      if (!thirdStep.selected.isSelect) {
        setThirdStep({
          ...thirdStep,
          selected: {
            isSelect: true,
            value: secondStep.selected.value,
            id: secondStep.selected.id,
            subcategoryData: secondStep.selected.subcategoryData,
          },
        });
      }
      setTimeout(() => onNext(), 300);
    }
  }, [shouldSkipToFeatures, onNext, secondStep, thirdStep, setThirdStep]);

  if (shouldSkipToFeatures) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-lg text-gray-600">
          Özelliklere yönlendiriliyor...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Geri</span>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">
          {secondStep.selected.value} Türü Seçiniz
        </h3>
        <div className="w-20"></div>
      </div>

      {secondStep.selected.isSelect && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">Üst Kategori:</h4>
          <p className="text-blue-700 text-sm">
            <strong>{secondStep.selected.value}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {allNestedSubcategories.length > 0 ? (
          allNestedSubcategories.map((nestedSubcategory) => (
            <motion.button
              key={nestedSubcategory._id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelect(nestedSubcategory)}
              className={`p-4 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                thirdStep.selected.id === nestedSubcategory._id
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
              }`}
            >
              <span className="font-medium text-sm">
                {nestedSubcategory.name}
              </span>
              {thirdStep.selected.id === nestedSubcategory._id && (
                <div className="mt-2 text-blue-500 text-sm">✓ Seçili</div>
              )}
            </motion.button>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            {secondStep.selected.subcategoryData
              ? "Bu alt kategori için başka alt kategori bulunamadı."
              : "Lütfen önce bir ilan tipi seçin."}
          </div>
        )}
      </div>

      {thirdStep.selected.isSelect && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Şu Anda Seçili:</h4>
          <p className="text-green-700">
            <strong>{thirdStep.selected.value}</strong>
          </p>
        </div>
      )}
    </motion.div>
  );
}
