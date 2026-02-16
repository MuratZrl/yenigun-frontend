// src/features/category-detail/utils.ts
import { Advert } from "@/types/search";

export const GROSS_M2_FEATURE_ID = "69679f63cd76859b79ca8aa4"; // m² (Brüt)
export const NET_M2_FEATURE_ID = "69679f97cd76859b79ca8ac6"; // m² (Net)
export const ALT_M2_FEATURE_ID = "6968858ccd76859b79ca9451"; // eski/alternatif m²
export const DONUM_FEATURE_ID = "6931851fc9f133554f0adc75"; // dönüm

export const LOGO_URL = "/logo.png";

export const isValidM2 = (v: any) =>
  v !== undefined &&
  v !== null &&
  String(v).trim() !== "" &&
  String(v).trim() !== "0";

export const getM2Text = (ad: any) => {
  if (!ad?.isFeatures || !Array.isArray(ad?.featureValues)) return "";

  const gross = ad.featureValues.find(
    (f: any) => f.featureId === GROSS_M2_FEATURE_ID,
  );
  const net = ad.featureValues.find(
    (f: any) => f.featureId === NET_M2_FEATURE_ID,
  );
  const alt = ad.featureValues.find(
    (f: any) => f.featureId === ALT_M2_FEATURE_ID,
  );
  const donum = ad.featureValues.find(
    (f: any) => f.featureId === DONUM_FEATURE_ID,
  );

  const grossVal = isValidM2(gross?.value) ? String(gross.value) : "";
  const netVal = isValidM2(net?.value) ? String(net.value) : "";
  const altVal = isValidM2(alt?.value) ? String(alt.value) : "";
  const donumVal = isValidM2(donum?.value) ? String(donum.value) : "";

  // Öncelik: Brüt+Net > Brüt > Net > Alt m² > Dönüm
  if (grossVal && netVal) return `${grossVal} • ${netVal}  `;
  if (grossVal) return `${grossVal}  `;
  if (netVal) return `${netVal}  `;
  if (altVal) return `${altVal}  `;
  if (donumVal) return `${donumVal} `;

  return "";
};

export const getM2Compact = (ad: any) => {
  if (!ad?.isFeatures || !Array.isArray(ad?.featureValues)) return "-";

  const gross = ad.featureValues.find(
    (f: any) => f.featureId === GROSS_M2_FEATURE_ID,
  );
  const net = ad.featureValues.find(
    (f: any) => f.featureId === NET_M2_FEATURE_ID,
  );
  const alt = ad.featureValues.find(
    (f: any) => f.featureId === ALT_M2_FEATURE_ID,
  );
  const donum = ad.featureValues.find(
    (f: any) => f.featureId === DONUM_FEATURE_ID,
  );

  const grossVal = isValidM2(gross?.value) ? String(gross.value) : "";
  const netVal = isValidM2(net?.value) ? String(net.value) : "";
  const altVal = isValidM2(alt?.value) ? String(alt.value) : "";
  const donumVal = isValidM2(donum?.value) ? String(donum.value) : "";

  if (grossVal && netVal) return `${grossVal} • ${netVal}`;
  if (grossVal) return grossVal;
  if (netVal) return netVal;
  if (altVal) return altVal;
  if (donumVal) return `${donumVal} `;

  return "-";
};

export const formatDate = (timestamp?: number) => {
  if (!timestamp) return "Tarih yok";
  const date = new Date(timestamp);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (timestamp?: number) => {
  if (!timestamp) return "-";
  const d = new Date(timestamp);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export const hasValidImage = (advert: Advert): boolean => {
  const photos: any = (advert as any).photos;
  if (!photos || !Array.isArray(photos)) return false;

  const firstPhoto = photos[0];
  if (typeof firstPhoto !== "string" || firstPhoto.trim() === "") return false;

  try {
    new URL(firstPhoto);
    return true;
  } catch {
    return false;
  }
};
