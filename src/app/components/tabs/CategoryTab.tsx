"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StepState } from "@/app/types/property";

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
  const handleCategorySelect = (item: string) => {
    setThirdStep({
      ...thirdStep,
      selected: { isSelect: true, value: item },
    });

    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 300);
  };

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
        <div className="w-20"></div> {/* Boşluk için */}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {firstStep.selected.value &&
          secondStep.selected.value &&
          thirdStep.selections[
            firstStep.selected.value.toLowerCase().split(" ").join("-")
          ]?.[
            secondStep.selected.value.toLowerCase().split(" ").join("-")
          ]?.map((item: string, index: number) => (
            <motion.button
              key={index}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelect(item)}
              className={`p-4 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                thirdStep.selected.value === item
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
              }`}
            >
              <span className="font-medium text-sm">{item}</span>
            </motion.button>
          ))}
      </div>
    </motion.div>
  );
}
