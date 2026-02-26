// src/features/home/why-us/ui/WhyUsImageBlock.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WhyUsBadge } from "../types";
import { fadeUp, scaleIn } from "../motion/variants";

type Props = {
  imageSrc: string;
  imageAlt: string;
  badge: WhyUsBadge;
};

export default function WhyUsImageBlock({ imageSrc, imageAlt, badge }: Props) {
  const BadgeIcon = badge.icon;

  return (
    <motion.div variants={fadeUp} className="relative shrink-0 lg:w-[45%]">
      {/* Decorative blur */}
      <div className="absolute -inset-4 bg-blue-200/30 rounded-3xl blur-2xl -z-10" />

      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Badge */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 flex items-center gap-3 bg-white/90 backdrop-blur-md border border-white/50 rounded-xl px-5 py-3 shadow-lg"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center shadow-md">
          <BadgeIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-base font-bold text-gray-900">{badge.countText}</span>
          <span className="block text-xs text-gray-500 font-medium">{badge.label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
