// src/features/home/image-slider/types.ts
export type SliderSlide = {
  image: string;
  alt: string;
  heading: string;
  subtitle: string;
  lines: string[];
  cta: {
    href: string;
    label: string;
  };
};
