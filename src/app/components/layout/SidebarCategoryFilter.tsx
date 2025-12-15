"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Home,
  Building,
  MapPin,
  Building2,
  Hotel,
  Briefcase,
  Loader2,
  Trees,
  Key,
  House,
  ChevronRight,
  Grid,
} from "lucide-react";
import api from "@/app/lib/api";

interface ApiCategory {
  _id: string;
  name: string;
  subcategories: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategoryCount: number;
}

const getIconForCategory = (categoryName: string): React.ReactNode => {
  const name = categoryName.toLowerCase();

  if (name.includes("konut") || name.includes("daire") || name.includes("ev")) {
    return <Home className="w-5 h-5" />;
  }
  if (name.includes("arsa")) {
    return <MapPin className="w-5 h-5" />;
  }
  if (name.includes("bina")) {
    return <Building className="w-5 h-5" />;
  }
  if (name.includes("işyeri") || name.includes("isyeri")) {
    return <Briefcase className="w-5 h-5" />;
  }
  if (name.includes("villa")) {
    return <Building2 className="w-5 h-5" />;
  }
  if (name.includes("devremülk") || name.includes("devremulk")) {
    return <Key className="w-5 h-5" />;
  }
  if (name.includes("turistik") || name.includes("otel")) {
    return <Hotel className="w-5 h-5" />;
  }
  if (name.includes("müstakil") || name.includes("mustakil")) {
    return <House className="w-5 h-5" />;
  }
  if (
    name.includes("tarla") ||
    name.includes("bağ") ||
    name.includes("bahçe")
  ) {
    return <Trees className="w-5 h-5" />;
  }

  return <Home className="w-5 h-5" />;
};

interface CategorySidebarProps {
  selectedCategoryId?: string;
}

const CategorySidebar = ({ selectedCategoryId }: CategorySidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await api.get("/admin/categories");

        if (response.data && response.data.success) {
          const fetchedCategories = response.data.data;

          const transformedCategories = fetchedCategories.map(
            (cat: ApiCategory) => ({
              id: cat._id,
              name: cat.name,
              icon: getIconForCategory(cat.name),
              subcategoryCount: cat.subcategories?.length || 0,
            })
          );

          setCategories(transformedCategories);
        } else {
          throw new Error("API yanıtı beklenen formatta değil");
        }
      } catch (err: any) {
        console.error("Kategoriler yüklenirken hata:", err);

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Kategoriler yüklenemedi. Lütfen tekrar deneyin.");
        }

        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    const slug = categoryName
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    router.push(`/kategori/${categoryId}/${slug}`);
  };

  const handleAllCategoriesClick = () => {
    router.push(`/ads`);
  };

  if (loading) {
    return (
      <motion.aside
        initial="hidden"
        animate="visible"
        className="w-full bg-white rounded-2xl shadow-lg p-6 sticky top-6 h-fit"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      className="w-full bg-white rounded-2xl shadow-lg p-6 sticky top-6 h-fit"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Kategoriler
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleAllCategoriesClick}
          className={`w-full flex items-center justify-between p-3 text-left rounded-xl transition-all duration-200 group ${
            !selectedCategoryId
              ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50"
              : "bg-gray-50 hover:bg-gray-100 text-gray-900 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg transition-colors ${
                !selectedCategoryId
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
              }`}
            >
              <Grid className="w-3 h-3" />
            </div>
            <div className="text-left">
              <span className="font-semibold block">Tüm Kategoriler</span>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              !selectedCategoryId ? "text-blue-500" : "text-gray-400"
            }`}
          />
        </button>

        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Henüz kategori bulunmuyor.</p>
          </div>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`w-full flex items-center justify-between p-1.5 text-left rounded-lg transition-all duration-200 group ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500 ring-opacity-50 text-xs"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-900 hover:shadow-sm text-xs"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1 rounded-md transition-colors ${
                      isSelected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block text-xs">
                      {category.name}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    isSelected ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </button>
            );
          })
        )}
      </div>
    </motion.aside>
  );
};

export default CategorySidebar;
