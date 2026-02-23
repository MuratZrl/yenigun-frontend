// src/features/about/stats/StatsSection.client.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Home, TrendingUp, Calendar } from "lucide-react";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

const stats = [
  {
    number: 50000,
    suffix: "+",
    label: "Aylık Ziyaretçi",
    description: "Her ay binlerce kullanıcı platformumuzu ziyaret ediyor",
    duration: 2.5,
    icon: Users,
    color: "from-blue-600 to-blue-400",
  },
  {
    number: 3000,
    suffix: "+",
    label: "Gayrimenkul Ağı",
    description: "Geniş portföyümüzle size en uygun seçeneği sunuyoruz",
    duration: 2,
    icon: Home,
    color: "from-indigo-600 to-indigo-400",
  },
  {
    number: 7000,
    suffix: "+",
    label: "Aylık Satış",
    description: "Başarılı işlem sayımız her geçen gün artıyor",
    duration: 2,
    icon: TrendingUp,
    color: "from-blue-700 to-blue-500",
  },
  {
    number: 50,
    suffix: "+",
    label: "Yıllık Deneyim",
    description: "Sektördeki uzun soluklu tecrübemizle yanınızdayız",
    duration: 1.5,
    icon: Calendar,
    color: "from-indigo-700 to-indigo-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Rakamlarla{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 pb-1 -mb-1 inline-block decoration-clone">
              Yenigün
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Güvenilir hizmet anlayışımızın somut göstergeleri. Her rakam,
            müşterilerimize olan bağlılığımızın bir yansımasıdır.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-lg border border-gray-200 p-6 md:p-8 hover:shadow-md hover:border-gray-300 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>

              {/* Number */}
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {isInView ? (
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

              {/* Label */}
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
