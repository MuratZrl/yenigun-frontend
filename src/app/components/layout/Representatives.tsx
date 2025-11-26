"use client";
import React, { useEffect } from "react";
import { Poppins } from "next/font/google";
import { motion, Variants } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Swiper instance için tip tanımı
interface SwiperInstance {
  swiper?: {
    slidePrev: () => void;
    slideNext: () => void;
  };
}

const Representatives = () => {
  useEffect(() => {
    const customSwiper5 = document.getElementById("customSwiper5");
    const nextButton = document.querySelector("#represent .swiper-button-next");
    const prevButton = document.querySelector("#represent .swiper-button-prev");
    const pagination = document.querySelector("#represent .swiper-pagination");

    if (customSwiper5 && prevButton && pagination && nextButton) {
      customSwiper5.innerHTML = "";

      const navContainer = document.createElement("div");
      navContainer.className = "flex items-center gap-6";

      const customPrev = document.createElement("button");
      customPrev.className =
        "p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-300 swiper-button-prev-custom";
      customPrev.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      `;
      customPrev.onclick = () => {
        const swiper = document.querySelector(
          "#represent .swiper"
        ) as unknown as SwiperInstance;
        if (swiper?.swiper) {
          swiper.swiper.slidePrev();
        }
      };

      const customNext = document.createElement("button");
      customNext.className =
        "p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-300 swiper-button-next-custom";
      customNext.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      `;
      customNext.onclick = () => {
        const swiper = document.querySelector(
          "#represent .swiper"
        ) as unknown as SwiperInstance;
        if (swiper?.swiper) {
          swiper.swiper.slideNext();
        }
      };

      navContainer.appendChild(customPrev);
      navContainer.appendChild(pagination);
      navContainer.appendChild(customNext);
      customSwiper5.appendChild(navContainer);
    }
  }, []);

  const data = [
    {
      title: "Nevzat Berber",
      image: "/logo.png",
      type: "Gayrimenkul Danışmanı",
      phonenum: "0532 232 84 05 ",
      phone: "tel:+905322328405",
      whatsapp: "https://wa.me/905322328405",
    },
    {
      title: "Musa Kaya",
      image: "/logo.png",
      type: "Gayrimenkul Danışmanı",
      phonenum: " 0532 646 66 07 ",
      phone: "tel:+905326466607",
      whatsapp: "https://wa.me/905326466607",
    },
    // {
    //   title: "İlker Berber",
    //   image: "/logo.png",
    //   type: "Gayrimenkul Danışmanı",

    // },
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

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const imageVariants: Variants = {
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      className={`min-h-screen py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
      id="represent"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <span className="text-gray-600 font-semibold tracking-widest text-sm uppercase">
              Profesyonel Ekip
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Uzman{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Temsilcilerimiz
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Deneyimli ekibimiz hayalinizdeki yaşam alanını bulmanız için
            profesyonel danışmanlık sunuyor
          </motion.p>
        </motion.div>

        <div className="relative">
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 24,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 28,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 36,
              },
            }}
            style={{
              padding: "3rem 1rem",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: ".swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            loop={true}
          >
            {data.map((rep, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="group cursor-pointer relative"
                >
                  <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-200 group-hover:border-blue-300 group-hover:shadow-2xl transition-all duration-500"></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="relative overflow-hidden h-64 rounded-t-3xl bg-gray-100 flex items-center justify-center p-8">
                      <motion.img
                        variants={imageVariants}
                        whileHover="hover"
                        src={rep.image}
                        alt={rep.title}
                        className="w-full h-full object-contain max-w-[250px] max-h-[200px]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-center mb-6">
                        <motion.h3
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                        >
                          {rep.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="text-gray-600 text-lg font-medium mb-2"
                        >
                          {rep.type}
                        </motion.p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex gap-3"
                      >
                        <Link
                          href={rep.phone}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl text-base font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Phone className="text-sm" size={16} />
                          <span>Ara</span>
                        </Link>
                        <Link
                          href={rep.whatsapp}
                          target="_blank"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-base font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                          <MessageCircle className="text-sm" size={16} />
                          <span>Mesaj</span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500"></div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            id="customSwiper5"
            className="flex items-center justify-center gap-8 mt-8"
          >
            <style jsx>{`
              .swiper-pagination {
                position: relative !important;
                bottom: auto !important;
                display: flex;
                gap: 8px;
                justify-content: center;
              }
              .swiper-pagination-bullet {
                width: 8px;
                height: 8px;
                background: #d1d5db;
                opacity: 1;
              }
              .swiper-pagination-bullet-active {
                background: #2563eb;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Representatives;
