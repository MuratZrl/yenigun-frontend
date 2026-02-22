// src/features/home/highlights/HighlightsSection.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import CategorySidebar from "./ui/CategorySidebar.client";

import type { HighlightProps, Listing } from "./types";
import { hasValidPhoto } from "./utils/listingUtils";
import { useCopyListingLink } from "./hooks/useCopyListing";
import HighlightMobileRow from "./ui/HighlightMobileRow.client";
import HighlightCard from "./ui/HighlightCard.client";

export default function HighlightsSection({ data }: HighlightProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(12);
  const { copiedId, copy } = useCopyListingLink("/ilan", 2000);

  const safeData = useMemo<Listing[]>(() => (Array.isArray(data) ? data : []), [data]);

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
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">
            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-900 to-blue-500 rounded-full" />
            Yeni Eklenenler
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Son Eklenen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">İlanlar</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            En güncel ilanları keşfedin, fırsatları kaçırmayın.
          </p>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <div className="sticky top-6">
              <CategorySidebar />
            </div>
          </div>

          {/* Listings */}
          <div className="lg:w-4/5">
            {/* Mobile list */}
            <div className="space-y-3 mb-8 block md:hidden">
              {visibleData.map((listing, index) => (
                <HighlightMobileRow
                  key={listing.uid || String(index)}
                  listing={listing}
                  onNavigate={navigateTo}
                />
              ))}
            </div>

            {/* Desktop grid */}
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

            {/* Empty state */}
            {filteredData.length === 0 && (
              <div className="text-center py-12 md:py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="text-indigo-500" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    İlan Bulunamadı
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen farklı filtreler deneyin.
                  </p>
                </div>
              </div>
            )}

            {/* Load more */}
            {filteredData.length > 0 && visibleCount < filteredData.length && (
              <div className="flex justify-center mt-8 md:mt-12">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                >
                  Daha Fazla Göster ({remaining} ilan kaldı)
                </button>
              </div>
            )}

            {/* View all */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex justify-center mt-6 md:mt-10"
            >
              <Link
                href="/ilanlar"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200
                           hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 group"
              >
                Tüm İlanları Görüntüle
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
