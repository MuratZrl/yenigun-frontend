"use client";

import { Suspense, useEffect, useState } from "react";
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

interface Address {
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  full_address: string;
  district: string;
  province: string;
  quarter: string;
  parcel?: string;
}

interface PropertyListing {
  _id: string;
  uid: number;
  address: Address;
  title: string;
  fee: string;
  thoughts: string;
  photos: string[];
  categoryId: string;
  steps: {
    first: string;
    second: string;
  };
  details?: {
    netArea?: number;
    grossArea?: number;
  };
}

export default function HaritaSayfasi() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  useEffect(() => {
    const storedAdverts = localStorage.getItem("haritaAdverts");
    if (storedAdverts) {
      try {
        const parsedAdverts: any[] = JSON.parse(storedAdverts);

        const formattedListings: PropertyListing[] = parsedAdverts.map(
          (advert: any) => {
            const address: Address = {
              mapCoordinates: advert.address?.mapCoordinates || {
                lat: 0,
                lng: 0,
              },
              full_address: advert.address?.full_address || "",
              district: advert.address?.district || "",
              province: advert.address?.province || "",
              quarter: advert.address?.quarter || "",
              parcel: advert.address?.parcel || "",
            };

            if (
              !address.mapCoordinates ||
              typeof address.mapCoordinates.lat !== "number" ||
              typeof address.mapCoordinates.lng !== "number" ||
              isNaN(address.mapCoordinates.lat) ||
              isNaN(address.mapCoordinates.lng)
            ) {
              address.mapCoordinates = { lat: 0, lng: 0 };
            }

            return {
              _id:
                advert._id ||
                advert.uid?.toString() ||
                Math.random().toString(),
              uid: advert.uid || 0,
              address: address,
              title: advert.title || "İsimsiz İlan",
              fee: advert.fee || "Fiyat Belirtilmemiş",
              thoughts: advert.thoughts || "",
              photos: advert.photos || [],
              categoryId: advert.categoryId || "",
              steps: advert.steps || { first: "", second: "" },
              details: advert.details || {},
            };
          }
        );

        const validListings = formattedListings.filter(
          (listing) =>
            listing.address.mapCoordinates &&
            listing.address.mapCoordinates.lat !== 0 &&
            listing.address.mapCoordinates.lng !== 0 &&
            !isNaN(listing.address.mapCoordinates.lat) &&
            !isNaN(listing.address.mapCoordinates.lng)
        );

        setListings(validListings);

        if (validListings.length > 0) {
          const firstListing = validListings[0];
          setSelectedProvince(firstListing.address.province || "");
          setSelectedDistrict(firstListing.address.district || "");
        }
      } catch (error) {
        console.error("Veri parse hatası:", error);
      }
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const provinceParam = urlParams.get("province");
      const districtParam = urlParams.get("district");

      if (provinceParam) setSelectedProvince(provinceParam);
      if (districtParam) setSelectedDistrict(districtParam);
    }
  }, []);

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
                Lütfen ana sayfadan ilanları filtreleyip "Haritada Göster"
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
