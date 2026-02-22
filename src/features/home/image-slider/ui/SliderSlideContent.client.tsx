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
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="w-full px-6 md:px-10 text-center">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={slide.heading + slide.lines[0]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/90 border border-white/25 rounded-full mb-6 backdrop-blur-sm bg-white/5"
              >
                {slide.heading}
              </motion.span>

              {/* Main heading lines */}
              {slide.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-white font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  {line}
                </motion.p>
              ))}

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-16 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent mt-6 mb-4"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-white/65 text-base md:text-lg lg:text-xl font-medium max-w-xl"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="flex flex-wrap items-center justify-center gap-3 mt-8"
              >
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all duration-200 group shadow-lg shadow-black/20"
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white/85 hover:text-white text-sm font-semibold border border-white/25 hover:border-white/50 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  Hakkımızda
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
