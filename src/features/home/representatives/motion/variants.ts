// src/features/home/representatives/motion/variants.ts
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
    y: -10,
    scale: 1.03,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
};

export const imageVariants: Variants = {
  hover: {
    scale: 1.08,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};
