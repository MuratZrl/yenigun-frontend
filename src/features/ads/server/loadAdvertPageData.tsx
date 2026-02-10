// src/features/ads/server/loadAdvertPageData.ts
import "server-only";
import { headers } from "next/headers";
import { getAdvert, getSimilarAdverts } from "./adverts.server";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function safePhotoList(photos: unknown): string[] {
  if (!Array.isArray(photos)) return [];
  return photos.filter((p): p is string => typeof p === "string" && p.trim() !== "");
}

function slugifyTR(input: string) {
  return input
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleTR(input: string) {
  const s = String(input ?? "").trim().replace(/[-_]+/g, " ");
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
}

function toStr(v: any): string {
  return String(v ?? "").trim();
}

function getDeep(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function pickString(obj: any, paths: string[]): string | undefined {
  for (const p of paths) {
    const v = getDeep(obj, p);
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickId(obj: any, paths: string[]): string | null {
  for (const p of paths) {
    const v = getDeep(obj, p);
    const s = toStr(v);
    if (s) return s;
  }
  return null;
}

function pushUnique(list: BreadcrumbItem[], item: BreadcrumbItem) {
  const label = (item.label ?? "").trim();
  if (!label) return;
  const last = list[list.length - 1]?.label?.trim();
  if (last && last.toLowerCase() === label.toLowerCase()) return;
  list.push({ ...item, label });
}

async function getOriginFromHeaders(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

/**
 * DİKKAT: Filtre hangi endpoint’ten categories çekiyorsa BURAYA onu yaz.
 * Çoğu sende: /backend/admin/categories
 * Eğer backend’de public bir endpoint varsa daha da iyi: /backend/categories/list gibi.
 */
async function fetchCategories(): Promise<any[]> {
  const origin = getOriginFromHeaders();
  const base = (process.env.NEXT_PUBLIC_BACKEND_API || "/backend").trim() || "/backend";

  const CATEGORIES_URL = `${origin}${base}/admin/categories`;

  try {
    const res = await fetch(CATEGORIES_URL, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json().catch(() => null);
    const cats =
      json?.data?.categories ??
      json?.categories ??
      json?.data ??
      [];

    return Array.isArray(cats) ? cats : [];
  } catch {
    return [];
  }
}

function getNodeId(node: any): string {
  // Öncelik uid olsun çünkü kategori ağacında en anlamlı bağ genelde uid.
  return (
    toStr(node?.uid) ||
    toStr(node?._id) ||
    toStr(node?.id) ||
    toStr(node?.slug) ||
    toStr(node?.name) ||
    ""
  );
}

function getNodeName(node: any): string {
  return toStr(node?.name) || toStr(node?.title) || getNodeId(node);
}

function getParentId(node: any): string {
  return toStr(node?.parentUid) || toStr(node?.parentId) || "";
}

function getChildren(node: any): any[] {
  const a = node?.children;
  if (Array.isArray(a)) return a;
  const b = node?.subcategories;
  if (Array.isArray(b)) return b;
  const c = node?.subCategories;
  if (Array.isArray(c)) return c;
  return [];
}

/**
 * Categories bazen nested tree, bazen flat list gelir.
 * Burada ikisini de parentMap + nodeMap’e çevirip leaf -> root chain çıkarıyoruz.
 */
function buildCategoryChain(categories: any[], leafId: string | null): string[] {
  if (!leafId) return [];

  const nodeMap = new Map<string, any>();
  const parentMap = new Map<string, string>(); // childId -> parentId

  const visit = (node: any, parent: any | null) => {
    const id = getNodeId(node);
    if (!id) return;

    // node’u kaydet
    if (!nodeMap.has(id)) nodeMap.set(id, node);

    // parent ilişkisini kaydet (nested geldiğinde parentUid yoksa bile chain kurabilelim)
    const explicitParent = getParentId(node);
    const parentId = explicitParent || (parent ? getNodeId(parent) : "");
    if (parentId) parentMap.set(id, parentId);

    const kids = getChildren(node);
    for (const k of kids) visit(k, node);
  };

  // 1) Nested varsa direkt dolaş.
  const hasNested = categories.some((x) => getChildren(x).length > 0);
  if (hasNested) {
    for (const r of categories) visit(r, null);
  } else {
    // 2) Flat list ise tüm node’ları map’e al, parentUid/parentId üzerinden parentMap kur.
    for (const raw of categories) {
      const id = getNodeId(raw);
      if (!id) continue;
      nodeMap.set(id, raw);
    }
    for (const raw of categories) {
      const id = getNodeId(raw);
      if (!id) continue;
      const p = getParentId(raw);
      if (p) parentMap.set(id, p);
    }
  }

  // leafId bazen numeric gelir, map’te string; zaten string’e çevirdik.
  const chainNodes: any[] = [];
  const seen = new Set<string>();

  let curId: string | undefined = leafId;
  while (curId && !seen.has(curId)) {
    seen.add(curId);
    const node = nodeMap.get(curId);
    if (node) chainNodes.push(node);
    curId = parentMap.get(curId);
  }

  // root->leaf sırası
  const names = chainNodes.reverse().map(getNodeName).map(titleTR).filter(Boolean);

  // “Emlak” zaten root olarak ayrıca push ediliyor, tekrar etmesin
  return names.filter((n) => n.toLocaleLowerCase("tr-TR") !== "emlak");
}

function buildAdvertBreadcrumbs(advert: any, categories: any[]): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  pushUnique(items, { label: "Emlak", href: "/ilanlar" });

  // İlandaki leaf category id/uid’yi yakala (backend’e göre değişebilir, o yüzden birkaç ihtimal deniyoruz).
  const leafCategoryId =
    pickId(advert, [
      "categoryUid",
      "categoryId",
      "category.uid",
      "category.id",
      "details.categoryUid",
      "details.categoryId",
      "contract.categoryUid",
      "contract.categoryId",
      "steps.categoryUid",
      "steps.categoryId",
    ]) ?? null;

  const chainNames = buildCategoryChain(categories, leafCategoryId);

  // Filtrede gördüğün sıra buradan gelir: Konut > Satılık/Kiralık > Daire ...
  for (const name of chainNames) {
    // Linkleri istersen filtre sayfana bağla, istemezsen href verme.
    // Ben “tıklanınca filtrelenmiş listeye gitsin” diye kaba bir query koyuyorum.
    pushUnique(items, { label: name, href: `/ilanlar?cat=${encodeURIComponent(slugifyTR(name))}` });
  }

  // Lokasyon parçaları (ilan response’un nerede tutuyorsa oradan alınır)
  const city = pickString(advert, [
    "location.cityName",
    "location.city",
    "contract.cityName",
    "contract.city",
    "details.cityName",
    "details.city",
    "cityName",
    "city",
    "il",
  ]);

  const district = pickString(advert, [
    "location.districtName",
    "location.district",
    "contract.districtName",
    "contract.district",
    "details.districtName",
    "details.district",
    "districtName",
    "district",
    "ilce",
  ]);

  const town = pickString(advert, [
    "location.townName",
    "location.town",
    "contract.townName",
    "contract.town",
    "details.townName",
    "details.town",
    "townName",
    "town",
  ]);

  const quarter = pickString(advert, [
    "location.quarterName",
    "location.quarter",
    "location.neighborhoodName",
    "contract.quarterName",
    "contract.neighborhoodName",
    "details.quarterName",
    "details.neighborhoodName",
    "quarterName",
    "neighborhoodName",
    "mahalle",
  ]);

  if (city) pushUnique(items, { label: titleTR(city), href: `/ilanlar?city=${encodeURIComponent(slugifyTR(city))}` });
  if (district) pushUnique(items, { label: titleTR(district), href: `/ilanlar?district=${encodeURIComponent(slugifyTR(district))}` });
  if (town) pushUnique(items, { label: titleTR(town), href: `/ilanlar?town=${encodeURIComponent(slugifyTR(town))}` });
  if (quarter) pushUnique(items, { label: titleTR(quarter), href: `/ilanlar?quarter=${encodeURIComponent(slugifyTR(quarter))}` });

  return items.filter((x) => x.label && x.label.trim());
}

export async function loadAdvertPageData(uid: string): Promise<{
  advert: any;
  similarAds: any[];
  breadcrumbs: BreadcrumbItem[];
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

  // Filtrenin kullandığı kategori ağacını server-side çekiyoruz.
  const categories = await fetchCategories();

  // Breadcrumb artık “steps tahmini” değil, kategori ağacının gerçek chain’i.
  const breadcrumbs = buildAdvertBreadcrumbs(normalizedAdvert, categories);

  return { advert: normalizedAdvert, similarAds, breadcrumbs };
}
