// src/features/ads/ui/detail/utils/featureIcons.ts

export const featureIcons = {
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

export type FeatureIconKey = keyof typeof featureIcons;

export function getFeatureIcon(key: string): string {
  const k = String(key ?? "").trim() as FeatureIconKey;
  return featureIcons[k] ?? "🏷️";
}
