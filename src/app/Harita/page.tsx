"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import "../globals.css";

const HaritaClient = dynamic(() => import("@/app/components/HaritaClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Harita yükleniyor...</p>
      </div>
    </div>
  ),
});

export default function HaritaSayfasi() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Sayfa yükleniyor...</p>
          </div>
        </div>
      }
    >
      <HaritaClient />
    </Suspense>
  );
}
