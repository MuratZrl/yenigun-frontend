// src/features/ads/ui/components/filter/categoryHandlers.ts

import type { Category, Feature, Subcategory } from "@/types/advert";
import type { CategoryHandlerDeps, ExtendedFilterState, FeatureFilterValue, FeatureFiltersMap } from "./types";

/* ----------------------------- Node type ----------------------------- */

/** Generic shape covering Category, Subcategory, and flat-list variants. */
type CategoryNode = {
  uid?: string;
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  parentUid?: string;
  parentId?: string;
  subcategories?: CategoryNode[];
  subCategories?: CategoryNode[];
  children?: CategoryNode[];
  features?: Feature[];
  /** Internal id added by buildTreeFromFlat */
  __id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

/* ----------------------------- Helpers ----------------------------- */

function getChildren(node: CategoryNode): CategoryNode[] {
  const a = node?.children;
  if (Array.isArray(a)) return a;
  const b = node?.subcategories;
  if (Array.isArray(b)) return b;
  const c = node?.subCategories;
  if (Array.isArray(c)) return c;
  return [];
}

function nodeId(node: CategoryNode): string {
  return String(node?.uid ?? node?._id ?? node?.id ?? node?.slug ?? "").trim();
}

function nodeName(node: CategoryNode): string {
  return String(node?.name ?? node?.title ?? "").trim();
}

function looksLikeFlatCategoryList(list: CategoryNode[]): boolean {
  return (list || []).some(
    (x) =>
      x &&
      (x.parentUid !== undefined || x.parentId !== undefined) &&
      (x.uid !== undefined || x._id !== undefined || x.id !== undefined),
  );
}

function buildTreeFromFlat(rawList: CategoryNode[]): CategoryNode[] {
  const byId = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const raw of rawList || []) {
    const id = String(raw?.uid ?? raw?._id ?? raw?.id ?? "").trim();
    if (!id) continue;

    if (!byId.has(id)) {
      byId.set(id, { ...raw, __id: id, children: [] as CategoryNode[] });
    } else {
      const prev = byId.get(id)!;
      byId.set(id, {
        ...prev,
        ...raw,
        __id: id,
        children: Array.isArray(prev.children) ? prev.children : [],
      });
    }
  }

  for (const node of byId.values()) {
    const parentId = String(node?.parentUid ?? node?.parentId ?? "").trim();
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function normalizeRoots(categories: CategoryNode[]): CategoryNode[] {
  const list = Array.isArray(categories) ? categories : [];
  if (!list.length) return [];
  const hasNested = list.some((x) => getChildren(x).length > 0);
  if (!hasNested && looksLikeFlatCategoryList(list)) return buildTreeFromFlat(list);
  return list;
}

// target node'a giden NODE path'i bul (root -> ... -> target)
function findPathNodes(nodes: CategoryNode[], targetId: string, trail: CategoryNode[] = []): CategoryNode[] | null {
  for (const n of nodes || []) {
    const nextTrail = [...trail, n];
    const id = nodeId(n) || String(n?.__id ?? "").trim();

    if (id && id === targetId) return nextTrail;

    const kids = getChildren(n);
    if (kids.length) {
      const hit = findPathNodes(kids, targetId, nextTrail);
      if (hit) return hit;
    }
  }
  return null;
}

function stripRootEmlak(parts: string[]) {
  if (!parts.length) return parts;
  if (String(parts[0]).toLocaleLowerCase("tr-TR") === "emlak") return parts.slice(1);
  return parts;
}

function resolveActionFromTypeParts(parts: string[]) {
  const candidates = new Set(["Satılık", "Kiralık", "Günlük Kiralık", "Devren Satılık"]);
  for (const p of parts) {
    if (candidates.has(p)) return p;
  }
  return "Tümü";
}

function defaultFeatureValue(feature: Feature): FeatureFilterValue {
  if (!feature) return "";
  if (feature.type === "multi_select") return [];
  if (feature.type === "boolean") return false;
  if (feature.type === "range") return { min: null, max: null };
  return "";
}

function reconcileFeatureFilters(prevFF: FeatureFiltersMap, features: Feature[]): FeatureFiltersMap {
  const next: FeatureFiltersMap = {};

  for (const f of features || []) {
    const id = f?._id;
    if (!id) continue;
    next[id] = prevFF && prevFF[id] !== undefined ? prevFF[id] : defaultFeatureValue(f);
  }

  // prevFF'den artıkları temizle (sadece current features kalsın)
  // (yukarıda zaten sadece ids içindekileri ekledik)
  return next;
}

// ✅ En güvenlisi: tıklanan node'un ağaçtaki TAM path'i
export function buildTypePathFromNode(clickedNode: CategoryNode, categories: CategoryNode[]): string {
  const roots = normalizeRoots(categories);
  const id = nodeId(clickedNode);
  const name = nodeName(clickedNode);

  if (!id) {
    // id yoksa en azından isim döndür (kötü ama hiç yoktan iyi)
    return name || "Hepsi";
  }

  const pathNodes = findPathNodes(roots, id) ?? [];
  const parts = stripRootEmlak(pathNodes.map(nodeName).filter(Boolean));

  return parts.join(" > ") || name || "Hepsi";
}

function pickFeaturesFromPath(pathNodes: CategoryNode[]): Feature[] {
  // en derindeki node'da feature varsa onu al, yoksa yukarı doğru çık
  for (let i = (pathNodes?.length || 0) - 1; i >= 0; i--) {
    const f = pathNodes[i]?.features;
    if (Array.isArray(f) && f.length > 0) return f;
  }
  return [];
}

/* ------------------------ One true handler ------------------------- */

function handleNodeSelect(clickedNode: CategoryNode | null, deps: CategoryHandlerDeps) {
  const {
    categories,

    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedSubSubcategory,

    setAvailableSubcategories,
    setAvailableSubSubcategories,

    setFeatureFilters,
    setCurrentFeatures,
    setFilters,
  } = deps;

  // Reset state if null
  if (!clickedNode) {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setAvailableSubcategories([]);
    setAvailableSubSubcategories([]);
    setCurrentFeatures([]);
    setFeatureFilters({});

    setFilters((prev: ExtendedFilterState) => ({
      ...prev,
      type: "Hepsi",
      category: undefined,
      subcategory: undefined,
      subsubcategory: undefined,
      action: "Tümü",
    }));

    return;
  }

  const roots = normalizeRoots(categories as unknown as CategoryNode[]);
  const id = nodeId(clickedNode);

  // Path bulunamazsa en azından nodeName ile devam et
  const pathNodes = (id ? findPathNodes(roots, id) : null) ?? [clickedNode];

  const rawParts = pathNodes.map(nodeName).filter(Boolean);
  const parts = stripRootEmlak(rawParts);

  const typePath = parts.join(" > ") || nodeName(clickedNode) || "Hepsi";
  const action = resolveActionFromTypeParts(parts);

  // Seviye çözümü: 1=category, 2=subcategory, 3=subsub...
  const level1 = pathNodes[0] ?? null;
  const level2 = pathNodes[1] ?? null;
  const level3 = pathNodes[2] ?? null;

  // selected states
  setSelectedCategory(level1 as unknown as Category | null);
  setSelectedSubcategory((level2 as unknown as Subcategory | null) ?? null);
  setSelectedSubSubcategory((level3 as unknown as Subcategory | null) ?? null);

  // available lists
  const subs = level1 ? getChildren(level1) : [];
  setAvailableSubcategories(Array.isArray(subs) ? (subs as unknown as Subcategory[]) : []);

  const subsubs = level2 ? getChildren(level2) : [];
  setAvailableSubSubcategories(Array.isArray(subsubs) ? (subsubs as unknown as Subcategory[]) : []);

  // Filters (category/subcategory/subsubcategory alanları breadcrumb için şart değil ama UI için yararlı)
  const categoryName = parts[0];
  const subcategoryName = parts[1];
  const subsubName = parts[2];

  setFilters((prev: ExtendedFilterState) => ({
    ...prev,
    type: typePath,
    category: categoryName,
    subcategory: subcategoryName,
    subsubcategory: subsubName,
    action,
  }));

  // Features: en derindeki node -> yukarı fallback
  const nextFeatures = pickFeaturesFromPath(pathNodes);
  setCurrentFeatures(nextFeatures);

  setFeatureFilters((prevFF: FeatureFiltersMap) => reconcileFeatureFilters(prevFF || {}, nextFeatures));
}

/* ----------------------------- Exports ----------------------------- */

// Not: Bu 3 fonksiyon artık aynı "akıllı" handler'a gider.
// Çünkü senin UI bazı yerlerde hangi node'u tıkladığını ayırmıyor (her şeyi onCategorySelect'e yolluyor).
export function handleCategorySelect(category: Category | null, deps: CategoryHandlerDeps) {
  handleNodeSelect(category as unknown as CategoryNode | null, deps);
}

export function handleSubcategorySelect(subcategory: Subcategory | null, deps: CategoryHandlerDeps) {
  handleNodeSelect(subcategory as unknown as CategoryNode | null, deps);
}

export function handleSubSubcategorySelect(subsubcategory: Subcategory | null, deps: CategoryHandlerDeps) {
  handleNodeSelect(subsubcategory as unknown as CategoryNode | null, deps);
}
