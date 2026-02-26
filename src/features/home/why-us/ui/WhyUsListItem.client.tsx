// src/features/home/why-us/ui/WhyUsListItem.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WhyUsItem } from "../types";
import { cardVariants } from "../motion/variants";

type Props = {
  item: WhyUsItem;
};

export default function WhyUsListItem({ item }: Props) {
  const Icon = item.icon;

  return (
    <motion.li
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-default"
    >
      <div className="shrink-0">
        <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className={`w-6 h-6 ${item.iconColor}`} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.li>
  );
}
