// src/features/home/image-slider/ui/SliderSlideContent.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SliderSlide } from "../types";

type Props = {
  slide: SliderSlide;
  isActive: boolean;
};

export default function SliderSlideContent({ slide, isActive }: Props) {
  return (
    <div className="absolute inset-0 z-10 flex items-center">
      <div className="max-w-6xl mx-auto px-6 md:px-10 w-full">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={slide.heading + slide.lines[0]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              {/* Small accent line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-1 bg-indigo-500 rounded-full mb-6"
              />

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-white/80 text-sm md:text-base lg:text-lg font-medium tracking-widest uppercase mb-3 md:mb-4"
              >
                {slide.heading}
              </motion.h1>

              {/* Main lines */}
              {slide.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="text-white font-bold text-3xl md:text-5xl lg:text-6xl leading-tight"
                >
                  {line}
                </motion.p>
              ))}

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 md:mt-8"
              >
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-gray-900 text-sm md:text-base font-semibold rounded-lg
                             hover:bg-indigo-600 hover:text-white transition-all duration-300 group"
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
