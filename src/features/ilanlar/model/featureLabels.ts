// src/features/ads/model/featureLabels.ts

export type ResolveFeatureLabelInput = {
  featureId?: string | null;
  title?: string | null;
  name?: string | null;
  /**
   * Map'te yoksa fallback formatı:
   * "Özellik (xxxxxx)"
   */
  fallbackPrefix?: string;
};

function cleanLabel(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim();
}

function last6(id: string): string {
  const s = String(id || "").trim();
  return s.length > 6 ? s.slice(-6) : s;
}

/**
 * Bazı endpoint'lerde featureId string-key olarak geliyor (elevator, netArea vs).
 * Bunları da label'a çevir.
 */
export const FEATURE_LABELS_BY_KEY: Record<string, string> = {
  grossArea: "m² (Brüt)",
  netArea: "m² (Net)",
  roomCount: "Oda Sayısı",
  buildingAge: "Bina Yaşı",
  floor: "Bulunduğu Kat",
  totalFloor: "Kat Sayısı",
  heating: "Isıtma",
  deed: "Tapu Durumu",
  balcony: "Balkon",
  balconyCount: "Balkon Sayısı",
  elevator: "Asansör",
  furniture: "Eşyalı",
  inSite: "Site İçerisinde",
  whichSide: "Cephe",
  siteName: "Site Adı",
  acre: "Dönüm",
  zoningStatus: "İmar Durumu",
  swap: "Takas",
};

/**
 * Mongo ObjectId gibi gelen gerçek featureId -> label map'i.
 * Şu anki liste uid=336 response'undan türetildi.
 *
 * Not: Bazı alanlar (özellikle yes/no çıkanlar) backend resolve olmadığı için
 * yüzde 100 garanti değil; ama UI'da "Özellik" yerine insan gibi başlık göstermek için yeterli.
 * Yanlış gördüklerini burada düzeltirsin (1 dakikalık iş).
 */
export const FEATURE_LABELS_BY_ID: Record<string, string> = {
  // Temel ölçüler
  "6968858ccd76859b79ca9451": "m² (Brüt)",
  "6968859ccd76859b79ca9475": "m² (Net)",
  "696885f0cd76859b79ca949a": "Oda Sayısı",
  "6968868ccd76859b79ca94c0": "Bina Yaşı",
  "69688813cd76859b79ca94e7": "Bulunduğu Kat",
  "6968891ccd76859b79ca950f": "Kat Sayısı",
  "69688994cd76859b79ca9538": "Isıtma",
  "696889dfcd76859b79ca9562": "Banyo Sayısı",

  // Seçim alanları (uid=336 çıktısına göre)
  // Kapalı değerinin "Mutfak" olması çok olası (Açık/Kapalı)
  "69688a12cd76859b79ca958d": "Mutfak",

  // Var/Yok/No tipleri (uid=336'da backend label yok, tahmini eşleştirme)
  "69688a3dcd76859b79ca95b9": "Balkon",
  "69688a97cd76859b79ca95e6": "Asansör",
  "69688acccd76859b79ca9614": "Eşyalı",
  "69688aeacd76859b79ca9643": "Site İçerisinde",
  "69688b68cd76859b79ca96d6": "Takas",
  "69688c64cd76859b79ca97a8": "Krediye Uygun",

  // Sayısal / metin
  "69688b43cd76859b79ca96a4": "Aidat (TL)",
  "69688ba4cd76859b79ca9709": "Gayrimenkul Sahibi",
  "69688c3fcd76859b79ca9772": "EIDS No",
  "69688c91cd76859b79ca97df": "Site Adı",
  "69688cc4cd76859b79ca9817": "Cephe",

  // Çoklu-seçim kümeleri (checkbox listeleri)
  "69689afccd76859b79ca9890": "Dış Özellikler",
  "6968c530cd76859b79ca9b59": "Konum / Çevre",

  // Fiyat
  "6968c87ccd76859b79ca9c16": "Fiyat",

  // Boş gelenler ({}): şimdilik genel label verelim
  "69688e3dcd76859b79ca9850": "Diğer",
  "6968a96fcd76859b79ca9939": "Diğer",
  "6968c4cdcd76859b79ca9b1c": "Diğer",
  "6968c6cccd76859b79ca9b97": "Diğer",
  "6968c860cd76859b79ca9bd6": "Diğer",
};

/**
 * Backend resolve yaparsa title/name gelir, onu direkt kullanırız.
 * Yapmazsa: key-map -> id-map -> fallback "Özellik (xxxxxx)".
 */
export function resolveFeatureLabel(input: ResolveFeatureLabelInput): string {
  const prefix = cleanLabel(input.fallbackPrefix) || "Özellik";

  const title = cleanLabel(input.title);
  if (title) return title;

  const name = cleanLabel(input.name);
  if (name) return name;

  const rawId = cleanLabel(input.featureId);
  if (!rawId) return prefix;

  // string-key geldiyse
  const byKey = FEATURE_LABELS_BY_KEY[rawId];
  if (byKey) return byKey;

  // gerçek id geldiyse
  const byId = FEATURE_LABELS_BY_ID[rawId];
  if (byId) return byId;

  return `${prefix} (${last6(rawId)})`;
}

/**
 * UI'da düzgün value göstermek için (object/array -> string).
 * İstersen PriceSummarySection'da toText yerine bunu da kullanabilirsin.
 */
export function normalizeFeatureValue(v: any): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";

  // {Kombi ( ... )} gibi garip PS görünümlerine karşı
  if (Array.isArray(v)) {
    return v.map(normalizeFeatureValue).filter(Boolean).join(", ");
  }

  // {} boşsa boş dön
  if (typeof v === "object") {
    const keys = Object.keys(v || {});
    if (keys.length === 0) return "";
    // Bazı backendler set/dict gibi döndürür: { a: true, b: true } vs.
    // Değerleri string yapıp basitçe birleştir.
    return keys
      .map((k) => normalizeFeatureValue((v as any)[k]) || k)
      .filter(Boolean)
      .join(", ");
  }

  return String(v).trim();
}
