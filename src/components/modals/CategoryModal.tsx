// src/components/modals/CategoryModal.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { toast } from "react-toastify";

import api from "@/lib/api";

type Id = string;

type CategoryEntity = {
  _id: Id;
  name: string;
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  category?: Partial<CategoryEntity> | null;
  mode: "create" | "edit";
}

const CATEGORIES_ENDPOINT = "/admin/categories";
const CATEGORY_ENDPOINT = (id: string) => `/admin/categories/${id}`;

function normalizeName(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
  mode,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && category) {
      setName(category.name ?? "");
    } else {
      setName("");
    }

    setError("");

    // küçük bir frame sonra focus
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen, mode, category]);

  const canSubmit = useMemo(() => {
    const n = normalizeName(name);
    if (!n) return false;
    if (loading) return false;
    if (mode === "edit" && !category?._id) return false;
    return true;
  }, [name, loading, mode, category?._id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setLoading(true);
      setError("");

      const safeName = normalizeName(name);

      try {
        if (mode === "create") {
          await api.post(CATEGORIES_ENDPOINT, { name: safeName });
          toast.success("Kategori oluşturuldu");
        } else {
          const id = category?._id;
          if (!id) throw new Error("Edit modunda category._id yok");
          await api.patch(CATEGORY_ENDPOINT(id), { name: safeName });
          toast.success("Kategori güncellendi");
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
            : err?.message || "Bir hata oluştu");

        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [canSubmit, name, mode, category?._id, onClose, onSuccess]
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
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create" ? "Yeni Kategori" : "Kategori Düzenle"}
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Adı
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kategori adını giriniz"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Fazla boşluklar otomatik düzeltilir.
                  </p>
                </div>

                {mode === "edit" && !category?._id && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Edit modunda kategori ID gelmedi. Bu modalı çağıran yerde category objesi eksik.
                    </p>
                  </div>
                )}

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
                  disabled={!canSubmit}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
