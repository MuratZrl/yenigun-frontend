"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StepState, Category } from "@/app/types/property";
import api from "@/app/lib/api";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/categories");

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
        setError("Kategoriler yüklenemedi");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePropertySelect = (category: Category) => {
    setFirstStep({
      ...firstStep,
      selected: {
        isSelect: true,
        value: category.name,
        id: category._id,
        categoryData: category,
      },
    });

    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-lg text-gray-600">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-lg text-red-600">{error}</div>
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Emlak Türü Seçin
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category._id}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePropertySelect(category)}
            className={`p-4 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
              firstStep.selected.value === category.name
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <span className="font-medium text-sm">{category.name}</span>
            {firstStep.selected.value === category.name && (
              <div className="mt-2 text-blue-500">✓ Seçili</div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
