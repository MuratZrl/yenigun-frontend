// src/features/home/why-us/ui/JoinCta.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WhyUsCta } from "../types";

type Props = {
  cta: WhyUsCta;
};

export default function JoinCta({ cta }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      viewport={{ once: true }}
      className="text-center mt-12"
    >
      <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-xl px-6 py-4 border border-gray-200">
        <div className="text-left">
          <h4 className="text-gray-900 font-semibold text-lg">{cta.title}</h4>
          <p className="text-gray-600 text-sm">{cta.description}</p>
        </div>

        <motion.a
          href={cta.href}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          {cta.buttonText}
        </motion.a>
      </div>
    </motion.div>
  );
}
