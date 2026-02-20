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

export default function QualityCard({ item }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
    >
      <div className="p-6 md:p-8 h-full flex flex-col items-center text-center">
        {/* Icon */}
        <motion.div
          variants={imageVariants}
          className="mb-5 md:mb-6 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-indigo-50 flex items-center justify-center"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-indigo-600 transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-6 grow">
          {item.description}
        </p>

        {/* Button */}
        <QualityButton href={item.button.link} title={item.button.title} />
      </div>
    </motion.div>
  );
}
