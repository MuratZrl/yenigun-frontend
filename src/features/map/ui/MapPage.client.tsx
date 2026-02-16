"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import useMapListings from "../hooks/useMapListings";

const HaritaClient = dynamic(() => import("@/components/HaritaClient"), {
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

export default function MapPage() {
  const { listings, selectedDistrict, selectedProvince } = useMapListings();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ana içerik */}
      <main className="container mx-auto px-4 py-6">
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
          {listings.length > 0 ? (
            <HaritaClient
              listings={listings}
              selectedDistrict={selectedDistrict}
              selectedProvince={selectedProvince}
            />
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Haritada gösterilecek ilan bulunamadı
              </h3>
              <p className="text-gray-500 mb-6">
                Lütfen ana sayfadan ilanları filtreleyip &quot;Haritada Göster&quot;
                butonuna tıklayın.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
