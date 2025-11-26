// components/modals/CategoryModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import api from "@/app/lib/api";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
  mode: "create" | "edit";
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
  mode,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name || "");
    } else {
      setName("");
    }
    setError("");
  }, [isOpen, mode, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await api.post("/admin/categories", { name });
      } else {
        await api.patch(`/admin/categories/${category._id}`, { name });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

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
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create" ? "Yeni Kategori" : "Kategori Düzenle"}
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
                    Kategori Adı
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kategori adını giriniz"
                    required
                  />
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
                  disabled={loading || !name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

export default CategoryModal;
