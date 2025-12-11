"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import {
  ExternalLink,
  Flame,
  Link as LinkIcon,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import CategorySidebar from "./SidebarCategoryFilter";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface HighlightProps {
  data: any[];
}

const Highlights = ({ data }: HighlightProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const copyToClipboard = (uid: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(`${window.location.origin}/ads/${uid}`);
    setCopiedId(uid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCardClick = (uid: string) => {
    window.location.href = `/ads/${uid}`;
  };

  const filteredData = data.filter(
    (item: any) => item.photos && item.photos.length > 0
  );

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -6,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants: Variants = {
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <section
      id="highlights"
      className="min-h-screen py-12 md:py-16 flex flex-col px-4 md:px-6 xl:w-[90%] mx-auto gap-12 md:gap-16 relative overflow-hidden"
      style={PoppinsFont.style}
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-4 md:gap-6 text-center relative z-10 px-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 md:w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
          <span className="text-blue-500 font-semibold tracking-wider uppercase text-xs md:text-sm">
            Öne Çıkan İlanlar
          </span>
          <div className="w-8 md:w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-500"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
        >
          Fırsatları Kaçırmayın
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Özenle seçilmiş en değerli mülkler. Hayalinizdeki yaşam alanını
          keşfedin.
        </motion.p>
      </motion.div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 md:gap-8 w-full">
        {/* Kategori Sidebar - Sol */}
        <div className="lg:w-1/4">
          <div className="sticky top-6">
            <CategorySidebar />
          </div>
        </div>

        {/* İlanlar Grid - Sağ */}
        <div className="lg:w-3/4">
          {/* İlan Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {visibleData.map((item: any, index: number) => (
              <motion.div
                key={item.uid}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => handleCardClick(item.uid)}
                className="group cursor-pointer bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* Resim Alanı */}
                <div className="relative overflow-hidden h-48 md:h-56">
                  <motion.img
                    variants={imageVariants}
                    whileHover="hover"
                    src={item.photos.find(
                      (photo: any) => typeof photo === "string"
                    )}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Öne Çıkan Badge */}
                  {item.isHighlight && (
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-xs shadow-lg">
                        <Flame className="text-white" size={12} />
                        <span>Öne Çıkan</span>
                      </div>
                    </div>
                  )}

                  {/* Fiyat */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="py-2 px-4 rounded-lg bg-white/95 backdrop-blur-sm font-bold text-gray-900 text-base md:text-lg shadow-lg">
                      {item.fee}
                    </div>
                  </div>

                  {/* Link Kopyala Butonu */}
                  <div className="absolute top-3 right-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => copyToClipboard(item.uid, e)}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200 relative"
                    >
                      <LinkIcon className="text-gray-700" size={14} />
                      {copiedId === item.uid && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 py-1 px-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap"
                        >
                          Link kopyalandı!
                        </motion.span>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* İçerik Alanı */}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  {/* Başlık */}
                  <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
                    {item.title}
                  </h3>

                  {/* Konum */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3 md:mb-4">
                    <MapPin
                      className="text-orange-500 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-xs md:text-sm font-medium truncate">
                      {item.address.province} / {item.address.district}
                    </span>
                  </div>

                  {/* Özellikler (opsiyonel - eğer datada varsa) */}
                  {(item.features?.bedrooms ||
                    item.features?.bathrooms ||
                    item.features?.size) && (
                    <div className="flex items-center justify-between mb-3 md:mb-4 bg-gray-50 rounded-lg p-2">
                      {item.features.bedrooms && (
                        <div className="flex flex-col items-center flex-1">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Bed size={14} />
                            <span className="text-xs font-semibold">
                              {item.features.bedrooms}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1">
                            Yatak Odası
                          </span>
                        </div>
                      )}

                      {item.features.bathrooms && (
                        <div className="flex flex-col items-center flex-1 border-x border-gray-200">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Bath size={14} />
                            <span className="text-xs font-semibold">
                              {item.features.bathrooms}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1">
                            Banyo
                          </span>
                        </div>
                      )}

                      {item.features.size && (
                        <div className="flex flex-col items-center flex-1">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Square size={14} />
                            <span className="text-xs font-semibold">
                              {item.features.size}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1">
                            m²
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kategori ve Tip */}
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="text-xs font-semibold text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full">
                      {item.steps?.second || "Konut"}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {item.steps?.first || "Satılık"}
                    </span>
                  </div>

                  {/* Açıklama (kısa) */}
                  {item.thoughts && (
                    <p
                      className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2 mb-3 md:mb-4 flex-1"
                      dangerouslySetInnerHTML={{
                        __html:
                          item.thoughts
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 80) + "...",
                      }}
                    />
                  )}

                  {/* Detay Butonu */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto"
                  >
                    <button className="w-full py-2.5 md:py-3 bg-linear-to-rrom-blue-900 to-blue-700 text-white rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 group">
                      <span className="flex items-center justify-center gap-1.5 md:gap-2">
                        İncele
                        <ExternalLink
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                          size={12}
                        />
                      </span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daha Fazla Göster Butonu */}
          {visibleCount < filteredData.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mt-8 md:mt-12"
            >
              <button
                onClick={loadMore}
                className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:gap-3 md:hover:gap-4"
              >
                <span>
                  Daha Fazla Göster ({filteredData.length - visibleCount} ilan
                  kaldı)
                </span>
                <ExternalLink
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                  size={14}
                />
              </button>
            </motion.div>
          )}

          {/* İlan Yoksa Mesaj */}
          {filteredData.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-500" size={32} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  İlan Bulunamadı
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen farklı
                  filtreler deneyin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tüm İlanları Görüntüle Butonu - SAYFANIN ORTASINA ALINDI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center mt-2 md:mt-4 w-full"
      >
        <div className="w-full flex justify-center">
          <Link
            href="/ads"
            className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-2.5 md:py-3 bg-linear-to-r from-blue-500 to-blue-900 text-white rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:gap-3 md:hover:gap-4"
          >
            <span>Tüm İlanları Görüntüle</span>
            <ExternalLink
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              size={14}
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Highlights;
