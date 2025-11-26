"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  List,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/app/lib/api";
import AdminSidebar from "@/app/components/layout/AdminSidebar";
import CategoryModal from "@/app/components/modals/CategoryModal";
import SubcategoryModal from "@/app/components/modals/SubCategoryModal";
import FeatureModal from "@/app/components/modals/FeatureModal";
import DeleteModal from "@/app/components/modals/CategoryDeleteModal";
import AdminLayout from "@/app/components/layout/AdminLayout";

const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-gray-50">
    <AdminSidebar />
    <div className="flex-1 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Kategoriler Yükleniyor
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600"
        >
          Kategori verileri hazırlanıyor...
        </motion.p>
      </motion.div>
    </div>
  </div>
);

const EmptyState = ({ onAddCategory }: { onAddCategory: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Folder size={48} className="text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      Henüz kategori bulunmuyor
    </h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
      İlanlarınızı düzenlemek için kategoriler oluşturun. Kategoriler altında
      alt kategoriler ve özellikler ekleyebilirsiniz.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAddCategory}
      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
    >
      <Plus size={24} />
      İlk Kategoriyi Oluştur
    </motion.button>
  </motion.div>
);

const CategoryCard = ({
  category,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddSubcategory,
  expandedSubcategories,
  onToggleSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
}: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    {/* Category Header */}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(category._id)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
          >
            {isExpanded ? (
              <ChevronDown size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </motion.button>

          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
            <Folder size={24} className="text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {category.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{category.subcategories?.length || 0} alt kategori</span>
              <span>•</span>
              <span>
                {category.subcategories?.reduce(
                  (total: number, sub: any) =>
                    total + (sub.features?.length || 0),
                  0
                ) || 0}{" "}
                özellik
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddSubcategory(category._id)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md"
          >
            <Plus size={18} />
            Alt Kategori
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(category)}
            className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete("category", category._id, category.name)}
            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </div>

    {/* Subcategories */}
    <AnimatePresence>
      {isExpanded &&
        category.subcategories &&
        category.subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-4">
              {category.subcategories.map((subcategory: any) => (
                <SubcategoryCard
                  key={subcategory._id}
                  subcategory={subcategory}
                  categoryId={category._id}
                  isExpanded={expandedSubcategories.has(subcategory._id)}
                  onToggle={() => onToggleSubcategory(subcategory._id)}
                  onEdit={() => onEditSubcategory(category._id, subcategory)}
                  onDelete={() =>
                    onDeleteSubcategory(
                      category._id,
                      subcategory._id,
                      subcategory.name
                    )
                  }
                  onAddFeature={() =>
                    onAddFeature(category._id, subcategory._id)
                  }
                  onEditFeature={onEditFeature}
                  onDeleteFeature={onDeleteFeature}
                />
              ))}
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  </motion.div>
);

const SubcategoryCard = ({
  subcategory,
  categoryId,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
}: any) => (
  <motion.div
    layout
    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
  >
    {/* Subcategory Header */}
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="p-1 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
          >
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </motion.button>

          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
            <FolderOpen size={18} className="text-white" />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {subcategory.name}
            </h4>
            <p className="text-sm text-gray-500">
              {subcategory.features?.length || 0} özellik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddFeature}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Özellik
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </div>

    {/* Features */}
    <AnimatePresence>
      {isExpanded &&
        subcategory.features &&
        subcategory.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-2">
              {subcategory.features.map((feature: any) => (
                <FeatureItem
                  key={feature._id}
                  feature={feature}
                  categoryId={categoryId}
                  subcategoryId={subcategory._id}
                  onEdit={() =>
                    onEditFeature(categoryId, subcategory._id, feature)
                  }
                  onDelete={() =>
                    onDeleteFeature(
                      categoryId,
                      subcategory._id,
                      feature._id,
                      feature.name
                    )
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  </motion.div>
);

const FeatureItem = ({ feature, onEdit, onDelete }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center shadow-sm">
        <List size={16} className="text-white" />
      </div>
      <div>
        <span className="font-medium text-gray-900 text-sm">
          {feature.name}
        </span>
        <span className="ml-3 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
          {feature.type}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onEdit}
        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
      >
        <Edit2 size={14} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
      </motion.button>
    </div>
  </motion.div>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Set<string>
  >(new Set());

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    category: null as any,
  });
  const [subcategoryModal, setSubcategoryModal] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    categoryId: "",
    subcategory: null as any,
  });
  const [featureModal, setFeatureModal] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    categoryId: "",
    subcategoryId: "",
    feature: null as any,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "",
    id: "",
    name: "",
    categoryId: "",
    subcategoryId: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories");
      console.log("📊 Kategori API Yanıtı:", response.data);

      let categoriesData = response.data.data || response.data || [];

      if (!Array.isArray(categoriesData)) {
        console.warn("⚠️ Kategori verisi array değil:", categoriesData);
        categoriesData = [];
      }

      const normalizedCategories = categoriesData.map((category: any) => ({
        ...category,
        _id: category._id || category.id,
        subcategories: (category.subcategories || []).map((subcat: any) => ({
          ...subcat,
          _id: subcat._id || subcat.id,
          features: (subcat.features || []).map((feature: any) => ({
            ...feature,
            _id: feature._id || feature.id,
          })),
        })),
      }));

      console.log("✅ Normalize edilmiş kategoriler:", normalizedCategories);
      setCategories(normalizedCategories);

      const newExpanded = new Set<string>();
      normalizedCategories.forEach((cat: any) => newExpanded.add(cat._id));
      setExpandedCategories(newExpanded);
    } catch (error: any) {
      console.error("❌ Kategoriler yüklenemedi:", error);
      toast.error("Kategoriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const handleDelete = async () => {
    const { type, id, categoryId, subcategoryId } = deleteModal;
    console.log("🗑️ Silme işlemi:", { type, id, categoryId, subcategoryId });

    try {
      if (type === "category") {
        await api.delete(`/admin/categories/${id}`);
        toast.success("Kategori başarıyla silindi");
      } else if (type === "subcategory") {
        await api.delete(`/admin/categories/${categoryId}/subcategories/${id}`);
        toast.success("Alt kategori başarıyla silindi");
      } else if (type === "feature") {
        await api.delete(
          `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features/${id}`
        );
        toast.success("Özellik başarıyla silindi");
      }

      setDeleteModal({
        isOpen: false,
        type: "",
        id: "",
        name: "",
        categoryId: "",
        subcategoryId: "",
      });
      fetchCategories();
    } catch (error: any) {
      console.error("❌ Silme işlemi başarısız:", error);
      toast.error(error.response?.data?.message || "Silme işlemi başarısız");
    }
  };

  const openDeleteModal = (
    type: string,
    id: string,
    name: string,
    categoryId: string = "",
    subcategoryId: string = ""
  ) => {
    console.log("🗑️ Silme modalı açılıyor:", {
      type,
      id,
      name,
      categoryId,
      subcategoryId,
    });
    setDeleteModal({ isOpen: true, type, id, name, categoryId, subcategoryId });
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Kategoriler Yükleniyor
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600"
        >
          Kategori verileri hazırlanıyor...
        </motion.p>
      </motion.div>
    </div>
  );

  return (
    <div>
      <AdminLayout>
        <div className="flex-1 p-6 lg:p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3">
                    Kategori Yönetimi
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl">
                    Kategori, alt kategori ve özelliklerinizi kolayca yönetin.
                    İlanlarınızı düzenli bir şekilde organize edin.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCategoryModal({
                      isOpen: true,
                      mode: "create",
                      category: null,
                    })
                  }
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus size={24} />
                  Yeni Kategori
                </motion.button>
              </div>
            </motion.div>

            {/* Categories List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {categories.length === 0 ? (
                <EmptyState
                  onAddCategory={() =>
                    setCategoryModal({
                      isOpen: true,
                      mode: "create",
                      category: null,
                    })
                  }
                />
              ) : (
                categories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    isExpanded={expandedCategories.has(category._id)}
                    onToggle={toggleCategory}
                    onEdit={(cat: any) =>
                      setCategoryModal({
                        isOpen: true,
                        mode: "edit",
                        category: cat,
                      })
                    }
                    onDelete={(type: string, id: string, name: string) =>
                      openDeleteModal(type, id, name)
                    }
                    onAddSubcategory={(categoryId: string) =>
                      setSubcategoryModal({
                        isOpen: true,
                        mode: "create",
                        categoryId,
                        subcategory: null,
                      })
                    }
                    expandedSubcategories={expandedSubcategories}
                    onToggleSubcategory={toggleSubcategory}
                    onEditSubcategory={(categoryId: string, subcategory: any) =>
                      setSubcategoryModal({
                        isOpen: true,
                        mode: "edit",
                        categoryId,
                        subcategory,
                      })
                    }
                    onDeleteSubcategory={(
                      categoryId: string,
                      subcategoryId: string,
                      name: string
                    ) =>
                      openDeleteModal(
                        "subcategory",
                        subcategoryId,
                        name,
                        categoryId
                      )
                    }
                    onAddFeature={(categoryId: string, subcategoryId: string) =>
                      setFeatureModal({
                        isOpen: true,
                        mode: "create",
                        categoryId,
                        subcategoryId,
                        feature: null,
                      })
                    }
                    onEditFeature={(
                      categoryId: string,
                      subcategoryId: string,
                      feature: any
                    ) =>
                      setFeatureModal({
                        isOpen: true,
                        mode: "edit",
                        categoryId,
                        subcategoryId,
                        feature,
                      })
                    }
                    onDeleteFeature={(
                      categoryId: string,
                      subcategoryId: string,
                      featureId: string,
                      name: string
                    ) =>
                      openDeleteModal(
                        "feature",
                        featureId,
                        name,
                        categoryId,
                        subcategoryId
                      )
                    }
                  />
                ))
              )}
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <CategoryModal
          isOpen={categoryModal.isOpen}
          onClose={() =>
            setCategoryModal({ isOpen: false, mode: "create", category: null })
          }
          onSuccess={fetchCategories}
          category={categoryModal.category}
          mode={categoryModal.mode}
        />

        <SubcategoryModal
          isOpen={subcategoryModal.isOpen}
          onClose={() =>
            setSubcategoryModal({
              isOpen: false,
              mode: "create",
              categoryId: "",
              subcategory: null,
            })
          }
          onSuccess={fetchCategories}
          categoryId={subcategoryModal.categoryId}
          subcategory={subcategoryModal.subcategory}
          mode={subcategoryModal.mode}
        />

        <FeatureModal
          isOpen={featureModal.isOpen}
          onClose={() =>
            setFeatureModal({
              isOpen: false,
              mode: "create",
              categoryId: "",
              subcategoryId: "",
              feature: null,
            })
          }
          onSuccess={fetchCategories}
          categoryId={featureModal.categoryId}
          subcategoryId={featureModal.subcategoryId}
          feature={featureModal.feature}
          mode={featureModal.mode}
        />

        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({
              isOpen: false,
              type: "",
              id: "",
              name: "",
              categoryId: "",
              subcategoryId: "",
            })
          }
          onConfirm={handleDelete}
          title={`${
            deleteModal.type === "category"
              ? "Kategori"
              : deleteModal.type === "subcategory"
              ? "Alt Kategori"
              : "Özellik"
          } Sil`}
          message={`"${deleteModal.name}" adlı ${
            deleteModal.type === "category"
              ? "kategoriyi"
              : deleteModal.type === "subcategory"
              ? "alt kategoriyi"
              : "özelliği"
          } silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        />
      </AdminLayout>
    </div>
  );
}
