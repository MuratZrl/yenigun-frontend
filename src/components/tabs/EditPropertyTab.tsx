// src/components/tabs/EditPropertyTab.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { StepState, Category } from "@/types/property";

interface EditPropertyTabProps {
  firstStep: StepState;
  setFirstStep: (step: StepState) => void;
  onNext?: () => void;
}

type ApiAny = any;

function unwrapArray<T>(res: ApiAny): T[] {
  const root = res?.data ?? res;

  const maybe =
    root?.data?.data ??
    root?.data ??
    root?.categories ??
    root?.items ??
    root;

  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

function slugify(input: string) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export default function EditPropertyTab({
  firstStep,
  setFirstStep,
  onNext,
}: EditPropertyTabProps) {
  const [categories, setCategories] = useState<(Category & { value: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Seçimi sağlam kıyasla: id varsa id, yoksa value/name
  const selectedKey = useMemo(() => {
    const sel: any = (firstStep as any)?.selected ?? {};
    return sel?.id ?? sel?.value ?? sel?.name ?? "";
  }, [firstStep]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Backend’de list endpoint’i var
        const res = await api.get("/admin/categories");

        const items = unwrapArray<Category>(res);

        const normalized = items.map((c: any) => ({
          ...c,
          value: slugify(c?.name),
        }));

        if (cancelled) return;

        setCategories(normalized);

        if (!normalized.length) {
          setError("Hiç kategori bulunamadı");
        }
      } catch (e: any) {
        if (cancelled) return;

        const status = e?.response?.status;
        if (status === 401) setError("Yetkisiz (401). Token/login sorunu var.");
        else if (status === 404) setError("Endpoint bulunamadı (404). Route yanlış.");
        else setError("Kategoriler yüklenemedi");

        setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePropertySelect = (category: Category) => {
    setFirstStep({
      ...firstStep,
      selected: {
        ...(firstStep as any)?.selected,
        isSelect: true,
        value: category.name,
        id: (category as any)._id,
        name: category.name,
        categoryData: category,
      },
    });

    // edit ekranıysa genelde hemen next’e geçmek mantıklı, ama senin UX’in böyle
    onNext?.();
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
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Emlak Türü Seçin
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category: any) => {
          const key = category?._id ?? category?.name;
          const isSelected =
            selectedKey === (category?._id ?? category?.name) ||
            selectedKey === category?.name;

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePropertySelect(category)}
              className={`p-4 border-2 rounded-xl text-center transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:shadow-sm"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>

              <span className="font-medium text-sm">{category.name}</span>

              {isSelected && <div className="mt-2 text-blue-500">✓ Seçili</div>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
