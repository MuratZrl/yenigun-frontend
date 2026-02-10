// src/features/ads/model/utils.ts
import type { Advert } from "@/types/advert";
import { FEATURE_IDS } from "./constants";

export const decodeURLParam = (param: string): string =>
  decodeURIComponent(param.replace(/\+/g, " "));

export const formatTRY = (v: any) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return new Intl.NumberFormat("tr-TR").format(v) + " TL";
  return String(v);
};

export const isValidM2 = (v: any) =>
  v !== undefined && v !== null && String(v).trim() !== "" && String(v).trim() !== "0";

export const getM2Text = (ad: Advert) => {
  if (!ad.isFeatures || !Array.isArray(ad.featureValues)) return "";

  const gross = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.GROSS_M2);
  const net = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.NET_M2);
  const alt = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.ALT_M2);
  const donum = ad.featureValues.find((f) => f.featureId === FEATURE_IDS.DONUM);

  const grossVal = isValidM2(gross?.value) ? String(gross!.value) : "";
  const netVal = isValidM2(net?.value) ? String(net!.value) : "";
  const altVal = isValidM2(alt?.value) ? String(alt!.value) : "";
  const donumVal = isValidM2(donum?.value) ? String(donum!.value) : "";

  if (grossVal && netVal) return `${grossVal}  • ${netVal}  `;
  if (grossVal) return `${grossVal}`;
  if (netVal) return `${netVal}`;
  if (altVal) return `${altVal} `;
  if (donumVal) return `${donumVal}`;
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
  const validPhoto = ad.photos.find((photo: any) => {
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
