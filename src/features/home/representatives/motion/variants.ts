// src/features/home/representatives/motion/variants.ts
import type { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: "easeInOut" as const },
  },
};
