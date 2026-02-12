// src/features/admin/categories/model/AttributeModel.tsx
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

export default function AttributeModal({
  isOpen,
  onClose,
  onSuccess,
  categoryUid,
  categoryName,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("TEXT");
  const [required, setRequired] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSelectType = type === "SELECT" || type === "CHECKBOX";

  useEffect(() => {
    if (isOpen) {
      setName("");
      setType("TEXT");
      setRequired(true);
      setOptions([]);
      setNewOption("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    if (!options.includes(trimmed)) setOptions([...options, trimmed]);
    setNewOption("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    if (isSelectType && options.length === 0) {
      setError("Seçim tipinde en az 1 seçenek ekleyin.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await CategoryAPI.addAttribute(categoryUid, {
        name: name.trim(),
        type,
        options: isSelectType ? options : [],
        required,
      });
      toast.success("Özellik eklendi");
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
            Yeni Özellik — {categoryName}
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
              Özellik Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ör: Oda Sayısı"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tür
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="TEXT">Metin</option>
              <option value="SELECT">Tek Seçim (SELECT)</option>
              <option value="CHECKBOX">Çoklu Seçim (CHECKBOX)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="attr-required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="attr-required" className="text-sm text-gray-700">
              Zorunlu alan
            </label>
          </div>

          {isSelectType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seçenekler
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Yeni seçenek"
                />
                <button
                  type="button"
                  onClick={addOption}
                  disabled={!newOption.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {options.length === 0 ? (
                  <p className="p-3 text-center text-gray-500 text-sm">
                    Henüz seçenek eklenmedi
                  </p>
                ) : (
                  options.map((opt) => (
                    <div
                      key={opt}
                      className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm">{opt}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setOptions(options.filter((o) => o !== opt))
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
          )}

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
              disabled={!name.trim() || loading}
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2"
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