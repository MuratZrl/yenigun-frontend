// src/features/ads/model/advertView.ts
import type { AdvertData, FeatureValue } from "@/types/advert";

const toText = (v: any): string => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  const s = String(v).trim();
  return s === "null" || s === "undefined" ? "" : s;
};

const toTrDate = (v: any): string => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR");
};

const featureMap = (featureValues?: FeatureValue[]) => {
  const m = new Map<string, any>();
  (featureValues || []).forEach((fv) => {
    if (fv?.featureId) m.set(String(fv.featureId), fv.value);
  });
  return m;
};

// ⚠️ Bu mapping “featureId” sabitliği varsayar. Kategoriye göre değişiyorsa prod’da kırılır.
// En doğru çözüm: backend’den featureId -> label/name bilgisi almak veya category->features listesinden map kurmak.
type FeatureIdHints = Partial<{
  grossArea: string; netArea: string; roomCount: string; buildingAge: string;
  floor: string; totalFloor: string; heating: string; bathCount: string;
  kitchen: string; balcony: string; elevator: string; furniture: string;
  inSite: string; parking: string; siteName: string; eidsNo: string; eidsDate: string;
}>;

export function buildAdvertView(data: AdvertData, ids?: FeatureIdHints) {
  const fv = featureMap((data as any)?.featureValues);

  const pick = (detailsVal: any, featureKey?: keyof FeatureIdHints) => {
    const d = toText(detailsVal);
    if (d) return d;
    const fid = featureKey && ids?.[featureKey] ? ids[featureKey] : "";
    return fid ? toText(fv.get(fid)) : "";
  };

  const uid = toText((data as any)?.uid);
  const fee = toText((data as any)?.fee) || toText((data as any)?.price?.amount ? `${(data as any)?.price?.amount} ${(data as any)?.price?.currency || ""}` : "");
  const created = toTrDate((data as any)?.created?.createdTimestamp || (data as any)?.contract?.date || (data as any)?.createdAt);

  const address = (data as any)?.address || {};
  const location = [toText(address.province), toText(address.district), toText(address.quarter)].filter(Boolean).join(" / ");

  const stepsSecond = toText((data as any)?.steps?.second);
  const stepsFirst = toText((data as any)?.steps?.first);
  const typeText = [stepsSecond, stepsFirst].filter(Boolean).join(" ").trim();

  const details = (data as any)?.details || {};

  return {
    uid,
    fee: fee || "Fiyat yok",
    location,
    createdDate: created,
    typeText: typeText || "-",
    eidsNo: toText((data as any)?.eidsNo) || pick((data as any)?.eidsNo, "eidsNo"),
    eidsDate: toTrDate((data as any)?.eidsDate) || toTrDate(pick((data as any)?.eidsDate, "eidsDate")),
    rows: {
      grossArea: pick(details.grossArea, "grossArea"),
      netArea: pick(details.netArea, "netArea"),
      roomCount: pick(details.roomCount, "roomCount"),
      buildingAge: pick(details.buildingAge, "buildingAge"),
      floor: pick(details.floor, "floor"),
      totalFloor: pick(details.totalFloor, "totalFloor"),
      heating: pick(details.heating, "heating"),
      bathCount: pick(details.bathCount, "bathCount"),
      kitchen: pick((details as any).kitchen, "kitchen"),
      balcony: pick(details.balcony, "balcony"),
      elevator: pick(details.elevator, "elevator"),
      furniture: pick(details.furniture, "furniture"),
      inSite: pick(details.inSite, "inSite"),
      parking: pick((details as any).parking || (details as any).park, "parking"),
      siteName: pick((details as any).siteName, "siteName"),
    },
  };
}
