"use client";

import React from "react";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            Hayalinizdeki Eve Birlikte Kavuşalım
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Profesyonel ekibimizle ihtiyaçlarınıza özel çözümler sunmaya
            hazırız.
          </p>
          <motion.a
            href="https://wa.me/+905322328405"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300"
          >
            Ücretsiz Danışmanlık Al
            <Handshake className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
