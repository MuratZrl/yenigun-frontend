// components/modals/FeatureModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import api from "@/app/lib/api";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId: string;
  subcategoryId: string;
  feature?: any;
  mode: "create" | "edit";
}

const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  subcategoryId,
  feature,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "text" as
      | "text"
      | "number"
      | "single_select"
      | "multi_select"
      | "boolean",
    example: "",
    options: [] as string[],
  });
  const [newOption, setNewOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && feature) {
      setFormData({
        name: feature.name || "",
        type: feature.type || "text",
        example: feature.example || "",
        options: feature.options || [],
      });
    } else {
      setFormData({
        name: "",
        type: "text",
        example: "",
        options: [],
      });
    }
    setNewOption("");
    setError("");
  }, [isOpen, mode, feature]);

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        example: formData.example,
        ...(formData.type === "single_select" ||
        formData.type === "multi_select"
          ? { options: formData.options }
          : {}),
      };

      if (mode === "create") {
        await api.post(
          `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features`,
          payload
        );
      } else {
        await api.patch(
          `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features/${feature._id}`,
          payload
        );
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
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create" ? "Yeni Özellik" : "Özellik Düzenle"}
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
                    Özellik Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Özellik adını giriniz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özellik Türü
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="text">Metin</option>
                    <option value="number">Sayı</option>
                    <option value="single_select">Tek Seçim</option>
                    <option value="multi_select">Çoklu Seçim</option>
                    <option value="boolean">Evet/Hayır</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Örnek Değer
                  </label>
                  <input
                    type="text"
                    value={formData.example}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        example: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örnek değer giriniz"
                  />
                </div>

                {(formData.type === "single_select" ||
                  formData.type === "multi_select") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seçenekler
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Yeni seçenek ekle"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addOption())
                          }
                        />
                        <button
                          type="button"
                          onClick={addOption}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Ekle
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                        {formData.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {formData.options.length === 0 && (
                          <div className="p-3 text-center text-gray-500 text-sm">
                            Henüz seçenek eklenmedi
                          </div>
                        )}
                      </div>
                    </div>
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
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

export default FeatureModal;
