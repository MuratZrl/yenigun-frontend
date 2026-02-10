// src/features/home/why-us/ui/StatCard.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { StatItem } from "../types";
import { fadeUp } from "../motion/variants";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

type Props = {
  item: StatItem;
  isActive: boolean;
};

export default function StatCard({ item, isActive }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group p-6 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
        {isActive ? (
          <CountUp
            start={0}
            end={item.count}
            duration={item.duration ?? 2}
            separator="."
            suffix={item.suffix ?? ""}
          />
        ) : (
          <span>0</span>
        )}
      </div>

      <h3 className="text-gray-700 font-medium text-sm md:text-base">{item.title}</h3>
    </motion.div>
  );
}
