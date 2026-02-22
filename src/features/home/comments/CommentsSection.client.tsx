// src/features/home/comments/CommentsSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { commentsData } from "./data/comments";
import CommentsSlider from "./ui/CommentsSlider.client";

export default function CommentsSection() {
  return (
    <section
      id="comments"
      className="py-16 md:py-24 bg-slate-50 relative overflow-hidden"
    >
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
            Müşterilerimizin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">Deneyimleri</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Yenigün Emlak ile hayallerine kavuşan müşterilerimizin samimi geri
            bildirimleri.
          </p>
        </motion.div>

        {/* Slider */}
        <CommentsSlider items={commentsData} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-14"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-6 py-5 hover:border-indigo-200 transition-colors duration-300">
            <div>
              <h4 className="text-gray-900 font-semibold text-base mb-1">
                Siz de Deneyiminizi Paylaşın
              </h4>
              <p className="text-gray-500 text-sm">
                Yenigün Emlak ile yaşadığınız deneyimi diğer müşterilerle
                paylaşın.
              </p>
            </div>

            <a
              href="https://www.google.com/search?si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s14ENo7E3CKEIDpeTFIxSFDternuNADdiL6Dxydba6Am5dL3FsMVORrI-MCCU57NhWwVxb_H3zDQbZkjDFXSO8Hofvil&q=Yenigun+Emlak+Reviews"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Yorum Yap
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
