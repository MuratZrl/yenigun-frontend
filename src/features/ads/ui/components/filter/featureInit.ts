// src/features/ads/ui/components/filter/featureInit.ts
import type { Feature } from "@/types/advert";

/**
 * currentFeatures listesine göre, featureFilters içinde olmayan alanlara default değerleri üretir.
 * Bu fonksiyon "mutasyon" yapmaz, sadece eksikleri döner.
 */
export function buildMissingFeatureDefaults(args: {
  currentFeatures: Feature[];
  featureFilters: Record<string, any>;
}) {
  const { currentFeatures, featureFilters } = args;

  const missing: Record<string, any> = {};

  for (const feature of currentFeatures) {
    if (featureFilters[feature._id] !== undefined) continue;

    if (feature.type === "multi_select") missing[feature._id] = [];
    else if (feature.type === "boolean") missing[feature._id] = false;
    else if (feature.type === "range") missing[feature._id] = { min: null, max: null };
    else missing[feature._id] = "";
  }

  return missing;
}

/**
 * currentFeatures listesine göre featureFilters’i güvenli hale getirir.
 * - Eksikleri default ile tamamlar
 * - Var olanları dokunmaz
 */
export function ensureFeatureFiltersInitialized(args: {
  currentFeatures: Feature[];
  featureFilters: Record<string, any>;
}) {
  const { currentFeatures, featureFilters } = args;
  const missing = buildMissingFeatureDefaults({ currentFeatures, featureFilters });
  if (Object.keys(missing).length === 0) return featureFilters;
  return { ...featureFilters, ...missing };
}
