"use client";
import { useEffect } from "react";
import { Poppins } from "next/font/google";
import { ExternalLink, MapPin } from "lucide-react";
import { motion, Variants } from "framer-motion";
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

interface SwiperInstance {
  swiper?: {
    slidePrev: () => void;
    slideNext: () => void;
  };
}

interface LocationProps {
  data: any[];
}

const Locations = ({ data }: LocationProps) => {
  useEffect(() => {
    const customSwiper = document.getElementById("customSwiper");
    const nextButton = document.querySelector("#locations .swiper-button-next");
    const prevButton = document.querySelector("#locations .swiper-button-prev");
    const pagination = document.querySelector("#locations .swiper-pagination");

    if (customSwiper && prevButton && pagination && nextButton) {
      customSwiper.innerHTML = "";

      const navContainer = document.createElement("div");
      navContainer.className = "flex items-center gap-6";

      const customPrev = document.createElement("button");
      customPrev.className =
        "p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300 swiper-button-prev-custom";
      customPrev.innerHTML = '<ChevronLeft class="w-4 h-4" />';
      customPrev.onclick = () => {
        const swiper = document.querySelector(
          "#locations .swiper"
        ) as unknown as SwiperInstance;
        if (swiper?.swiper) {
          swiper.swiper.slidePrev();
        }
      };

      const customNext = document.createElement("button");
      customNext.className =
        "p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300 swiper-button-next-custom";
      customNext.innerHTML = '<ChevronRight class="w-4 h-4" />';
      customNext.onclick = () => {
        const swiper = document.querySelector(
          "#locations .swiper"
        ) as unknown as SwiperInstance;
        if (swiper?.swiper) {
          swiper.swiper.slideNext();
        }
      };

      navContainer.appendChild(customPrev);
      navContainer.appendChild(pagination);
      navContainer.appendChild(customNext);
      customSwiper.appendChild(navContainer);
    }
  }, []);

  const locations = [
    {
      title: "Serdivan",
      image: "/serdivan.jpg",
      href: "/ads?location=Sakarya&district=Serdivan",
      count:
        data?.filter((x: any) => x?.address?.district === "Serdivan").length ||
        0,
    },
    {
      title: "Adapazarı",
      image: "/adapazari.jpg",
      href: "/ads?location=Sakarya&district=Adapazarı",
      count:
        data?.filter((x: any) => x?.address?.district === "Adapazarı").length ||
        0,
    },
    {
      title: "Sapanca",
      image: "/sapanca.jpg",
      href: "/ads?location=Sakarya&district=Sapanca",
      count:
        data?.filter((x: any) => x?.address?.district === "Sapanca").length ||
        0,
    },
    {
      title: "Karasu",
      image: "/karasu.jpg",
      href: "/ads?location=Sakarya&district=Karasu",
      count:
        data?.filter((x: any) => x?.address?.district === "Karasu").length || 0,
    },
    {
      title: "Akyazı",
      image: "/akyazi.jpg",
      href: "/ads?location=Sakarya&district=Akyazı",
      count:
        data?.filter((x: any) => x?.address?.district === "Akyazı").length || 0,
    },
    {
      title: "Hendek",
      image: "/hendek.jpg",
      href: "/ads?location=Sakarya&district=Hendek",
      count:
        data?.filter((x: any) => x?.address?.district === "Hendek").length || 0,
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
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const imageVariants: Variants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="locations"
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
              Lokasyonlar
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Türkiye&apos;nin{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Her Yerinden
            </span>{" "}
            İlanlar
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Türkiye&apos;nin en gözde lokasyonlarından satılık ve kiralık
            konutları keşfedin
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Link
              href="/ads"
              className="group inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:gap-4"
            >
              <span>Tüm Şehirleri Görüntüle</span>
              <ExternalLink
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                size={16}
              />
            </Link>
          </motion.div>
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
              768: {
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
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            loop={true}
          >
            {locations.map((location, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  onClick={() => {
                    window.location.href = location.href;
                  }}
                  className="group cursor-pointer relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-blue-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden h-48">
                    <motion.img
                      variants={imageVariants}
                      whileHover="hover"
                      src={location.image}
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-300">
                        <MapPin className="text-gray-700 text-sm" size={14} />
                        <span className="text-gray-800 font-semibold text-sm">
                          {location.count} İlan
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6 text-center">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      {location.title}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                    >
                      <MapPin className="text-sm" size={14} />
                      <span className="text-sm font-medium">Sakarya</span>
                    </motion.div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            id="customSwiper"
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
                {locations.reduce((acc, loc) => acc + loc.count, 0)}+
              </span>{" "}
              aktif ilan ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;
