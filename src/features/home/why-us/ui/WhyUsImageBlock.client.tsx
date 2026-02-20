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
    <motion.div variants={fadeUp} className="relative shrink-0 lg:w-[45%]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full rounded-xl border border-gray-200"
      />

      {/* Badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
        <img
          src={badge.icon}
          alt="badge"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <span className="block text-sm font-bold text-gray-900">{badge.countText}</span>
          <span className="block text-xs text-gray-500">{badge.label}</span>
        </div>
      </div>
    </motion.div>
  );
}
