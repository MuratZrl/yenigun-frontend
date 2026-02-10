// src/features/home/why-us/ui/WhyUsListItem.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WhyUsItem } from "../types";
import { fadeUp } from "../motion/variants";

type Props = {
  item: WhyUsItem;
};

export default function WhyUsListItem({ item }: Props) {
  return (
    <motion.li
      variants={fadeUp}
      whileHover={{ x: 5 }}
      className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100"
    >
      <div className="shrink-0">
        <div className="p-2 bg-blue-100 rounded-lg">
          <img src={item.icon} alt={item.title} className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.li>
  );
}
