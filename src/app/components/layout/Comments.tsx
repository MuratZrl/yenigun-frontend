"use client";
import React, { useEffect } from "react";
import { Poppins } from "next/font/google";
import { Quote, Star } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const quoteVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const Comments = () => {
  useEffect(() => {
    const customSwiper2 = document.getElementById("customSwiper2");
    const nextButton = document.querySelector("#comments .swiper-button-next");
    const prevButton = document.querySelector("#comments .swiper-button-prev");
    const pagination = document.querySelector("#comments .swiper-pagination");

    if (customSwiper2 && prevButton && pagination && nextButton) {
      customSwiper2.innerHTML = "";

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
        const swiper = document.querySelector("#comments .swiper") as any;
        if (swiper && swiper.swiper) {
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
        const swiper = document.querySelector("#comments .swiper") as any;
        if (swiper && swiper.swiper) {
          swiper.swiper.slideNext();
        }
      };

      navContainer.appendChild(customPrev);
      navContainer.appendChild(pagination);
      navContainer.appendChild(customNext);
      customSwiper2.appendChild(navContainer);
    }
  }, []);

  const data = [
    {
      title: "Harika Deneyim",
      comment:
        "Yenigün Emlak ile çalışmak harika bir deneyimdi. Danışmanlarımızın profesyonel yaklaşımı ve süreç boyunca gösterdikleri özen sayesinde hayalimizdeki evi bulduk.",
      star: 5,
      author: {
        title: "Defne A***",
        image: "/human.jpeg",
        location: "Serdivan, Sakarya",
        job: "Doktor",
      },
    },
    {
      title: "Güvenilir Hizmet",
      comment:
        "Emlak danışmanımız bize sadece ev bulmakla kalmadı, aynı zamanda tüm süreçte rehberlik etti. Samimi ve güvenilir hizmetleri için çok teşekkür ederiz. Kesinlikle tavsiye ediyoruz.",
      star: 5,
      author: {
        title: "Doruk K***",
        image: "/human_2.jpeg",
        location: "Adapazarı, Sakarya",
        job: "Mühendis",
      },
    },
    {
      title: "Profesyonel Ekip",
      comment:
        "Ev alma sürecimizde Yenigün Emlak ekibi adeta bir aile gibi yanımızdaydı. Her sorumuza anında cevap verdiler ve işlemlerimiz sorunsuz ilerledi. Çok memnun kaldık!",
      star: 5,
      author: {
        title: "Ahmet M***",
        image: "/human_3.jpeg",
        location: "Sapanca, Sakarya",
        job: "Öğretmen",
      },
    },
    {
      title: "Mükemmel Destek",
      comment:
        "Yenigün Emlak'ın ilgili ve bilgili ekibi sayesinde istediğimiz özelliklere uygun birçok seçenek bulduk. Sürecin her aşamasında destek aldığımız için çok şanslıyız.",
      star: 5,
      author: {
        title: "Melih C***",
        image: "/human_4.jpeg",
        location: "Karasu, Sakarya",
        job: "İş Adamı",
      },
    },
    {
      title: "Kaliteli Hizmet",
      comment:
        "Emlak piyasasında bu kadar profesyonel ve müşteri odaklı bir firma bulmak gerçekten zor. Yenigün Emlak, verdiği kaliteli hizmetle fark yaratıyor. Teşekkürler!",
      star: 5,
      author: {
        title: "Arya R***",
        image: "/human_5.jpeg",
        location: "Akyazı, Sakarya",
        job: "Mimar",
      },
    },
    {
      title: "Hızlı Çözüm",
      comment:
        "Acil ev ihtiyacımız vardı ve Yenigün Emlak ekibi inanılmaz hızlı hareket etti. Bir hafta içinde istediğimiz kriterlere uygun ev buldular. Süper bir ekip!",
      star: 5,
      author: {
        title: "Can Y***",
        image: "/human_3.jpeg",
        location: "Hendek, Sakarya",
        job: "Serbest Meslek",
      },
    },
  ];

  return (
    <section
      id="comments"
      className={`min-h-screen py-20 relative overflow-hidden bg-white ${PoppinsFont.className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>

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
              Müşteri Yorumları
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Müşterilerimizin{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Deneyimleri
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak ile hayallerine kavuşan müşterilerimizin samimi geri
            bildirimleri
          </motion.p>
        </motion.div>

        <div className="relative">
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
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
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            loop={true}
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="group cursor-pointer relative h-full"
                >
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-500"></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>

                  <div className="relative p-6 z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                      >
                        {item.title}
                      </motion.h3>

                      <motion.div
                        variants={quoteVariants}
                        whileHover="hover"
                        className="p-2 bg-blue-100 rounded-lg text-blue-600"
                      >
                        <Quote className="text-lg" />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-1 mb-4"
                    >
                      {Array.from({ length: item.star }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="text-yellow-400 text-sm"
                        />
                      ))}
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-gray-600 leading-relaxed mb-6 flex-grow text-sm"
                    >
                      &quot;{item.comment}&quot;
                    </motion.p>

                    <div className="w-full h-px bg-gray-200 mb-4"></div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <img
                          src={item.author.image}
                          alt={item.author.title}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.author.title}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          {item.author.job}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {item.author.location}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500"></div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            id="customSwiper2"
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
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gray-50 border border-gray-200 rounded-2xl px-8 py-6">
            <div className="text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-1">
                Siz de Deneyiminizi Paylaşın
              </h4>
              <p className="text-gray-600 text-sm">
                Yenigün Emlak ile yaşadığınız deneyimi diğer müşterilerle
                paylaşın
              </p>
            </div>
            <motion.a
              href="https://www.google.com/search?sxsrf=AE3TifOz_53UEsPmdjk3plapYmFL-lSFLg:1760650910291&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s14ENo7E3CKEIDpeTFIxSFDternuNADdiL6Dxydba6Am5dL3FsMVORrI-MCCU57NhWwVxb_H3zDQbZkjDFXSO8Hofvil&q=Yenigun+Emlak+Reviews"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              target="_blank"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Yorum Yap
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Comments;
