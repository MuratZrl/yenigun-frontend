// src/features/home/types/sections/TypesSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PoppinsFont } from "./fonts";
import type { AdvertLike } from "./../types/types";
import { buildPropertyTypes } from "./utils/buildPropertyTypes";
import TypesSlider from "./ui/TypesSlider.client";

type Props = {
  data: AdvertLike[];
};

export default function TypesSection({ data }: Props) {
  const items = useMemo(() => buildPropertyTypes(data), [data]);

  const totalProperties = useMemo(() => {
    return items.reduce((acc, x) => acc + (x.count || 0), 0);
  }, [items]);

  return (
    <section
      id="types"
      className={`min-h-screen py-12 md:py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4 md:mb-6"
          >
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            <span className="text-gray-600 font-semibold tracking-widest text-sm uppercase">
              Mülk Çeşitleri
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6"
          >
            Her Türlü{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Konut
            </span>{" "}
            Seçeneği
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak&apos;ın geniş portföyünde her bütçe ve zevke uygun konutları keşfedin
          </motion.p>
        </motion.div>

        <TypesSlider items={items} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">{totalProperties}+</span>{" "}
              aktif konut seçeneği ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
