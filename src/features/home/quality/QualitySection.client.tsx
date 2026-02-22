// src/features/home/quality/QualitySection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { containerVariants } from "./motion/variants";
import QualityCard from "./ui/QualityCard.client";
import { qualityItems } from "./data/qualityItems";

export default function QualitySection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Üstün{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">Kalite</span>{" "}
            ve Hizmet
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Yenigün Emlak ile hayalinizdeki yaşam alanına kavuşun. Profesyonel
            danışmanlık ve güvenilir hizmet anlayışı.
          </p>
        </motion.div>

        {/* Cards — left & right */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {qualityItems.map((item, index) => (
            <QualityCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* CTA Banner — full width below cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white border border-gray-200 rounded-lg px-8 py-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300">
            <div className="text-center sm:text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-1">
                Size Özel Çözümler Sunuyoruz
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                Evinizi satmak, kiralamak veya yeni bir yaşam alanı bulmak mı istiyorsunuz?
                Deneyimli danışman ekibimiz ihtiyaçlarınıza özel çözümler üretmek için hazır.
              </p>
            </div>
            <a
              href="https://wa.me/905322328405"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition-colors duration-200 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Whatsapp&apos;tan Ulaşın
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
