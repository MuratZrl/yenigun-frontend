// src/features/home/types/TypesSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

import type { AdvertLike } from "./../types/types";
import { buildPropertyTypes } from "./utils/buildPropertyTypes";
import TypeCard from "./ui/TypeCard.client";

type Props = {
  data: AdvertLike[];
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function TypesSection({ data }: Props) {
  const items = useMemo(() => buildPropertyTypes(data), [data]);

  const totalProperties = useMemo(() => {
    return items.reduce((acc, x) => acc + (x.count || 0), 0);
  }, [items]);

  return (
    <section id="types" className="py-16 md:py-24 bg-white relative overflow-hidden">
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
            Her Türlü{" "}
            <span className="text-indigo-600">Konut</span>{" "}
            Seçeneği
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Yenigün Emlak&apos;ın geniş portföyünde her bütçe ve zevke uygun konutları keşfedin.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {items.map((item) => (
            <TypeCard key={item.title} item={item} />
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
              <span className="font-semibold text-gray-900">{totalProperties}+</span>{" "}
              aktif konut seçeneği ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
