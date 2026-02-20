// src/features/home/types/ui/TypeCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PropertyTypeItem } from "../model";
import { cardVariants } from "../motion/variants";

type Props = {
  item: PropertyTypeItem;
};

export default function TypeCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <Link href={`/ilanlar?type=${encodeURIComponent(item.type)}`} className="block">
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group bg-white rounded-xl border border-gray-200 shadow-sm
                   hover:shadow-md hover:border-indigo-200
                   transition-all duration-300 p-6 text-center"
      >
        {/* Icon */}
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={22} />
        </div>

        {/* Count */}
        <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
          {item.count}+
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
          {item.title}
        </h3>
      </motion.div>
    </Link>
  );
}
