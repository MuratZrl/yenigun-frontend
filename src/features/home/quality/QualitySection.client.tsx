// src/features/home/quality/QualitySection.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { containerVariants } from "./motion/variants";
import QualityCard from "./ui/QualityCard.client";
import { qualityItems } from "./data/qualityItems";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function QualitySection() {
  return (
    <section
      className="min-h-screen py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
      style={PoppinsFont.style}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            <span className="text-gray-600 font-semibold tracking-widest text-sm uppercase">
              Premium Hizmet
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6"
          >
            Üstün{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kalite
            </span>{" "}
            ve Hizmet
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak ile hayalinizdeki yaşam alanına kavuşun. Profesyonel
            danışmanlık ve güvenilir hizmet anlayışı.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 md:gap-8 lg:gap-12"
        >
          {qualityItems.map((item, index) => (
            <QualityCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl px-8 py-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-1">
                Size Özel Çözümler
              </h4>
              <p className="text-gray-600 text-sm">
                Özel ihtiyaçlarınız için profesyonel danışmanlık
              </p>
            </div>

            <a
              href="https://wa.me/905322328405"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Whatsapp&apos;tan Ulaşın
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
