// src/features/ads/server/loadAdvertPageData.ts
import "server-only";
import { getAdvert, getSimilarAdverts } from "./adverts.server";

export type BreadcrumbItem = {
  label: string;
  href?: string;
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

  // Actual DB: steps.first = sub-type (Daire, Arsa, Müstakil Ev, İşyeri)
  //            steps.second = action UPPERCASE (SATILIK, KİRALIK)
  //            steps.third = specific type (Çiftlik, Dükkan - Mağaza, or "")
  const subType = toStr(advert?.steps?.first);
  const action = toStr(advert?.steps?.second);
  const specific = toStr(advert?.steps?.third);

  // Breadcrumb: Emlak > Daire > Kiralık > [specific] > location...
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

  // Lokasyon — parseUrlToState "location", "district", "quarter" bekliyor
  const city = toStr(advert?.address?.province);
  const district = toStr(advert?.address?.district);
  const quarter = toStr(advert?.address?.quarter);

  if (city) pushUnique(items, { label: titleTR(city), href: `/ilanlar?location=${encodeURIComponent(city)}` });
  if (district) pushUnique(items, { label: titleTR(district), href: `/ilanlar?location=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}` });
  if (quarter) pushUnique(items, { label: titleTR(quarter), href: `/ilanlar?location=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&quarter=${encodeURIComponent(quarter)}` });

  // Son eleman: ilan başlığı (aktif sayfa, tıklanamaz)
  const advertTitle = toStr(advert?.title);
  if (advertTitle) {
    pushUnique(items, { label: advertTitle });
  }

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

  const breadcrumbs = buildAdvertBreadcrumbs(normalizedAdvert);

  return { advert: normalizedAdvert, similarAds, breadcrumbs };
}