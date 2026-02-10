// src/app/(public)/ilanlar/[...slug]/page.tsx
import AdsPageClient from "@/features/ads/ui/AdsPage.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Record<string, string | string[] | undefined>;

const LISTING_TYPE_MAP: Record<string, string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
  "gunluk-kiralik": "Günlük Kiralık",
  "devren-satilik": "Devren Satılık",
};

function toTitleTR(input: string) {
  const s = String(input || "").trim();
  if (!s) return s;

  return s
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toLocaleUpperCase("tr-TR") + w.slice(1).toLocaleLowerCase("tr-TR"))
    .join(" ");
}

function parseSortSegment(seg: string): { sortBy?: "date" | "price"; sortOrder?: "asc" | "desc" } {
  // örnekler:
  // sirala-yeni, sirala-eski
  // sirala-fiyat-artan, sirala-fiyat-azalan
  const s = seg.toLowerCase();

  if (s === "sirala-yeni" || s === "siralama-yeni") return { sortBy: "date", sortOrder: "desc" };
  if (s === "sirala-eski" || s === "siralama-eski") return { sortBy: "date", sortOrder: "asc" };
  if (s === "sirala-fiyat-artan" || s === "siralama-fiyat-artan") return { sortBy: "price", sortOrder: "asc" };
  if (s === "sirala-fiyat-azalan" || s === "siralama-fiyat-azalan") return { sortBy: "price", sortOrder: "desc" };

  return {};
}

function parseSlug(slug: string[]) {
  const parts = (slug ?? [])
    .filter(Boolean)
    .map((p) => decodeURIComponent(p).trim())
    .filter(Boolean);

  const out: Record<string, string> = {};

  // sayfa: sayfa-2 veya p-2
  const pageIdx = parts.findIndex((p) => /^((sayfa|p)-\d+)$/i.test(p));
  if (pageIdx >= 0) {
    const m = parts[pageIdx].match(/\d+/);
    if (m?.[0]) out.page = m[0];
    parts.splice(pageIdx, 1);
  }

  // fiyat: fiyat-100000-200000
  const priceIdx = parts.findIndex((p) => p.toLowerCase().startsWith("fiyat-"));
  if (priceIdx >= 0) {
    const raw = parts[priceIdx].slice("fiyat-".length);
    const [min, max] = raw.split("-").map((x) => x?.trim()).filter(Boolean);

    if (min) out.minPrice = min;
    if (max) out.maxPrice = max;

    parts.splice(priceIdx, 1);
  }

  // sıralama: sirala-...
  const sortIdx = parts.findIndex((p) => p.toLowerCase().startsWith("sirala-") || p.toLowerCase().startsWith("siralama-"));
  if (sortIdx >= 0) {
    const s = parseSortSegment(parts[sortIdx]);
    if (s.sortBy) out.sortBy = s.sortBy;
    if (s.sortOrder) out.sortOrder = s.sortOrder;
    parts.splice(sortIdx, 1);
  }

  // temel varsayım:
  // /ilanlar/{category}/{type?}/{city?}/{district?}/{quarter?}
  const categorySeg = parts[0];
  if (categorySeg) out.category = toTitleTR(categorySeg);

  const maybeType = parts[1]?.toLowerCase();
  const hasType = !!(maybeType && LISTING_TYPE_MAP[maybeType]);
  if (hasType) out.type = LISTING_TYPE_MAP[maybeType];

  const locStart = hasType ? 2 : 1;

  const citySeg = parts[locStart];
  if (citySeg) out.city = toTitleTR(citySeg);

  const districtSeg = parts[locStart + 1];
  if (districtSeg) out.district = toTitleTR(districtSeg);

  const quarterSeg = parts[locStart + 2];
  if (quarterSeg) out.quarter = toTitleTR(quarterSeg);

  return out;
}

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: SearchParams;
}) {
  const fromSlug = parseSlug(params.slug);
  const merged: SearchParams = { ...fromSlug, ...(searchParams ?? {}) };

  return <AdsPageClient initialSearchParams={merged} />;
}
