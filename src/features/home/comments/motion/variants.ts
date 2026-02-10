// src/features/home/comments/motion/variants.ts
import type { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
};

export const quoteVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};
