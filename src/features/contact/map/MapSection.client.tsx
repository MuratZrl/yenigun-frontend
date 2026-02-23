// src/features/contact/map/MapSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
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
            Ofisimizi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 pb-1 -mb-1 inline-block decoration-clone">
              Ziyaret Edin
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Sakarya&apos;nın merkezi lokasyonlarında hizmetinizdeyiz.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-lg border border-gray-200 overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48576.34199869256!2d30.3711!3d40.6940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409c9e8b22a0b97d%3A0x3e30a9b4e5b5e76a!2sSakarya!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Yenigün Emlak Konum"
            className="w-full h-[300px] md:h-[450px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
