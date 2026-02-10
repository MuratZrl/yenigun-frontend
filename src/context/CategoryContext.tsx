// src/context/CategoryContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "selected-subcategory";

export interface Feature {
  _id: string;
  name: string;
  type: string;
  options?: unknown[];
}

export interface SelectedSubcategory {
  id: string;
  name: string;
  features: Feature[];
  path: string;
  parentCategoryId: string;
  parentCategoryName: string;
}

export interface CategoryContextType {
  selectedSubcategory: SelectedSubcategory | null;
  setSelectedSubcategory: (
    categoryId: string,
    categoryName: string,
    subcategoryId: string,
    subcategoryName: string,
    features: Feature[],
    path?: string
  ) => void;
  clearSelectedSubcategory: () => void;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

function readSelectionFromSession(): SelectedSubcategory | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SelectedSubcategory;

    // Minimal shape guard (bozuk/veri değişmişse patlamasın)
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id || !parsed.parentCategoryId) return null;

    return parsed;
  } catch {
    // Bozuk JSON varsa temizle, sonra null dön
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // sessizce geç
    }
    return null;
  }
}

function writeSelectionToSession(value: SelectedSubcategory | null) {
  if (typeof window === "undefined") return;

  try {
    if (!value) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // sessionStorage dolu / bloklu / saçma bir tarayıcı modu olabilir -> umursama
  }
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedSubcategory, setSelectedSubcategoryState] =
    useState<SelectedSubcategory | null>(() => readSelectionFromSession());

  const setSelectedSubcategory = useCallback(
    (
      categoryId: string,
      categoryName: string,
      subcategoryId: string,
      subcategoryName: string,
      features: Feature[],
      path = ""
    ) => {
      const newSelection: SelectedSubcategory = {
        id: subcategoryId,
        name: subcategoryName,
        features: Array.isArray(features) ? features : [],
        path,
        parentCategoryId: categoryId,
        parentCategoryName: categoryName,
      };

      setSelectedSubcategoryState(newSelection);
      writeSelectionToSession(newSelection);
    },
    []
  );

  const clearSelectedSubcategory = useCallback(() => {
    setSelectedSubcategoryState(null);
    writeSelectionToSession(null);
  }, []);

  const value = useMemo<CategoryContextType>(
    () => ({
      selectedSubcategory,
      setSelectedSubcategory,
      clearSelectedSubcategory,
    }),
    [selectedSubcategory, setSelectedSubcategory, clearSelectedSubcategory]
  );

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return ctx;
}
