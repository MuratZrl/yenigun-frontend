// src/features/ads/model/url.ts
import type { FilterState } from "@/types/advert";
import { decodeURLParam } from "./utils";
import { DEFAULT_FILTERS } from "./defaults";

type AnyFilters = FilterState & Record<string, any>;

const EXTRA_FILTER_PREFIX = "f_";

const BASE_FILTER_KEYS = new Set([
  "keyword",
  "location",
  "district",
  "quarter",
  "type",
  "minPrice",
  "maxPrice",
  "sortBy",
  "sortOrder",
  "category",
  "subcategory",
  "subsubcategory",
]);

const TR_CHAR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  I: "i",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

export function slugifyTR(input: string) {
  const s = String(input || "").trim();
  if (!s) return "";
  const mapped = s
    .split("")
    .map((ch) => TR_CHAR_MAP[ch] ?? ch)
    .join("");

  return mapped
    .toLowerCase()
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-")
    .replace(/-+/g, "-");
}

function encodeExtraFilterValue(value: any): string | null {
  if (value === undefined || value === null) return null;
  if (value === "") return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return `a:${value.map(String).join(",")}`;
  }
  if (typeof value === "boolean") return value ? "b:true" : null;
  if (typeof value === "number") return Number.isFinite(value) ? `n:${value}` : null;
  return `s:${String(value)}`;
}

function decodeExtraFilterValue(raw: string) {
  if (raw.startsWith("a:")) {
    const body = raw.slice(2);
    if (!body) return [];
    return body.split(",").map((v) => v.trim()).filter(Boolean);
  }
  if (raw.startsWith("b:")) {
    const v = raw.slice(2).toLowerCase();
    return v === "true" || v === "1";
  }
  if (raw.startsWith("n:")) {
    const n = Number(raw.slice(2));
    return Number.isFinite(n) ? n : null;
  }
  if (raw.startsWith("s:")) return raw.slice(2);
  return raw;
}

function shouldIncludeExtraFilter(key: string, value: any) {
  if (BASE_FILTER_KEYS.has(key)) return false;
  if (value === undefined || value === null) return false;
  if (value === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "boolean" && value === false) return false;

  if (key in DEFAULT_FILTERS && (DEFAULT_FILTERS as any)[key] === value) return false;

  return true;
}

function deslugifyLoose(slug: string) {
  // Tam tersine TR harflerini “kusursuz” geri getiremezsin, o yüzden “loose” bırakıyoruz.
  // Eşleştirme yaparken slugifyTR(realName) === slug karşılaştırmasıyla çözersin.
  return String(slug || "").replace(/-/g, " ").trim();
}

/**
 * Sadece querystring -> state (liste sayfan /ilan için ideal)
 */
