// src/features/home/top-adverts/TopAdvertsSection.client.tsx
"use client";

import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

import type { Listing } from "../highlights/types";
import { hasValidPhoto } from "../highlights/utils/listingUtils";
import TopAdvertCard from "./ui/TopAdvertCard.client";

type Props = {
  data: Listing[];
};

export default function TopAdvertsSection({ data }: Props) {
  const router = useRouter();

  const topAdverts = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    return safe.filter(hasValidPhoto);
  }, [data]);

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
  }, [topAdverts, updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const navigateTo = (uid: string) => {
    router.push(`/ilan/${uid}`);
  };

  if (topAdverts.length === 0) return null;

  return (
    <section id="top-adverts" className="py-8 md:py-12 bg-gradient-to-b from-[#E9EEF7] to-[#E9EEF7]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 md:mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-3">
              Öne Çıkan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#035DBA] to-[#03409F]">
                İlanlar
              </span>
              <TrendingUp size={28} className="text-green-500" />
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
              Editör seçimi ve en çok ilgi gören ilanları keşfedin.
            </p>
          </div>

          <Link
            href="/ilanlar"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#035DBA] border border-[#035DBA]/20 rounded-xl hover:bg-[#035DBA] hover:text-white transition-all duration-300 group"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Cards row with navigation */}
        <div className="relative">
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

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-3 overflow-x-auto overflow-y-hidden pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {topAdverts.map((listing, index) => (
              <div key={listing.uid} className="flex-shrink-0 w-[240px] md:w-[270px] xl:w-[300px]">
                <TopAdvertCard
                  listing={listing}
                  index={index}
                  onNavigate={navigateTo}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link
            href="/ilanlar"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-[#035DBA] border border-[#035DBA]/20 rounded-xl hover:bg-[#035DBA] hover:text-white transition-all duration-300 group"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
