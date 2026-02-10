// src/features/home/types/ui/TypeCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PropertyTypeItem } from "../model";
import { cardVariants, iconVariants } from "../motion/variants";

type Props = {
  item: PropertyTypeItem;
  index: number;
};

export default function TypeCard({ item, index }: Props) {
  const Icon = item.icon;

  return (
    <Link href={`/ads?type=${encodeURIComponent(item.type)}`} className="block">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true }}
        className="group cursor-pointer relative"
      >
        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-500" />

        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
        />

        <div className="relative p-8 text-center z-10">
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-500 inline-flex`}
          >
            <Icon className="text-white" size={24} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
          >
            {item.count}+
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
          >
            {item.title}
          </motion.h3>
        </div>

        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500" />
      </motion.div>
    </Link>
  );
}
