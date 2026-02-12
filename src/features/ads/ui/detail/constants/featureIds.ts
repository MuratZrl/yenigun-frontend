// src/features/ads/ui/detail/constants/featureIds.ts

// Feature ID mappings for fallback resolution
export const FEATURE_FALLBACK_IDS = {
  grossArea: ["6968858ccd76859b79ca9451"],
  netArea: ["6968859ccd76859b79ca9475"],
  roomCount: ["696885f0cd76859b79ca949a"],
  buildingAge: ["6968868ccd76859b79ca94c0"],
  floor: ["69688813cd76859b79ca94e7"],
  totalFloor: ["6968891ccd76859b79ca950f"],
  heating: ["69688994cd76859b79ca9538"],
  bathCount: ["696889dfcd76859b79ca9562"],
  parking: ["69688a12cd76859b79ca958d"],
  siteName: ["69688c91cd76859b79ca97df"],
  eidsNo: ["69688c3fcd76859b79ca9772"],
  priceAmount: ["6968c87ccd76859b79ca9c16"],
} as const;

// Label mappings for details object
export const DETAILS_FIELD_LABELS: Record<string, string> = {
  roomCount: "Oda Sayısı",
  netArea: "m² (Net)",
  grossArea: "m² (Brüt)",
  buildingAge: "Bina Yaşı",
  elevator: "Asansör",
  inSite: "Site İçerisinde",
  whichSide: "Cephe",
  acre: "Dönüm",
  zoningStatus: "İmar Durumu",
  floor: "Bulunduğu Kat",
  totalFloor: "Kat Sayısı",
  balcony: "Balkon",
  balconyCount: "Balkon Sayısı",
  furniture: "Eşyalı",
  heating: "Isıtma",
  deed: "Tapu Durumu",
  siteName: "Site Adı",
  swap: "Takas",
};
