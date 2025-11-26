"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import {
  ExternalLink,
  Flame,
  Heart,
  Link as LinkIcon,
  Home,
  Bath,
  Building,
  MapPin,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface HighlightProps {
  data: any[];
}

const Highlights = ({ data }: HighlightProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

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
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
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

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <section
      id="highlights"
      className="min-h-screen py-16 flex flex-col px-6 xl:w-[90%] mx-auto gap-16 relative overflow-hidden"
      style={PoppinsFont.style}
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
          <span className="text-blue-500 font-semibold tracking-wider uppercase text-sm">
            Öne Çıkan İlanlar
          </span>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-500"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Fırsatları Kaçırmayın
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Özenle seçilmiş en değerli mülkler. Hayalinizdeki yaşam alanını
          keşfedin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-4"
        >
          <Link
            href="/ads"
            className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:gap-4"
          >
            <span>Tüm İlanları Görüntüle</span>
            <ExternalLink
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              size={16}
            />
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {visibleData.map((item: any, index: number) => (
            <motion.div
              key={item.uid}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => handleCardClick(item.uid)}
              className="group cursor-pointer bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="relative overflow-hidden h-64">
                <motion.img
                  variants={imageVariants}
                  whileHover="hover"
                  src={item.photos.find(
                    (photo: any) => typeof photo === "string"
                  )}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.isHighlight && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-2 py-2 px-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg"
                    >
                      <Flame className="text-white" size={14} />
                      <span>Öne Çıkan</span>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="py-1.5 px-4 rounded-full bg-white/95 backdrop-blur-sm font-semibold text-gray-900 text-sm shadow-lg"
                  >
                    {item.fee}
                  </motion.div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => copyToClipboard(item.uid, e)}
                    className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200 relative"
                  >
                    <LinkIcon className="text-gray-700" size={16} />
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

              <div className="p-6">
                <motion.h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </motion.h3>

                <motion.div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="text-orange-500" size={18} />
                  <span className="text-sm font-medium">
                    {item.address.province} / {item.address.district}
                  </span>
                </motion.div>

                <motion.div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {item.steps.second}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {item.steps.first}
                  </span>
                </motion.div>

                {item.thoughts && (
                  <motion.p
                    className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        item.thoughts
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100) + "...",
                    }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button className="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <span className="flex items-center justify-center gap-2">
                      İncele
                      <ExternalLink
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        size={14}
                      />
                    </span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < filteredData.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={loadMore}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:gap-4"
            >
              <span>
                Daha Fazla Göster ({filteredData.length - visibleCount} ilan
                kaldı)
              </span>
              <ExternalLink
                className="transition-transform duration-300 group-hover:translate-y-1"
                size={16}
              />
            </button>
          </motion.div>
        )}

        {visibleCount >= filteredData.length && filteredData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 text-lg font-medium">
              Tüm ilanları görüntülüyorsunuz. Toplam{" "}
              <span className="text-blue-600 font-bold">
                {filteredData.length}
              </span>{" "}
              ilan listeleniyor.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Highlights;
