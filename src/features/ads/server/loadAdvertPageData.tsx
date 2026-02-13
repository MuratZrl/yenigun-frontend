// src/features/ads/server/loadAdvertPageData.ts
import "server-only";
import { getAdvert, getSimilarAdverts } from "./adverts.server";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FacilitySection = {
  title: string;
  options: string[];
};

function safePhotoList(photos: unknown): string[] {
  if (!Array.isArray(photos)) return [];
  return photos.filter((p): p is string => typeof p === "string" && p.trim() !== "");
}

function titleTR(input: string) {
  const s = String(input ?? "").trim().replace(/[-_]+/g, " ");
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1).toLocaleLowerCase("tr-TR");
}

function toStr(v: any): string {
  return String(v ?? "").trim();
}

function pushUnique(list: BreadcrumbItem[], item: BreadcrumbItem) {
  const label = (item.label ?? "").trim();
  if (!label) return;
  const last = list[list.length - 1]?.label?.trim();
  if (last && last.toLowerCase() === label.toLowerCase()) return;
  list.push({ ...item, label });
}

function buildAdvertBreadcrumbs(advert: any): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  pushUnique(items, { label: "Emlak", href: "/ilanlar" });

  const subType = toStr(advert?.steps?.first);
  const action = toStr(advert?.steps?.second);
  const specific = toStr(advert?.steps?.third);

  if (subType) {
    pushUnique(items, { label: titleTR(subType), href: `/ilanlar?type=${encodeURIComponent(subType)}` });
  }
  if (action) {
    const combined = subType ? `${subType} > ${action}` : action;
    pushUnique(items, { label: titleTR(action), href: `/ilanlar?type=${encodeURIComponent(combined)}` });
  }
  if (specific) {
    const parts = [subType, action, specific].filter(Boolean);
    pushUnique(items, { label: titleTR(specific), href: `/ilanlar?type=${encodeURIComponent(parts.join(" > "))}` });
  }

  const city = toStr(advert?.address?.province);
  const district = toStr(advert?.address?.district);
  const quarter = toStr(advert?.address?.quarter);

  if (city) pushUnique(items, { label: titleTR(city), href: `/ilanlar?location=${encodeURIComponent(city)}` });
  if (district) pushUnique(items, { label: titleTR(district), href: `/ilanlar?location=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}` });
  if (quarter) pushUnique(items, { label: titleTR(quarter), href: `/ilanlar?location=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&quarter=${encodeURIComponent(quarter)}` });

  const advertTitle = toStr(advert?.title);
  if (advertTitle) {
    pushUnique(items, { label: advertTitle });
  }

  return items.filter((x) => x.label && x.label.trim());
}

/* ------------------------------------------------------------------ */
/*  Category tree helpers                                             */
/* ------------------------------------------------------------------ */

function safeArr<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

