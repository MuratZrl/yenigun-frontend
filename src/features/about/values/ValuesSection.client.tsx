"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Handshake, Users, Award, Home } from "lucide-react";

const values = [
  {
    icon: <Handshake className="w-8 h-8" />,
    title: "Güven",
    description:
      "1973&apos;ten beri şeffaf iletişim ve dürüstlük temel prensibimizdir.",
    color: "from-blue-500 to-blue-600",
    delay: 0.1,
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Müşteri Odaklılık",
    description: "50 yıldır her müşterimizin ihtiyaçları bizim için özeldir.",
    color: "from-indigo-500 to-indigo-600",
    delay: 0.2,
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Kalite",
    description:
      "Yarım asırlık deneyimimizle en yüksek standartlarda hizmet sunuyoruz.",
    color: "from-purple-500 to-purple-600",
    delay: 0.3,
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: "Uzmanlık",
    description:
      "Nesiller boyu edindiğimiz tecrübeyle doğru çözümleri sunuyoruz.",
    color: "from-blue-600 to-indigo-600",
    delay: 0.4,
  },
];

const valueCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: custom,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    y: -15,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.8,
    },
  },
  hover: {
    scale: 1.2,
    rotate: 5,
    transition: {
      duration: 0.3,
    },
  },
};

export default function ValuesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Değerlerimiz
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Çalışma prensiplerimiz ve hizmet anlayışımız
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              custom={value.delay}
              variants={valueCardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg group-hover:border-blue-200 group-hover:shadow-xl transition-all duration-500"></div>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-500`}
              ></div>

              <div className="relative p-4 sm:p-6 md:p-8 h-full flex flex-col items-center text-center z-10">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${value.color} text-white shadow-lg group-hover:shadow-blue-200/50 transition-shadow duration-500`}
                >
                  {value.icon}
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: value.delay + 0.2 }}
                  className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors duration-300"
                >
                  {value.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: value.delay + 0.3 }}
                  className="text-gray-600 leading-relaxed text-xs sm:text-sm"
                >
                  {value.description}
                </motion.p>
              </div>

              <div
                className={`absolute -inset-1 bg-gradient-to-r ${value.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500`}
              ></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-blue-400/30 rounded-tr-lg sm:rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-indigo-400/30 rounded-bl-lg sm:rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
