// src/features/about/history/HistorySection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Tag, Users, Globe } from "lucide-react";

const milestones = [
  {
    year: "1973",
    title: "Kuruluş",
    description:
      "Yenigün Emlak olarak müşteri memnuniyeti odaklı hizmet anlayışıyla yola çıktık.",
    Icon: History,
    color: "from-blue-600 to-blue-400",
  },
  {
    year: "1980",
    title: "İlk Büyüme",
    description:
      "7 yıllık deneyimle Sakarya'da güvenilir emlak danışmanlığında öncü firma olduk.",
    Icon: Tag,
    color: "from-indigo-600 to-indigo-400",
  },
  {
    year: "2000",
    title: "Yüzyılın Dönümü",
    description:
      "27 yıllık tecrübemizle bölgenin en köklü emlak firmalarından biri haline geldik.",
    Icon: Users,
    color: "from-blue-700 to-blue-500",
  },
  {
    year: "2024",
    title: "Dijital Dönüşüm",
    description:
      "Online platformumuzla hizmetlerimizi dijital dünyaya taşıyarak müşterilerimize her yerden ulaşıyoruz.",
    Icon: Globe,
    color: "from-indigo-700 to-indigo-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HistorySection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-12 md:mb-16"
        >
          <h2
            className="flex items-center gap-3 text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            <History className="w-7 h-7 md:w-9 md:h-9 text-blue-400 shrink-0" />
            Yarım Asırlık{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 pb-1 -mb-1 inline-block decoration-clone">
              Yolculuk
            </span>
          </h2>
          <p
            className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
          >
            1973&apos;ten bugüne, güvenin ve kalitenin adresi olmaya devam
            ediyoruz.
          </p>
        </motion.div>

        {/* Timeline cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {milestones.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Year */}
              <div className="text-4xl md:text-5xl font-bold text-white/10 group-hover:text-white/15 transition-colors duration-300 mb-4">
                {item.year}
              </div>

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}
              >
                <item.Icon className="w-5 h-5 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.description}
              </p>

              {/* Connector line (hidden on last item) */}
              {index < milestones.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
