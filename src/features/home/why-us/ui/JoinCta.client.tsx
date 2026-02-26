// src/features/home/why-us/ui/JoinCta.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl px-8 py-8 shadow-lg">
        <div className="text-center sm:text-left">
          <h4 className="text-white font-bold text-lg mb-1">
            {cta.title}
          </h4>
          <p className="text-green-100 text-sm">
            {cta.description}
          </p>
        </div>
        <a
          href={cta.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-green-700 text-sm rounded-xl font-bold transition-all duration-200 shrink-0 shadow-md hover:shadow-lg group"
        >
          <MessageCircle className="w-4 h-4" />
          {cta.buttonText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}
