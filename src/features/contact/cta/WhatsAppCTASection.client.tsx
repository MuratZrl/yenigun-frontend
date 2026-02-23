// src/features/contact/cta/WhatsAppCTASection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhatsAppCTASection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 px-8 md:px-16 py-12 md:py-16 overflow-hidden"
        >
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                Hemen İletişime Geçin
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed">
                Danışmanlarımızdan biriyle doğrudan WhatsApp üzerinden iletişime
                geçin. 7/24 mesaj atabilirsiniz.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="https://wa.me/905322328405"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp&apos;tan Yazın
              </a>
              <Link
                href="/ilanlar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg border border-white/20 transition-colors duration-200"
              >
                İlanları Keşfet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
