// src/features/contact/stats/ContactStatsSection.client.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { User, Home, Star, Shield } from "lucide-react";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

const statsData = [
  {
    number: 500,
    suffix: "+",
    label: "Mutlu Müşteri",
    icon: <User className="w-6 h-6" />,
    color: "from-purple-500 to-blue-400",
    duration: 2.5,
  },
  {
    number: 250,
    suffix: "+",
    label: "Tamamlanan Proje",
    icon: <Home className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    duration: 2,
  },
  {
    number: 12,
    suffix: "+",
    label: "Yıl Deneyim",
    icon: <Star className="w-6 h-6" />,
    color: "from-blue-500  to-purple-600",
    duration: 1.5,
  },
  {
    number: 24,
    suffix: "/7",
    label: "Müşteri Desteği",
    icon: <Shield className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500 ",
    duration: 2,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function ContactStatsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <section ref={statsRef} className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {isStatsInView ? (
                    <CountUp
                      start={0}
                      end={stat.number}
                      duration={stat.duration}
                      separator="."
                      suffix={stat.suffix}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
