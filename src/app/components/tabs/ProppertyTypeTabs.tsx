"use client";
import React from "react";
import { motion } from "framer-motion";
import { StepState } from "@/app/types/property";

interface PropertyTypeTabProps {
  firstStep: StepState;
  setFirstStep: (step: StepState) => void;
  onNext?: () => void;
}

export default function PropertyTypeTab({
  firstStep,
  setFirstStep,
  onNext,
}: PropertyTypeTabProps) {
  const handlePropertySelect = (item: any) => {
    setFirstStep({
      ...firstStep,
      selected: { isSelect: true, value: item.value },
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Emlak Türü Seçin
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {firstStep.selections.map((item: any) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePropertySelect(item)}
            className={`p-4 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
              firstStep.selected.value === item.value
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src={item.img}
                alt={item.value}
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="font-medium text-sm">{item.value}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
