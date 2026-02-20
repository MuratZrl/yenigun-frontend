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
      className="p-6 text-center bg-slate-50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-200"
    >
      <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
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

      <h3 className="text-gray-500 font-medium text-sm">{item.title}</h3>
    </motion.div>
  );
}
