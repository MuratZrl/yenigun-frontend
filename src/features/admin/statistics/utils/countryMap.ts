// src/features/admin/statistics/utils/countryMap.ts

/**
 * GSC 3-letter country codes to Turkish display names and flag emojis.
 * GSC returns lowercase 3-letter ISO codes (e.g. "tur", "deu", "usa").
 */
export const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  tur: { name: "Turkiye", flag: "\u{1F1F9}\u{1F1F7}" },
  deu: { name: "Almanya", flag: "\u{1F1E9}\u{1F1EA}" },
  usa: { name: "ABD", flag: "\u{1F1FA}\u{1F1F8}" },
  gbr: { name: "Birlesik Krallik", flag: "\u{1F1EC}\u{1F1E7}" },
  nld: { name: "Hollanda", flag: "\u{1F1F3}\u{1F1F1}" },
  fra: { name: "Fransa", flag: "\u{1F1EB}\u{1F1F7}" },
  aze: { name: "Azerbaycan", flag: "\u{1F1E6}\u{1F1FF}" },
  ita: { name: "Italya", flag: "\u{1F1EE}\u{1F1F9}" },
  esp: { name: "Ispanya", flag: "\u{1F1EA}\u{1F1F8}" },
  rus: { name: "Rusya", flag: "\u{1F1F7}\u{1F1FA}" },
  sau: { name: "Suudi Arabistan", flag: "\u{1F1F8}\u{1F1E6}" },
  are: { name: "BAE", flag: "\u{1F1E6}\u{1F1EA}" },
  bel: { name: "Belcika", flag: "\u{1F1E7}\u{1F1EA}" },
  aut: { name: "Avusturya", flag: "\u{1F1E6}\u{1F1F9}" },
  che: { name: "Isvicre", flag: "\u{1F1E8}\u{1F1ED}" },
  swe: { name: "Isvec", flag: "\u{1F1F8}\u{1F1EA}" },
  nor: { name: "Norvec", flag: "\u{1F1F3}\u{1F1F4}" },
  dnk: { name: "Danimarka", flag: "\u{1F1E9}\u{1F1F0}" },
  can: { name: "Kanada", flag: "\u{1F1E8}\u{1F1E6}" },
  aus: { name: "Avustralya", flag: "\u{1F1E6}\u{1F1FA}" },
  grc: { name: "Yunanistan", flag: "\u{1F1EC}\u{1F1F7}" },
  bgr: { name: "Bulgaristan", flag: "\u{1F1E7}\u{1F1EC}" },
  rou: { name: "Romanya", flag: "\u{1F1F7}\u{1F1F4}" },
  irq: { name: "Irak", flag: "\u{1F1EE}\u{1F1F6}" },
  geo: { name: "Gurcistan", flag: "\u{1F1EC}\u{1F1EA}" },
  ukr: { name: "Ukrayna", flag: "\u{1F1FA}\u{1F1E6}" },
  kaz: { name: "Kazakistan", flag: "\u{1F1F0}\u{1F1FF}" },
};

/**
 * Resolve a GSC country code to display info.
 */
export function resolveCountry(code: string): { name: string; flag: string } {
  const lower = code.toLowerCase();
  return COUNTRY_MAP[lower] ?? { name: code.toUpperCase(), flag: "\u{1F30D}" };
}
