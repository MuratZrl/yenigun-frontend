// src/features/admin/emlak-archived-detail/types.ts

export type { AdvertData, SimilarAd } from "@/types/advert";

export interface ZoomState {
  show: boolean;
  photo: string;
  level: number;
}

export const FEATURE_ICONS = {
  area: "📐",
  rooms: "🚪",
  age: "🏢",
  floor: "📊",
  heating: "🔥",
  bathroom: "🚿",
  elevator: "🛗",
  balcony: "🌿",
  furniture: "🛋️",
  site: "🏘️",
} as const;