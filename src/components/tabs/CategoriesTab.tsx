// src/components/tabs/CategoriesTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";

import api from "@/lib/api";
import type { StepState } from "@/types/property";

/* ───────────────────── Types ───────────────────── */

type Id = string;

type CategoryAttribute = {
  id: string;
  type: string;
  options?: string[];
  required?: boolean;
  name: string;
  order?: number;
};

type CategoryFacilityGroup = {
  title: string;
  features: string[];
};

type NestedSubCategory = {
  _id: Id;
  uid: number;
  parentUid: number | null;
  name: string;
  attributes?: CategoryAttribute[];
  facilities?: CategoryFacilityGroup[];
  subcategories?: NestedSubCategory[];
};

type UiCategory = NestedSubCategory & { value: string };

interface CombinedCategoryTabProps {
  firstStep: StepState;
  setFirstStep: React.Dispatch<React.SetStateAction<StepState>>;
  secondStep: StepState;
  setSecondStep: React.Dispatch<React.SetStateAction<StepState>>;
  thirdStep: StepState;
  setThirdStep: React.Dispatch<React.SetStateAction<StepState>>;
  onNext?: () => void;
}

/* ───────────────────── Helpers ───────────────────── */

const CATEGORIES_ENDPOINT = "/admin/categories/tree";

function safeArr<T>(v: any): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function mapChildrenToSubcategories(nodes: any[]): NestedSubCategory[] {
  return nodes.map((n: any) => ({
    _id: String(n._id ?? n.uid ?? ""),
    uid: n.uid,
    parentUid: n.parentUid ?? null,
    name: n.name ?? "",
    attributes: safeArr<CategoryAttribute>(n.attributes),
    facilities: safeArr<CategoryFacilityGroup>(n.facilities),
    subcategories: mapChildrenToSubcategories(safeArr(n.children)),
  }));
}

function slugifyTR(input: string) {
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

function isAbortError(e: any) {
  return e?.name === "AbortError" || e?.code === "ERR_CANCELED";
}

function getSelected(step: StepState): any {
  return (step as any)?.selected ?? {};
}

function patchSelected(
  setStep: React.Dispatch<React.SetStateAction<StepState>>,
  patch: Record<string, any>,
) {
  setStep((prev) => {
    const prevSel = getSelected(prev);
    return { ...prev, selected: { ...prevSel, ...patch } } as StepState;
  });
}

function pickMainForUI(treeRoots: NestedSubCategory[]): NestedSubCategory[] {
  if (treeRoots.length === 1) {
    const kids = safeArr<NestedSubCategory>(treeRoots[0].subcategories);
    if (kids.length > 0) return kids;
  }
  return treeRoots;
}

/** Find a node by name (case-insensitive) in a flat list */
function findByName(nodes: NestedSubCategory[], name: string): NestedSubCategory | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return nodes.find((n) => n.name.toLowerCase().trim() === lower) ?? null;
}

