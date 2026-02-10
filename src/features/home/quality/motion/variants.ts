// src/features/home/quality/motion/variants.ts
import type { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    y: -15,
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const imageVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, delay: 0.2 },
  },
  hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3 } },
};
