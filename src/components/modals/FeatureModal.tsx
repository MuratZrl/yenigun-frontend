// src/components/modals/FeatureModal.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

import api from "@/lib/api";

type Id = string;

type FeatureType = "text" | "number" | "single_select" | "multi_select" | "boolean";

type FeatureEntity = {
  _id: Id;
  name: string;
  type: FeatureType;
  example?: string;
  options?: string[];
};

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  categoryId: string;
  subcategoryId: string;

  feature?: Partial<FeatureEntity> | null;
  mode: "create" | "edit";
}

type FormData = {
  name: string;
  type: FeatureType;
  example: string;
  options: string[];
};

const FEATURES_ENDPOINT = (categoryId: string, subcategoryId: string) =>
  `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features`;

const FEATURE_ENDPOINT = (categoryId: string, subcategoryId: string, featureId: string) =>
  `/admin/categories/${categoryId}/subcategories/${subcategoryId}/features/${featureId}`;

function normalizeOption(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function dedupeOptions(options: string[]) {
  const map = new Map<string, string>(); // lower -> original
  for (const raw of options) {
    const normalized = normalizeOption(raw);
    if (!normalized) continue;
    const key = normalized.toLocaleLowerCase("tr-TR");
    if (!map.has(key)) map.set(key, normalized);
  }
  return Array.from(map.values());
}

export default function FeatureModal({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  subcategoryId,
  feature,
  mode,
}: FeatureModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "text",
    example: "",
    options: [],
  });

  const [newOption, setNewOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSelectType = formData.type === "single_select" || formData.type === "multi_select";

  const canSubmit = useMemo(() => {
    const nameOk = formData.name.trim().length > 0;
    const idsOk = Boolean(categoryId) && Boolean(subcategoryId);
    const optionsOk = !isSelectType || dedupeOptions(formData.options).length > 0;
    return nameOk && idsOk && optionsOk && !loading;
  }, [categoryId, subcategoryId, formData.name, formData.options, isSelectType, loading]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && feature) {
      const incomingType = (feature.type as FeatureType) || "text";
      const incomingOptions = Array.isArray(feature.options) ? feature.options : [];
      setFormData({
        name: feature.name ?? "",
        type: incomingType,
        example: feature.example ?? "",
        options: incomingType === "single_select" || incomingType === "multi_select" ? dedupeOptions(incomingOptions) : [],
      });
    } else {
      setFormData({ name: "", type: "text", example: "", options: [] });
    }

    setNewOption("");
    setError("");
  }, [isOpen, mode, feature, categoryId, subcategoryId]);

  useEffect(() => {
    if (!isSelectType && formData.options.length) {
      setFormData((prev) => ({ ...prev, options: [] }));
      setNewOption("");
    }
  }, [isSelectType]); // intentionally only reacts to type change

  const addOption = useCallback(() => {
    const candidate = normalizeOption(newOption);
    if (!candidate) return;

    setFormData((prev) => {
      const next = dedupeOptions([...prev.options, candidate]);
      return { ...prev, options: next };
    });

    setNewOption("");
  }, [newOption]);

  const removeOption = useCallback((opt: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((x) => x !== opt),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const name = formData.name.trim();
      if (!categoryId || !subcategoryId) {
        setError("Kategori veya alt kategori ID'si eksik.");
        return;
      }
      if (!name) {
        setError("Özellik adı boş olamaz.");
        return;
      }

      const payload: Record<string, any> = {
        name,
        type: formData.type,
      };

      const example = formData.example.trim();
      if (example) payload.example = example;

      if (formData.type === "single_select" || formData.type === "multi_select") {
        const options = dedupeOptions(formData.options);
        if (!options.length) {
          setError("Seçim tipi özelliklerde en az 1 seçenek olmalı.");
          return;
        }
        payload.options = options;
      }

      setLoading(true);
      try {
        if (mode === "create") {
          await api.post(FEATURES_ENDPOINT(categoryId, subcategoryId), payload);
          toast.success("Özellik başarıyla oluşturuldu");
        } else {
          const featureId = (feature as any)?._id as string | undefined;
          if (!featureId) throw new Error("Düzenlenecek özellik ID'si eksik");

          await api.patch(FEATURE_ENDPOINT(categoryId, subcategoryId, featureId), payload);
          toast.success("Özellik başarıyla güncellendi");
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
    [categoryId, subcategoryId, feature, formData.example, formData.name, formData.options, formData.type, mode, onClose, onSuccess]
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "create" ? "Yeni Özellik" : "Özellik Düzenle"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Özellik adını giriniz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellik Türü</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as FeatureType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="text">Metin</option>
                    <option value="number">Sayı</option>
                    <option value="single_select">Tek Seçim</option>
                    <option value="multi_select">Çoklu Seçim</option>
                    <option value="boolean">Evet/Hayır</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Örnek Değer (Opsiyonel)</label>
                  <input
                    type="text"
                    value={formData.example}
                    onChange={(e) => setFormData((prev) => ({ ...prev, example: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örnek değer giriniz"
                  />
                </div>

                {isSelectType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Yeni seçenek ekle"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addOption();
                            }
                          }}
                        />

                        <button
                          type="button"
                          onClick={addOption}
                          disabled={!normalizeOption(newOption)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Ekle
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                        {dedupeOptions(formData.options).map((opt) => (
                          <div
                            key={opt}
                            className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="text-sm text-gray-700">{opt}</span>
                            <button
                              type="button"
                              onClick={() => removeOption(opt)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              aria-label="Seçeneği sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {dedupeOptions(formData.options).length === 0 && (
                          <div className="p-3 text-center text-gray-500 text-sm">Henüz seçenek eklenmedi</div>
                        )}
                      </div>

                      {dedupeOptions(formData.options).length === 0 && (
                        <p className="text-xs text-gray-500">
                          Tek/çoklu seçim tiplerinde en az 1 seçenek eklemen gerekiyor, yoksa backend’e “boş seçim” gönderirsin.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
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
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
