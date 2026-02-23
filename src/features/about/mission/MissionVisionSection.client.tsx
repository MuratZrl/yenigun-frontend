// src/features/about/mission/MissionVisionSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Compass, Heart } from "lucide-react";

const items = [
  {
    Icon: Target,
    title: "Misyonumuz",
    description:
      "Müşterilerimize güvenilir, şeffaf ve profesyonel emlak danışmanlık hizmeti sunarak hayallerindeki yaşam alanlarına kavuşmalarını sağlamak. Her müşterimizin ihtiyaçlarını anlayarak, onlara en uygun çözümleri sunmayı ilke ediniyoruz.",
    color: "from-blue-600 to-blue-400",
  },
  {
    Icon: Eye,
    title: "Vizyonumuz",
    description:
      "Sakarya ve çevresinde emlak sektörünün en güvenilir, yenilikçi ve müşteri odaklı firması olmak. Teknolojiyi ve deneyimimizi birleştirerek sektörde öncü bir konumda yer almaya devam etmek.",
    color: "from-indigo-600 to-indigo-400",
  },
  {
    Icon: Compass,
    title: "Stratejimiz",
    description:
      "Geniş portföyümüz, deneyimli ekibimiz ve dijital altyapımızla müşterilerimize hızlı ve doğru hizmet sunuyoruz. Pazar analizleri ve bölge uzmanlığımızla her zaman bir adım önde olmayı hedefliyoruz.",
    color: "from-blue-700 to-blue-500",
  },
  {
    Icon: Heart,
    title: "Taahhüdümüz",
    description:
      "Edindiğimiz güveni korumak ve her geçen gün daha iyisini sunmak en büyük taahhüdümüzdür. Müşteri memnuniyeti her zaman önceliğimizdir.",
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

export default function MissionVisionSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
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
            Misyon &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 pb-1 -mb-1 inline-block decoration-clone">
              Vizyon
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Yarım asırlık yolculuğumuzda bize yön veren ilkeler ve geleceğe
            dair hedeflerimiz.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-50 rounded-lg border border-gray-200 p-6 md:p-8 hover:shadow-md hover:border-gray-300 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}
              >
                <item.Icon className="w-5 h-5 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
