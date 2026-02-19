// src/features/ads/model/utils.ts
import type { Advert } from "@/types/advert";
import { FEATURE_IDS } from "./constants";

export const decodeURLParam = (param: string): string =>
  decodeURIComponent(param.replace(/\+/g, " "));

export const formatTRY = (v: string | number | undefined | null, currency?: string) => {
  if (!v) return "";
  const label = currency && currency !== "₺" ? currency : "TL";
  if (typeof v === "string") {
    const cleaned = v.replace(/\s*(TL|₺|USD|\$|EUR|€|GBP|£)\s*/gi, "").trim();
    return cleaned ? `${cleaned} ${label}` : "";
  }
  if (typeof v === "number") return new Intl.NumberFormat("tr-TR").format(v) + ` ${label}`;
  return String(v);
};

export const isValidM2 = (v: string | number | undefined | null) =>
  v !== undefined && v !== null && String(v).trim() !== "" && String(v).trim() !== "0";

export const getM2Text = (ad: Advert) => {
  const fmt = (n: number) => n.toLocaleString("tr-TR");

  let grossVal: number | null = null;
  let netVal: number | null = null;
  let altVal: number | null = null;
  let donumVal: number | null = null;

  // 1) Try featureValues (new dynamic feature system)
  if (ad.isFeatures && Array.isArray(ad.featureValues)) {
    const gross = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.GROSS_M2);
    const net = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.NET_M2);
    const alt = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.ALT_M2);
    const donum = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.DONUM);

    grossVal = isValidM2(gross?.value) ? Number(gross!.value) : null;
    netVal = isValidM2(net?.value) ? Number(net!.value) : null;
    altVal = isValidM2(alt?.value) ? Number(alt!.value) : null;
    donumVal = isValidM2(donum?.value) ? Number(donum!.value) : null;
  }

  // 2) Fallback to details (legacy) if featureValues didn't have them
  if (!grossVal && isValidM2(ad.details?.grossArea)) grossVal = Number(ad.details!.grossArea);
  if (!netVal && isValidM2(ad.details?.netArea)) netVal = Number(ad.details!.netArea);

  if (grossVal && netVal) return `${fmt(grossVal)} • ${fmt(netVal)}`;
  if (grossVal) return fmt(grossVal);
  if (netVal) return fmt(netVal);
  if (altVal) return fmt(altVal);
  if (donumVal) return fmt(donumVal);

  return "";
};

export const getGrossM2Text = (ad: Advert) => {
  // 1) Try featureValues first (new dynamic feature system)
  if (ad.isFeatures && Array.isArray(ad.featureValues)) {
    const gross = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.GROSS_M2);
    const grossVal = isValidM2(gross?.value) ? Number(gross!.value) : null;
    if (grossVal) return grossVal.toLocaleString("tr-TR");
  }
  // 2) Fallback to details.grossArea (legacy)
  const legacy = ad.details?.grossArea;
  if (isValidM2(legacy)) return Number(legacy).toLocaleString("tr-TR");
  return "";
};

export const getNetM2Text = (ad: Advert) => {
  // 1) Try featureValues first (new dynamic feature system)
  if (ad.isFeatures && Array.isArray(ad.featureValues)) {
    const net = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.NET_M2);
    const netVal = isValidM2(net?.value) ? Number(net!.value) : null;
    if (netVal) return netVal.toLocaleString("tr-TR");
  }
  // 2) Fallback to details.netArea (legacy)
  const legacy = ad.details?.netArea;
  if (isValidM2(legacy)) return Number(legacy).toLocaleString("tr-TR");
  return "";
};

export const getRoom = (ad: Advert) => {
  if (ad.details?.roomCount) return String(ad.details.roomCount);
  if (ad.isFeatures && Array.isArray(ad.featureValues)) {
    const rc = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.ROOM_COUNT);
    if (rc?.value) return String(rc.value);
  }
  return "";
};

export const getCityDistrict = (ad: Advert) => {
  const p = ad.address?.province;
  const d = ad.address?.district;
  if (p && d) return `${p}\n${d}`;
  if (p) return p;
  if (d) return d;
  return "";
};

export const hasValidImage = (ad: Advert): boolean => {
  if (!ad.photos || !Array.isArray(ad.photos)) return false;
  const validPhoto = ad.photos.find((photo: string) => {
    if (typeof photo === "string") {
      return (
        photo.trim() !== "" &&
        !photo.includes("default-image") &&
        !photo.includes("placeholder")
      );
    }
    return false;
  });
  return !!validPhoto;
};
