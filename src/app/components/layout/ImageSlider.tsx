import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Swiper instance için tip tanımı
interface SwiperInstance {
  swiper?: {
    slidePrev: () => void;
    slideNext: () => void;
  };
}

const ImageSlider = () => {
  React.useEffect(() => {
    const customSwiper = document.getElementById("customArrows");
    const nextButton = document.querySelector(
      "#image-slider .swiper-button-next"
    );
    const prevButton = document.querySelector(
      "#image-slider .swiper-button-prev"
    );

    if (customSwiper && prevButton && nextButton) {
      customSwiper.appendChild(prevButton);
      customSwiper.appendChild(nextButton);
    }
  }, []);

  return (
    <section id="image-slider" className="relative" style={PoppinsFont.style}>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        navigation={true}
        modules={[Navigation]}
        direction="vertical"
        speed={1500}
        style={{ height: "100vh" }}
      >
        <SwiperSlide className="h-screen relative">
          <img
            src="/home_1.jpg"
            alt="ilan"
            className="object-cover h-screen w-full"
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-[5%] md:left-[15%] flex flex-col items-start gap-3">
            <h1 className="text-white text-xl md:text-3xl font-semibold">
              Yenigün Emlak
            </h1>
            <p className="text-white font-bold text-3xl md:text-6xl">
              biz buradayız!
            </p>
            <Link
              href="/about"
              className="py-2 px-4 bg-custom-orange text-white rounded-xl hover:bg-orange-600 transition-colors duration-300"
            >
              Detaylar için tıklayın
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-screen relative">
          <img
            src="/home_2.jpg"
            alt="ilan"
            className="object-cover h-full w-full"
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-[5%] md:left-[15%] flex flex-col items-start gap-2">
            <h1 className="text-white text-xl md:text-3xl font-semibold">
              Yenigün Emlak
            </h1>
            <p className="text-white font-bold text-3xl md:text-5xl">
              Çeşitliliğimizle istediğiniz
            </p>
            <p className="text-white font-bold text-3xl md:text-5xl">
              eve kavuşabilirsiniz
            </p>
            <Link
              href="/about"
              className="py-2 px-4 bg-custom-orange rounded-xl text-white text-lg hover:bg-orange-600 transition-colors duration-300"
            >
              Detaylar için tıklayın
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        id="customArrows"
        className="absolute top-[80%] md:top-1/2 -translate-y-1/2 right-1/4 translate-x-0 z-70 flex flex-col items-center justify-center gap-10"
      />
    </section>
  );
};

export default ImageSlider;
