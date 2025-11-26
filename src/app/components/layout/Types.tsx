"use client";
import React, { useEffect } from "react";
import { Poppins } from "next/font/google";
import {
  Home,
  Building,
  LandPlot,
  Building2,
  Calendar,
  Store,
  Castle,
  House,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion, Variants } from "framer-motion";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

interface PropertyType {
  title: string;
  count: number;
  icon: any;
  gradient: string;
  type: string;
}

interface TypesProps {
  data: any[];
}

// Swiper instance için tip tanımı
interface SwiperInstance {
  swiper?: {
    slidePrev: () => void;
    slideNext: () => void;
  };
}

const Types = ({ data }: TypesProps) => {
  const getPropertyTypes = (): PropertyType[] => {
    const typeCounts: { [key: string]: number } = {};

    data?.forEach((item) => {
      if (item?.steps?.third) {
        const type = item.steps.third;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });

    const propertyTypeConfig: {
      [key: string]: { icon: any; gradient: string };
    } = {
      Daire: { icon: Home, gradient: "from-blue-500 to-cyan-500" },
      Villa: { icon: Castle, gradient: "from-indigo-500 to-purple-500" },
      "Müstakil Ev": {
        icon: House,
        gradient: "from-green-500 to-teal-500",
      },
      Residence: {
        icon: Building2,
        gradient: "from-orange-500 to-red-500",
      },
      Ofis: {
        icon: Calendar,
        gradient: "from-purple-500 to-pink-500",
      },
      "Dükkan - Mağaza": {
        icon: Store,
        gradient: "from-cyan-500 to-blue-500",
      },
      Arsa: { icon: LandPlot, gradient: "from-yellow-500 to-orange-500" },
      Apartman: { icon: Building, gradient: "from-gray-500 to-blue-500" },
    };

    const propertyTypes: PropertyType[] = Object.entries(typeCounts)
      .map(([type, count]) => ({
        title: type,
        count,
        icon: propertyTypeConfig[type]?.icon || Home,
        gradient:
          propertyTypeConfig[type]?.gradient || "from-gray-500 to-blue-500",
        type: type,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return propertyTypes;
  };

  const propertyTypes = getPropertyTypes();

  useEffect(() => {
    const customSwiper4 = document.getElementById("customSwiper4");
    const nextButton = document.querySelector("#types .swiper-button-next");
    const prevButton = document.querySelector("#types .swiper-button-prev");
    const pagination = document.querySelector("#types .swiper-pagination");

    if (customSwiper4 && prevButton && pagination && nextButton) {
      customSwiper4.innerHTML = "";

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
          "#types .swiper"
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
          "#types .swiper"
        ) as unknown as SwiperInstance;
        if (swiper?.swiper) {
          swiper.swiper.slideNext();
        }
      };

      navContainer.appendChild(customPrev);
      navContainer.appendChild(pagination);
      navContainer.appendChild(customNext);
      customSwiper4.appendChild(navContainer);
    }
  }, []);

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
      y: -8,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const iconVariants: Variants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const handleTypeClick = (type: string) => {
    window.location.href = `/ads?type=${encodeURIComponent(type)}`;
  };

  const totalProperties = propertyTypes.reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <section
      id="types"
      className={`min-h-screen py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
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
              Mülk Çeşitleri
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Her Türlü{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Konut
            </span>{" "}
            Seçeneği
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak&apos;ın geniş portföyünde her bütçe ve zevke uygun
            konutları keşfedin
          </motion.p>
        </motion.div>

        <div className="relative">
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 5,
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
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            loop={true}
          >
            {propertyTypes.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <SwiperSlide key={index}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    onClick={() => handleTypeClick(item.type)}
                    className="group cursor-pointer relative"
                  >
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-500"></div>

                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                    ></div>

                    <div className="relative p-8 text-center z-10">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-500 inline-flex`}
                      >
                        <IconComponent
                          className="text-white text-2xl"
                          size={24}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                      >
                        {item.count}+
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                      >
                        {item.title}
                      </motion.h3>
                    </div>

                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500"></div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div
            id="customSwiper4"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">
                {totalProperties}+
              </span>{" "}
              aktif konut seçeneği ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Types;
