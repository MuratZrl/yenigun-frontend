"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Clock,
  User,
} from "lucide-react";

const teamData = [
  {
    title: "Nevzat Berber",
    image: "/logo.png",
    type: "Gayrimenkul Danışmanı",
    phonenum: "0532 232 84 05",
    phone: "tel:+905322328405",
    whatsapp: "https://wa.me/905322328405",
  },
  {
    title: "Musa Kaya",
    image: "/logo.png",
    type: "Gayrimenkul Danışmanı",
    phonenum: "0532 646 66 07",
    phone: "tel:+905326466607",
    whatsapp: "https://wa.me/905326466607",
  },
  {
    title: "Aykut Berber",
    image: "/logo.png",
    type: "Gayrimenkul Danışmanı",
    phonenum: "0532 480 57 86",
    phone: "tel:+905324805786",
    whatsapp: "https://wa.me/905324805786",
  },
  {
    title: "Sefa Berber",
    image: "/logo.png",
    type: "Gayrimenkul Danışmanı",
    phonenum: "0532 592 47 37",
    phone: "tel:+905325924737",
    whatsapp: "https://wa.me/905325924737",
  },
  {
    title: "Uğur Berber",
    image: "/logo.png",
    type: "Gayrimenkul Danışmanı",
    phonenum: "0545 281 91 81",
    phone: "tel:+905452819181",
    whatsapp: "https://wa.me/905452819181",
  },
];

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Adres",
    content: "Sakarya, Türkiye",
    description: "Şubelerimiz Sakarya'nın stratejik noktalarında",
    color: "from-blue-500 to-blue-600",
    delay: 0.1,
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Telefon",
    content: "0532 232 84 05",
    description: "7/24 ulaşabilirsiniz",
    color: "from-indigo-500 to-indigo-600",
    delay: 0.2,
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "E-posta",
    content: "yenigun@yenigunemlak.com",
    description: "E-postalarınızı hızlıca yanıtlıyoruz",
    color: "from-purple-500 to-purple-600",
    delay: 0.3,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Çalışma Saatleri",
    content: "09:00 - 19:00",
    description: "Pazartesi - Cumartesi",
    color: "from-blue-600 to-indigo-600",
    delay: 0.4,
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

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

const contactCardVariants: Variants = {
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

export { teamData };

export default function ContactInfoSection() {
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
            İletişim Bilgilerimiz
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Size en uygun iletişim kanalından bize ulaşabilirsiniz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              custom={item.delay}
              variants={contactCardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg group-hover:border-blue-200 group-hover:shadow-xl transition-all duration-500"></div>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-500`}
              ></div>

              <div className="relative p-4 sm:p-6 h-full flex flex-col items-center text-center z-10">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg group-hover:shadow-blue-200/50 transition-shadow duration-500`}
                >
                  {item.icon}
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: item.delay + 0.2 }}
                  className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300"
                >
                  {item.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: item.delay + 0.3 }}
                  className="text-gray-700 font-semibold text-sm sm:text-base mb-2"
                >
                  {item.content}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: item.delay + 0.4 }}
                  className="text-gray-500 text-xs sm:text-sm mt-auto"
                >
                  {item.description}
                </motion.p>
              </div>

              <div
                className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500`}
              ></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-blue-400/30 rounded-tr-lg sm:rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-indigo-400/30 rounded-bl-lg sm:rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Ekibimiz Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ekibimiz
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Deneyimli gayrimenkul danışmanlarımızla tanışın
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {teamData.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 group-hover:border-blue-200 group-hover:shadow-xl transition-all duration-300"></div>

              <div className="relative p-4 sm:p-6 text-center z-10">
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                    <MessageCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">
                  {member.title}
                </h3>
                <p className="text-blue-600 text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                  {member.type}
                </p>

                <div className="mb-3 sm:mb-4">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                    Telefon
                  </p>
                  <a
                    href={member.phone}
                    className="text-gray-900 font-semibold text-sm sm:text-base hover:text-blue-600 transition-colors duration-300 break-all"
                  >
                    {member.phonenum}
                  </a>
                </div>

                <div className="flex flex-col gap-1 sm:gap-2">
                  <motion.a
                    href={member.phone}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-gray-100 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    <Phone className="w-3 h-3" />
                    Ara
                  </motion.a>
                  <motion.a
                    href={member.whatsapp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-green-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-600 transition-all duration-300"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </motion.a>
                </div>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
