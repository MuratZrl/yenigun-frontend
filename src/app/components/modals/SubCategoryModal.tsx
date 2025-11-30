"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, ChevronDown, ChevronRight } from "lucide-react";
import api from "@/app/lib/api";
import { toast } from "react-toastify";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId: string;
  subcategory?: any;
  mode: "create" | "edit";
  categories?: any[];
}

interface SubcategoryType {
  _id: string;
  name: string;
  parentSubcategoryId?: string;
  features?: any[];
  subcategories?: SubcategoryType[];
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  subcategory,
  mode,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    parentSubcategoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedParentIds, setExpandedParentIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (mode === "edit" && subcategory) {
      setFormData({
        name: subcategory.name || "",
        parentSubcategoryId: subcategory.parentSubcategoryId || "",
      });
    } else {
      setFormData({
        name: "",
        parentSubcategoryId: "",
      });
    }
    setError("");
  }, [isOpen, mode, subcategory]);

  const getAllSubcategories = (
    subs: SubcategoryType[],
    level = 0
  ): { sub: SubcategoryType; level: number }[] => {
    let allSubs: { sub: SubcategoryType; level: number }[] = [];

    subs.forEach((sub) => {
      allSubs.push({ sub, level });
      if (sub.subcategories && sub.subcategories.length > 0) {
        allSubs = [
          ...allSubs,
          ...getAllSubcategories(sub.subcategories, level + 1),
        ];
      }
    });

    return allSubs;
  };

  const getAvailableSubcategories = (): {
    sub: SubcategoryType;
    level: number;
  }[] => {
    const currentCategory = categories.find(
      (cat: any) => cat._id === categoryId
    );
    if (!currentCategory) return [];

    const subcategories = currentCategory.subcategories || [];
    return getAllSubcategories(subcategories);
  };

  const getFilteredSubcategories = (): {
    sub: SubcategoryType;
    level: number;
  }[] => {
    const availableSubs = getAvailableSubcategories();

    if (mode === "edit" && subcategory) {
      const excludedIds = new Set([subcategory._id]);
      const getAllChildIds = (subs: SubcategoryType[]): string[] => {
        let ids: string[] = [];
        subs.forEach((sub) => {
          ids.push(sub._id);
          if (sub.subcategories) {
            ids = [...ids, ...getAllChildIds(sub.subcategories)];
          }
        });
        return ids;
      };

      if (subcategory.subcategories) {
        const childIds = getAllChildIds(subcategory.subcategories);
        childIds.forEach((id) => excludedIds.add(id));
      }

      return availableSubs.filter(({ sub }) => !excludedIds.has(sub._id));
    }

    return availableSubs;
  };

  const toggleParentExpanded = (subId: string) => {
    const newExpanded = new Set(expandedParentIds);
    if (newExpanded.has(subId)) {
      newExpanded.delete(subId);
    } else {
      newExpanded.add(subId);
    }
    setExpandedParentIds(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        parentSubcategoryId: formData.parentSubcategoryId || undefined,
      };

      console.log("📤 Gönderilen payload:", payload);

      if (mode === "create") {
        await api.post(
          `/admin/categories/${categoryId}/subcategories`,
          payload
        );
        toast.success("Alt kategori başarıyla oluşturuldu");
      } else {
        await api.patch(
          `/admin/categories/${categoryId}/subcategories/${subcategory._id}`,
          payload
        );
        toast.success("Alt kategori başarıyla güncellendi");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("❌ Alt kategori işlemi başarısız:", err);
      const errorMessage = err.response?.data?.message || "Bir hata oluştu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcategories = getFilteredSubcategories();
  const availableSubs = getAvailableSubcategories();

  const selectedParent = filteredSubcategories.find(
    ({ sub }) => sub._id === formData.parentSubcategoryId
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create"
                  ? "Yeni Alt Kategori"
                  : "Alt Kategori Düzenle"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Kategori Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Alt kategori adını giriniz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Üst Alt Kategori (Opsiyonel)
                  </label>

                  {availableSubs.length > 0 ? (
                    <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200 bg-gray-50">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              parentSubcategoryId: "",
                            }))
                          }
                          className={`w-full text-left p-2 rounded ${
                            formData.parentSubcategoryId === ""
                              ? "bg-blue-100 text-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          📁 Ana Alt Kategori (Üst Kategori Yok)
                        </button>
                      </div>

                      <div className="p-2 space-y-1">
                        {filteredSubcategories.map(({ sub, level }) => (
                          <div key={sub._id} style={{ marginLeft: level * 20 }}>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  parentSubcategoryId: sub._id,
                                }))
                              }
                              className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                                formData.parentSubcategoryId === sub._id
                                  ? "bg-blue-100 text-blue-700"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {sub.subcategories &&
                              sub.subcategories.length > 0 ? (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleParentExpanded(sub._id);
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                >
                                  {expandedParentIds.has(sub._id) ? (
                                    <ChevronDown size={14} />
                                  ) : (
                                    <ChevronRight size={14} />
                                  )}
                                </span>
                              ) : (
                                <div className="w-5" />
                              )}
                              <span className="flex-1">
                                {sub.name}
                                {level > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (seviye {level + 1})
                                  </span>
                                )}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 border border-gray-300 rounded-lg">
                      Bu kategoride henüz alt kategori bulunmuyor
                    </div>
                  )}

                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      Bu alt kategoriyi başka bir alt kategorinin altına eklemek
                      için seçim yapın
                    </p>

                    {selectedParent && (
                      <p className="text-xs text-green-600">
                        Seçili üst kategori:{" "}
                        <strong>{selectedParent.sub.name}</strong>
                        {selectedParent.level > 0 &&
                          ` (seviye ${selectedParent.level + 1})`}
                      </p>
                    )}

                    {mode === "edit" && formData.parentSubcategoryId === "" && (
                      <p className="text-xs text-blue-500">
                        Not: Üst alt kategori seçmezseniz, bu alt kategori ana
                        alt kategori olacaktır.
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {loading
                    ? "Kaydediliyor..."
                    : mode === "create"
                    ? "Oluştur"
                    : "Güncelle"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubcategoryModal;
