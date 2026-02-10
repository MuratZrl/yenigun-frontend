// src/components/tabs/ProppertyTypeTabs.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StepState, Category } from "@/types/property";
import api from "@/lib/api";

interface PropertyTypeTabProps {
  firstStep: StepState;
  setFirstStep: (step: StepState) => void;
  onNext?: () => void;
}

// API cevapları bazen {data:[...]}, bazen {data:{data:[...]}} vs geliyor.
// Tek noktadan “array” çıkaralım.
function unwrapArray<T>(payload: any): T[] {
  const maybe =
    payload?.data?.data ??
    payload?.data ??
    payload?.categories ??
    payload?.items ??
    payload;

  return Array.isArray(maybe) ? maybe : [];
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
        setError(null);

        // ❗️Asıl düzeltme: /admin/categories -> /admin/categories
        const res = await api.get("/admin/categories");

        const categoriesData = unwrapArray<Category>(res?.data);

        const normalizedCategories = categoriesData.map((category) => ({
          ...category,
          value: String(category.name ?? "")
            .toLowerCase()
            .replace(/\s+/g, "-"),
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

  const handlePropertySelect = (category: Category) => {
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

    setTimeout(() => {
      onNext?.();
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
              firstStep.selected.id === category._id
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center" />
            <span className="font-medium text-sm">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
