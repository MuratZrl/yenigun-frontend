"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Tag, Users, Award } from "lucide-react";

const companyHistory = [
  {
    year: "1973",
    title: "Kuruluş",
    description:
      "Yenigün Emlak olarak 1973&apos;ten beri müşteri memnuniyeti odaklı hizmet anlayışıyla yola çıktık.",
    icon: <History className="text-blue-600" />,
  },
  {
    year: "1980",
    title: "İlk Büyüme",
    description:
      "7 yıllık deneyimle Sakarya&apos;da güvenilir emlak danışmanlığında öncü firma olduk.",
    icon: <Tag className="text-indigo-600" />,
  },
  {
    year: "2000",
    title: "Yüzyılın Dönümü",
    description:
      "27 yıllık tecrübemizle bölgenin en köklü emlak firmalarından biri haline geldik.",
    icon: <Users className="text-purple-600" />,
  },
  {
    year: "2024",
    title: "50+ Yıllık Liderlik",
    description:
      "50 yılı aşkın deneyimimizle sektörün güvenilir ismi olmaya devam ediyoruz.",
    icon: <Award className="text-blue-600" />,
  },
];

export default function HistorySection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Yolculuğumuz
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Geçmişten günümüze büyüme hikayemiz ve başarılarımız
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline çizgisi - mobilde gizle */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>

          <div className="space-y-8 sm:space-y-12">
            {companyHistory.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Mobil için düzenleme */}
                <div className="md:hidden">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <motion.div
                        className="p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {item.year}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                {/* Desktop için düzenleme */}
                <div className="hidden md:flex items-center">
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-12" : "pl-12"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="p-3 bg-blue-50 rounded-xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.icon}
                        </motion.div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {item.year}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"
                    whileInView={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
