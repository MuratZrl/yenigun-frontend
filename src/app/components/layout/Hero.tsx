"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, MapMinus, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const heroData = [
  {
    backgroundImage: "/turkey.jpg",
    headline: "Sakarya'da Hayalinizdeki Evi Bulun",
    subtitle: "Profesyonel danışmanlık ile hayalinizdeki yaşam alanına kavuşun",
  },
  {
    backgroundImage: "/akyazi.jpg",
    headline: "Sakarya'da Mükemmel Mahalleyi Keşfedin",
    subtitle: "En gözde lokasyonlarda size özel seçenekler",
  },
  {
    backgroundImage: "/karasu.jpg",
    headline: "Karasu'da Lüks Yaşam Sizi Bekliyor",
    subtitle: "Deniz manzaralı premium konut fırsatları",
  },
];

const popularCities = [
  "Serdivan",
  "Adapazarı",
  "Sapanca",
  "Karasu",
  "Akyazı",
  "Hendek",
  "Erenler",
  "Arifiye",
];

const propertyTypes = [
  "Hepsi",
  "Daire",
  "Villa",
  "Rezidans",
  "Müstakil Ev",
  "Yazlık",
  "Ofis",
  "Arsa",
  "Dükkan",
  "Depo",
];

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchValue, setSearchValue] = useState({
    keyword: "",
    type: "Hepsi",
    location: "",
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue.keyword) params.append("q", searchValue.keyword);
    if (searchValue.type !== "Hepsi") params.append("type", searchValue.type);
    if (searchValue.location) params.append("location", searchValue.location);
    router.push(`/ads?${params.toString()}`);
  };

  const handlePopularCityClick = (city: string) => {
    setSearchValue({ ...searchValue, location: city });
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        {heroData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${item.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={`headline-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight drop-shadow-2xl">
              {heroData[currentSlide].headline}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
              {heroData[currentSlide].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-5 border border-white/20 shadow-2xl mb-6 relative z-20"
          >
            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
              <div className="relative flex-1 min-w-[150px]">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center justify-between w-full py-3 px-5 rounded-lg bg-white text-gray-800 text-sm font-medium border border-gray-300 hover:border-blue-500 transition-all duration-300 shadow-md"
                >
                  <span className="truncate">{searchValue.type}</span>
                  <motion.div
                    animate={{ rotate: showTypeDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-gray-500 text-xs" />
                  </motion.div>
                </button>

                {showTypeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-30"
                  >
                    {propertyTypes.map((type, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSearchValue({ ...searchValue, type });
                          setShowTypeDropdown(false);
                        }}
                      >
                        <span
                          className={`${
                            searchValue.type === type
                              ? "text-blue-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {type}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <MapMinus className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Konum ara (örn. Sakarya, Serdivan)..."
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white text-gray-800 placeholder-gray-400 text-sm border border-gray-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 shadow-md"
                  value={searchValue.location}
                  onChange={(e) =>
                    setSearchValue({ ...searchValue, location: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Search className="text-sm" />
                <span>Ara</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-gray-300 text-xs font-medium mb-3">
              Popüler Lokasyonlar:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularCities.map((city, i) => (
                <motion.button
                  key={i}
                  whileHover={{
                    y: -2,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-300 text-xs ${
                    searchValue.location === city
                      ? "border-blue-400 bg-blue-500/20 text-white shadow-md"
                      : "border-white/30 bg-white/10 text-gray-200 hover:border-white/50 hover:bg-white/15"
                  }`}
                  onClick={() => handlePopularCityClick(city)}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {heroData.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
