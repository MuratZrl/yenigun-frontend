// src/features/about/values/ValuesSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Handshake, Users, Award, Home, Heart } from "lucide-react";

const values = [
  {
    Icon: Handshake,
    title: "Güven",
    description:
      "1973'ten beri şeffaf iletişim ve dürüstlük temel prensibimizdir.",
    color: "from-blue-600 to-blue-400",
  },
  {
    Icon: Users,
    title: "Müşteri Odaklılık",
    description: "Her müşterimizin ihtiyaçları bizim için özeldir ve önceliğimizdir.",
    color: "from-indigo-600 to-indigo-400",
  },
  {
    Icon: Award,
    title: "Kalite",
    description:
      "Deneyimimizi en yüksek standartlarla birleştirerek kaliteli hizmet sunuyoruz.",
    color: "from-blue-700 to-blue-500",
  },
  {
    Icon: Home,
    title: "Uzmanlık",
    description:
      "Nesiller boyu edindiğimiz tecrübeyle doğru çözümleri sunuyoruz.",
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
    transition: { duration: 0.5 },
  },
};

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

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
            <Heart className="w-7 h-7 md:w-9 md:h-9 text-blue-400 shrink-0" />
            Temel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 pb-1 -mb-1 inline-block decoration-clone">
              Değerlerimiz
            </span>
          </h2>
          <p
            className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
          >
            Çalışma prensiplerimiz ve hizmet anlayışımızın temelini oluşturan
            değerler.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center mb-5`}
              >
                <value.Icon className="w-5 h-5 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white mb-2">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
