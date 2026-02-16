// src/features/category-list/hooks/useCategoryList.ts
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category, MainCategory } from "../types";

export default function useCategoryList() {
  const [data, setData] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);

  useEffect(() => {
    api.get("/admin/categories").then((res) => {
      const categories: Category[] = res.data.data || [];
      setData(categories);
      transformCategories(categories);
    });
  }, []);

  const transformCategories = (categories: Category[]) => {
    const transformed: MainCategory[] = [];

    const satilikCategories: { name: string; count: number }[] = [];

    categories.forEach((cat) => {
      if (cat.subcategories) {
        cat.subcategories.forEach((sub) => {
          if (sub.name.toUpperCase() === "SATILIK" || sub.name === "Satılık") {
            satilikCategories.push({
              name: cat.name,
              count: 0,
            });

            if (sub.subcategories && sub.subcategories.length > 0) {
              sub.subcategories.forEach((subSub) => {
                satilikCategories.push({
                  name: subSub.name,
                  count: 0,
                });
              });
            }
          }
        });
      }
    });

    const kiralikCategories: { name: string; count: number }[] = [];

    categories.forEach((cat) => {
      if (cat.subcategories) {
        cat.subcategories.forEach((sub) => {
          if (sub.name.toUpperCase() === "KİRALIK" || sub.name === "Kiralık") {
            kiralikCategories.push({
              name: cat.name,
              count: 0,
            });

            if (sub.subcategories && sub.subcategories.length > 0) {
              sub.subcategories.forEach((subSub) => {
                kiralikCategories.push({
                  name: subSub.name,
                  count: 0,
                });
              });
            }
          }
        });
      }
    });

    const gunlukKiralikCategories: { name: string; count: number }[] = [];

    categories.forEach((cat) => {
      if (cat.name === "Konut" && cat.subcategories) {
        cat.subcategories.forEach((sub) => {
          if (sub.name === "Günlük Kiralık") {
            gunlukKiralikCategories.push({
              name: "Daire",
              count: 0,
            });

            if (sub.subcategories && sub.subcategories.length > 0) {
              sub.subcategories.forEach((subSub) => {
                gunlukKiralikCategories.push({
                  name: subSub.name,
                  count: 0,
                });
              });
            }
          }
        });
      }
    });

    transformed.push({
      name: "Satılık",
      count: 650257,
      subcategories: satilikCategories,
    });

    transformed.push({
      name: "Kiralık",
      count: 209664,
      subcategories: kiralikCategories,
    });

    transformed.push({
      name: "Turistik Günlük Kiralık",
      count: 2597,
      subcategories: gunlukKiralikCategories,
    });

    setMainCategories(transformed);
  };

  return { data, mainCategories };
}
