// src/components/tabs/CategoriesTab/utils.ts
import type { StepState } from "@/types/property";
import type {
  RawCategoryNode,
  NestedSubCategory,
  CategoryAttribute,
  CategoryFacilityGroup,
  CategorySelectedItem,
  UiCategory,
} from "./types";

/* ── Array safety ── */

export function safeArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/* ── Tree mapping ── */

export function mapChildrenToSubcategories(nodes: RawCategoryNode[]): NestedSubCategory[] {
  return nodes.map((n) => ({
    _id: String(n._id ?? n.uid ?? ""),
    uid: n.uid ?? 0,
    parentUid: n.parentUid ?? null,
    name: n.name ?? "",
    attributes: safeArr<CategoryAttribute>(n.attributes),
    facilities: safeArr<CategoryFacilityGroup>(n.facilities),
    subcategories: mapChildrenToSubcategories(safeArr<RawCategoryNode>(n.children)),
  }));
}

export function pickMainForUI(treeRoots: NestedSubCategory[]): NestedSubCategory[] {
  if (treeRoots.length === 1) {
    const kids = safeArr<NestedSubCategory>(treeRoots[0].subcategories);
    if (kids.length > 0) return kids;
  }
  return treeRoots;
}

/* ── Slugify ── */

export function slugifyTR(input: string): string {
  return String(input || "")
    .toLowerCase()
    .trim()
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

/* ── Error detection ── */

export function isAbortError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === "AbortError") return true;
  const err = e as { code?: string } | undefined;
  return err?.code === "ERR_CANCELED";
}

/* ── Step selection helpers ── */

export function getSelected(step: StepState): CategorySelectedItem {
  return (step.selected as CategorySelectedItem) ?? { isSelect: false, value: "" };
}

export function patchSelected(
  setStep: React.Dispatch<React.SetStateAction<StepState>>,
  patch: Partial<CategorySelectedItem>,
): void {
  setStep((prev) => {
    const prevSel = getSelected(prev);
    return { ...prev, selected: { ...prevSel, ...patch } } as StepState;
  });
}

/* ── Tree search ── */

/** Find a node by name (case-insensitive) in a flat list */
export function findByName(nodes: NestedSubCategory[], name: string): NestedSubCategory | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return nodes.find((n) => n.name.toLowerCase().trim() === lower) ?? null;
}

/** Deep search: find a node by name anywhere in the tree, return the chain [root, ..., match] */
export function findDeepByName(
  nodes: NestedSubCategory[],
  name: string,
  chain: NestedSubCategory[] = [],
): NestedSubCategory[] | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const n of nodes) {
    if (n.name.toLowerCase().trim() === lower) return [...chain, n];
    const kids = safeArr<NestedSubCategory>(n.subcategories);
    if (kids.length) {
      const result = findDeepByName(kids, name, [...chain, n]);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Given advert step names (e.g. "Daire", "KİRALIK"), figure out
 * which tree nodes correspond to columns 1/2/3 in the UI.
 */
export function resolveStepsToColumns(
  categories: UiCategory[],
  stepNames: string[],
): { col1: NestedSubCategory | null; col2: NestedSubCategory | null; col3: NestedSubCategory | null } {
  const result = {
    col1: null as NestedSubCategory | null,
    col2: null as NestedSubCategory | null,
    col3: null as NestedSubCategory | null,
  };

  const names = stepNames.filter((n) => n && n.trim());
  if (!names.length) return result;

  let fullChain: NestedSubCategory[] | null = null;
  for (let i = names.length - 1; i >= 0; i--) {
    fullChain = findDeepByName(categories, names[i]);
    if (fullChain) break;
  }

  if (!fullChain || !fullChain.length) {
    const top = findByName(categories, names[0]);
    if (top) fullChain = [top];
  }

  if (!fullChain) return result;

  result.col1 = fullChain[0] ?? null;
  result.col2 = fullChain[1] ?? null;
  result.col3 = fullChain[2] ?? null;

  return result;
}

/* ── Constants ── */

export const CATEGORIES_ENDPOINT = "/admin/categories/tree";
