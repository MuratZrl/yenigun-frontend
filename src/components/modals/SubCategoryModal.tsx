// src/components/modals/SubCategoryModal.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Save, X } from "lucide-react";
import { toast } from "react-toastify";

import api from "@/lib/api";

type Id = string;

type SubcategoryType = {
  _id: Id;
  name: string;
  parentSubcategoryId?: Id;
  features?: any[];
  subcategories?: SubcategoryType[];
};

type CategoryType = {
  _id: Id;
  name?: string;
  subcategories?: SubcategoryType[];
};

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  categoryId: string;
  subcategory?: SubcategoryType | null;
  mode: "create" | "edit";

  categories?: CategoryType[];
}

type FlatNode = {
  sub: SubcategoryType;
  level: number;
  parentId: Id | null;
  hasChildren: boolean;
};

const SUBCATEGORIES_ENDPOINT = (categoryId: string) =>
  `/admin/categories/${categoryId}/subcategories`;

const SUBCATEGORY_ENDPOINT = (categoryId: string, subId: string) =>
  `/admin/categories/${categoryId}/subcategories/${subId}`;

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function buildFlatTree(
  subs: SubcategoryType[],
  level = 0,
  parentId: Id | null = null
): FlatNode[] {
  const out: FlatNode[] = [];
  for (const sub of safeArr(subs)) {
    const children = safeArr(sub.subcategories);
    out.push({
      sub,
      level,
      parentId,
      hasChildren: children.length > 0,
    });
    if (children.length) {
      out.push(...buildFlatTree(children, level + 1, sub._id));
    }
  }
  return out;
}

function collectAllDescendantIds(sub: SubcategoryType | null | undefined): Set<Id> {
  const set = new Set<Id>();
  const walk = (node?: SubcategoryType) => {
    if (!node) return;
    for (const c of safeArr(node.subcategories)) {
      set.add(c._id);
      walk(c);
    }
  };
  walk(sub ?? undefined);
  return set;
}

