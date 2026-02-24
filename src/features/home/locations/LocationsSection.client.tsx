// src/features/home/locations/LocationsSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

import type { AdvertLike, LocationItem } from "./types";
import { countByProvince } from "./utils/count";
import { getFallbackCityImage } from "./data/cities";
import LocationCard from "./ui/LocationCard.client";

type Props = {
  data: AdvertLike[];
};

const TOP_CITIES_COUNT = 6;

export default function LocationsSection({ data }: Props) {
  const items: LocationItem[] = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    const provinceCounts = countByProvince(safe);

    // Take top 6 cities by advert count
    const topCities: LocationItem[] = [];
    for (const [city, cityData] of provinceCounts) {
      if (topCities.length >= TOP_CITIES_COUNT) break;
      topCities.push({
        title: city,
        image: cityData.image || getFallbackCityImage(city),
        href: `/ilanlar?location=${encodeURIComponent(city)}`,
        count: cityData.count,
      });
    }

    return topCities;
  }, [data]);

  const totalActive = useMemo(() => {
    return items.reduce((acc, x) => acc + (x.count || 0), 0);
  }, [items]);

  return (
    <section id="locations" className="py-8 md:py-12 bg-slate-50 relative overflow-hidden">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Türkiye&apos;nin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">Her Yerinden</span>{" "}
              İlanlar
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
              Türkiye&apos;nin en gözde şehirlerinden satılık ve kiralık konutları keşfedin.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 hidden md:flex">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-500 text-xs">
              <span className="font-semibold text-gray-900">{totalActive}+</span>{" "}
              Aktif ilan
            </p>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-wrap gap-4">
          {items.map((item, index) => (
            <div key={item.title} className="flex-1 min-w-[140px] sm:min-w-0" style={{ flexBasis: `calc(${100 / items.length}% - ${((items.length - 1) * 16) / items.length}px)` }}>
              <LocationCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
