// src/features/admin/categories/components/EmptyState.tsx
"use client";

import { Folder, Plus } from "lucide-react";

interface Props {
  onAddCategory: () => void;
}

export default function EmptyState({ onAddCategory }: Props) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Folder size={48} className="text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Henüz kategori bulunmuyor
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        İlanlarınızı düzenlemek için kategoriler oluşturun.
      </p>
      <button
        onClick={onAddCategory}
        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
      >
        <Plus size={24} />
        İlk Kategoriyi Oluştur
      </button>
    </div>
  );
}