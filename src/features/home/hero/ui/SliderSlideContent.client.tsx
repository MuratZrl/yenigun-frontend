// src/features/home/image-slider/ui/SliderSlideContent.client.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SliderSlide } from "../types";

type Props = {
  slide: SliderSlide;
  isActive: boolean;
};

export default function SliderSlideContent({ slide, isActive }: Props) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pb-40 md:pb-48">
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
              {/* Main heading lines */}
              {slide.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-white font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.08]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
