// src/features/home/why-us/ui/StatsBanner.client.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import type { StatItem } from "../types";
import { scaleIn } from "../motion/variants";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

type Props = {
  stats: StatItem[];
};

export default function StatsBanner({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#000066] to-[#035DBA] rounded-2xl px-6 py-10 md:py-12 shadow-xl"
    >
      {/* Decorative blurs */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-400/15 rounded-full blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={[
                "flex flex-col items-center text-center",
                i < stats.length - 1 ? "md:border-r md:border-white/20" : "",
              ].join(" ")}
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {isInView ? (
                  <CountUp
                    start={0}
                    end={stat.count}
                    duration={stat.duration ?? 2}
                    separator="."
                    suffix={stat.suffix ?? ""}
                  />
                ) : (
                  <span>0</span>
                )}
              </div>
              <h3 className="text-white/90 font-semibold text-sm mb-0.5">{stat.title}</h3>
              <p className="text-white/60 text-xs">{stat.description}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