export function parseUrlToState(params: URLSearchParams) {
  const sortByParam = params.get("sortBy") ?? DEFAULT_FILTERS.sortBy;
  const sortOrderParam = params.get("sortOrder") ?? DEFAULT_FILTERS.sortOrder;

  const filters: AnyFilters = {
    ...DEFAULT_FILTERS,
    keyword: params.get("q") ? decodeURLParam(params.get("q")!) : "",
    location: params.get("location") ? decodeURLParam(params.get("location")!) : "Hepsi",
    district: params.get("district") ? decodeURLParam(params.get("district")!) : "Hepsi",
    quarter: params.get("quarter") ? decodeURLParam(params.get("quarter")!) : "Hepsi",
    type: params.get("type") ? decodeURLParam(params.get("type")!) : "Hepsi",
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : null,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : null,
    sortBy: sortByParam === "date" || sortByParam === "price" ? sortByParam : "date",
    sortOrder: sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : "desc",
  };

  // Yeni filter yapın category/subcategory/subsubcategory kullanıyorsa query’den de okuyalım.
  if (params.get("category")) filters.category = decodeURLParam(params.get("category")!);
  if (params.get("subcategory")) filters.subcategory = decodeURLParam(params.get("subcategory")!);
  if (params.get("subsubcategory")) filters.subsubcategory = decodeURLParam(params.get("subsubcategory")!);

  const page = params.get("page") ? Number(params.get("page")) : 1;

  const featureFilters: Record<string, any> = {};
  params.forEach((value, key) => {
    if (!key.startsWith("feature_")) return;
    const featureId = key.replace("feature_", "");
    const decodedValue = decodeURLParam(value);

    if (decodedValue.includes(",")) featureFilters[featureId] = decodedValue.split(",");
    else if (decodedValue === "true" || decodedValue === "false") featureFilters[featureId] = decodedValue === "true";
    else if (!Number.isNaN(Number(decodedValue))) featureFilters[featureId] = Number(decodedValue);
    else featureFilters[featureId] = decodedValue;
  });

  params.forEach((value, key) => {
    if (!key.startsWith(EXTRA_FILTER_PREFIX)) return;
    const filterKey = key.replace(EXTRA_FILTER_PREFIX, "");
    const decodedValue = decodeURLParam(value);
    (filters as AnyFilters)[filterKey] = decodeExtraFilterValue(decodedValue);
  });

  const activeUrlParams: Record<string, any> = {};
  params.forEach((value, key) => {
    activeUrlParams[key] = decodeURLParam(value);
  });

  const showUrlDebug = Object.keys(activeUrlParams).some((k) => !["page"].includes(k));

  return { filters: filters as FilterState, featureFilters, page, activeUrlParams, showUrlDebug };
}

/**
 * State -> query URL (/ilan?...). Senin mevcut “liste sayfan” için doğru base budur.
 */
export function buildStateToUrl(
  filters: FilterState,
  page: number,
  featureFilters: Record<string, any>,
  basePath = "/ilanlar"
) {
  const f = filters as AnyFilters;
  const params = new URLSearchParams();

  if (f.keyword) params.set("q", f.keyword);

  if (f.location && f.location !== "Hepsi") params.set("location", f.location);
  if (f.district && f.district !== "Hepsi") params.set("district", f.district);
  if (f.quarter && f.quarter !== "Hepsi") params.set("quarter", f.quarter);

  if (f.type && f.type !== "Hepsi") params.set("type", f.type);

  // Yeni filter alanları (opsiyonel)
  if (f.category) params.set("category", f.category);
  if (f.subcategory) params.set("subcategory", f.subcategory);
  if (f.subsubcategory) params.set("subsubcategory", f.subsubcategory);

  if (f.minPrice !== null && f.minPrice !== undefined && f.minPrice !== 0) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice !== null && f.maxPrice !== undefined && f.maxPrice !== 0) params.set("maxPrice", String(f.maxPrice));

  if (f.sortBy && f.sortBy !== DEFAULT_FILTERS.sortBy) params.set("sortBy", f.sortBy);
  if (f.sortOrder && f.sortOrder !== DEFAULT_FILTERS.sortOrder) params.set("sortOrder", f.sortOrder);

  if (page > 1) params.set("page", String(page));

  Object.entries(featureFilters).forEach(([featureId, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;

    if (Array.isArray(value)) params.set(`feature_${featureId}`, value.join(","));
    else params.set(`feature_${featureId}`, String(value));
  });

  Object.entries(f).forEach(([key, value]) => {
    if (!shouldIncludeExtraFilter(key, value)) return;
    const encoded = encodeExtraFilterValue(value);
    if (!encoded) return;
    params.set(`${EXTRA_FILTER_PREFIX}${key}`, encoded);
  });

  const queryString = params.toString();
  const newUrl = queryString ? `${basePath}?${queryString}` : basePath;

  const activeUrlParams: Record<string, any> = {};
  params.forEach((value, key) => (activeUrlParams[key] = value));
  const showUrlDebug = Object.keys(activeUrlParams).some((k) => !["page"].includes(k));

  return { newUrl, activeUrlParams, showUrlDebug };
}

/**
 * State -> slug URL (/ilanlar/...).
 * Not: “temel hiyerarşi”yi slug’a koyuyoruz, geri kalanlar query’de kalsın.
 */
