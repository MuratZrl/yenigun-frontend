// src/features/home/locations/LocationsSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

import type { AdvertLike, LocationItem } from "./types";
import { locationConfigs } from "./data/locations";
import { countByDistrict } from "./utils/count";
import LocationCard from "./ui/LocationCard.client";

type Props = {
  data: AdvertLike[];
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function LocationsSection({ data }: Props) {
  const items: LocationItem[] = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    return locationConfigs.map((cfg) => ({
      title: cfg.title,
      image: cfg.image,
      href: cfg.href,
      count: countByDistrict(safe, cfg.district),
      provinceLabel: cfg.provinceLabel ?? "Sakarya",
    }));
  }, [data]);

  const totalActive = useMemo(() => {
    return items.reduce((acc, x) => acc + (x.count || 0), 0);
  }, [items]);

  return (
    <section id="locations" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-10 md:mb-14"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Türkiye&apos;nin{" "}
            <span className="text-indigo-600">Her Yerinden</span>{" "}
            İlanlar
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Türkiye&apos;nin en gözde lokasyonlarından satılık ve kiralık konutları keşfedin.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {items.map((item, index) => (
            <LocationCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* Active listings badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-14"
        >
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-900">{totalActive}+</span>{" "}
              aktif ilan ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
