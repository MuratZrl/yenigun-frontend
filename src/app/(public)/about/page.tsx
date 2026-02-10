"use client";
import React, { useRef } from "react";
import { Poppins } from "next/font/google";
import { motion, useInView, Variants } from "framer-motion";
import {
  History,
  Tag,
  Users,
  Award,
  Handshake,
  Home,
  TrendingUp,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoToTop from "@/components/GoToTop";
import Comments from "@/components/layout/Comments";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const AboutUs = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

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

  const stats = [
    {
      number: 50000,
      suffix: "+",
      label: "Aylık Ziyaretçi",
      duration: 2.5,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-blue-400",
    },
    {
      number: 3000,
      suffix: "+",
      label: "Gayrimenkul Ağı",
      duration: 2,
      icon: <Home className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: 7000,
      suffix: "+",
      label: "Aylık Satış",
      duration: 2,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-500  to-purple-600",
    },
    {
      number: 50,
      suffix: "+",
      label: "Yıllık Deneyim",
      duration: 1.5,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500 ",
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

  return (
    <div className="min-h-screen bg-white" style={PoppinsFont.style}>
      <Navbar />
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <span className="text-gray-600 font-semibold tracking-widest text-xs sm:text-sm uppercase">
                Hakkımızda
              </span>
              <div className="w-8 sm:w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 px-2"
            >
              Yenigün{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Emlak
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2"
            >
              15 yılı aşkın deneyimimizle, hayalinizdeki yaşam alanını bulmanız
              için profesyonel danışmanlık hizmeti sunuyoruz. Güven, kalite ve
              müşteri memnuniyeti odaklı çalışma prensibimizle sektörde lider
              konumdayız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={statsRef} className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
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

      <section
        ref={valuesRef}
        className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
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

      <Comments />

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Hayalinizdeki Eve Birlikte Kavuşalım
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Profesyonel ekibimizle ihtiyaçlarınıza özel çözümler sunmaya
              hazırız.
            </p>
            <motion.a
              href="https://wa.me/+905322328405"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300"
            >
              Ücretsiz Danışmanlık Al
              <Handshake className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
      <GoToTop />
      <Footer />
    </div>
  );
};

export default AboutUs;