export function buildStateToSlugUrl(
  filters: FilterState,
  page: number,
  featureFilters: Record<string, any>,
  basePath = "/ilanlar"
) {
  const f = filters as AnyFilters;
  const segments: string[] = [];

  // Sahibinden tarzı hiyerarşi: kategori > alt > alt-alt > il > ilçe > mahalle
  if (f.category) segments.push(slugifyTR(f.category));
  if (f.subcategory) segments.push(slugifyTR(f.subcategory));
  if (f.subsubcategory) segments.push(slugifyTR(f.subsubcategory));

  if (f.location && f.location !== "Hepsi") segments.push(slugifyTR(f.location));
  if (f.district && f.district !== "Hepsi") segments.push(slugifyTR(f.district));
  if (f.quarter && f.quarter !== "Hepsi") segments.push(slugifyTR(f.quarter));

  const path = segments.length ? `${basePath}/${segments.join("/")}` : basePath;

  const params = new URLSearchParams();

  // Slug’a koymadıklarımız query’de kalsın
  if (f.keyword) params.set("q", f.keyword);
  if (f.type && f.type !== "Hepsi") params.set("type", f.type);
  if (f.minPrice !== null && f.minPrice !== undefined && f.minPrice !== 0) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice !== null && f.maxPrice !== undefined && f.maxPrice !== 0) params.set("maxPrice", String(f.maxPrice));

  if (f.sortBy && f.sortBy !== DEFAULT_FILTERS.sortBy) params.set("sortBy", f.sortBy);
  if (f.sortOrder && f.sortOrder !== DEFAULT_FILTERS.sortOrder) params.set("sortOrder", f.sortOrder);

  if (page > 1) params.set("page", String(page));

  Object.entries(featureFilters).forEach(([featureId, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;

    if (Array.isArray(value)) params.set(`feature_${featureId}`, value.join(","));
    else params.set(`feature_${featureId}`, String(value));
  });

  Object.entries(f).forEach(([key, value]) => {
    if (!shouldIncludeExtraFilter(key, value)) return;
    const encoded = encodeExtraFilterValue(value);
    if (!encoded) return;
    params.set(`${EXTRA_FILTER_PREFIX}${key}`, encoded);
  });

  const queryString = params.toString();
  const newUrl = queryString ? `${path}?${queryString}` : path;

  const activeUrlParams: Record<string, any> = {};
  params.forEach((value, key) => (activeUrlParams[key] = value));
  const showUrlDebug = Object.keys(activeUrlParams).some((k) => !["page"].includes(k));

  return { newUrl, activeUrlParams, showUrlDebug };
}

/**
 * /ilanlar/[...slug] -> state
 * Burada slug’ı “loose” çeviriyoruz. Asıl doğru eşleştirmeyi UI tarafında slugifyTR ile yapacaksın.
 */
export function parseSlugToState(slugSegments: string[] | undefined, query: URLSearchParams) {
  const parsed = parseUrlToState(query);
  const f = parsed.filters as AnyFilters;

  const segs = (slugSegments ?? []).filter(Boolean);

  const categorySlug = segs[0];
  const subcategorySlug = segs[1];
  const subsubcategorySlug = segs[2];
  const citySlug = segs[3];
  const districtSlug = segs[4];
  const quarterSlug = segs[5];

  if (categorySlug) f.category = deslugifyLoose(categorySlug);
  if (subcategorySlug) f.subcategory = deslugifyLoose(subcategorySlug);
  if (subsubcategorySlug) f.subsubcategory = deslugifyLoose(subsubcategorySlug);

  if (citySlug) f.location = deslugifyLoose(citySlug);
  if (districtSlug) f.district = deslugifyLoose(districtSlug);
  if (quarterSlug) f.quarter = deslugifyLoose(quarterSlug);

  return {
    ...parsed,
    // UI tarafında gerçek objeleri seçmek için slug’ları ayrıca istersen diye bırakıyorum:
    slugParts: {
      category: categorySlug,
      subcategory: subcategorySlug,
      subsubcategory: subsubcategorySlug,
      location: citySlug,
      district: districtSlug,
      quarter: quarterSlug,
    },
  };
}
