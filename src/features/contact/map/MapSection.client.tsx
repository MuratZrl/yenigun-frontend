"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function MapSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ofisimizi Ziyaret Edin
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Sakarya&apos;nın merkezi lokasyonlarında hizmetinizdeyiz
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center px-4"
            >
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Sakarya Ofisimiz
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Harita entegrasyonu buraya eklenecek
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
