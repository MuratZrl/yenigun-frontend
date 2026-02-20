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
      className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="shrink-0">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <img src={item.icon} alt={item.title} className="w-6 h-6 rounded-full" />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.li>
  );
}
