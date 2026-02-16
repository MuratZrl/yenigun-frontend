// src/features/category-detail/ui/components/ErrorState.client.tsx
"use client";

import { useRouter } from "next/navigation";

interface ErrorStateProps {
  error: string | null;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Hata!</h2>
        <p className="text-gray-600 mb-6">{error || "Kategori bulunamadı"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
}
