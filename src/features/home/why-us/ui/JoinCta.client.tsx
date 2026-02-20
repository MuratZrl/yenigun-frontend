// src/features/home/why-us/ui/JoinCta.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { WhyUsCta } from "../types";

type Props = {
  cta: WhyUsCta;
};

export default function JoinCta({ cta }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-slate-50 border border-gray-200 rounded-lg px-8 py-6 hover:border-green-200 hover:shadow-sm transition-all duration-300">
        <div className="text-center sm:text-left">
          <h4 className="text-gray-900 font-semibold text-lg mb-1">
            {cta.title}
          </h4>
          <p className="text-gray-500 text-sm">
            {cta.description}
          </p>
        </div>
        <a
          href={cta.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition-colors duration-200 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          {cta.buttonText}
        </a>
      </div>
    </motion.div>
  );
}
