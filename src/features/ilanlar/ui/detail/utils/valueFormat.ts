// src/features/ads/ui/detail/utils/valueFormat.ts

const VALUE_TR: Record<string, string> = {
  yes: "Evet",
  no: "Hayır",
  true: "Evet",
  false: "Hayır",
  Yes: "Evet",
  No: "Hayır",
  True: "Evet",
  False: "Hayır",
  VAR: "Var",
  YOK: "Yok",
};

export function isEmptyValue(v: any): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (typeof v === "number" && v === 0) return true;
  if (v === "0") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

export function formatBooleanTR(v: boolean): "Evet" | "Hayır" {
  return v ? "Evet" : "Hayır";
}

function translateIfNeeded(s: string): string {
  const t = VALUE_TR[s];
  if (t) return t;

  const up = s.toUpperCase();
  const t2 = VALUE_TR[up];
  if (t2) return t2;

  return s;
}

/**
 * Backend’den gelen her şeyi (string/number/boolean/array) kullanıcıya okunur hale getirir.
 * Boş değerlere "" döndürür (render tarafı zaten boşsa göstermeyebilir).
 */
export function formatAnyValue(v: any): string {
  if (isEmptyValue(v)) return "";

  if (Array.isArray(v)) {
    const joined = v
      .map((x) => String(x ?? "").trim())
      .filter(Boolean)
      .join(", ");
    return joined ? translateIfNeeded(joined) : "";
  }

  if (typeof v === "boolean") return formatBooleanTR(v);

  const s = String(v).trim();
  if (!s || s === "0") return "";
  return translateIfNeeded(s);
}

/**
 * Tarihleri tek tip göstermek için küçük helper.
 */
export function formatDateTR(input?: string | number | Date | null): string {
  if (!input) return "-";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("tr-TR");
}