export default function SubcategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  subcategory,
  mode,
  categories = [],
}: SubcategoryModalProps) {
  const [formData, setFormData] = useState<{ name: string; parentSubcategoryId: string }>({
    name: "",
    parentSubcategoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Expand state: hangi parent node’lar açık
  const [expanded, setExpanded] = useState<Set<Id>>(() => new Set());

  // Modal açılınca formu doldur / sıfırla
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && subcategory) {
      setFormData({
        name: subcategory.name ?? "",
        parentSubcategoryId: subcategory.parentSubcategoryId ?? "",
      });

      // Edit modunda seçili parent zincirini expand etmek istersen:
      // şimdilik dokunmuyoruz; kullanıcı manuel açar.
    } else {
      setFormData({ name: "", parentSubcategoryId: "" });
    }

    setError("");
    setExpanded(new Set()); // modal her açıldığında UI temiz başlasın
  }, [isOpen, mode, subcategory]);

  const currentCategory = useMemo(() => {
    return categories.find((c) => c?._id === categoryId) ?? null;
  }, [categories, categoryId]);

  // Kategori ağacını flat listeye çevir (memo)
  const flatAll = useMemo(() => {
    const subs = safeArr(currentCategory?.subcategories);
    return buildFlatTree(subs);
  }, [currentCategory]);

  // Edit modunda: “kendisini + torunlarını” parent olarak seçtirmeyelim
  const excludedIds = useMemo(() => {
    if (mode !== "edit" || !subcategory) return new Set<Id>();
    const set = new Set<Id>();
    set.add(subcategory._id);
    for (const id of collectAllDescendantIds(subcategory)) set.add(id);
    return set;
  }, [mode, subcategory]);

  const filteredFlat = useMemo(() => {
    if (!excludedIds.size) return flatAll;
    return flatAll.filter((n) => !excludedIds.has(n.sub._id));
  }, [flatAll, excludedIds]);

  // Expand gerçekten çalışsın: sadece “görünür” düğümleri listele
  const visibleFlat = useMemo(() => {
    if (!filteredFlat.length) return filteredFlat;

    const isVisible = (node: FlatNode, map: Map<Id, FlatNode>) => {
      if (node.parentId === null) return true;

      let p: Id | null = node.parentId;

      while (p !== null) {
        if (!expanded.has(p)) return false;

        const parent = map.get(p);
        p = parent?.parentId ?? null;
      }

      return true;
    };

    const map = new Map<Id, FlatNode>();
    for (const n of filteredFlat) map.set(n.sub._id, n);

    return filteredFlat.filter((n) => isVisible(n, map));
  }, [filteredFlat, expanded]);

  const toggleExpanded = useCallback((id: Id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setParent = useCallback((id: string) => {
    setFormData((prev) => ({ ...prev, parentSubcategoryId: id }));
  }, []);

  const selectedParentInfo = useMemo(() => {
    const match = filteredFlat.find((n) => n.sub._id === formData.parentSubcategoryId);
    return match ?? null;
  }, [filteredFlat, formData.parentSubcategoryId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const name = formData.name.trim();
      if (!categoryId) {
        setError("categoryId yok. Kategori seçmeden alt kategori eklenemez.");
        return;
      }
      if (!name) {
        setError("Alt kategori adı boş olamaz.");
        return;
      }

      setLoading(true);
      try {
        const payload: { name: string; parentSubcategoryId?: string } = {
          name,
        };
        if (formData.parentSubcategoryId) payload.parentSubcategoryId = formData.parentSubcategoryId;

        if (mode === "create") {
          await api.post(SUBCATEGORIES_ENDPOINT(categoryId), payload);
          toast.success("Alt kategori başarıyla oluşturuldu");
        } else {
          if (!subcategory?._id) throw new Error("Edit modunda subcategory._id yok");
          await api.patch(SUBCATEGORY_ENDPOINT(categoryId, subcategory._id), payload);
          toast.success("Alt kategori başarıyla güncellendi");
        }

        onSuccess();
        onClose();
      } catch (err: any) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          (status === 401
            ? "Yetkisiz (401). Token/login sorunu var."
            : status === 404
            ? "Endpoint bulunamadı (404). Route yanlış."
            : "Bir hata oluştu");
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, formData.name, formData.parentSubcategoryId, mode, onClose, onSuccess, subcategory?._id]
  );

  const hasAny = visibleFlat.length > 0;

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
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create" ? "Yeni Alt Kategori" : "Alt Kategori Düzenle"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Alt kategori adını giriniz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üst Alt Kategori (Opsiyonel)</label>

                  {hasAny ? (
                    <div className="border border-gray-300 rounded-lg max-h-56 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200 bg-gray-50">
                        <button
                          type="button"
                          onClick={() => setParent("")}
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
                        {visibleFlat.map(({ sub, level, hasChildren }) => {
                          const isSelected = formData.parentSubcategoryId === sub._id;
                          const isOpenNode = expanded.has(sub._id);

                          return (
                            <div key={sub._id} style={{ marginLeft: level * 16 }}>
                              <button
                                type="button"
                                onClick={() => setParent(sub._id)}
                                className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                                  isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                                }`}
                              >
                                {hasChildren ? (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpanded(sub._id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                    aria-label={isOpenNode ? "Kapat" : "Aç"}
                                  >
                                    {isOpenNode ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </span>
                                ) : (
                                  <div className="w-5" />
                                )}

                                <span className="flex-1">
                                  {sub.name}
                                  {level > 0 && (
                                    <span className="text-xs text-gray-500 ml-1">(seviye {level + 1})</span>
                                  )}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 border border-gray-300 rounded-lg">
                      Bu kategoride henüz alt kategori bulunmuyor
                    </div>
                  )}

                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      Bu alt kategoriyi başka bir alt kategorinin altına eklemek için seçim yapın.
                    </p>

                    {selectedParentInfo && (
                      <p className="text-xs text-green-600">
                        Seçili üst kategori: <strong>{selectedParentInfo.sub.name}</strong>
                        {selectedParentInfo.level > 0 && ` (seviye ${selectedParentInfo.level + 1})`}
                      </p>
                    )}

                    {mode === "edit" && formData.parentSubcategoryId === "" && (
                      <p className="text-xs text-blue-500">
                        Not: Üst alt kategori seçmezseniz, bu alt kategori ana alt kategori olacaktır.
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
                  disabled={loading || !formData.name.trim() || !categoryId}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {loading ? "Kaydediliyor..." : mode === "create" ? "Oluştur" : "Güncelle"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
