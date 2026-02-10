"use client";
import { useRef } from "react";
import { Poppins } from "next/font/google";
import { motion, useInView, Variants } from "framer-motion";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Clock,
  User,
  Home,
  Star,
  Shield,
} from "lucide-react";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoToTop from "@/components/GoToTop";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Contact = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

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

  return (
    <div className="min-h-screen bg-white" style={PoppinsFont.style}>
      <Navbar />

      <section className="relative min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="pt-16 sm:pt-10 relative z-10 text-center px-4 sm:px-6 max-w-5xl">
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
              <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-gray-600 font-semibold tracking-widest text-xs sm:text-sm uppercase">
                İletişim
              </span>
              <div className="w-8 sm:w-12 h-1 bg-gradient-to-l from-indigo-500 to-pink-500 rounded-full"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 px-2"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-gray-900">
                BİZE ULAŞIN
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2"
            >
              Hayalinizdeki evi bulmanız için buradayız. 12 yıllık deneyimimiz
              ve profesyonel ekibimizle size en uygun çözümleri sunmaya hazırız.
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

      {/* İletişim Bilgileri Section */}
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

      {/* WhatsApp CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 mb-4 sm:mb-6"
            >
              <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2"
            >
              Hemen WhatsApp&apos;tan Yazın
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
            >
              Danışmanlarımızdan biriyle doğrudan WhatsApp üzerinden iletişime
              geçin. Sorularınızı hızlıca yanıtlayalım.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              {teamData.slice(0, 3).map((member, index) => (
                <motion.a
                  key={index}
                  href={member.whatsapp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 sm:gap-3 bg-white text-green-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-0 justify-center text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{member.title}</span>
                </motion.a>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-green-100 text-xs sm:text-sm mt-4 sm:mt-6"
            >
              7/24 mesaj atabilirsiniz. En kısa sürede dönüş yapacağız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Harita Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ofisimizi Ziyaret Edin
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Sakarya&apos;nın merkezi lokasyonlarında hizmetinizdeyiz
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center px-4"
              >
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Sakarya Ofisimiz
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Harita entegrasyonu buraya eklenecek
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <GoToTop />
      <Footer />
    </div>
  );
};

export default Contact;
