// src/features/home/quality/ui/QualityCard.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { QualityItem } from "../types";
import { cardVariants, imageVariants } from "../motion/variants";
import QualityButton from "./QualityButton.client";

type Props = {
  item: QualityItem;
  index: number;
};

export default function QualityCard({ item, index }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative"
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-xl group-hover:border-blue-200 group-hover:shadow-2xl transition-all duration-500" />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
      />

      <div className="relative p-5 md:p-8 h-full flex flex-col items-center text-center z-10">
        <motion.div
          variants={imageVariants}
          className="mb-5 md:mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg group-hover:shadow-blue-200/50 transition-shadow duration-500 border border-blue-100"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-14 h-14 md:w-20 md:h-20 object-contain"
          />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-blue-700 transition-colors duration-300"
        >
          {item.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-gray-600 leading-relaxed mb-5 md:mb-8 grow"
        >
          {item.description}
        </motion.p>

        <QualityButton
          href={item.button.link}
          title={item.button.title}
          gradient={item.gradient}
        />
      </div>

      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
