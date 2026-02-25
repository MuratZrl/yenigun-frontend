// src/features/home/highlights/LatestAdverts.client.tsx
"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import CategorySidebar from "./ui/CategorySidebar.client";

import type { HighlightProps, Listing } from "./types";
import { hasValidPhoto } from "./utils/listingUtils";
import { useCopyListingLink } from "./hooks/useCopyListing";
import HighlightMobileRow from "./ui/HighlightMobileRow.client";
import HighlightCard from "./ui/HighlightCard.client";

export default function LatestAdverts({ data }: HighlightProps) {
  const router = useRouter();
  const { copiedId, copy } = useCopyListingLink("/ilan", 2000);

  const safeData = useMemo<Listing[]>(() => (Array.isArray(data) ? data : []), [data]);

  const filteredData = safeData;

  const navigateTo = (uid: string) => {
    router.push(`/ilan/${uid}`);
  };

  // Horizontal scroll navigation
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [filteredData, updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section
      id="highlights"
      className="py-8 md:py-12 bg-white relative overflow-hidden"
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
              {filteredData.map((listing, index) => (
                <HighlightMobileRow
                  key={listing.uid || String(index)}
                  listing={listing}
                  onNavigate={navigateTo}
                />
              ))}
            </div>

            {/* Desktop horizontal scroll */}
            <div className="hidden md:block relative group/scroll">
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#035DBA] transition-all duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Right arrow */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#035DBA] transition-all duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Cards row */}
              <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className="flex gap-4 md:gap-6 overflow-x-auto pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredData.map((listing, index) => (
                  <div key={listing.uid} className="flex-shrink-0 w-[240px] xl:w-[270px]">
                    <HighlightCard
                      listing={listing}
                      index={index}
                      copiedId={copiedId}
                      onNavigate={navigateTo}
                      onCopy={copy}
                    />
                  </div>
                ))}
              </div>
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
