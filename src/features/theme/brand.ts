// src/features/theme/brand.ts
export const brand = {
  navy: "#000066",
  blue: "#035DBA",
  blue2: "#03409F",
  red: "#FA1919",
  light: "#E9EEF7",
} as const;

export type BrandColorKey = keyof typeof brand;