/** Deep search: find a node by name anywhere in the tree, return the chain [root, ..., match] */
function findDeepByName(
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
 * Strategy: find the deepest named step in the tree, then use
 * its chain to fill columns from the top.
 */
function resolveStepsToColumns(
  categories: UiCategory[],
  stepNames: string[],
): { col1: NestedSubCategory | null; col2: NestedSubCategory | null; col3: NestedSubCategory | null } {
  const result = { col1: null as NestedSubCategory | null, col2: null as NestedSubCategory | null, col3: null as NestedSubCategory | null };

  // Collect all non-empty step names
  const names = stepNames.filter((n) => n && n.trim());
  if (!names.length) return result;

  // Try to find the deepest step name in the tree — start from the last name
  let fullChain: NestedSubCategory[] | null = null;
  for (let i = names.length - 1; i >= 0; i--) {
    fullChain = findDeepByName(categories, names[i]);
    if (fullChain) break;
  }

  if (!fullChain || !fullChain.length) {
    // Fallback: try first name at top level
    const top = findByName(categories, names[0]);
    if (top) fullChain = [top];
  }

  if (!fullChain) return result;

  // Map the chain to columns (the UI shows categories as pickMainForUI processed them,
  // so column 1 = categories array level, column 2 = subcategories, column 3 = nested)
  // fullChain[0] should be in the `categories` array (main column)
  result.col1 = fullChain[0] ?? null;
  result.col2 = fullChain[1] ?? null;
  result.col3 = fullChain[2] ?? null;

  return result;
}

/* ───────────────────── Component ───────────────────── */

export default function CombinedCategoryTab({
  firstStep,
  setFirstStep,
  secondStep,
  setSecondStep,
  thirdStep,
  setThirdStep,
  onNext,
}: CombinedCategoryTabProps) {
  const [categories, setCategories] = useState<UiCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const didSyncRef = useRef(false);

  /* ── Fetch ── */
  const loadCategories = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(CATEGORIES_ENDPOINT, { signal: ac.signal } as any);
      const raw = res?.data?.data?.tree || res?.data?.tree || res?.data?.data || [];
      const tree = mapChildrenToSubcategories(Array.isArray(raw) ? raw : []);
      const main = pickMainForUI(tree);

      setCategories(
        main.map((n) => ({ ...n, value: slugifyTR(n.name) })),
      );
    } catch (e: any) {
      if (isAbortError(e)) return;
      const status = e?.response?.status;
      if (status === 401) setError("Yetkisiz (401). Admin oturumu/token sorunu var.");
      else if (status === 403) setError("Erişim yok (403). Yetki sorunu var.");
      else if (status === 404) setError("Endpoint bulunamadı (404). Route yanlış.");
      else setError("Kategoriler yüklenemedi.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    return () => abortRef.current?.abort();
  }, [loadCategories]);

  /* ── Sync pre-existing selection by name → id (for edit page) ── */
  useEffect(() => {
    if (didSyncRef.current || !categories.length) return;

    const firstSel = getSelected(firstStep);
    const secondSel = getSelected(secondStep);
    const thirdSel = getSelected(thirdStep);

    // Only sync if we have a name but no id (edit page scenario)
    const hasNameNoId = (firstSel?.value && !firstSel?.id) ||
                        (secondSel?.value && !secondSel?.id) ||
                        (thirdSel?.value && !thirdSel?.id);
    if (!hasNameNoId) return;

    // Collect step names
    const stepNames = [
      firstSel?.value || "",
      secondSel?.value || "",
      thirdSel?.value || "",
    ];

    const { col1, col2, col3 } = resolveStepsToColumns(categories, stepNames);

    if (!col1) return;

    didSyncRef.current = true;

    patchSelected(setFirstStep, {
      isSelect: true,
      value: col1.name,
      id: col1._id,
      uid: col1.uid,
      name: col1.name,
      categoryData: col1,
    });

    if (col2) {
      patchSelected(setSecondStep, {
        isSelect: true,
        value: col2.name,
        id: col2._id,
        uid: col2.uid,
        subcategoryData: col2,
      });
    }

    if (col3) {
      patchSelected(setThirdStep, {
        isSelect: true,
        value: col3.name,
        id: col3._id,
        uid: col3.uid,
        subcategoryData: col3,
      });
    }
  }, [categories, firstStep, secondStep, thirdStep, setFirstStep, setSecondStep, setThirdStep]);

  /* ── Selection helpers ── */
  const resetSecond = useCallback(() => {
    patchSelected(setSecondStep, { isSelect: false, value: "", id: "", uid: null, subcategoryData: null });
  }, [setSecondStep]);

  const resetThird = useCallback(() => {
    patchSelected(setThirdStep, { isSelect: false, value: "", id: "", uid: null, subcategoryData: null });
  }, [setThirdStep]);

  const clearAll = useCallback(() => {
    didSyncRef.current = false;
    patchSelected(setFirstStep, { isSelect: false, value: "", id: "", uid: null, name: "", categoryData: null });
    resetSecond();
    resetThird();
  }, [setFirstStep, resetSecond, resetThird]);

  /* ── Derived state ── */
  const firstSel = getSelected(firstStep);
  const secondSel = getSelected(secondStep);
  const thirdSel = getSelected(thirdStep);

  const firstSelected = Boolean(firstSel?.isSelect);
  const secondSelected = Boolean(secondSel?.isSelect);
  const thirdSelected = Boolean(thirdSel?.isSelect);

  const selectedMain = useMemo(
    () => categories.find((c) => c._id === String(firstSel?.id ?? "")) ?? null,
    [categories, firstSel],
  );

  const mainSubs = useMemo(
    () => safeArr<NestedSubCategory>(selectedMain?.subcategories),
    [selectedMain],
  );

  const selectedSub = useMemo(
    () => mainSubs.find((s) => s._id === String(secondSel?.id ?? "")) ?? null,
    [mainSubs, secondSel],
  );

  const nestedSubs = useMemo(
    () => safeArr<NestedSubCategory>(selectedSub?.subcategories),
    [selectedSub],
  );

  const isComplete = useMemo(() => {
    if (!firstSelected) return false;
    if (mainSubs.length === 0) return true;
    if (!secondSelected) return false;
    if (nestedSubs.length === 0) return true;
    if (!thirdSelected) return false;
    return true;
  }, [firstSelected, secondSelected, thirdSelected, mainSubs, nestedSubs]);

  const breadcrumb = useMemo(() => {
    const parts: string[] = ["Emlak"];
    if (firstSel?.value) parts.push(firstSel.value);
    if (secondSel?.value) parts.push(secondSel.value);
    if (thirdSel?.value) parts.push(thirdSel.value);
    return parts;
  }, [firstSel, secondSel, thirdSel]);

  /* ── Handlers ── */
  const handleMainSelect = useCallback(
    (cat: UiCategory) => {
      patchSelected(setFirstStep, {
        isSelect: true,
        value: cat.name,
        id: cat._id,
        uid: cat.uid,
        name: cat.name,
        categoryData: cat,
      });
      resetSecond();
      resetThird();
    },
    [setFirstStep, resetSecond, resetThird],
  );

  const handleSubSelect = useCallback(
    (sub: NestedSubCategory) => {
      patchSelected(setSecondStep, {
        isSelect: true,
        value: sub.name,
        id: sub._id,
        uid: sub.uid,
        subcategoryData: sub,
      });
      resetThird();
    },
    [setSecondStep, resetThird],
  );

  const handleNestedSelect = useCallback(
    (nested: NestedSubCategory) => {
      patchSelected(setThirdStep, {
        isSelect: true,
        value: nested.name,
        id: nested._id,
        uid: nested.uid,
        subcategoryData: nested,
      });
    },
    [setThirdStep],
  );

  /* ── Render ── */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[14px] text-gray-500">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-[14px] text-red-600 text-center">{error}</div>
        <button
          type="button"
          onClick={loadCategories}
          className="px-4 py-1.5 border border-gray-300 text-[13px] hover:bg-gray-50"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-[14px] text-gray-700">Kategori bulunamadı.</div>
        <button
          type="button"
          onClick={loadCategories}
          className="px-4 py-1.5 border border-gray-300 text-[13px] hover:bg-gray-50"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Adım Adım Kategori Seç</h3>
        {firstSelected && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[12px] text-blue-700 hover:underline"
          >
            Temizle
          </button>
        )}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="mb-3 flex items-center gap-1 text-[13px]">
        {breadcrumb.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}
            <span
              className={
                i === breadcrumb.length - 1 && breadcrumb.length > 1
                  ? "text-gray-900 font-medium"
                  : "text-blue-700"
              }
            >
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* ── Columns ── */}
      <div className="flex border border-gray-300 bg-white min-h-[320px]">
        {/* Column 1 */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          {categories.map((cat) => {
            const active = firstSelected && String(firstSel?.id ?? "") === cat._id;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleMainSelect(cat)}
                className={[
                  "w-full text-left px-3 py-[6px] text-[13px] border-b border-gray-100 transition-colors",
                  active
                    ? "bg-[#e8f0fe] font-semibold text-gray-900"
                    : "text-blue-700 hover:bg-gray-50",
                ].join(" ")}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          {firstSelected && mainSubs.length > 0
            ? mainSubs.map((sub) => {
                const active = secondSelected && String(secondSel?.id ?? "") === sub._id;
                return (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => handleSubSelect(sub)}
                    className={[
                      "w-full text-left px-3 py-[6px] text-[13px] border-b border-gray-100 transition-colors",
                      active
                        ? "bg-[#e8f0fe] font-semibold text-gray-900"
                        : "text-blue-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {sub.name}
                  </button>
                );
              })
            : firstSelected && (
                <div className="p-3 text-[12px] text-gray-400">Alt kategori yok</div>
              )}
        </div>

        {/* Column 3 */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto max-h-[360px]">
          {firstSelected && secondSelected && nestedSubs.length > 0
            ? nestedSubs.map((nested) => {
                const active = thirdSelected && String(thirdSel?.id ?? "") === nested._id;
                return (
                  <button
                    key={nested._id}
                    type="button"
                    onClick={() => handleNestedSelect(nested)}
                    className={[
                      "w-full text-left px-3 py-[6px] text-[13px] border-b border-gray-100 transition-colors",
                      active
                        ? "bg-[#e8f0fe] font-semibold text-gray-900"
                        : "text-blue-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {nested.name}
                  </button>
                );
              })
            : firstSelected && secondSelected && (
                <div className="p-3 text-[12px] text-gray-400">Detay kategori yok</div>
              )}
        </div>

        {/* Column 4 */}
        <div className="w-1/4 flex items-center justify-center p-4">
          {isComplete ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>  
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                Kategori seçimi
                <br />
                tamamlanmıştır.
              </p>
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-6 py-2 bg-blue-600 text-white text-[14px] font-semibold rounded hover:bg-blue-700 transition-colors"
                >
                  Devam
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-[12px] text-gray-400 leading-relaxed">
              Lütfen kategori seçiminizi
              <br />
              tamamlayın.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}