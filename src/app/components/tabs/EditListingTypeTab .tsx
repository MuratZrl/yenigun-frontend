"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StepState, SubCategory } from "@/app/types/property";

interface ListingTypeTabProps {
  firstStep: StepState;
  secondStep: StepState;
  setSecondStep: (step: StepState) => void;
  onBack: () => void;
  onNext?: () => void;
}

export default function ListingTypeTab({
  firstStep,
  secondStep,
  setSecondStep,
  onBack,
  onNext,
}: ListingTypeTabProps) {
  const getSubcategories = (): SubCategory[] => {
    if (!firstStep.selected.categoryData) {
      return [];
    }

    const subcategories = firstStep.selected.categoryData.subcategories || [];
    return subcategories;
  };

  const handleListingSelect = (subcategory: SubCategory) => {
    setSecondStep({
      ...secondStep,
      selected: {
        isSelect: true,
        value: subcategory.name,
        id: subcategory._id,
        subcategoryData: subcategory,
      },
    });

    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 300);
  };

  const subcategories = getSubcategories();

  const allSubcategories = React.useMemo(() => {
    const categories = [...subcategories];

    if (secondStep.selected.id && secondStep.selected.value) {
      const alreadyExists = categories.some(
        (cat) => cat._id === secondStep.selected.id
      );
      if (!alreadyExists && secondStep.selected.subcategoryData) {
        categories.push(secondStep.selected.subcategoryData);
      }
    }

    return categories;
  }, [subcategories, secondStep]);

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
          {firstStep.selected.value} Türü Seçiniz
        </h3>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {allSubcategories.length > 0 ? (
          allSubcategories.map((subcategory) => (
            <motion.button
              key={subcategory._id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleListingSelect(subcategory)}
              className={`p-4 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                secondStep.selected.id === subcategory._id
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
              }`}
            >
              <span className="font-medium text-sm">{subcategory.name}</span>
              {secondStep.selected.id === subcategory._id && (
                <div className="mt-2 text-blue-500 text-sm">✓ Seçili</div>
              )}
            </motion.button>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            {firstStep.selected.categoryData
              ? "Bu kategori için alt kategori bulunamadı."
              : "Lütfen önce bir emlak türü seçin."}
          </div>
        )}
      </div>

      {secondStep.selected.isSelect && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Şu Anda Seçili:</h4>
          <p className="text-green-700">
            <strong>{secondStep.selected.value}</strong>
          </p>
        </div>
      )}
    </motion.div>
  );
}
