// src/features/home/highlights/HighlightsSection.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import CategorySidebar from "./ui/CategorySidebar.client";

import type { HighlightProps, Listing } from "./types";
import { hasValidPhoto } from "./utils/listingUtils";
import { useCopyListingLink } from "./hooks/useCopyListing";
import HighlightMobileRow from "./ui/HighlightMobileRow.client";
import HighlightCard from "./ui/HighlightCard.client";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HighlightsSection({ data }: HighlightProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(12);
  const { copiedId, copy } = useCopyListingLink("/ilan", 2000);

  const safeData: Listing[] = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    return safeData.filter(hasValidPhoto);
  }, [safeData]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const remaining = Math.max(0, filteredData.length - visibleCount);

  const loadMore = () => setVisibleCount((prev) => prev + 12);

  const navigateTo = (uid: string) => {
    router.push(`/ilan/${uid}`);
  };

  return (
    <section
      id="highlights"
      className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Full-width background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -translate-x-1/3 -translate-y-1/3 blur-[120px] opacity-50" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-50 rounded-full translate-x-1/4 -translate-y-1/2 blur-[100px] opacity-40" />
      <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-blue-50 rounded-full translate-y-1/3 blur-[100px] opacity-30" />

      {/* Content container */}
      <div className="relative z-10 py-12 md:py-16 flex flex-col px-4 md:px-6 xl:w-[90%] mx-auto gap-12 md:gap-16">

      <div className="flex flex-col items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
          Öne Çıkan İlanlar
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Özenle seçilmiş mülkler arasından hayalinizdeki yaşam alanını keşfedin.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full">
        <div className="lg:w-1/4">
          <div className="sticky top-6">
            <CategorySidebar />
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="space-y-3 mb-8 block md:hidden">
            {visibleData.map((listing, index) => (
              <HighlightMobileRow
                key={listing.uid || String(index)}
                listing={listing}
                onNavigate={navigateTo}
              />
            ))}
          </div>

          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {visibleData.map((listing, index) => (
              <HighlightCard
                key={listing.uid}
                listing={listing}
                index={index}
                copiedId={copiedId}
                onNavigate={navigateTo}
                onCopy={copy}
              />
            ))}
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-indigo-500" size={32} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  İlan Bulunamadı
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen farklı filtreler deneyin.
                </p>
              </div>
            </div>
          ) : null}

          {filteredData.length > 0 && visibleCount < filteredData.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mt-8 md:mt-12"
            >
              <button
                onClick={loadMore}
                className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-full font-bold text-sm md:text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:gap-3 md:hover:gap-4"
              >
                <span>Daha Fazla Göster ({remaining} ilan kaldı)</span>
                <ExternalLink
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                  size={14}
                />
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center mt-2 md:mt-4 w-full"
      >
        <div className="w-full flex justify-center">
          <Link
            href="/ilanlar"
            className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-2.5 md:py-3 bg-white text-indigo-700 rounded-full font-bold text-sm md:text-base shadow-lg ring-1 ring-indigo-200 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-500 hover:text-white hover:ring-0 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:gap-3 md:hover:gap-4"
          >
            <span>Tüm İlanları Görüntüle</span>
            <ExternalLink
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              size={14}
            />
          </Link>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
