// src/features/admin/listing-edit/model/utils.ts

import type { CategoryTreeNode, CategoryAttribute, DynamicFeature } from "./types";

export function selVal(x: string | number | boolean | { value?: string } | null | undefined): string {
  if (!x && x !== 0 && x !== false) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  if (typeof x === "object" && x !== null && "value" in x) return String(x.value ?? "");
  return String(x);
}

export function formatNumber(n: string | number | null | undefined) {
  if (!n && n !== 0) return "";
  const s = String(n).replace(/\./g, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

/** Turkish-aware lowercase + whitespace normalization for search matching */
export function turkishLower(input: string): string {
  return String(input || "")
    .replace(/\s+/g, " ").trim()
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u");
}

/** Custom react-select filter that handles Turkish characters + extra whitespace */
export function turkishFilterOption(option: { label: string; value: unknown }, inputValue: string): boolean {
  return turkishLower(option.label).includes(turkishLower(inputValue));
}

export function slugifyTR(input: string) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function mapType(t: string | undefined): string {
  const up = String(t || "").toUpperCase();
  if (up === "TEXT") return "text";
  if (up === "NUMBER") return "number";
  if (up === "SELECT") return "single_select";
  if (up === "MULTI_SELECT" || up === "MULTISELECT") return "multi_select";
  if (up === "BOOLEAN" || up === "BOOL") return "boolean";
  return "text";
}

export function findNodeInTree(nodes: CategoryTreeNode[], id: string | number | undefined): CategoryTreeNode | null {
  if (!id && id !== 0) return null;
  const s = String(id);
  for (const n of nodes) {
    if (String(n?.uid ?? "") === s || String(n?._id ?? "") === s) return n;
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) { const f = findNodeInTree(kids, id); if (f) return f; }
  }
  return null;
}

export function findNodeByName(nodes: CategoryTreeNode[], name: string): CategoryTreeNode | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const n of nodes) {
    if (String(n?.name ?? "").toLowerCase().trim() === lower) return n;
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) {
      const found = findNodeByName(kids, name);
      if (found) return found;
    }
  }
  return null;
}

export function collectChainToNode(nodes: CategoryTreeNode[], targetId: string | number | undefined, chain: CategoryTreeNode[] = []): CategoryTreeNode[] | null {
  if (!targetId && targetId !== 0) return null;
  const s = String(targetId);
  for (const n of nodes) {
    if (String(n?.uid ?? "") === s || String(n?._id ?? "") === s) return [...chain, n];
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) { const r = collectChainToNode(kids, targetId, [...chain, n]); if (r) return r; }
  }
  return null;
}

export function buildFeaturesFromChain(chain: CategoryTreeNode[]): DynamicFeature[] {
  const attrMap = new Map<string, CategoryAttribute>();
  for (const node of chain) for (const a of safeArr(node?.attributes)) {
    const key = String(a?.id ?? a?._id ?? ""); if (key) attrMap.set(key, a);
  }
  const facMap = new Map<string, Set<string>>();
  for (const node of chain) for (const g of safeArr(node?.facilities)) {
    const title = String(g?.title ?? ""); const feats = safeArr(g?.features);
    if (title && feats.length) { if (!facMap.has(title)) facMap.set(title, new Set()); feats.forEach(x => facMap.get(title)!.add(String(x))); }
  }
  const af = Array.from(attrMap.values()).reduce<DynamicFeature[]>((acc, a) => {
    const _id = String(a?.id ?? a?._id ?? ""); const name = String(a?.name ?? "");
    if (_id && name) acc.push({ _id, name, type: mapType(a?.type), options: safeArr(a?.options), required: false, order: typeof a?.order === "number" ? a.order : undefined });
    return acc;
  }, []);
  const ff: DynamicFeature[] = Array.from(facMap.entries()).map(([title, set]) => ({
    _id: `fac_${slugifyTR(title)}`, name: title, type: "multi_select", options: Array.from(set.values()), required: false,
  }));
  return [...af, ...ff].sort((a, b) => (a?.order ?? 9999) - (b?.order ?? 9999));
}

export const HARDCODED_FIELD_NAMES = new Set([
  "m2", "m2 (brut)", "m2 (net)", "m2 brut", "m2 net", "brut m2", "net m2",
  "oda sayisi", "bina yasi", "bulundugu kat", "kat sayisi",
  "isitma", "banyo sayisi", "balkon", "asansor", "otopark",
  "esyali", "site icinde", "site icerisinde", "tapu durumu", "cephe", "imar durumu",
]);

export function normalizeName(name: string): string {
  return String(name || "")
    .toLowerCase().trim()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/²/g, "2")
    .replace(/[^a-z0-9 ()]/g, "")
    .replace(/\s+/g, " ").trim();
}

export function isHardcodedField(name: string): boolean {
  return HARDCODED_FIELD_NAMES.has(normalizeName(name));
}

export function getSafeAddress(address: string | { lat?: number; lng?: number } | null | undefined): string {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object" && address.lat && address.lng) return `Konum: ${address.lat}, ${address.lng}`;
  return "";
}

export function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [spliced] = copy.splice(from, 1);
  copy.splice(to, 0, spliced);
  return copy;
}

export function formatMB(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) return "";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
