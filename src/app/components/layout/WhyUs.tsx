"use client";
import React, { useRef } from "react";
import { Poppins } from "next/font/google";
import { motion, useInView, Variants } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import for CountUp to avoid SSR issues
const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span>0</span>,
});

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const WhyUs: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.3 });

  const data = [
    {
      title: "Aylık Ziyaretçi",
      count: 50000,
      suffix: "+",
      duration: 2.5,
    },
    {
      title: "Gayrimenkul Ağı",
      count: 3000,
      suffix: "+",
      duration: 2,
    },
    {
      title: "Aylık Satış",
      count: 7000,
      suffix: "+",
      duration: 2,
    },
  ];

  const whyUsData = [
    {
      title: "Profesyonel Danışmanlar",
      icon: "/icons/type_1.jpeg",
      description:
        "Deneyimli danışmanlarımızla birebir hizmet sunuyoruz. Alım-satım ve kiralama süreçlerinde profesyonel rehberlik.",
    },
    {
      title: "En İyi Hizmet",
      icon: "/icons/type_1.jpeg",
      description:
        "Modern teknolojiler ve piyasa analizleriyle en doğru kararları almanızı sağlıyoruz.",
    },
    {
      title: "Güvenilir Ekip",
      icon: "/icons/type_1.jpeg",
      description:
        "Güven ve dürüstlük temel prensibimiz. Doğru bilgiyle süreçlerinizi kolaylaştırıyoruz.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const statCardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <section
      className={`min-h-screen py-16 relative bg-white ${PoppinsFont.className}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Neden <span className="text-blue-600">Yenigün Emlak?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profesyonel ekibimiz ve geniş ağımızla hayalinizdeki yaşam alanını
            bulmanız için buradayız.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col lg:flex-row gap-12 items-center justify-between mb-20"
        >
          <motion.div variants={itemVariants} className="relative shrink-0">
            <div className="relative">
              <img
                src="/office.jpeg"
                alt="Neden Yenigün Emlak"
                className="w-full max-w-md rounded-xl shadow-lg border border-gray-200"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <img
                      src="/icons/type_1.jpeg"
                      alt="professional"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">4,500+</span>
                    <span className="text-xs opacity-90">mutlu müşteri</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 max-w-lg">
            <motion.ul className="space-y-6">
              {whyUsData.map((item, index) => (
                <motion.li
                  key={index}
                  variants={listItemVariants}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100"
                >
                  <div className="shrink-0">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={statCardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group p-6 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {isInView && (
                  <CountUp
                    start={0}
                    end={item.count}
                    duration={item.duration}
                    separator="."
                    suffix={item.suffix}
                  />
                )}
              </div>
              <h3 className="text-gray-700 font-medium text-sm md:text-base">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-xl px-6 py-4 border border-gray-200">
            <div className="text-left">
              <h4 className="text-gray-900 font-semibold text-lg">
                Siz de Ailemize Katılın
              </h4>
              <p className="text-gray-600 text-sm">
                Binlerce mutlu müşterimiz arasında yerinizi alın
              </p>
            </div>
            <motion.a
              href="https://wa.me/+905322328405"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Hemen Başlayın
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
