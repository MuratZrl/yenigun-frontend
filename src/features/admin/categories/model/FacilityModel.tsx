// src/features/admin/categories/model/FacilityModel.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { CategoryAPI } from "../lib/api";
import { errMsg } from "../lib/helpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryUid: number;
  categoryName: string;
}

export default function FacilityModal({
  isOpen,
  onClose,
  onSuccess,
  categoryUid,
  categoryName,
}: Props) {
  const [title, setTitle] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setFeatures([]);
      setNewFeature("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setNewFeature("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || features.length === 0 || loading) return;

    setLoading(true);
    setError("");
    try {
      await CategoryAPI.addFacility(categoryUid, {
        title: title.trim(),
        features,
      });
      toast.success("Tesis özelliği eklendi");
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = errMsg(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Yeni Tesis Özelliği — {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grup Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ör: İç Özellikler"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özellikler
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Yeni özellik"
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
              {features.length === 0 ? (
                <p className="p-3 text-center text-gray-500 text-sm">
                  Henüz özellik eklenmedi
                </p>
              ) : (
                features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm">{f}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFeatures(features.filter((x) => x !== f))
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!title.trim() || features.length === 0 || loading}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loading ? "Kaydediliyor..." : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}