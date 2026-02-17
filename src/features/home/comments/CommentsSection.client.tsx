// src/features/home/comments/sections/CommentsSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { PoppinsFont } from "./fonts";
import { commentsData } from "./data/comments";
import CommentsSlider from "./ui/CommentsSlider.client";

export default function CommentsSection() {
  return (
    <section
      id="comments"
      className={`min-h-screen py-12 md:py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30" />

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
              Müşteri Yorumları
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
            Müşterilerimizin{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Deneyimleri
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak ile hayallerine kavuşan müşterilerimizin samimi geri bildirimleri
          </motion.p>
        </motion.div>

        <CommentsSlider items={commentsData} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gray-50 border border-gray-200 rounded-2xl px-8 py-6">
            <div className="text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-1">
                Siz de Deneyiminizi Paylaşın
              </h4>
              <p className="text-gray-600 text-sm">
                Yenigün Emlak ile yaşadığınız deneyimi diğer müşterilerle paylaşın
              </p>
            </div>

            <motion.a
              href="https://www.google.com/search?si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s14ENo7E3CKEIDpeTFIxSFDternuNADdiL6Dxydba6Am5dL3FsMVORrI-MCCU57NhWwVxb_H3zDQbZkjDFXSO8Hofvil&q=Yenigun+Emlak+Reviews"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Yorum Yap
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
