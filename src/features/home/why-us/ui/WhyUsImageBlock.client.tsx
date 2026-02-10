// src/features/home/why-us/ui/WhyUsImageBlock.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WhyUsBadge } from "../types";
import { fadeUp } from "../motion/variants";

type Props = {
  imageSrc: string;
  imageAlt: string;
  badge: WhyUsBadge;
};

export default function WhyUsImageBlock({ imageSrc, imageAlt, badge }: Props) {
  return (
    <motion.div variants={fadeUp} className="relative shrink-0">
      <div className="relative">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full max-w-md rounded-xl shadow-lg border border-gray-200"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          viewport={{ once: true }}
          className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-lg">
              <img
                src={badge.icon}
                alt="professional"
                className="w-6 h-6 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{badge.countText}</span>
              <span className="text-xs opacity-90">{badge.label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
