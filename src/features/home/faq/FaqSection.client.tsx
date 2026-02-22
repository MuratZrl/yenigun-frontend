// src/features/home/faq/FaqSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

import { faqData } from "./data/faqs";
import { staggerContainer } from "./motion/variants";
import FaqItem from "./ui/FaqItem.client";

export default function FaqSection() {
  const mid = Math.ceil(faqData.length / 2);
  const leftColumn = faqData.slice(0, mid);
  const rightColumn = faqData.slice(mid);

  return (
    <section id="faq" className="py-16 md:py-24 bg-white relative overflow-hidden">
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
            Sıkça Sorulan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">
              Sorular
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Emlak süreçleri hakkında merak edilenleri sizin için derledik.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {/* Left Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {leftColumn.map((item) => (
              <FaqItem key={item.question} item={item} />
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {rightColumn.map((item) => (
              <FaqItem key={item.question} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
