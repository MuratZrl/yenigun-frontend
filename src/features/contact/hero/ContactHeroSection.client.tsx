// src/features/contact/hero/ContactHeroSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactHeroSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="pt-16 sm:pt-10 relative z-10 text-center px-4 sm:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-gray-600 font-semibold tracking-widest text-xs sm:text-sm uppercase">
              İletişim
            </span>
            <div className="w-8 sm:w-12 h-1 bg-gradient-to-l from-indigo-500 to-pink-500 rounded-full"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 px-2"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-gray-900">
              BİZE ULAŞIN
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2"
          >
            Hayalinizdeki evi bulmanız için buradayız. 12 yıllık deneyimimiz
            ve profesyonel ekibimizle size en uygun çözümleri sunmaya hazırız.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