function findNodeByName(nodes: any[], name: string): any | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const n of nodes) {
    if (String(n?.name ?? "").toLowerCase().trim() === lower) return n;
    const kids = safeArr<any>(n?.children ?? n?.subcategories);
    if (kids.length) {
      const found = findNodeByName(kids, name);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Replicate AdDetailsTab's buildFeaturesFromChain:
 *   1. Collect ALL attributes from the chain, deduped by id, sorted by order
 *   2. Collect ALL facilities from the chain, deduped by title
 *   3. Return [...attributes, ...facilities]
 */
function collectOrderedFeatures(tree: any[], steps: any): { name: string }[] {
  const stepNames = [
    toStr(steps?.first),
    toStr(steps?.second),
    toStr(steps?.third),
  ].filter(Boolean);

  const chain: any[] = [];
  for (const stepName of stepNames) {
    const node = findNodeByName(tree, stepName);
    if (node) chain.push(node);
  }
  if (!chain.length) return [];

  const attrMap = new Map<string, any>();
  for (const node of chain) {
    for (const a of safeArr<any>(node?.attributes)) {
      const key = String(a?.id ?? a?._id ?? "");
      if (key) attrMap.set(key, a);
    }
  }

  const facMap = new Map<string, Set<string>>();
  for (const node of chain) {
    for (const g of safeArr<any>(node?.facilities)) {
      const title = String(g?.title ?? g?.name ?? "").trim();
      const feats = safeArr<string>(g?.features);
      if (title && feats.length) {
        if (!facMap.has(title)) facMap.set(title, new Set());
        feats.forEach((x: any) => facMap.get(title)!.add(String(x)));
      }
    }
  }

  const attributes = Array.from(attrMap.values())
    .map((a: any) => ({
      name: String(a?.name ?? "").trim(),
      order: typeof a?.order === "number" ? a.order : 9999,
    }))
    .filter((a) => a.name)
    .sort((a, b) => a.order - b.order);

  const facilities = Array.from(facMap.keys()).map((title) => ({
    name: title,
  }));

  return [...attributes, ...facilities];
}

/**
 * Collect facilities schema: each section with its title and ALL options.
 * This powers the sahibinden-style grid with checkmarks.
 */
function collectFacilitiesSchema(tree: any[], steps: any): FacilitySection[] {
  const stepNames = [
    toStr(steps?.first),
    toStr(steps?.second),
    toStr(steps?.third),
  ].filter(Boolean);

  const chain: any[] = [];
  for (const stepName of stepNames) {
    const node = findNodeByName(tree, stepName);
    if (node) chain.push(node);
  }

  // Merge facilities from the chain, deduped by title
  const facMap = new Map<string, string[]>();
  for (const node of chain) {
    for (const g of safeArr<any>(node?.facilities)) {
      const title = String(g?.title ?? g?.name ?? "").trim();
      const feats = safeArr<any>(g?.features).map((x: any) => String(x).trim()).filter(Boolean);
      if (!title || !feats.length) continue;
      if (!facMap.has(title)) {
        facMap.set(title, []);
      }
      const existing = facMap.get(title)!;
      for (const f of feats) {
        if (!existing.includes(f)) existing.push(f);
      }
    }
  }

  return Array.from(facMap.entries()).map(([title, options]) => ({
    title,
    options,
  }));
}

function buildFeatureNameMapByPosition(
  tree: any[],
  advert: any,
): Record<string, string> {
  const steps = advert?.steps;
  if (!steps) return {};

  const orderedFeatures = collectOrderedFeatures(tree, steps);
  const featureValues = safeArr<any>(advert?.featureValues);
  const map: Record<string, string> = {};

  const len = Math.min(orderedFeatures.length, featureValues.length);
  for (let i = 0; i < len; i++) {
    const fv = featureValues[i];
    const feat = orderedFeatures[i];
    const featureId = String(fv?.featureId ?? "").trim();
    if (featureId && feat.name) {
      map[featureId] = feat.name;
    }
  }

  return map;
}

async function fetchCategoryTree(baseUrl: string): Promise<any[]> {
  try {
    const url = `${baseUrl}/categories/tree`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const tree = json?.data?.tree ?? json?.data ?? json?.tree ?? [];
    return Array.isArray(tree) ? tree : [];
  } catch {
    return [];
  }
}

async function getBackendBaseUrl(): Promise<string> {
  const { getRequestOrigin } = await import("@/lib/server/origin");
  const raw = (process.env.NEXT_PUBLIC_BACKEND_API || "/backend").trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.endsWith("/") ? raw.slice(0, -1) : raw;
  }
  const origin = await getRequestOrigin();
  const rel = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${rel}`.replace(/\/$/, "");
}

/* ------------------------------------------------------------------ */
/*  Main loader                                                       */
/* ------------------------------------------------------------------ */

export async function loadAdvertPageData(uid: string): Promise<{
  advert: any;
  similarAds: any[];
  breadcrumbs: BreadcrumbItem[];
  featureNameMap: Record<string, string>;
  facilitiesSchema: FacilitySection[];
}> {
  const advert = await getAdvert(uid);
  if (!advert || advert.active === false) {
    throw new Error("İlan bulunamadı");
  }

  const normalizedAdvert = {
    ...advert,
    photos: safePhotoList(advert.photos),
  };

  let similarAds: any[] = [];
  try {
    similarAds = (await getSimilarAdverts(uid, 1, 12)) ?? [];
  } catch {
    similarAds = [];
  }

  let featureNameMap: Record<string, string> = {};
  let facilitiesSchema: FacilitySection[] = [];
  try {
    const base = await getBackendBaseUrl();
    const tree = await fetchCategoryTree(base);
    if (tree.length > 0) {
      featureNameMap = buildFeatureNameMapByPosition(tree, advert);
      facilitiesSchema = collectFacilitiesSchema(tree, advert?.steps);
    }
  } catch {
    // Non-critical
  }

  const breadcrumbs = buildAdvertBreadcrumbs(normalizedAdvert);

  return { advert: normalizedAdvert, similarAds, breadcrumbs, featureNameMap, facilitiesSchema };
}