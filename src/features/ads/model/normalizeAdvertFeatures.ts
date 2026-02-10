// src/features/ads/model/normalizeAdvertFeatures.ts
import type { AdvertData, FeatureValue } from "@/types/advert";

function isTruthyString(v: any) {
  return typeof v === "string" && v.trim() !== "";
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "number") return String(v);
  return String(v).trim();
}

/**
 * FeatureValue içinden label yakala:
 * backend resolve ettiyse title/name gelir.
 * gelmiyorsa id ile devam eder (en azından "tam" gösterim için).
 */
function getFeatureLabel(fv: any): string {
  const label = toText(fv?.title || fv?.name || fv?.label);
  if (label) return label;
  const id = toText(fv?.featureId || fv?.id || fv?._id);
  return id ? `#${id}` : "Bilinmeyen Özellik";
}

/**
 * Eğer backend resolve ettiyse group/facility gibi alanlar olabilir.
 * Yoksa hepsini "Özellikler" altında topla.
 */
function getFeatureGroup(fv: any): string {
  const g =
    toText(fv?.group) ||
    toText(fv?.facilityTitle) ||
    toText(fv?.facility) ||
    "";
  return g || "Özellikler";
}

export type NormalizedFeature = {
  group: string;
  label: string;
  value: string;
  source: "details" | "features";
};

/**
 * Burada amaç: "tam liste" üretmek.
 * details (legacy) + featureValues (new) birleşir.
 * Aynı label varsa details üstün.
 */
export function normalizeAdvertFeatures(data: AdvertData) {
  const out: NormalizedFeature[] = [];

  const details: any = (data as any)?.details ?? {};
  const isFeatures = Boolean((data as any)?.isFeatures);

  // 1) Legacy details -> feature list (senin projendeki alanlara göre çoğaltabilirsin)
  // Burada sadece örnek veriyorum; asıl amaç featureValues’u kaçırmamak.
  const legacyPairs: Array<[string, any]> = [
    ["m² (Brüt)", details?.grossArea],
    ["m² (Net)", details?.netArea],
    ["Oda Sayısı", details?.roomCount],
    ["Bina Yaşı", details?.buildingAge],
    ["Bulunduğu Kat", details?.floor],
    ["Kat Sayısı", details?.totalFloor],
    ["Isıtma", details?.heating],
    ["Banyo Sayısı", details?.bathCount],
    ["Balkon", details?.balcony],
    ["Asansör", details?.elevator],
    ["Eşyalı", details?.furniture],
    ["Site İçerisinde", details?.inSite],
    ["Site Adı", details?.siteName],
    ["Otopark", details?.parking || details?.park],
    ["Tapu Durumu", details?.deed],
    ["Takas", details?.swap],
  ];

  for (const [label, raw] of legacyPairs) {
    const v = toText(raw);
    if (!v) continue;
    out.push({ group: "Detaylar", label, value: v, source: "details" });
  }

  // 2) New features -> featureValues
  const rawFV = (data as any)?.featureValues;
  const featureValues: FeatureValue[] = Array.isArray(rawFV) ? rawFV : [];

  for (const fv of featureValues) {
    const label = getFeatureLabel(fv);
    const value = toText((fv as any)?.value);
    if (!value) continue;
    out.push({
      group: getFeatureGroup(fv),
      label,
      value,
      source: "features",
    });
  }

  // 3) Dedup: aynı label birden çoksa details üstün, sonra features
  const dedup = new Map<string, NormalizedFeature>();
  for (const item of out) {
    const key = item.label.trim().toLowerCase();
    const prev = dedup.get(key);
    if (!prev) {
      dedup.set(key, item);
      continue;
    }
    if (prev.source === "features" && item.source === "details") {
      dedup.set(key, item);
    }
  }

  // 4) Group’lara göre sırala (isteğe bağlı)
  const final = Array.from(dedup.values());

  return {
    isFeatures,
    features: final,
  };
}
