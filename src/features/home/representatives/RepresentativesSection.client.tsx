// src/features/home/representatives/RepresentativesSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

import { representativesData } from "./data/representatives";
import RepresentativeCard from "./ui/RepresentativeCard.client";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function RepresentativesSection() {
  return (
    <section
      className="py-16 md:py-24 bg-white relative overflow-hidden"
      id="represent"
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
            Uzman{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">Temsilcilerimiz</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Deneyimli ekibimiz hayalinizdeki yaşam alanını bulmanız için
            profesyonel danışmanlık sunuyor.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {representativesData.map((rep) => (
            <RepresentativeCard key={rep.title} rep={rep} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
