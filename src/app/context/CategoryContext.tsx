"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Feature {
  _id: string;
  name: string;
  type: string;
  options?: any[];
}

interface SelectedSubcategory {
  id: string;
  name: string;
  features: Feature[];
  path: string;
  parentCategoryId: string;
  parentCategoryName: string;
}

interface CategoryContextType {
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

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedSubcategory, setSelectedSubcategoryState] =
    useState<SelectedSubcategory | null>(() => {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("selected-subcategory");
        return stored ? JSON.parse(stored) : null;
      }
      return null;
    });

  const setSelectedSubcategory = (
    categoryId: string,
    categoryName: string,
    subcategoryId: string,
    subcategoryName: string,
    features: Feature[],
    path = ""
  ) => {
    const newSelection = {
      id: subcategoryId,
      name: subcategoryName,
      features,
      path,
      parentCategoryId: categoryId,
      parentCategoryName: categoryName,
    };

    setSelectedSubcategoryState(newSelection);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "selected-subcategory",
        JSON.stringify(newSelection)
      );
    }
  };

  const clearSelectedSubcategory = () => {
    setSelectedSubcategoryState(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selected-subcategory");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        selectedSubcategory,
        setSelectedSubcategory,
        clearSelectedSubcategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
}
