// src/features/home/image-slider/data/slides.ts
import type { SliderSlide } from "../types";

export const slides: SliderSlide[] = [
  {
    image: "/home_1.jpg",
    alt: "ilan",
    heading: "Yenigün Emlak",
    lines: ["biz buradayız!"],
    cta: { href: "/about", label: "Detaylar için tıklayın" },
  },
  {
    image: "/home_2.jpg",
    alt: "ilan",
    heading: "Yenigün Emlak",
    lines: ["Çeşitliliğimizle istediğiniz", "eve kavuşabilirsiniz"],
    cta: { href: "/about", label: "Detaylar için tıklayın" },
  },
];
