// src/app/(public)/category/category-detail/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/layout/Navbar";

interface Subcategory {
  _id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface Category {
  _id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface MainCategory {
  name: string;
  count: number;
  subcategories: {
    name: string;
    count: number;
  }[];
}

export default function CategoriesPage() {
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

  return (
    <>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 pt-6 ">
          Kategoriler
        </h1>

        <div className="mt-12 p-6 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((cat) => (
              <div key={cat._id} className="  p-4  bg-white">
                <h3 className="text-lg font-bold mb-2 border-b border-gray-300">
                  {cat.name}
                </h3>
                <ul className="space-y-1">
                  {cat.subcategories?.map((sub) => (
                    <li key={sub._id} className="font-medium text-blue-900">
                      {sub.name}
                      {sub.subcategories && sub.subcategories.length > 0 && (
                        <ul className="ml-4 mt-1 list-disc text-gray-700">
                          {sub.subcategories.map((s) => (
                            <li key={s._id} className="text-sm">
                              {s.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
