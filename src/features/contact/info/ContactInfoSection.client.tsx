// src/features/contact/info/ContactInfoSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Phone } from "lucide-react";
import { representativesData } from "@/features/home/representatives/data/representatives";
import RepresentativeCard from "@/features/home/representatives/ui/RepresentativeCard.client";

const contactCards = [
  {
    Icon: MapPin,
    title: "Adres",
    content: "Sakarya, Türkiye",
    description: "Şubelerimiz Sakarya'nın stratejik noktalarında",
    color: "from-blue-600 to-blue-400",
  },
  {
    Icon: Phone,
    title: "Telefon",
    content: "0532 232 84 05",
    description: "7/24 ulaşabilirsiniz",
    color: "from-indigo-600 to-indigo-400",
  },
  {
    Icon: Mail,
    title: "E-posta",
    content: "yenigun@yenigunemlak.com",
    description: "E-postalarınızı hızlıca yanıtlıyoruz",
    color: "from-blue-700 to-blue-500",
  },
  {
    Icon: Clock,
    title: "Çalışma Saatleri",
    content: "09:00 - 19:00",
    description: "Pazartesi - Cumartesi",
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ContactInfoSection() {
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
            İletişim{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 pb-1 -mb-1 inline-block decoration-clone">
              Bilgileri
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Size en uygun iletişim kanalından bize ulaşabilirsiniz.
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16 md:mb-20"
        >
          {contactCards.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 hover:shadow-md hover:border-gray-300 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}
              >
                <item.Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm font-bold text-gray-900 mb-2 break-all">
                {item.content}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-10 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Ekibimiz
          </h3>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Deneyimli gayrimenkul danışmanlarımızla tanışın.
          </p>
        </motion.div>

        {/* Team grid — same cards as home/about Representatives */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {representativesData.map((rep) => (
            <RepresentativeCard key={rep.title} rep={rep} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
