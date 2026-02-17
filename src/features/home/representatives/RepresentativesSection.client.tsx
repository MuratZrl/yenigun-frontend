// src/features/home/representatives/sections/RepresentativesSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { PoppinsFont } from "./fonts";
import { representativesData } from "./data/representatives";
import RepresentativesSlider from "./ui/RepresentativesSlider.client";

export default function RepresentativesSection() {
  return (
    <section
      className={`min-h-screen py-12 md:py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
      id="represent"
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
              Profesyonel Ekip
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
            Uzman{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Temsilcilerimiz
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Deneyimli ekibimiz hayalinizdeki yaşam alanını bulmanız için profesyonel danışmanlık sunuyor
          </motion.p>
        </motion.div>

        <RepresentativesSlider items={representativesData} />
      </div>
    </section>
  );
}
